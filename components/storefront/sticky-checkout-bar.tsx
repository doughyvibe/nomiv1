"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { availableCartSummary } from "@/lib/cart/storage";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";

export function StickyCheckoutBar() {
  const { cart } = useCart();
  const { products } = useStorefront();

  const priceById = new Map(products.map((p) => [p.id, p.price_cents]));
  const { count, subtotalCents } = availableCartSummary(cart.items, priceById);
  const hasItems = count > 0;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      aria-live="polite"
    >
      <div
        className={cn(
          "checkout-bar pointer-events-auto mx-auto flex max-w-[1280px] items-center gap-4 rounded-2xl border border-vibe-border/30 bg-vibe-surface/95 px-4 py-3 shadow-lg backdrop-blur-md transition-all",
          hasItems ? "justify-between" : "justify-center",
        )}
      >
        <Link
          href="/cart"
          className={cn(
            "flex min-h-11 items-center gap-2.5 text-vibe-text transition-colors",
            !hasItems && "justify-center px-2",
          )}
        >
          <ShoppingCart
            className={cn(
              "size-6 shrink-0",
              hasItems ? "checkout-bar-icon-active" : "text-vibe-text-muted",
            )}
          />
          {hasItems ? (
            <>
              <span className="text-base text-vibe-text-muted">
                {count} {count === 1 ? "item" : "items"}
              </span>
              <span className="font-display text-xl font-semibold text-vibe-text-bright">
                {formatPrice(subtotalCents)}
              </span>
            </>
          ) : (
            <span className="text-base font-medium text-vibe-text-muted">
              Your cart is empty
            </span>
          )}
        </Link>

        {hasItems ? (
          <Link
            href="/checkout"
            className="checkout-bar-cta inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-vibe-primary px-5 text-base font-semibold text-vibe-primary-fg transition-transform active:scale-95"
          >
            Checkout
          </Link>
        ) : null}
      </div>
    </div>
  );
}
