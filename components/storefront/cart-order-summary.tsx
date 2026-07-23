"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { useStorefront } from "@/components/storefront/storefront-context";
import {
  cartLineClass,
  cartNameClass,
  cartPriceClass,
  cartQtyBtnClass,
  cartRemoveClass,
  cartThumbClass,
  checkoutSectionLabelClass,
  vibeFlags,
} from "@/components/storefront/vibe-ui";
import { formatPrice } from "@/lib/money";
import type { CartLine } from "@/lib/cart/types";
import type { Product } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export type CartSummaryLine = {
  item: CartLine;
  product: Product;
  unit: number;
  variantLabel: string | null;
  customLines: string[];
};

const COLLAPSE_THRESHOLD = 3;

function CartLineRow({
  line,
  onSetQuantity,
  onRemove,
}: {
  line: CartSummaryLine;
  onSetQuantity: (lineKey: string, quantity: number) => void;
  onRemove: (lineKey: string) => void;
}) {
  const { store } = useStorefront();
  const flags = vibeFlags(store.vibe);
  const { item, product, unit, variantLabel, customLines } = line;

  return (
    <li
      className={cn(
        cartLineClass(flags),
        "flex gap-3 rounded-[var(--vibe-radius)] p-4",
      )}
    >
      {product.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image_url}
          alt=""
          className={cartThumbClass(flags)}
        />
      ) : (
        <div
          className={cn(cartThumbClass(flags), "bg-vibe-border/20 object-cover")}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cartNameClass(flags)}>{product.name}</p>
            {variantLabel ? (
              <p className="text-xs text-vibe-text-muted">{variantLabel}</p>
            ) : null}
            {customLines.map((cl) => (
              <p key={cl} className="text-xs text-vibe-text-muted">
                {cl}
              </p>
            ))}
            <p className="mt-0.5 text-xs text-vibe-text-muted">
              {formatPrice(unit)} each
            </p>
          </div>
          <p className={cn(cartPriceClass(flags), "text-sm")}>
            {formatPrice(unit * item.quantity)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onSetQuantity(item.lineKey, item.quantity - 1)}
              className={cartQtyBtnClass(flags)}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="min-w-[2rem] text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onSetQuantity(item.lineKey, item.quantity + 1)}
              className={cartQtyBtnClass(flags)}
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.lineKey)}
            className={cartRemoveClass(flags)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartOrderSummary({
  lines,
  onSetQuantity,
  onRemove,
}: {
  lines: CartSummaryLine[];
  onSetQuantity: (lineKey: string, quantity: number) => void;
  onRemove: (lineKey: string) => void;
}) {
  const { store } = useStorefront();
  const flags = vibeFlags(store.vibe);
  const [expanded, setExpanded] = useState(false);
  const collapsible = lines.length >= COLLAPSE_THRESHOLD;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className={checkoutSectionLabelClass(flags)}>Your order</h2>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-semibold text-vibe-text-muted underline-offset-2 hover:underline"
          >
            {expanded ? "Hide items" : "Edit items"}
          </button>
        ) : null}
      </div>

      {collapsible && !expanded ? (
        <ul className="flex flex-col gap-2">
          {lines.map((line) => (
            <li
              key={line.item.lineKey}
              className="flex justify-between gap-3 text-sm text-vibe-text"
            >
              <span className="min-w-0 truncate">
                {line.product.name} × {line.item.quantity}
              </span>
              <span className="shrink-0 tabular-nums">
                {formatPrice(line.unit * line.item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-3">
          {lines.map((line) => (
            <CartLineRow
              key={line.item.lineKey}
              line={line}
              onSetQuantity={onSetQuantity}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
