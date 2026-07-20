"use server";

import { redirect } from "next/navigation";

import {
  isBillingEnabled,
  priceIdForInterval,
  type BillingInterval,
} from "@/lib/billing/plans";
import { getStripe } from "@/lib/billing/stripe";
import { getDashboardUrl } from "@/lib/host";
import { createClient } from "@/lib/supabase/server";
import type { Store } from "@/lib/stores/types";

type ActionResult = { error: string } | { url: string };

async function ownedStore(): Promise<
  | { error: string }
  | { store: Store; userId: string; email: string | undefined }
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
  return { store, userId: user.id, email: user.email };
}

export async function startCheckoutAction(
  interval: BillingInterval,
): Promise<ActionResult> {
  if (!isBillingEnabled()) {
    return { error: "Billing is not set up yet" };
  }

  const ctx = await ownedStore();
  if ("error" in ctx) return ctx;

  const priceId = priceIdForInterval(interval);
  if (!priceId) return { error: "Price is not configured" };

  const stripe = getStripe();
  let customerId = ctx.store.stripe_customer_id ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: ctx.email,
      metadata: {
        store_id: ctx.store.id,
        user_id: ctx.userId,
      },
    });
    customerId = customer.id;
    const supabase = await createClient();
    await supabase
      .from("stores")
      .update({ stripe_customer_id: customerId })
      .eq("id", ctx.store.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${getDashboardUrl("/billing/success")}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: getDashboardUrl("/billing/publish"),
    client_reference_id: ctx.store.id,
    metadata: {
      store_id: ctx.store.id,
      user_id: ctx.userId,
      plan: interval,
    },
    subscription_data: {
      metadata: {
        store_id: ctx.store.id,
        user_id: ctx.userId,
        plan: interval,
      },
    },
  });

  if (!session.url) return { error: "Could not start checkout" };
  return { url: session.url };
}

export async function openBillingPortalAction(): Promise<ActionResult> {
  if (!isBillingEnabled()) {
    return { error: "Billing is not set up yet" };
  }

  const ctx = await ownedStore();
  if ("error" in ctx) return ctx;
  if (!ctx.store.stripe_customer_id) {
    return { error: "No billing account yet" };
  }

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: ctx.store.stripe_customer_id,
    return_url: getDashboardUrl("/settings"),
  });

  if (!portal.url) return { error: "Could not open billing portal" };
  return { url: portal.url };
}

/** Server helper used by the success page — not a client action. */
export async function redirectToCheckout(interval: BillingInterval) {
  const result = await startCheckoutAction(interval);
  if ("error" in result) throw new Error(result.error);
  redirect(result.url);
}
