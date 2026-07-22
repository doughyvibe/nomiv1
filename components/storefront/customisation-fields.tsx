"use client";

import { useState } from "react";

import { OptionRow } from "@/components/storefront/option-row";
import { formatPrice } from "@/lib/money";
import type {
  CustomisationAnswers,
  ProductCustomisation,
} from "@/lib/products/customisations";
import {
  customisationAnswersComplete,
  multiSelectHint,
  multiSelectMax,
  totalCustomisationFeesCents,
} from "@/lib/products/customisations";
import { cn } from "@/lib/utils";

type CustomisationFieldsProps = {
  customisations: ProductCustomisation[];
  answers: CustomisationAnswers;
  onChange: (next: CustomisationAnswers) => void;
  className?: string;
};

/** Shared customisation fields for PDP. */
export function CustomisationFields({
  customisations,
  answers,
  onChange,
  className,
}: CustomisationFieldsProps) {
  if (customisations.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {customisations.map((def) => (
        <CustomisationField
          key={def.id}
          def={def}
          value={answers[def.id]}
          onChange={(value) => {
            const next = { ...answers };
            if (value === undefined) {
              delete next[def.id];
            } else {
              next[def.id] = value;
            }
            onChange(next);
          }}
        />
      ))}
    </div>
  );
}

function CustomisationField({
  def,
  value,
  onChange,
}: {
  def: ProductCustomisation;
  value: string | string[] | boolean | undefined;
  onChange: (value: string | string[] | boolean | undefined) => void;
}) {
  const hint =
    def.type === "multi_select" ? multiSelectHint(def) : null;
  const label = (
    <legend className="text-xs font-medium tracking-wider text-vibe-text-muted uppercase">
      {def.label}
      {def.required ? (
        <span className="text-vibe-primary"> *</span>
      ) : (
        <span className="font-normal normal-case tracking-normal">
          {" "}
          (optional)
        </span>
      )}
    </legend>
  );

  if (def.type === "text") {
    return (
      <fieldset className="flex flex-col gap-2">
        {label}
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          maxLength={120}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v.trim() ? v : undefined);
          }}
          placeholder="Type here"
          className="min-h-11 w-full rounded-xl border border-vibe-border/50 bg-vibe-surface px-3.5 text-sm text-vibe-text outline-none placeholder:text-vibe-text-muted focus-visible:border-vibe-primary"
        />
      </fieldset>
    );
  }

  if (def.type === "yes_no") {
    const fee =
      def.price_cents != null && def.price_cents > 0
        ? `+${formatPrice(def.price_cents)}`
        : undefined;
    const selected = typeof value === "boolean" ? value : null;
    return (
      <fieldset className="flex flex-col gap-2">
        {label}
        <div className="flex flex-col gap-2">
          <OptionRow
            active={selected === true}
            onClick={() => onChange(true)}
            label="Yes"
            meta={fee}
          />
          <OptionRow
            active={selected === false}
            onClick={() => onChange(false)}
            label="No"
          />
        </div>
      </fieldset>
    );
  }

  if (def.type === "single_select") {
    const selected = typeof value === "string" ? value : "";
    return (
      <fieldset className="flex flex-col gap-2">
        {label}
        <div className="flex flex-col gap-2">
          {def.choices.map((choice) => {
            const active =
              selected.toLowerCase() === choice.label.toLowerCase();
            const fee =
              choice.price_cents != null && choice.price_cents > 0
                ? `+${formatPrice(choice.price_cents)}`
                : undefined;
            return (
              <OptionRow
                key={choice.label}
                active={active}
                onClick={() => onChange(choice.label)}
                label={choice.label}
                meta={fee}
              />
            );
          })}
        </div>
      </fieldset>
    );
  }

  // multi_select
  const selected = Array.isArray(value) ? value : [];
  const max = multiSelectMax(def);
  return (
    <fieldset className="flex flex-col gap-2">
      {label}
      {hint ? (
        <p className="text-xs text-vibe-text-muted">{hint}</p>
      ) : null}
      <div className="flex flex-col gap-2">
        {def.choices.map((choice) => {
          const active = selected.some(
            (s) => s.toLowerCase() === choice.label.toLowerCase(),
          );
          const fee =
            choice.price_cents != null && choice.price_cents > 0
              ? `+${formatPrice(choice.price_cents)}`
              : undefined;
          const atMax = !active && selected.length >= max;
          return (
            <OptionRow
              key={choice.label}
              active={active}
              onClick={() => {
                if (active) {
                  const next = selected.filter(
                    (s) => s.toLowerCase() !== choice.label.toLowerCase(),
                  );
                  onChange(next.length ? next : undefined);
                } else if (!atMax) {
                  onChange([...selected, choice.label]);
                }
              }}
              label={choice.label}
              meta={fee}
              disabled={atMax}
            />
          );
        })}
      </div>
    </fieldset>
  );
}

export function useCustomisationAnswers(product: {
  customisations?: ProductCustomisation[] | null;
}) {
  const defs = product.customisations ?? [];
  const [answers, setAnswers] = useState<CustomisationAnswers>({});

  const complete =
    defs.length === 0 || customisationAnswersComplete(defs, answers);
  const feeCents = totalCustomisationFeesCents(defs, answers);

  return {
    defs,
    answers,
    setAnswers,
    complete,
    feeCents,
    hasCustomisations: defs.length > 0,
  };
}
