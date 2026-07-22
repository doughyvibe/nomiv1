import {
  fulfillmentIsComplete,
  heroIsComplete,
  paynowIsComplete,
  type Store,
} from "@/lib/stores/types";

export type PublishIssue = {
  message: string;
  href: string;
};

export function storePublishIssues(
  store: Store,
  productCount: number,
): PublishIssue[] {
  const issues: PublishIssue[] = [];
  if (!store.vibe) {
    issues.push({ message: "Choose a vibe", href: "/storefront" });
  }
  if (!heroIsComplete(store.hero)) {
    issues.push({ message: "Complete hero title", href: "/storefront" });
  }
  if (productCount === 0) {
    issues.push({ message: "Add at least one product", href: "/products/new" });
  }
  // Methods only — calendar / windows / Live mode are optional (§8, P9-D-02).
  // Never gate on variants or product choices.
  if (!fulfillmentIsComplete(store.fulfillment)) {
    issues.push({ message: "Configure fulfillment", href: "/settings" });
  }
  if (!paynowIsComplete(store.paynow)) {
    issues.push({ message: "Configure PayNow", href: "/settings" });
  }
  return issues;
}

export function storePublishReadiness(
  store: Store,
  productCount: number,
): { ready: boolean; issues: string[] } {
  const issues = storePublishIssues(store, productCount);
  return {
    ready: issues.length === 0,
    issues: issues.map((i) => i.message),
  };
}
