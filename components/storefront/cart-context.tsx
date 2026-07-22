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
import type { Cart, CartLineCustomisations } from "@/lib/cart/types";

type CartContextValue = {
  cart: Cart;
  count: number;
  addToCart: (
    productId: string,
    quantity: number,
    variantId?: string | null,
    customisations?: CartLineCustomisations,
  ) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
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
  const [cart, setCart] = useState<Cart>({ items: [] });

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
      addToCart: (productId, quantity, variantId, customisations) => {
        setCart(
          addItem(slug, { productId, quantity, variantId, customisations }),
        );
      },
      setQuantity: (lineKey, quantity) => {
        setCart(updateCartItem(slug, lineKey, quantity));
      },
      removeItem: (lineKey) => {
        setCart(removeFromCart(slug, lineKey));
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
