import type { SupabaseClient } from "@supabase/supabase-js";

import type { OrderItemRow, OrderRow } from "./types";

export async function countPendingVerification(
  supabase: SupabaseClient,
  storeId: string,
): Promise<number> {
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("status", "seller_verification_requested");

  return count ?? 0;
}

export async function loadSellerOrders(
  supabase: SupabaseClient,
  storeId: string,
  statusFilter?: string,
): Promise<OrderRow[]> {
  let query = supabase
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data } = await query;
  return (data as OrderRow[]) ?? [];
}

export async function loadSellerOrderByReference(
  supabase: SupabaseClient,
  storeId: string,
  reference: string,
): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .eq("reference", reference)
    .maybeSingle<OrderRow>();

  if (!order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  return { order, items: (items as OrderItemRow[]) ?? [] };
}
