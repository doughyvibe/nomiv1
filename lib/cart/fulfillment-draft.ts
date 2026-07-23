/** Buyer fulfilment choices drafted on cart, consumed at checkout. */

export type FulfilmentDraft = {
  method: "pickup" | "delivery";
  deliveryMethodId?: string;
  date?: string;
  windowId?: string;
};

function draftKey(slug: string): string {
  return `nomi-fulfillment-${slug}`;
}

export function loadFulfilmentDraft(slug: string): FulfilmentDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FulfilmentDraft;
    if (parsed.method !== "pickup" && parsed.method !== "delivery") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveFulfilmentDraft(slug: string, draft: FulfilmentDraft): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(draftKey(slug), JSON.stringify(draft));
}

export function clearFulfilmentDraft(slug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey(slug));
}
