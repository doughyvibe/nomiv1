/** Single Nomi plan — two billing choices (via Context7 / Stripe Billing). */

export type BillingInterval = "four_weekly" | "yearly";

export const BILLING_COPY = {
  weeklyPrice: "$3.90",
  weeklyCadence: "per week",
  billedEvery: "Billed every 4 weeks",
  yearlyPrice: "$149",
  yearlyCadence: "per year",
} as const;

export function priceIdForInterval(interval: BillingInterval): string | null {
  if (interval === "yearly") {
    return process.env.STRIPE_PRICE_YEARLY?.trim() || null;
  }
  return process.env.STRIPE_PRICE_FOUR_WEEKLY?.trim() || null;
}

export function isBillingEnabled(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.STRIPE_PRICE_FOUR_WEEKLY?.trim() &&
      process.env.STRIPE_PRICE_YEARLY?.trim(),
  );
}

/** Active enough to keep (or make) a store public. */
export function subscriptionAllowsPublish(
  status: string | null | undefined,
): boolean {
  return status === "active" || status === "trialing";
}
