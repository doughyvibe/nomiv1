"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";

export function StickyCheckoutBar() {
  const { count, cart } = useCart();
  const { products } = useStorefront();

  const productMap = new Map(products.map((p) => [p.id, p]));
  const subtotal = cart.items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product ? product.price_cents * item.quantity : 0);
  }, 0);

  const hasItems = count > 0;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      aria-live="polite"
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-[1280px] items-center gap-3 rounded-2xl border border-vibe-border/30 bg-vibe-surface/95 px-4 py-3 shadow-lg backdrop-blur-md transition-all",
          hasItems ? "justify-between" : "justify-center",
        )}
      >
        <Link
          href="/cart"
          className={cn(
            "flex min-h-11 items-center gap-2 text-vibe-text transition-colors",
            !hasItems && "justify-center px-4",
          )}
        >
          <ShoppingCart className="size-5 shrink-0 text-vibe-text-muted" />
          {hasItems ? (
            <>
              <span className="text-sm text-vibe-text-muted">
                {count} {count === 1 ? "item" : "items"}
              </span>
              <span className="font-display text-lg font-semibold text-vibe-text">
                {formatPrice(subtotal)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-vibe-text-muted">
              Cart · 0
            </span>
          )}
        </Link>

        {hasItems ? (
          <Link
            href="/cart"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-vibe-primary text-vibe-primary-fg transition-transform active:scale-95"
            aria-label="Go to checkout"
          >
            <ArrowRight className="size-5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
