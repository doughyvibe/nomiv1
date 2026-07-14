import type { PayNowConfig, Store, Vibe } from "@/lib/stores/types";
import { createAdminClient } from "@/lib/supabase/admin";

import { orderStoreAllowsBuyerAccess } from "./seller-contact";
import type { OrderItemRow, OrderRow } from "./types";

export type { OrderItemRow, OrderRow } from "./types";

export type OrderStore = {
  id: string;
  slug: string;
  name: string;
  paynow: Partial<PayNowConfig>;
  status: string;
  vibe?: Vibe | null;
};

export type LoadedOrder = {
  order: OrderRow;
  store: OrderStore;
  items: OrderItemRow[];
};

/** Load order by reference; slug must match store (reference acts as URL token). */
export async function getOrderForPayment(
  slug: string,
  reference: string,
): Promise<LoadedOrder | null> {
  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .maybeSingle<OrderRow>();

  if (!order) return null;

  const { data: store } = await admin
    .from("stores")
    .select("id, slug, name, paynow, status, vibe")
    .eq("id", order.store_id)
    .single<OrderStore>();

  // Existing orders stay reachable after unpublish (catalogue still gated).
  if (!store || store.slug !== slug || !orderStoreAllowsBuyerAccess(store.status)) {
    return null;
  }

  const { data: items } = await admin
    .from("order_items")
    .select("id, product_name, price_cents, quantity")
    .eq("order_id", order.id);

  return { order, store, items: (items as OrderItemRow[]) ?? [] };
}

/**
 * Minimal storefront chrome for order pages when the shop is unpublished.
 * Catalogue stays blocked by the published gate; products intentionally empty.
 */
export async function getOrderStorefrontChrome(
  slug: string,
): Promise<{ store: Store; products: [] } | null> {
  const admin = createAdminClient();
  const { data: store } = await admin
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Store>();

  if (!store || !orderStoreAllowsBuyerAccess(store.status)) return null;
  return { store, products: [] };
}
