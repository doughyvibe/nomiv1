"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import type { InventoryInput } from "@/lib/products/inventory";
import type { ProductVariant } from "@/lib/products/variants";
import { cn } from "@/lib/utils";

function stocksFromVariants(
  options: { values: { id: string; name: string }[] }[] | undefined,
  variants: ProductVariant[] | undefined,
): Record<string, string> {
  if (!options?.length || !variants?.length) return {};
  const valueNameById = new Map<string, string>();
  for (const o of options) {
    for (const v of o.values) valueNameById.set(v.id, v.name);
  }
  const out: Record<string, string> = {};
  for (const v of variants) {
    const valueNames = v.option_value_ids.map(
      (id) => valueNameById.get(id) ?? "",
    );
    const key = valueNames.map((n) => n.toLowerCase()).join("\0");
    out[key] = v.stock_qty != null ? String(v.stock_qty) : "0";
  }
  return out;
}

/** Hook for product form Track inventory section. Always persists sold_out_policy = show. */
export function useStockState(initial?: {
  track_inventory?: boolean | null;
  stock_qty?: number | null;
  options?: { values: { id: string; name: string }[] }[];
  variants?: ProductVariant[];
}) {
  const [enabled, setEnabled] = useState(Boolean(initial?.track_inventory));
  const [productQty, setProductQty] = useState(
    initial?.stock_qty != null ? String(initial.stock_qty) : "10",
  );
  const [stockByKey, setStockByKey] = useState<Record<string, string>>(() =>
    stocksFromVariants(initial?.options, initial?.variants),
  );

  function toInventoryInput(): InventoryInput {
    if (!enabled) {
      return {
        track_inventory: false,
        stock_qty: null,
        sold_out_policy: "show",
      };
    }
    const n = Number.parseInt(productQty, 10);
    return {
      track_inventory: true,
      stock_qty: Number.isInteger(n) ? n : null,
      sold_out_policy: "show",
    };
  }

  function stockQtyForKey(key: string): number | null {
    const raw = stockByKey[key]?.trim() ?? "";
    if (raw === "") return null;
    const n = Number.parseInt(raw, 10);
    return Number.isInteger(n) ? n : null;
  }

  return {
    enabled,
    setEnabled,
    productQty,
    setProductQty,
    stockByKey,
    setStockByKey,
    toInventoryInput,
    stockQtyForKey,
  };
}

export type StockState = ReturnType<typeof useStockState>;

function QtyLeftField({
  id,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        inputMode="numeric"
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
        className={cn(
          "h-12 rounded-full border-border/50 bg-muted/60 pr-14 pl-5 text-[15px] font-medium shadow-none",
          "placeholder:text-muted-foreground/50",
          "focus-visible:border-foreground/20 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/35",
        )}
        placeholder="0"
      />
      <span
        className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[15px] text-muted-foreground"
        aria-hidden
      >
        left
      </span>
    </div>
  );
}

/** Track inventory config — parent FeatureToggle gates visibility. */
export function StockSection({
  state,
  choicesEnabled,
  combinations,
  disabled,
}: {
  state: StockState;
  choicesEnabled: boolean;
  /** Draft combination value-name arrays from choices editor. */
  combinations: string[][];
  disabled?: boolean;
}) {
  const { productQty, setProductQty, stockByKey, setStockByKey } = state;

  return (
    <div className="flex flex-col gap-4">
      {choicesEnabled && combinations.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-snug text-muted-foreground">
            Limit available quantity of this product.
          </p>
          {combinations.map((valueNames) => {
            const key = valueNames.map((n) => n.toLowerCase()).join("\0");
            const label = valueNames.join(" · ");
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
                <QtyLeftField
                  value={stockByKey[key] ?? ""}
                  disabled={disabled}
                  aria-label={`Quantity left for ${label}`}
                  onChange={(next) =>
                    setStockByKey((prev) => ({ ...prev, [key]: next }))
                  }
                />
              </div>
            );
          })}
        </div>
      ) : choicesEnabled ? (
        <p className="text-sm text-muted-foreground">Add variants first.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-snug text-muted-foreground">
            Limit available quantity of this product.
          </p>
          <QtyLeftField
            id="product-stock-qty"
            value={productQty}
            disabled={disabled}
            aria-label="Quantity left"
            onChange={setProductQty}
          />
        </div>
      )}
    </div>
  );
}
