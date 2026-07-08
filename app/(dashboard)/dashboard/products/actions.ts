"use server";

import { revalidatePath } from "next/cache";

import {
  type ProductInput,
  validateProductInput,
} from "@/lib/products/validate";
import { collectCategories, normalizeCategory } from "@/lib/products/category";
import { friendlyDbError } from "@/lib/errors/friendly-db";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { Product, Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export type { ProductInput } from "@/lib/products/validate";

type ActionResult =
  | { error: string }
  | { success: true; filtersLive?: boolean; categories?: string[] };

async function ownedStoreContext(): Promise<
  | { error: string }
  | { supabase: Awaited<ReturnType<typeof createClient>>; store: Store }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .neq("status", "deleted")
    .maybeSingle<Store>();

  if (!store) return { error: "No store yet" };

  return { supabase, store };
}

async function sellerContext(): Promise<
  | { error: string }
  | { supabase: Awaited<ReturnType<typeof createClient>>; store: Store }
> {
  const ctx = await ownedStoreContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store.id)
    .eq("archived", false);

  if (deriveOnboardingStep(store, count ?? 0) !== "done") {
    return { error: "Store not ready" };
  }

  return { supabase, store };
}

function cleanProductFields(product: ProductInput) {
  return {
    name: product.name.trim(),
    price_cents: product.price_cents,
    description: product.description.trim(),
    image_url: product.image_url || null,
    category: normalizeCategory(product.category),
  };
}

function revalidateProductPaths(store: Store, productId?: string) {
  revalidatePath("/dashboard/products");
  revalidatePath(`/s/${store.slug}`);
  if (productId) {
    revalidatePath(`/dashboard/products/${productId}/edit`);
    revalidatePath(`/s/${store.slug}/product/${productId}`);
  }
}

async function filterStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  storeId: string,
): Promise<{ filtersLive: boolean; categories: string[] }> {
  const { data: products } = await supabase
    .from("products")
    .select("category")
    .eq("store_id", storeId)
    .eq("archived", false);

  const categories = collectCategories((products as Product[]) ?? []);
  return { filtersLive: categories.length >= 2, categories };
}

export async function addProductAction(
  product: ProductInput,
): Promise<ActionResult> {
  const validationError = validateProductInput(product);
  if (validationError) return { error: validationError };

  const ctx = await ownedStoreContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;

  const priorCategories = collectCategories(
    (
      await supabase
        .from("products")
        .select("category")
        .eq("store_id", store.id)
        .eq("archived", false)
    ).data ?? [],
  );

  const nextCategory = normalizeCategory(product.category);
  const filtersJustLive =
    Boolean(nextCategory) &&
    priorCategories.length === 1 &&
    !priorCategories.some((c) => c.toLowerCase() === nextCategory!.toLowerCase());

  const { data: inserted, error } = await supabase
    .from("products")
    .insert({
      store_id: store.id,
      ...cleanProductFields(product),
    })
    .select("id")
    .single();

  if (error) return { error: friendlyDbError(error) };

  if (!store.featured_product_id && inserted?.id) {
    await supabase
      .from("stores")
      .update({ featured_product_id: inserted.id })
      .eq("id", store.id);
  }

  const { filtersLive, categories } = await filterStatus(supabase, store.id);

  revalidateProductPaths(store);
  return {
    success: true,
    filtersLive: filtersJustLive && filtersLive,
    categories: filtersLive ? categories : undefined,
  };
}

export async function updateProductAction(
  productId: string,
  product: ProductInput,
): Promise<ActionResult> {
  const validationError = validateProductInput(product);
  if (validationError) return { error: validationError };

  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { data: existing } = await supabase
    .from("products")
    .select("id, archived")
    .eq("id", productId)
    .eq("store_id", store.id)
    .maybeSingle<{ id: string; archived: boolean }>();

  if (!existing) return { error: "Product not found" };
  if (existing.archived) return { error: "Archived products cannot be edited" };

  const { error } = await supabase
    .from("products")
    .update(cleanProductFields(product))
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) return { error: friendlyDbError(error) };

  const { filtersLive, categories } = await filterStatus(supabase, store.id);

  revalidateProductPaths(store, productId);
  return {
    success: true,
    filtersLive,
    categories: filtersLive ? categories : undefined,
  };
}

export async function setFeaturedProductAction(
  productId: string,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("store_id", store.id)
    .eq("archived", false)
    .maybeSingle();

  if (!product) return { error: "Product not found" };

  const { error } = await supabase
    .from("stores")
    .update({ featured_product_id: productId })
    .eq("id", store.id);

  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/dashboard/products");
  revalidatePath(`/s/${store.slug}`);
  return { success: true };
}

export async function archiveProductAction(
  productId: string,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { data: existing } = await supabase
    .from("products")
    .select("id, archived")
    .eq("id", productId)
    .eq("store_id", store.id)
    .maybeSingle<{ id: string; archived: boolean }>();

  if (!existing) return { error: "Product not found" };
  if (existing.archived) return { success: true };

  const { error } = await supabase
    .from("products")
    .update({ archived: true })
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) return { error: friendlyDbError(error) };

  if (store.featured_product_id === productId) {
    const { data: next } = await supabase
      .from("products")
      .select("id")
      .eq("store_id", store.id)
      .eq("archived", false)
      .neq("id", productId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    await supabase
      .from("stores")
      .update({ featured_product_id: next?.id ?? null })
      .eq("id", store.id);
  }

  revalidateProductPaths(store, productId);
  return { success: true };
}
