import {
  buildCartLineKey,
  type Cart,
  type CartLine,
  type CartLineCustomisations,
} from "./types";
import {
  customisationAnswersComplete,
  productHasRequiredCustomisations,
} from "@/lib/products/customisations";
import type { ProductCustomisation } from "@/lib/products/customisations";

const CART_VERSION = 2;

function cartKey(slug: string): string {
  return `nomi-cart-v${CART_VERSION}-${slug}`;
}

function normalizeLine(raw: Partial<CartLine>): CartLine | null {
  if (!raw.productId || typeof raw.quantity !== "number" || raw.quantity <= 0) {
    return null;
  }
  const variantId = raw.variantId ?? null;
  const customisations = raw.customisations;
  const lineKey =
    typeof raw.lineKey === "string" && raw.lineKey.length > 0
      ? raw.lineKey
      : buildCartLineKey(raw.productId, variantId, customisations);
  return {
    productId: raw.productId,
    variantId,
    customisations,
    quantity: raw.quantity,
    lineKey,
  };
}

export function loadCart(slug: string): Cart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(cartKey(slug));
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as { items?: Partial<CartLine>[] };
    const items = (parsed.items ?? [])
      .map(normalizeLine)
      .filter((i): i is CartLine => i != null);
    return { items };
  } catch {
    return { items: [] };
  }
}

export function saveCart(slug: string, cart: Cart): void {
  localStorage.setItem(cartKey(slug), JSON.stringify(cart));
}

export function clearCart(slug: string): void {
  localStorage.removeItem(cartKey(slug));
}

export function cartItemCount(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

/** Keep only items whose product still exists; returns how many line entries were dropped. */
export function pruneCartToProductIds(
  slug: string,
  productIds: ReadonlySet<string>,
): { cart: Cart; removedLines: number } {
  const cart = loadCart(slug);
  const nextItems = cart.items.filter((i) => productIds.has(i.productId));
  const removedLines = cart.items.length - nextItems.length;
  if (removedLines === 0) return { cart, removedLines: 0 };
  const next = { items: nextItems };
  saveCart(slug, next);
  return { cart: next, removedLines };
}

type PruneProduct = {
  id: string;
  variants?: ReadonlyArray<{ id: string }> | null;
  customisations?: ReadonlyArray<ProductCustomisation> | null;
};

/**
 * Drop lines whose variant is missing when the product has choices,
 * or whose required customisation answers are incomplete/invalid.
 */
export function pruneCartToValidLines(
  slug: string,
  products: ReadonlyArray<PruneProduct>,
): { cart: Cart; removedLines: number } {
  const byId = new Map(products.map((p) => [p.id, p]));
  const cart = loadCart(slug);
  const nextItems = cart.items.filter((line) => {
    const product = byId.get(line.productId);
    if (!product) return false;
    const variants = product.variants ?? [];
    if (variants.length > 0) {
      if (!line.variantId) return false;
      if (!variants.some((v) => v.id === line.variantId)) return false;
    }
    const customs = product.customisations ?? [];
    if (productHasRequiredCustomisations({ customisations: [...customs] })) {
      if (
        !customisationAnswersComplete(
          [...customs],
          line.customisations,
        )
      ) {
        return false;
      }
    }
    return true;
  });
  const removedLines = cart.items.length - nextItems.length;
  if (removedLines === 0) return { cart, removedLines: 0 };
  const next = { items: nextItems };
  saveCart(slug, next);
  return { cart: next, removedLines };
}

/** Count/subtotal using a per-line unit price resolver. */
export function availableCartSummary(
  items: CartLine[],
  unitPriceCents: (line: CartLine) => number | undefined,
): { count: number; subtotalCents: number; availableItems: CartLine[] } {
  let count = 0;
  let subtotalCents = 0;
  const availableItems: CartLine[] = [];
  for (const item of items) {
    const price = unitPriceCents(item);
    if (price === undefined) continue;
    availableItems.push(item);
    count += item.quantity;
    subtotalCents += price * item.quantity;
  }
  return { count, subtotalCents, availableItems };
}

export type AddToCartInput = {
  productId: string;
  quantity: number;
  variantId?: string | null;
  customisations?: CartLineCustomisations;
};

export function addToCart(slug: string, input: AddToCartInput): Cart {
  const cart = loadCart(slug);
  const variantId = input.variantId ?? null;
  const customisations = input.customisations;
  const lineKey = buildCartLineKey(input.productId, variantId, customisations);
  const existing = cart.items.find((i) => i.lineKey === lineKey);
  if (existing) {
    existing.quantity += input.quantity;
  } else {
    cart.items.push({
      productId: input.productId,
      variantId,
      customisations,
      quantity: input.quantity,
      lineKey,
    });
  }
  saveCart(slug, cart);
  return cart;
}

export function updateCartItem(
  slug: string,
  lineKey: string,
  quantity: number,
): Cart {
  const cart = loadCart(slug);
  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.lineKey !== lineKey);
  } else {
    const item = cart.items.find((i) => i.lineKey === lineKey);
    if (item) item.quantity = quantity;
  }
  saveCart(slug, cart);
  return cart;
}

export function removeFromCart(slug: string, lineKey: string): Cart {
  return updateCartItem(slug, lineKey, 0);
}
