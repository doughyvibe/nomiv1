"use client";

import { usePathname } from "next/navigation";

import { CartProvider } from "@/components/storefront/cart-context";
import { StickyCheckoutBar } from "@/components/storefront/sticky-checkout-bar";

export function StorefrontShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isShopHome =
    pathname === "/" || /^\/s\/[^/]+$/.test(pathname);

  return (
    <CartProvider slug={slug}>
      <div
        className="mx-auto min-h-dvh w-full max-w-[1280px]"
        style={{
          paddingBottom: isShopHome
            ? "calc(5.5rem + env(safe-area-inset-bottom, 0px))"
            : "max(1.5rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </div>
      {isShopHome && <StickyCheckoutBar />}
    </CartProvider>
  );
}
