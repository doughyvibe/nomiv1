"use client";

import { formatPrice } from "@/lib/money";
import type { VibeFlags } from "@/components/storefront/vibe-ui";
import {
  cartSubtotalClass,
  cartSubtotalLabelClass,
  cartSubtotalValueClass,
} from "@/components/storefront/vibe-ui";
import { cn } from "@/lib/utils";

export function CartTotals({
  flags,
  subtotal,
  deliveryFee,
  deliveryWaived,
  total,
  untilFree,
}: {
  flags: VibeFlags;
  subtotal: number;
  deliveryFee?: number;
  deliveryWaived?: boolean;
  total: number;
  untilFree?: number | null;
}) {
  const showDelivery = deliveryFee !== undefined;

  return (
    <div className={cn(cartSubtotalClass(flags), "space-y-2 px-4 py-4")}>
      <div className="flex justify-between text-sm">
        <span className={cartSubtotalLabelClass(flags)}>Subtotal</span>
        <span className="tabular-nums text-vibe-text">{formatPrice(subtotal)}</span>
      </div>
      {showDelivery ? (
        <div className="flex justify-between text-sm">
          <span className={cartSubtotalLabelClass(flags)}>Delivery</span>
          <span className="tabular-nums text-vibe-text">
            {deliveryWaived ? "Free" : formatPrice(deliveryFee ?? 0)}
          </span>
        </div>
      ) : null}
      {untilFree != null ? (
        <p className="text-xs text-vibe-text-muted">
          {formatPrice(untilFree)} more for free delivery
        </p>
      ) : null}
      <div className="flex justify-between border-t border-vibe-border/12 pt-3">
        <span className={cartSubtotalLabelClass(flags)}>Total</span>
        <span className={cartSubtotalValueClass(flags)}>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
