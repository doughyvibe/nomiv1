"use client";

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
      <div className="flex flex-wrap gap-2">
        {suggestions.map((cat) => {
          const selected =
            normalizedValue.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              disabled={disabled}
              onClick={() => onChange(selected ? "" : cat)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors min-h-9",
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
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or type a custom category"
        maxLength={40}
        disabled={disabled}
        className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      />
      <p className="text-muted-foreground text-xs">
        Categories group your storefront menu. Add a second category to enable
        filters for buyers.
      </p>
    </div>
  );
}
