"use client";

import { Input } from "@/components/ui/input";
import { normalizeCategory } from "@/lib/products/category";
import { categorySuggestions } from "@/lib/trade-hint";
import type { TradeHint } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type CategoryPickerProps = {
  value: string;
  onChange: (value: string) => void;
  existingCategories: string[];
  tradeHint: TradeHint | null;
  disabled?: boolean;
};

export function CategoryPicker({
  value,
  onChange,
  existingCategories,
  tradeHint,
  disabled,
}: CategoryPickerProps) {
  const suggestions = categorySuggestions(tradeHint, existingCategories);
  const normalizedValue = normalizeCategory(value) ?? "";

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Category suggestions"
      >
        {suggestions.map((cat) => {
          const selected =
            normalizedValue.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : cat)}
              className={cn(
                "min-h-9 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                selected
                  ? "border-foreground bg-primary text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
      <Input
        id="product-category"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or type a custom category"
        maxLength={40}
        disabled={disabled}
        aria-label="Custom category"
      />
      <p className="text-muted-foreground text-xs">
        Categories group your storefront menu. Add a second category to enable
        filters for buyers.
      </p>
    </div>
  );
}
