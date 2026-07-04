"use client";

import { usePathname } from "next/navigation";

import { BottomNav } from "@/components/storefront/bottom-nav";
import { CartProvider } from "@/components/storefront/cart-context";

export function StorefrontShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav =
    pathname.includes("/checkout") || pathname.includes("/order/");

  return (
    <CartProvider slug={slug}>
      <div
        className="mx-auto min-h-full max-w-lg"
        style={{
          paddingBottom: hideNav
            ? "max(1.5rem, env(safe-area-inset-bottom, 0px))"
            : "calc(4.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </CartProvider>
  );
}
