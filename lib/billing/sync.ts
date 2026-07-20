import "server-only";

import type Stripe from "stripe";

import {
  subscriptionAllowsPublish,
  type BillingInterval,
} from "@/lib/billing/plans";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubscriptionPatch = {
  stripe_customer_id?: string | null;
  subscription_id?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  subscription_period_end?: string | null;
};

export async function applySubscriptionToStore(
  storeId: string,
  patch: SubscriptionPatch,
  opts?: { unpublishIfLapsed?: boolean },
): Promise<void> {
  const admin = createAdminClient();
  const update: Record<string, unknown> = { ...patch };

  if (
    opts?.unpublishIfLapsed &&
    patch.subscription_status &&
    !subscriptionAllowsPublish(patch.subscription_status)
  ) {
    update.status = "unpublished";
  }

  const { error } = await admin.from("stores").update(update).eq("id", storeId);
  if (error) throw new Error(error.message);
}

export async function findStoreIdByCustomer(
  customerId: string,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("stores")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .neq("status", "deleted")
    .maybeSingle();
  return data?.id ?? null;
}

export async function findStoreIdBySubscription(
  subscriptionId: string,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("stores")
    .select("id")
    .eq("subscription_id", subscriptionId)
    .neq("status", "deleted")
    .maybeSingle();
  return data?.id ?? null;
}

export function patchFromSubscription(
  sub: Stripe.Subscription,
  plan: BillingInterval | string | null,
): SubscriptionPatch {
  const periodEnd =
    "current_period_end" in sub && typeof sub.current_period_end === "number"
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null;

  return {
    stripe_customer_id:
      typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    subscription_id: sub.id,
    subscription_status: sub.status,
    subscription_plan: plan,
    subscription_period_end: periodEnd,
  };
}
