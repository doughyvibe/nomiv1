"use client";

import { usePathname } from "next/navigation";

import {
  CartProvider,
  useCart,
} from "@/components/storefront/cart-context";
import { StaleCartPruner } from "@/components/storefront/stale-cart-pruner";
import { StickyCheckoutBar } from "@/components/storefront/sticky-checkout-bar";
import { useStorefront } from "@/components/storefront/storefront-context";
import { availableCartSummary } from "@/lib/cart/storage";

function showStickyBar(pathname: string): boolean {
  // Hide on checkout/order so payment CTAs aren't covered (existing product decision)
  if (pathname.includes("/checkout") || pathname.includes("/order/")) {
    return false;
  }
  return true;
}

function StorefrontFrame({
  sticky,
  children,
}: {
  sticky: boolean;
  children: React.ReactNode;
}) {
  const { cart } = useCart();
  const { products } = useStorefront();
  const priceById = new Map(products.map((p) => [p.id, p.price_cents]));
  const { count } = availableCartSummary(cart.items, priceById);
  const barVisible = sticky && count > 0;

  return (
    <>
      <div
        className="mx-auto min-h-dvh w-full max-w-[1280px] transition-[padding-bottom] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          paddingBottom: barVisible
            ? "calc(5.5rem + env(safe-area-inset-bottom, 0px))"
            : "max(1.5rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </div>
      {sticky ? <StickyCheckoutBar /> : null}
    </>
  );
}

export function StorefrontShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sticky = showStickyBar(pathname);

  return (
    <CartProvider slug={slug}>
      <StaleCartPruner slug={slug} />
      <StorefrontFrame sticky={sticky}>{children}</StorefrontFrame>
    </CartProvider>
  );
}
