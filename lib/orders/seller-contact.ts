import { normalizeSgMobile } from "@/lib/paynow";
import type { PayNowConfig } from "@/lib/stores/types";

import { whatsAppBuyerUrl } from "./contact-buyer";

export type SellerMobileContact = {
  display: string;
  waUrl: string;
  telUrl: string;
};

/** Reuse PayNow mobile proxy as the buyer-facing seller contact (YAGNI: no extra field). */
export function sellerMobileContact(
  paynow: Partial<PayNowConfig>,
): SellerMobileContact | null {
  if (paynow.proxy_type !== "mobile" || !paynow.proxy_value?.trim()) return null;
  try {
    const e164 = normalizeSgMobile(paynow.proxy_value);
    const local = e164.replace(/^\+65/, "");
    return {
      display: `+65 ${local.slice(0, 4)} ${local.slice(4)}`,
      waUrl: whatsAppBuyerUrl(e164),
      telUrl: `tel:${e164}`,
    };
  } catch {
    return null;
  }
}

/** Existing orders stay reachable even if the seller unpublishes. */
export function orderStoreAllowsBuyerAccess(status: string): boolean {
  return status !== "deleted";
}
