import "server-only";

import Stripe from "stripe";

import { isBillingEnabled } from "@/lib/billing/plans";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripe) {
    // Use SDK default API version (via Context7 / stripe-node)
    stripe = new Stripe(key);
  }
  return stripe;
}

export function assertBillingEnabled(): void {
  if (!isBillingEnabled()) {
    throw new Error("Billing is not configured");
  }
}
