import {
  fulfillmentIsComplete,
  heroIsComplete,
  paynowIsComplete,
  type Store,
} from "@/lib/stores/types";

export function storePublishReadiness(
  store: Store,
  productCount: number,
): { ready: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!store.vibe) issues.push("Choose a vibe");
  if (!heroIsComplete(store.hero)) issues.push("Complete hero title");
  if (productCount === 0) issues.push("Add at least one product");
  if (!fulfillmentIsComplete(store.fulfillment)) {
    issues.push("Configure fulfillment");
  }
  if (!paynowIsComplete(store.paynow)) issues.push("Configure PayNow");
  return { ready: issues.length === 0, issues };
}
