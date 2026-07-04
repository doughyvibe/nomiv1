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
