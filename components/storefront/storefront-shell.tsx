"use client";

import { usePathname } from "next/navigation";

import { CartProvider } from "@/components/storefront/cart-context";
import { StaleCartPruner } from "@/components/storefront/stale-cart-pruner";
import { StickyCheckoutBar } from "@/components/storefront/sticky-checkout-bar";

function showStickyBar(pathname: string): boolean {
  // Hide on checkout/order so payment CTAs aren't covered (existing product decision)
  if (pathname.includes("/checkout") || pathname.includes("/order/")) {
    return false;
  }
  return true;
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
      <div
        className="mx-auto min-h-dvh w-full max-w-[1280px]"
        style={{
          paddingBottom: sticky
            ? "calc(5.5rem + env(safe-area-inset-bottom, 0px))"
            : "max(1.5rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </div>
      {sticky && <StickyCheckoutBar />}
    </CartProvider>
  );
}
