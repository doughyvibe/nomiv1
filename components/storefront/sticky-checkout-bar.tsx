"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { resolveCartLineUnitPrice } from "@/lib/cart/line-price";
import { availableCartSummary } from "@/lib/cart/storage";
import { buyerNeedsCartFulfilmentStep } from "@/lib/fulfilment/buyer-cart-step";
import { formatPrice } from "@/lib/money";
import type { FulfillmentConfig } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function StickyCheckoutBar() {
  const { cart } = useCart();
  const { products, store } = useStorefront();

  const productMap = new Map(products.map((p) => [p.id, p]));
  const { count, subtotalCents, availableItems } = availableCartSummary(
    cart.items,
    (line) => resolveCartLineUnitPrice(line, productMap.get(line.productId)),
  );
  const hasItems = count > 0;
  const cartLeadLines = availableItems.map((line) => {
    const p = productMap.get(line.productId);
    return { lead_time_days: p?.lead_time_days ?? 0 };
  });
  const viaCart = buyerNeedsCartFulfilmentStep(
    store.fulfillment as FulfillmentConfig,
    cartLeadLines,
  );
  const ctaHref = viaCart ? "/cart" : "/checkout";
  const ctaLabel = viaCart ? "Continue" : "Checkout";

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]",
        "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "motion-reduce:transition-none",
        hasItems
          ? "translate-y-0 opacity-100"
          : "translate-y-[calc(100%+1.25rem)] opacity-0",
      )}
      aria-hidden={!hasItems}
      aria-live="polite"
    >
      <div className="checkout-bar pointer-events-auto mx-auto flex max-w-[1280px] items-center justify-between gap-4 rounded-2xl border border-vibe-border/30 bg-vibe-surface/95 px-4 py-3 shadow-lg backdrop-blur-md">
        <Link
          href="/cart"
          tabIndex={hasItems ? undefined : -1}
          className="flex min-h-11 items-center gap-2.5 text-vibe-text transition-colors"
        >
          <ShoppingCart className="checkout-bar-icon-active size-6 shrink-0" />
          <span className="text-base text-vibe-text-muted">
            {count} {count === 1 ? "item" : "items"}
          </span>
          <span className="font-display text-xl font-semibold text-vibe-text-bright">
            {formatPrice(subtotalCents)}
          </span>
        </Link>

        <Link
          href={ctaHref}
          tabIndex={hasItems ? undefined : -1}
          className="checkout-bar-cta inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-vibe-primary px-5 text-base font-semibold text-vibe-primary-fg transition-transform active:scale-95"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
