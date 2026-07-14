import type { Cart, CartItem } from "./types";

function cartKey(slug: string): string {
  return `nomi-cart-${slug}`;
}

export function loadCart(slug: string): Cart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(cartKey(slug));
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as Cart;
    return {
      items: (parsed.items ?? []).filter(
        (i) => i.productId && i.quantity > 0,
      ),
    };
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

/** Count/subtotal using only products that still exist (avoids sticky vs money mismatch). */
export function availableCartSummary(
  items: CartItem[],
  priceById: ReadonlyMap<string, number>,
): { count: number; subtotalCents: number; availableItems: CartItem[] } {
  let count = 0;
  let subtotalCents = 0;
  const availableItems: CartItem[] = [];
  for (const item of items) {
    const price = priceById.get(item.productId);
    if (price === undefined) continue;
    availableItems.push(item);
    count += item.quantity;
    subtotalCents += price * item.quantity;
  }
  return { count, subtotalCents, availableItems };
}

export function addToCart(
  slug: string,
  productId: string,
  quantity: number,
): Cart {
  const cart = loadCart(slug);
  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  saveCart(slug, cart);
  return cart;
}

export function updateCartItem(
  slug: string,
  productId: string,
  quantity: number,
): Cart {
  const cart = loadCart(slug);
  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
  } else {
    const item = cart.items.find((i) => i.productId === productId);
    if (item) item.quantity = quantity;
  }
  saveCart(slug, cart);
  return cart;
}

export function removeFromCart(slug: string, productId: string): Cart {
  return updateCartItem(slug, productId, 0);
}
