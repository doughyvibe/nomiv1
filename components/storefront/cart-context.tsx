"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addToCart as addItem,
  cartItemCount,
  loadCart,
  removeFromCart,
  saveCart,
  updateCartItem,
} from "@/lib/cart/storage";
import type { Cart } from "@/lib/cart/types";

type CartContextValue = {
  cart: Cart;
  count: number;
  addToCart: (productId: string, quantity: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  refresh: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>(() =>
    typeof window !== "undefined" ? loadCart(slug) : { items: [] },
  );

  const refresh = useCallback(() => {
    setCart(loadCart(slug));
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cartItemCount(cart),
      addToCart: (productId, quantity) => {
        setCart(addItem(slug, productId, quantity));
      },
      setQuantity: (productId, quantity) => {
        setCart(updateCartItem(slug, productId, quantity));
      },
      removeItem: (productId) => {
        setCart(removeFromCart(slug, productId));
      },
      clear: () => {
        saveCart(slug, { items: [] });
        setCart({ items: [] });
      },
      refresh,
    }),
    [cart, slug, refresh],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
