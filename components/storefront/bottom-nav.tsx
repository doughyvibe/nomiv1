"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/components/storefront/cart-context";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  const isShop =
    pathname.endsWith("/cart") === false &&
    pathname.endsWith("/checkout") === false &&
    !pathname.includes("/order/");

  const isCart = pathname.endsWith("/cart");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-vibe-border/40 bg-vibe-bg/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg">
        <Link
          href="/"
          className={cn(
            "vibe-display flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-semibold uppercase transition-colors",
            isShop ? "text-vibe-primary" : "text-vibe-text-muted",
          )}
        >
          Shop
        </Link>
        <Link
          href="/cart"
          className={cn(
            "vibe-display relative flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-semibold uppercase transition-colors",
            isCart ? "text-vibe-primary" : "text-vibe-text-muted",
          )}
        >
          Cart
          {count > 0 && (
            <span className="absolute top-1.5 ml-10 flex size-5 items-center justify-center rounded-full bg-vibe-primary text-[10px] font-bold text-vibe-primary-fg">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
