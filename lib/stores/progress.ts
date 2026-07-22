import {
  fulfillmentIsComplete,
  paynowIsComplete,
  type Store,
} from "./types";

export const ONBOARDING_STEPS = [
  { step: 1, label: "Store name" },
  { step: 2, label: "Branding" },
  { step: 3, label: "Product" },
  { step: 4, label: "Fulfillment" },
  { step: 5, label: "PayNow" },
] as const;

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

/**
 * Progress is derived from store data, not a stored counter — resume-safe by
 * construction: the next incomplete step is always recomputed from what exists.
 * Branding is optional content-wise; completion is flagged on Continue.
 * Onboarding is done when fulfillment + PayNow are complete — empty live catalog
 * must not yank a finished seller back to the product step (publish readiness
 * still warns separately). Publishing is a separate paid step.
 */
export function deriveOnboardingStep(
  store: Store | null,
  productCount: number,
): OnboardingStep | "done" {
  if (!store) return 1;
  if (!store.hero.onboarding_branding_done) return 2;
  if (
    fulfillmentIsComplete(store.fulfillment) &&
    paynowIsComplete(store.paynow)
  ) {
    return "done";
  }
  if (productCount === 0) return 3;
  if (!fulfillmentIsComplete(store.fulfillment)) return 4;
  if (!paynowIsComplete(store.paynow)) return 5;
  return "done";
}
