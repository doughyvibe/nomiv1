import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  applySubscriptionToStore,
  findStoreIdByCustomer,
  findStoreIdBySubscription,
  patchFromSubscription,
} from "@/lib/billing/sync";
import { getStripe } from "@/lib/billing/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const storeId =
    session.metadata?.store_id || session.client_reference_id || null;
  if (!storeId || !session.subscription) return;

  const stripe = getStripe();
  const subId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;
  const sub = await stripe.subscriptions.retrieve(subId);
  const plan = session.metadata?.plan ?? sub.metadata?.plan ?? null;

  await applySubscriptionToStore(storeId, patchFromSubscription(sub, plan));

  // Go live after successful checkout when readiness already met
  const admin = createAdminClient();
  const { data: store } = await admin
    .from("stores")
    .select("status")
    .eq("id", storeId)
    .maybeSingle();

  if (store && store.status !== "published" && sub.status === "active") {
    // publishStore completeness still enforced by seller clicking publish /
    // success page; webhook only syncs billing fields here.
  }
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const storeId =
    sub.metadata?.store_id ||
    (await findStoreIdBySubscription(sub.id)) ||
    (typeof sub.customer === "string"
      ? await findStoreIdByCustomer(sub.customer)
      : null);
  if (!storeId) return;

  const plan = sub.metadata?.plan ?? null;
  await applySubscriptionToStore(storeId, patchFromSubscription(sub, plan), {
    unpublishIfLapsed: true,
  });
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const storeId =
    sub.metadata?.store_id ||
    (await findStoreIdBySubscription(sub.id)) ||
    (typeof sub.customer === "string"
      ? await findStoreIdByCustomer(sub.customer)
      : null);
  if (!storeId) return;

  await applySubscriptionToStore(
    storeId,
    {
      subscription_id: sub.id,
      subscription_status: "canceled",
      subscription_period_end: null,
    },
    { unpublishIfLapsed: true },
  );
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    console.error("stripe webhook:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
