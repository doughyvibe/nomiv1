"use client";

import { useMemo, useState } from "react";

import { OptionRow } from "@/components/storefront/option-row";
import type { Product } from "@/lib/stores/types";
import { isVariantSoldOut } from "@/lib/products/inventory";
import {
  findVariantByValueIds,
  productHasChoices,
  variantUnitPrice,
  type ProductVariant,
} from "@/lib/products/variants";
import { cn } from "@/lib/utils";

type VariantPickerProps = {
  product: Product;
  selectedByOptionId: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  className?: string;
};

/** True if this value can still form at least one in-stock variant given other picks. */
function valueHasStock(
  product: Product,
  optionId: string,
  valueId: string,
  selectedByOptionId: Record<string, string>,
): boolean {
  if (!product.track_inventory) return true;
  const options = product.options ?? [];
  const next = { ...selectedByOptionId, [optionId]: valueId };

  return (product.variants ?? []).some((v) => {
    if ((v.stock_qty ?? 0) <= 0) return false;
    if (!v.option_value_ids.includes(valueId)) return false;
    for (const o of options) {
      const sel = next[o.id];
      if (!sel) continue;
      if (!v.option_value_ids.includes(sel)) return false;
    }
    return true;
  });
}

/** Shared option pickers for PDP. */
export function VariantPicker({
  product,
  selectedByOptionId,
  onChange,
  className,
}: VariantPickerProps) {
  const options = product.options ?? [];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {options.map((option) => {
        const selected = selectedByOptionId[option.id] ?? "";
        return (
          <fieldset key={option.id} className="flex flex-col gap-2">
            <legend className="text-xs font-medium tracking-wider text-vibe-text-muted uppercase">
              {option.name}
            </legend>
            <div className="flex flex-col gap-2">
              {option.values.map((value) => {
                const active = selected === value.id;
                const inStock = valueHasStock(
                  product,
                  option.id,
                  value.id,
                  selectedByOptionId,
                );
                return (
                  <OptionRow
                    key={value.id}
                    active={active}
                    disabled={!inStock}
                    onClick={() =>
                      onChange({
                        ...selectedByOptionId,
                        [option.id]: value.id,
                      })
                    }
                    label={value.name}
                    meta={!inStock ? "Sold out" : undefined}
                  />
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

export function useVariantPicker(product: Product) {
  const options = product.options ?? [];
  const [selectedByOptionId, setSelectedByOptionId] = useState<
    Record<string, string>
  >({});

  const allSelected = options.every((o) => Boolean(selectedByOptionId[o.id]));
  const selectedValueIds = options
    .map((o) => selectedByOptionId[o.id])
    .filter(Boolean);

  const variant: ProductVariant | undefined = useMemo(() => {
    if (!allSelected) return undefined;
    return findVariantByValueIds(product.variants ?? [], selectedValueIds);
  }, [allSelected, product.variants, selectedValueIds]);

  const unitPriceCents = variant
    ? variantUnitPrice(product.price_cents, variant)
    : product.price_cents;

  const soldOut = Boolean(variant && isVariantSoldOut(product, variant));

  return {
    hasChoices: productHasChoices(product),
    selectedByOptionId,
    setSelectedByOptionId,
    allSelected,
    variant,
    unitPriceCents,
    complete: Boolean(variant) && !soldOut,
    selectionError:
      allSelected && !variant
        ? "That combination isn’t available"
        : allSelected && soldOut
          ? "That combination is sold out"
          : !allSelected
            ? "Choose options for this product"
            : null,
  };
}
