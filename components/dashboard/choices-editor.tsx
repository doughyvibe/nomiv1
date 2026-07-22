"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { fieldLabelClass } from "@/components/dashboard/field-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cartesianValueNames,
  expectedVariantCount,
  MAX_OPTION_DIMENSIONS,
  MAX_VARIANTS,
  type ChoicesInput,
  type ProductOption,
  type ProductVariant,
} from "@/lib/products/variants";
import { cn } from "@/lib/utils";

type DraftOption = {
  name: string;
  values: string[];
};

function defaultOption(): DraftOption {
  return { name: "Size", values: ["Regular"] };
}

function optionsFromProduct(options: ProductOption[] | undefined): DraftOption[] {
  if (!options?.length) return [defaultOption()];
  return options.map((o) => ({
    name: o.name,
    values: o.values.length ? o.values.map((v) => v.name) : ["Regular"],
  }));
}

function pricesFromProduct(
  options: ProductOption[] | undefined,
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
    out[key] =
      v.price_cents != null ? (v.price_cents / 100).toFixed(2) : "";
  }
  return out;
}

/** Hook for product form Variants section. */
export function useChoicesState(initial?: {
  options?: ProductOption[];
  variants?: ProductVariant[];
}) {
  const hasInitial = (initial?.options?.length ?? 0) > 0;
  const [enabled, setEnabled] = useState(hasInitial);
  const [options, setOptions] = useState<DraftOption[]>(() =>
    optionsFromProduct(initial?.options),
  );
  const [priceByKey, setPriceByKey] = useState<Record<string, string>>(() =>
    pricesFromProduct(initial?.options, initial?.variants),
  );

  const generated = useMemo(() => {
    if (!enabled) return [] as string[][];
    const cleaned = options.map((o) =>
      o.values.map((v) => v.trim()).filter(Boolean),
    );
    if (cleaned.some((v) => v.length === 0)) return [] as string[][];
    return cartesianValueNames(cleaned);
  }, [options, enabled]);

  const comboCount = useMemo(() => {
    if (!enabled) return 0;
    const counts = options.map((o) =>
      o.values.map((v) => v.trim()).filter(Boolean).length,
    );
    if (counts.some((c) => c === 0)) return 0;
    return expectedVariantCount(counts);
  }, [options, enabled]);

  function toChoicesInput(): ChoicesInput | null {
    if (!enabled) return null;
    const cleanedOptions = options.map((o) => ({
      name: o.name.trim(),
      values: o.values.map((v) => v.trim()).filter(Boolean),
    }));
    return {
      options: cleanedOptions,
      variants: generated.map((valueNames) => {
        const key = valueNames.map((n) => n.toLowerCase()).join("\0");
        const raw = priceByKey[key]?.trim() ?? "";
        let price_cents: number | null = null;
        if (raw) {
          const n = Number.parseFloat(raw);
          if (Number.isFinite(n) && n >= 0) {
            price_cents = Math.round(n * 100);
          }
        }
        return { valueNames, price_cents };
      }),
    };
  }

  return {
    enabled,
    setEnabled,
    options,
    setOptions,
    priceByKey,
    setPriceByKey,
    generated,
    comboCount,
    toChoicesInput,
  };
}

export type ChoicesState = ReturnType<typeof useChoicesState>;

/** Variants config body — parent FeatureToggle gates visibility. */
export function ChoicesSection({
  state,
  disabled,
  /** Product price field (dollars string) — shown as the inherited default. */
  productPrice,
}: {
  state: ChoicesState;
  disabled?: boolean;
  productPrice?: string;
}) {
  const {
    options,
    setOptions,
    priceByKey,
    setPriceByKey,
    generated,
    comboCount,
  } = state;
  const overCap = comboCount > MAX_VARIANTS;
  const basePriceHint = productPrice?.trim() || null;

  return (
    <div className="flex flex-col gap-6">
      {options.map((opt, oi) => (
        <div
          key={oi}
          className={
            oi < options.length - 1
              ? "flex flex-col gap-2 border-b border-border/40 pb-6"
              : "flex flex-col gap-2"
          }
        >
          <div className="flex items-end gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Label
                htmlFor={`choice-name-${oi}`}
                className={fieldLabelClass}
              >
                Option name
              </Label>
              <Input
                id={`choice-name-${oi}`}
                value={opt.name}
                placeholder="Size"
                disabled={disabled}
                onChange={(e) => {
                  const next = [...options];
                  next[oi] = { ...opt, name: e.target.value };
                  setOptions(next);
                }}
              />
            </div>
            {options.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                aria-label="Remove option"
                onClick={() =>
                  setOptions(options.filter((_, i) => i !== oi))
                }
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label className={fieldLabelClass}>Options</Label>
            {opt.values.map((val, vi) => (
              <div key={vi} className="flex gap-2">
                <Input
                  value={val}
                  placeholder="Regular"
                  disabled={disabled}
                  onChange={(e) => {
                    const next = [...options];
                    const values = [...opt.values];
                    values[vi] = e.target.value;
                    next[oi] = { ...opt, values };
                    setOptions(next);
                  }}
                />
                {opt.values.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={disabled}
                    aria-label="Remove option"
                    onClick={() => {
                      const next = [...options];
                      next[oi] = {
                        ...opt,
                        values: opt.values.filter((_, i) => i !== vi),
                      };
                      setOptions(next);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              disabled={disabled}
              aria-label="Add option"
              onClick={() => {
                const next = [...options];
                next[oi] = { ...opt, values: [...opt.values, ""] };
                setOptions(next);
              }}
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center self-start rounded-full border border-border/60 bg-card text-foreground transition-colors",
                "hover:border-foreground/25 hover:bg-muted/40",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <Plus className="size-5" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
      ))}

      {options.length < MAX_OPTION_DIMENSIONS ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start rounded-full border-primary/70 bg-card hover:border-primary hover:bg-primary/12"
          disabled={disabled}
          onClick={() => setOptions([...options, defaultOption()])}
        >
          <Plus className="size-3.5" strokeWidth={2.25} />
          Add another variant
        </Button>
      ) : null}

      {comboCount > 0 ? (
        <div className="mt-2 flex flex-col gap-3 border-t border-border/40 pt-5">
          <div className="flex flex-col gap-1">
            <p className={fieldLabelClass}>
              Variations ({comboCount}
              {overCap ? ` — max ${MAX_VARIANTS}` : ""})
            </p>
            <p className="text-sm leading-snug text-muted-foreground">
              Final price for each. Leave blank to use the product price
              {basePriceHint ? ` ($${basePriceHint})` : ""}.
            </p>
          </div>
          {overCap ? (
            <p className="text-destructive text-xs" role="alert">
              Too many variations (max {MAX_VARIANTS}).
            </p>
          ) : null}
          {!overCap
            ? generated.map((valueNames) => {
                const key = valueNames
                  .map((n) => n.toLowerCase())
                  .join("\0");
                const label = valueNames.join(" · ");
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                    <div className="relative w-32 shrink-0">
                      <span
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
                        aria-hidden
                      >
                        $
                      </span>
                      <Input
                        className="pl-8"
                        inputMode="decimal"
                        placeholder={basePriceHint ?? "0.00"}
                        disabled={disabled}
                        value={priceByKey[key] ?? ""}
                        onChange={(e) =>
                          setPriceByKey((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        aria-label={`Final price for ${label}`}
                      />
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      ) : null}
    </div>
  );
}
