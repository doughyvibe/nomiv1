"use server";

import { revalidatePath } from "next/cache";

import {
  canMarkCancelled,
  canMarkCompleted,
  canMarkPaymentVerified,
} from "@/lib/orders/status-transitions";
import type { OrderStatus } from "@/lib/orders/types";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string } | { success: true };

async function sellerContext(): Promise<
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

  let productCount = 0;
  if (store) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("status", "live");
    productCount = count ?? 0;
  }

  if (deriveOnboardingStep(store, productCount) !== "done" || !store) {
    return { error: "Store not ready" };
  }

  return { supabase, store };
}

/**
 * Atomic status + inventory via DB RPC (decrement on paid; restore on cancel-from-paid).
 * Falls back to plain update if migration not applied yet.
 */
async function transitionViaRpc(
  supabase: Awaited<ReturnType<typeof createClient>>,
  storeId: string,
  reference: string,
  nextStatus: OrderStatus,
): Promise<ActionResult | null> {
  const { data, error } = await supabase.rpc("seller_transition_order", {
    p_store_id: storeId,
    p_reference: reference,
    p_next_status: nextStatus,
  });

  if (error) {
    // Migration missing → caller uses legacy path
    if (
      error.message?.includes("seller_transition_order") ||
      error.code === "PGRST202" ||
      error.code === "42883"
    ) {
      return null;
    }
    return { error: "Could not update order" };
  }

  const row = data as { ok?: boolean; error?: string } | null;
  if (!row || row.ok !== true) {
    return { error: row?.error ?? "Could not update order" };
  }
  return { success: true };
}

async function updateOrderStatus(
  reference: string,
  nextStatus: OrderStatus,
  allowed: (status: OrderStatus) => boolean,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;

  const rpcResult = await transitionViaRpc(
    supabase,
    store.id,
    reference,
    nextStatus,
  );
  if (rpcResult) {
    if ("success" in rpcResult) {
      revalidatePath(`/dashboard/orders/${reference}`);
      revalidatePath(`/s/${store.slug}/order/${reference}`);
      revalidatePath("/dashboard/orders");
      revalidatePath(`/s/${store.slug}`);
    }
    return rpcResult;
  }

  // ponytail: legacy path before inventory migration
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("store_id", store.id)
    .eq("reference", reference)
    .maybeSingle<{ status: OrderStatus }>();

  if (!order) return { error: "Order not found" };
  if (!allowed(order.status)) {
    return { error: "This order cannot be updated to that status" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: nextStatus })
    .eq("store_id", store.id)
    .eq("reference", reference);

  if (error) return { error: "Could not update order" };

  revalidatePath(`/dashboard/orders/${reference}`);
  revalidatePath(`/s/${store.slug}/order/${reference}`);
  revalidatePath("/dashboard/orders");
  return { success: true };
}

export async function markPaymentVerifiedAction(
  reference: string,
): Promise<ActionResult> {
  return updateOrderStatus(
    reference,
    "seller_confirmed_paid",
    canMarkPaymentVerified,
  );
}

export async function markOrderCompletedAction(
  reference: string,
): Promise<ActionResult> {
  return updateOrderStatus(reference, "completed", canMarkCompleted);
}

export async function markOrderCancelledAction(
  reference: string,
): Promise<ActionResult> {
  return updateOrderStatus(reference, "cancelled", canMarkCancelled);
}
