"use client";

import type { ReactNode } from "react";

import { Switch } from "@/components/ui/switch";

type FeatureToggleProps = {
  label: string;
  /** One quiet line under the title — clarifies the capability without adding chrome. */
  description?: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
};

/**
 * Capability section: bold title + switch.
 * Fields below use quiet micro-labels; spacing (not cards) groups the block.
 */
export function FeatureToggle({
  label,
  description,
  enabled,
  onEnabledChange,
  disabled,
  children,
}: FeatureToggleProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg leading-snug font-bold tracking-tight text-foreground">
            {label}
          </h3>
          {description ? (
            <p className="mt-1 max-w-[22rem] text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          disabled={disabled}
          aria-label={label}
          className="mt-1 shrink-0"
        />
      </div>
      {enabled ? (
        <div className="mt-5 flex flex-col gap-4">{children}</div>
      ) : null}
    </div>
  );
}
