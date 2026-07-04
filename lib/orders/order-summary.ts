import type { SupabaseClient } from "@supabase/supabase-js";

export type OrderSummary = {
  awaitingVerification: number;
  paid: number;
  total: number;
};

export async function loadOrderSummary(
  supabase: SupabaseClient,
  storeId: string,
): Promise<OrderSummary> {
  const [awaiting, paid, total] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId)
      .eq("status", "seller_verification_requested"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId)
      .in("status", ["seller_confirmed_paid", "completed"]),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId),
  ]);

  return {
    awaitingVerification: awaiting.count ?? 0,
    paid: paid.count ?? 0,
    total: total.count ?? 0,
  };
}
