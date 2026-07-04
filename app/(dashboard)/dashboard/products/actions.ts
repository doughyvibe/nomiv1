"use server";

import { revalidatePath } from "next/cache";

import {
  type ProductInput,
  validateProductInput,
} from "@/lib/products/validate";
import { friendlyDbError } from "@/lib/errors/friendly-db";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export type { ProductInput } from "@/lib/products/validate";

type ActionResult = { error: string } | { success: true };

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
    category: product.category?.trim() || null,
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

export async function addProductAction(
  product: ProductInput,
): Promise<ActionResult> {
  const validationError = validateProductInput(product);
  if (validationError) return { error: validationError };

  const ctx = await ownedStoreContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { error } = await supabase.from("products").insert({
    store_id: store.id,
    ...cleanProductFields(product),
  });

  if (error) return { error: friendlyDbError(error) };

  revalidateProductPaths(store);
  return { success: true };
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

  revalidateProductPaths(store, productId);
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

  revalidateProductPaths(store, productId);
  return { success: true };
}
