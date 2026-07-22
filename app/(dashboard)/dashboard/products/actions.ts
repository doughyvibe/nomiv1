"use server";

import { revalidatePath } from "next/cache";

import {
  type ProductInput,
  validateProductInput,
} from "@/lib/products/validate";
import { collectCategories, normalizeCategory } from "@/lib/products/category";
import { replaceProductChoices } from "@/lib/products/replace-choices";
import { replaceProductCustomisations } from "@/lib/products/replace-customisations";
import { statusWriteFields } from "@/lib/products/status";
import { friendlyDbError } from "@/lib/errors/friendly-db";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { Product, Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export type { ProductInput } from "@/lib/products/validate";

type ActionResult =
  | { error: string }
  | {
      success: true;
      filtersLive?: boolean;
      categories?: string[];
      productId?: string;
    };

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
    .neq("status", "archived");

  if (deriveOnboardingStep(store, count ?? 0) !== "done") {
    return { error: "Store not ready" };
  }

  return { supabase, store };
}

function cleanProductFields(product: ProductInput) {
  const choicesOn =
    product.choices != null && (product.choices.options?.length ?? 0) > 0;
  const inventory = product.inventory;
  const inventoryFields =
    inventory == null
      ? {}
      : {
          track_inventory: inventory.track_inventory,
          sold_out_policy: inventory.sold_out_policy,
          // Product-level qty only when tracking a simple (no choices) offer
          stock_qty:
            inventory.track_inventory && !choicesOn
              ? inventory.stock_qty
              : null,
        };

  return {
    name: product.name.trim(),
    price_cents: product.price_cents,
    description: product.description.trim(),
    image_url: product.image_url || null,
    category: normalizeCategory(product.category),
    // Default 0 when omitted (onboarding / basic create paths)
    lead_time_days: product.lead_time_days ?? 0,
    ...inventoryFields,
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
    .eq("status", "live");

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
        .eq("status", "live")
    ).data ?? [],
  );

  const nextCategory = normalizeCategory(product.category);
  const filtersJustLive =
    Boolean(nextCategory) &&
    priorCategories.length === 1 &&
    !priorCategories.some((c) => c.toLowerCase() === nextCategory!.toLowerCase());

  // New products are always live
  const { data: inserted, error } = await supabase
    .from("products")
    .insert({
      store_id: store.id,
      ...cleanProductFields(product),
      ...statusWriteFields("live"),
    })
    .select("id")
    .single();

  if (error) return { error: friendlyDbError(error) };

  if (product.choices !== undefined && inserted?.id) {
    const choicesResult = await replaceProductChoices(
      supabase,
      inserted.id,
      product.choices,
    );
    if ("error" in choicesResult) {
      await supabase.from("products").delete().eq("id", inserted.id);
      return { error: friendlyDbError({ message: choicesResult.error }) };
    }
  }

  if (product.customisations !== undefined && inserted?.id) {
    const customsResult = await replaceProductCustomisations(
      supabase,
      inserted.id,
      product.customisations,
    );
    if ("error" in customsResult) {
      await supabase.from("products").delete().eq("id", inserted.id);
      return { error: friendlyDbError({ message: customsResult.error }) };
    }
  }

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

  // ownedStoreContext: allow edits during onboarding revisit (not only post-done)
  const ctx = await ownedStoreContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { data: existing } = await supabase
    .from("products")
    .select("id, status, archived")
    .eq("id", productId)
    .eq("store_id", store.id)
    .maybeSingle<{ id: string; status: Product["status"]; archived: boolean }>();

  if (!existing) return { error: "Product not found" };
  if (existing.status === "archived" || existing.archived) {
    return { error: "Restore this product before editing" };
  }

  const { error } = await supabase
    .from("products")
    .update({
      ...cleanProductFields(product),
      ...statusWriteFields("live"),
    })
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) return { error: friendlyDbError(error) };

  if (product.choices !== undefined) {
    const choicesResult = await replaceProductChoices(
      supabase,
      productId,
      product.choices,
    );
    if ("error" in choicesResult) {
      return { error: friendlyDbError({ message: choicesResult.error }) };
    }
  }

  if (product.customisations !== undefined) {
    const customsResult = await replaceProductCustomisations(
      supabase,
      productId,
      product.customisations,
    );
    if ("error" in customsResult) {
      return { error: friendlyDbError({ message: customsResult.error }) };
    }
  }

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

  // Toggle off if this product is already featured
  if (store.featured_product_id === productId) {
    const { error } = await supabase
      .from("stores")
      .update({ featured_product_id: null })
      .eq("id", store.id);
    if (error) return { error: friendlyDbError(error) };
    revalidatePath("/dashboard/products");
    revalidatePath(`/s/${store.slug}`);
    return { success: true };
  }

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("store_id", store.id)
    .eq("status", "live")
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
    .select("id, status, archived")
    .eq("id", productId)
    .eq("store_id", store.id)
    .maybeSingle<{ id: string; status: Product["status"]; archived: boolean }>();

  if (!existing) return { error: "Product not found" };
  if (existing.status === "archived" || existing.archived) return { success: true };

  const { error } = await supabase
    .from("products")
    .update(statusWriteFields("archived"))
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) return { error: friendlyDbError(error) };

  if (store.featured_product_id === productId) {
    const { data: next } = await supabase
      .from("products")
      .select("id")
      .eq("store_id", store.id)
      .eq("status", "live")
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

export async function restoreProductAction(
  productId: string,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { data: existing } = await supabase
    .from("products")
    .select("id, status, archived")
    .eq("id", productId)
    .eq("store_id", store.id)
    .maybeSingle<{ id: string; status: Product["status"]; archived: boolean }>();

  if (!existing) return { error: "Product not found" };
  if (existing.status !== "archived" && !existing.archived) {
    return { success: true };
  }

  const { error } = await supabase
    .from("products")
    .update(statusWriteFields("live"))
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) return { error: friendlyDbError(error) };

  // Re-star if nothing featured (e.g. last live product was Removed)
  if (!store.featured_product_id) {
    await supabase
      .from("stores")
      .update({ featured_product_id: productId })
      .eq("id", store.id);
  }

  revalidateProductPaths(store, productId);
  return { success: true };
}

/**
 * Hard-delete only when the product has never appeared on an order.
 * Otherwise use Remove from shop (archive).
 */
export async function deleteProductAction(
  productId: string,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("store_id", store.id)
    .maybeSingle();

  if (!existing) return { error: "Product not found" };

  const { count } = await supabase
    .from("order_items")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  if ((count ?? 0) > 0) {
    return { error: "Sold before — remove from shop instead" };
  }

  if (store.featured_product_id === productId) {
    const { data: next } = await supabase
      .from("products")
      .select("id")
      .eq("store_id", store.id)
      .eq("status", "live")
      .neq("id", productId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    await supabase
      .from("stores")
      .update({ featured_product_id: next?.id ?? null })
      .eq("id", store.id);
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/dashboard/products");
  revalidatePath(`/s/${store.slug}`);
  return { success: true };
}

/** Clear a category label from every product in the store (normalized match). */
export async function clearStoreCategoryAction(
  label: string,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  const target = normalizeCategory(label);
  if (!target) return { error: "Invalid category" };

  const { data: rows, error: fetchError } = await supabase
    .from("products")
    .select("id, category")
    .eq("store_id", store.id)
    .not("category", "is", null);

  if (fetchError) return { error: friendlyDbError(fetchError) };

  const ids = (rows ?? [])
    .filter((r) => normalizeCategory(r.category) === target)
    .map((r) => r.id as string);

  if (ids.length === 0) {
    revalidateProductPaths(store);
    return { success: true };
  }

  const { error } = await supabase
    .from("products")
    .update({ category: null })
    .eq("store_id", store.id)
    .in("id", ids);

  if (error) return { error: friendlyDbError(error) };

  revalidateProductPaths(store);
  return { success: true };
}
