import {
  serializeCustomisationsForKey,
  type CustomisationAnswers,
} from "@/lib/products/customisations";

export type CartLineCustomisations = CustomisationAnswers;

/**
 * Cart line identity (Phase 2+).
 * Merge rule: same lineKey → combine quantity.
 */
export type CartLine = {
  productId: string;
  variantId?: string | null;
  customisations?: CartLineCustomisations;
  quantity: number;
  lineKey: string;
};

export type Cart = {
  items: CartLine[];
};

/** @deprecated Phase 1 shape — localStorage now uses CartLine via nomi-cart-v2-* */
export type CartItem = {
  productId: string;
  quantity: number;
};

export function buildCartLineKey(
  productId: string,
  variantId?: string | null,
  customisations?: CartLineCustomisations,
): string {
  const cust = serializeCustomisationsForKey(customisations);
  const base = `${productId}::${variantId ?? ""}`;
  return cust ? `${base}::${cust}` : base;
}

export function legacyCartItemToLineKey(item: CartItem): string {
  return buildCartLineKey(item.productId);
}
