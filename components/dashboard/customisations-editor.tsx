"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { fieldLabelClass } from "@/components/dashboard/field-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  EDITOR_CUSTOMISATION_TYPES,
  MAX_CUSTOMISATION_CHOICES,
  MAX_CUSTOMISATIONS,
  type CustomisationType,
  type CustomisationsInput,
  type ProductCustomisation,
} from "@/lib/products/customisations";
import { parsePriceToCents } from "@/lib/products/validate";
import { cn } from "@/lib/utils";

type DraftChoice = { label: string; price: string };

type DraftRow = {
  label: string;
  type: CustomisationType;
  required: boolean;
  choices: DraftChoice[];
  /** yes_no fee */
  price: string;
  minSelect: string;
  maxSelect: string;
};

const TYPE_PILLS: { value: CustomisationType; label: string }[] = [
  { value: "text", label: "Text Input" },
  { value: "single_select", label: "Pick One" },
  { value: "multi_select", label: "Pick Multiple" },
];

function emptyRow(): DraftRow {
  return {
    label: "",
    type: "text",
    required: false,
    choices: [{ label: "", price: "" }],
    price: "",
    minSelect: "",
    maxSelect: "",
  };
}

function rowsFromProduct(
  customs: ProductCustomisation[] | undefined,
): DraftRow[] {
  if (!customs?.length) {
    return [emptyRow()];
  }
  return customs.map((c) => ({
    label: c.label,
    type: c.type,
    required: c.required,
    choices: c.choices.length
      ? c.choices.map((ch) => ({
          label: ch.label,
          price:
            ch.price_cents != null ? (ch.price_cents / 100).toFixed(2) : "",
        }))
      : [{ label: "", price: "" }],
    price: c.price_cents != null ? (c.price_cents / 100).toFixed(2) : "",
    minSelect: c.min_select != null ? String(c.min_select) : "",
    maxSelect: c.max_select != null ? String(c.max_select) : "",
  }));
}

function parseBound(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number.parseInt(t, 10);
  return Number.isInteger(n) ? n : null;
}

/** Hook for product form Allow Customization section. */
export function useCustomisationsState(initial?: {
  customisations?: ProductCustomisation[];
}) {
  const hasInitial = (initial?.customisations?.length ?? 0) > 0;
  const [enabled, setEnabled] = useState(hasInitial);
  const [rows, setRows] = useState<DraftRow[]>(() =>
    rowsFromProduct(initial?.customisations),
  );

  function toCustomisationsInput(): CustomisationsInput | null {
    if (!enabled) return null;
    return rows.map((row) => {
      const base = {
        label: row.label.trim(),
        type: row.type,
        required: row.required,
      };
      if (row.type === "yes_no") {
        const cents = row.price.trim()
          ? parsePriceToCents(row.price)
          : null;
        return { ...base, price_cents: cents };
      }
      if (row.type === "single_select" || row.type === "multi_select") {
        return {
          ...base,
          choices: row.choices
            .map((c) => ({
              label: c.label.trim(),
              price_cents: c.price.trim()
                ? parsePriceToCents(c.price)
                : null,
            }))
            .filter((c) => c.label),
          ...(row.type === "multi_select"
            ? {
                min_select: parseBound(row.minSelect),
                max_select: parseBound(row.maxSelect),
              }
            : {}),
        };
      }
      return base;
    });
  }

  function enableWithSeed(next: boolean) {
    setEnabled(next);
    if (next && rows.length === 0) {
      setRows([emptyRow()]);
    }
  }

  return {
    enabled,
    setEnabled: enableWithSeed,
    rows,
    setRows,
    toCustomisationsInput,
  };
}

export type CustomisationsState = ReturnType<typeof useCustomisationsState>;

function typePillsForRow(type: CustomisationType) {
  if (type === "yes_no") {
    return [
      ...TYPE_PILLS,
      { value: "yes_no" as const, label: "Yes / No" },
    ];
  }
  return TYPE_PILLS;
}

/** Allow Customization config — parent FeatureToggle gates visibility. */
export function CustomisationsSection({
  state,
  disabled,
}: {
  state: CustomisationsState;
  disabled?: boolean;
}) {
  const { rows, setRows } = state;

  function updateRow(index: number, patch: Partial<DraftRow>) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  function setType(index: number, next: CustomisationType) {
    const row = rows[index];
    if (!row) return;
    const patch: Partial<DraftRow> = { type: next };
    if (
      (next === "single_select" || next === "multi_select") &&
      !row.choices.some((c) => c.label.trim())
    ) {
      patch.choices = [{ label: "", price: "" }];
    }
    if (next !== "multi_select") {
      patch.minSelect = "";
      patch.maxSelect = "";
    }
    updateRow(index, patch);
  }

  return (
    <div className="flex flex-col gap-6">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className={
            ri < rows.length - 1
              ? "flex flex-col gap-3 border-b border-border/40 pb-6"
              : "flex flex-col gap-3"
          }
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className={fieldLabelClass}>Type</span>
              {rows.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label="Remove question"
                  onClick={() =>
                    setRows((prev) => prev.filter((_, i) => i !== ri))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {typePillsForRow(row.type).map((o) => {
                const active = row.type === o.value;
                const isLegacyYesNo =
                  o.value === "yes_no" && row.type === "yes_no";
                const creatable = (
                  EDITOR_CUSTOMISATION_TYPES as readonly string[]
                ).includes(o.value);
                if (!creatable && !isLegacyYesNo) return null;
                return (
                  <button
                    key={o.value}
                    type="button"
                    disabled={disabled}
                    aria-pressed={active}
                    onClick={() => setType(ri, o.value)}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      "disabled:pointer-events-none disabled:opacity-50",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-card text-foreground hover:bg-muted/40",
                    )}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-11 items-center justify-between gap-3">
            <Label
              htmlFor={`cust-required-${ri}`}
              className={fieldLabelClass}
            >
              Answer required?
            </Label>
            <Switch
              id={`cust-required-${ri}`}
              checked={row.required}
              disabled={disabled}
              onCheckedChange={(checked) =>
                updateRow(ri, { required: checked })
              }
              aria-label="Answer required"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`cust-label-${ri}`} className={fieldLabelClass}>
              Question
            </Label>
            <Input
              id={`cust-label-${ri}`}
              value={row.label}
              disabled={disabled}
              placeholder="Message on cake"
              onChange={(e) => updateRow(ri, { label: e.target.value })}
            />
          </div>

          {row.type === "yes_no" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor={`cust-fee-${ri}`} className={fieldLabelClass}>
                Add-on fee
              </Label>
              <p className="text-sm leading-snug text-muted-foreground">
                Extra charge when they choose Yes. Leave blank if free.
              </p>
              <div className="relative max-w-[10rem]">
                <span
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
                  aria-hidden
                >
                  $
                </span>
                <Input
                  id={`cust-fee-${ri}`}
                  inputMode="decimal"
                  value={row.price}
                  disabled={disabled}
                  placeholder="0"
                  className="pl-8"
                  onChange={(e) => updateRow(ri, { price: e.target.value })}
                />
              </div>
            </div>
          ) : null}

          {row.type === "multi_select" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`cust-min-${ri}`}
                  className={fieldLabelClass}
                >
                  Minimum
                </Label>
                <Input
                  id={`cust-min-${ri}`}
                  inputMode="numeric"
                  value={row.minSelect}
                  disabled={disabled}
                  placeholder={row.required ? "1" : "0"}
                  onChange={(e) =>
                    updateRow(ri, {
                      minSelect: e.target.value.replace(/[^\d]/g, ""),
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`cust-max-${ri}`}
                  className={fieldLabelClass}
                >
                  Maximum
                </Label>
                <Input
                  id={`cust-max-${ri}`}
                  inputMode="numeric"
                  value={row.maxSelect}
                  disabled={disabled}
                  placeholder="All"
                  onChange={(e) =>
                    updateRow(ri, {
                      maxSelect: e.target.value.replace(/[^\d]/g, ""),
                    })
                  }
                />
              </div>
            </div>
          ) : null}

          {row.type === "single_select" || row.type === "multi_select" ? (
            <div className="flex flex-col gap-2">
              <Label className={fieldLabelClass}>Options</Label>
              <p className="text-sm leading-snug text-muted-foreground">
                Add-on fee is extra on top of the product price. Leave blank
                if free.
              </p>
              <div className="flex items-center gap-2 px-0.5">
                <span className="min-w-0 flex-1 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground/80 uppercase">
                  Name
                </span>
                <span className="w-24 shrink-0 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground/80 uppercase">
                  Add-on
                </span>
                {row.choices.length > 1 ? (
                  <span className="size-10 shrink-0" aria-hidden />
                ) : null}
              </div>
              {row.choices.map((ch, ci) => (
                <div key={ci} className="flex gap-2">
                  <Input
                    value={ch.label}
                    disabled={disabled}
                    placeholder="Option name"
                    onChange={(e) => {
                      const choices = row.choices.map((c, i) =>
                        i === ci ? { ...c, label: e.target.value } : c,
                      );
                      updateRow(ri, { choices });
                    }}
                    className="flex-1"
                  />
                  <div className="relative w-24 shrink-0">
                    <span
                      className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground"
                      aria-hidden
                    >
                      $
                    </span>
                    <Input
                      inputMode="decimal"
                      value={ch.price}
                      disabled={disabled}
                      placeholder="0"
                      className="pl-7"
                      aria-label={`Add-on fee for option ${ci + 1}`}
                      onChange={(e) => {
                        const choices = row.choices.map((c, i) =>
                          i === ci ? { ...c, price: e.target.value } : c,
                        );
                        updateRow(ri, { choices });
                      }}
                    />
                  </div>
                  {row.choices.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={disabled}
                      aria-label="Remove option"
                      onClick={() => {
                        updateRow(ri, {
                          choices: row.choices.filter((_, i) => i !== ci),
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              {row.choices.length < MAX_CUSTOMISATION_CHOICES ? (
                <button
                  type="button"
                  disabled={disabled}
                  aria-label="Add option"
                  onClick={() =>
                    updateRow(ri, {
                      choices: [...row.choices, { label: "", price: "" }],
                    })
                  }
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center self-start rounded-full border border-border/60 bg-card text-foreground transition-colors",
                    "hover:border-foreground/25 hover:bg-muted/40",
                    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    "disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <Plus className="size-5" strokeWidth={2.25} aria-hidden />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}

      {rows.length < MAX_CUSTOMISATIONS ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="self-start rounded-full border-primary/70 bg-card hover:border-primary hover:bg-primary/12"
          onClick={() => setRows((prev) => [...prev, emptyRow()])}
        >
          <Plus className="size-3.5" strokeWidth={2.25} />
          Add another question
        </Button>
      ) : null}
    </div>
  );
}
