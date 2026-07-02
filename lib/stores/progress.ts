import {
  fulfillmentIsComplete,
  heroIsComplete,
  paynowIsComplete,
  type Store,
} from "./types";

export const ONBOARDING_STEPS = [
  { step: 1, label: "Store name" },
  { step: 2, label: "Vibe" },
  { step: 3, label: "Hero" },
  { step: 4, label: "Product" },
  { step: 5, label: "Fulfillment" },
  { step: 6, label: "PayNow" },
  { step: 7, label: "Publish" },
] as const;

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Progress is derived from store data, not a stored counter — resume-safe by
 * construction: the next incomplete step is always recomputed from what exists.
 */
export function deriveOnboardingStep(
  store: Store | null,
  productCount: number,
): OnboardingStep | "done" {
  if (!store) return 1;
  if (!store.vibe) return 2;
  if (!heroIsComplete(store.hero)) return 3;
  if (productCount === 0) return 4;
  if (!fulfillmentIsComplete(store.fulfillment)) return 5;
  if (!paynowIsComplete(store.paynow)) return 6;
  if (store.status === "draft") return 7;
  return "done";
}
