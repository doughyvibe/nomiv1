"use client";

import { Input } from "@/components/ui/input";

type CategoryPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function CategoryPicker({
  value,
  onChange,
  disabled,
}: CategoryPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        id="product-category"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Category (optional)"
        maxLength={40}
        disabled={disabled}
        aria-label="Category"
      />
      <p className="text-muted-foreground text-xs">
        Categories group your storefront menu. Add a second category to enable
        filters for buyers.
      </p>
    </div>
  );
}
