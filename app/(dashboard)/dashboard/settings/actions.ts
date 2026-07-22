"use server";

import { revalidatePath } from "next/cache";

import {
  publishStore,
  saveFulfillment,
  savePayNow,
  updateStoreIdentity,
} from "@/app/(dashboard)/dashboard/onboarding/actions";
import { friendlyDbError } from "@/lib/errors/friendly-db";
import {
  buildTomorrowDeliveryLiveCampaign,
  detectCampaignLeadConflicts,
  normalizeCampaignConfig,
} from "@/lib/fulfilment/campaigns";
import { revalidateDashboardStore } from "@/lib/stores/revalidate";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type {
  FulfillmentConfig,
  PayNowConfig,
  Store,
  TradeHint,
} from "@/lib/stores/types";
import type { PushSubscriptionPayload } from "@/lib/push/client";
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

  if (!store) return { error: "No store yet" };

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

export async function saveFulfillmentAction(
  config: FulfillmentConfig,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const result = await saveFulfillment(config);
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(ctx.store);
  return { success: true };
}

export async function startLiveModeAction(opts?: {
  force?: boolean;
}): Promise<
  { error: string } | { success: true } | { warning: string }
> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  if (!store.fulfillment.delivery?.enabled) {
    return { error: "Turn on local delivery before starting Live" };
  }

  const campaign = buildTomorrowDeliveryLiveCampaign();
  const { data: products } = await supabase
    .from("products")
    .select("name, lead_time_days")
    .eq("store_id", store.id)
    .neq("status", "archived");

  const conflict = detectCampaignLeadConflicts(
    campaign,
    (products ?? []) as { name: string; lead_time_days?: number | null }[],
  );
  if (conflict && !opts?.force) {
    return { warning: conflict.warning };
  }

  const normalized = normalizeCampaignConfig(campaign);
  if (!normalized) return { error: "Could not build Live campaign" };

  const next: FulfillmentConfig = {
    ...store.fulfillment,
    campaign: normalized,
  };
  const result = await saveFulfillment(next);
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(store);
  revalidatePath(`/s/${store.slug}`);
  return { success: true };
}

export async function stopLiveModeAction(): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { store } = ctx;
  const next: FulfillmentConfig = {
    ...store.fulfillment,
    campaign: undefined,
  };

  const result = await saveFulfillment(next);
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(store);
  revalidatePath(`/s/${store.slug}`);
  return { success: true };
}

export async function savePayNowAction(
  config: PayNowConfig,
): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const result = await savePayNow(config);
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(ctx.store);
  return { success: true };
}

export async function saveStoreIdentityAction(input: {
  name: string;
  tradeHint: TradeHint | null;
}): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const result = await updateStoreIdentity(input);
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(ctx.store);
  return { success: true };
}

export async function publishStoreAction(): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const result = await publishStore();
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(ctx.store);
  return { success: true };
}

export async function unpublishStoreAction(): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const { supabase, store } = ctx;
  if (store.status !== "published") {
    return { error: "Store is not published" };
  }

  const { error } = await supabase
    .from("stores")
    .update({ status: "unpublished" })
    .eq("id", store.id);

  if (error) return { error: friendlyDbError(error) };

  revalidateDashboardStore(store);
  revalidatePath("/dashboard/products");
  return { success: true };
}


// ---------------------------------------------------------------------------
// Push subscriptions (Task 5.3)
// ---------------------------------------------------------------------------

async function requireUser(): Promise<
  | { error: string }
  | { supabase: Awaited<ReturnType<typeof createClient>>; user: { id: string } }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };
  return { supabase, user };
}

export async function savePushSubscriptionAction(
  sub: PushSubscriptionPayload,
): Promise<ActionResult> {
  const ctx = await requireUser();
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, user } = ctx;
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: sub.endpoint,
      p256dh: sub.p256dh,
      auth_key: sub.auth,
    },
    { onConflict: "endpoint" },
  );

  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function removePushSubscriptionAction(
  endpoint: string,
): Promise<ActionResult> {
  const ctx = await requireUser();
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, user } = ctx;
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function removeAllPushSubscriptionsAction(): Promise<ActionResult> {
  const ctx = await requireUser();
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, user } = ctx;
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id);

  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/dashboard/settings");
  return { success: true };
}
