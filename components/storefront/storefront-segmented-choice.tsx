"use client";

import { cn } from "@/lib/utils";

export type SegmentOption = {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
};

/** Pickup / delivery — underline tab row, not filled slabs. */
export function StorefrontSegmentedChoice({
  options,
  className,
}: {
  options: SegmentOption[];
  className?: string;
}) {
  if (options.length === 0) return null;

  return (
    <div
      className={cn(
        "storefront-segment flex flex-wrap gap-x-1 border-b border-vibe-border/12",
        className,
      )}
      role="tablist"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={opt.selected}
          onClick={opt.onSelect}
          className={cn(
            "storefront-segment-item min-h-11 flex-1 px-3 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-5",
            opt.selected && "storefront-segment-item-active",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
