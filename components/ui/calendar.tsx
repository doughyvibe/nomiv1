"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type ClassNames,
  type DayPickerProps,
} from "react-day-picker";

import { cn } from "@/lib/utils";

function mergeClassNames(
  base: Partial<ClassNames>,
  override?: Partial<ClassNames>,
): Partial<ClassNames> {
  if (!override) return base;
  const out: Partial<ClassNames> = { ...base };
  for (const key of Object.keys(override) as (keyof ClassNames)[]) {
    out[key] = cn(base[key], override[key]) as ClassNames[typeof key];
  }
  return out;
}

const navBtn =
  "pointer-events-auto z-10 inline-flex size-9 items-center justify-center rounded-[var(--vibe-radius,0.5rem)] text-vibe-text opacity-80 hover:bg-vibe-border/25 hover:opacity-100 aria-disabled:pointer-events-none aria-disabled:opacity-30";

/**
 * Storefront Calendar — vibe tokens only (no RDP default CSS, no platform primary/muted).
 * Only used by fulfilment date picker today.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit p-2 text-vibe-text", className)}
      classNames={mergeClassNames(
        {
          root: cn("w-fit", defaults.root),
          months: cn("relative flex flex-col", defaults.months),
          month: cn("flex w-full flex-col gap-3", defaults.month),
          month_caption: cn(
            "relative flex h-10 w-full items-center justify-center px-10 text-sm font-semibold text-vibe-text",
            defaults.month_caption,
          ),
          caption_label: cn(
            "text-sm font-semibold text-vibe-text",
            defaults.caption_label,
          ),
          nav: cn(
            "pointer-events-none absolute inset-x-0 top-0 z-10 flex w-full items-center justify-between px-0.5",
            defaults.nav,
          ),
          button_previous: cn(navBtn, defaults.button_previous),
          button_next: cn(navBtn, defaults.button_next),
          month_grid: cn("w-full border-collapse", defaults.month_grid),
          weekdays: cn("flex w-full", defaults.weekdays),
          weekday: cn(
            "flex-1 basis-0 select-none text-center text-[0.7rem] font-medium text-vibe-text-muted",
            defaults.weekday,
          ),
          week: cn("mt-1 flex w-full", defaults.week),
          day: cn(
            "relative flex aspect-square flex-1 basis-0 items-center justify-center p-0 text-sm",
            defaults.day,
          ),
          day_button: cn(
            "size-9 rounded-[var(--vibe-radius,0.5rem)] font-normal text-vibe-text outline-none hover:bg-vibe-border/25 focus-visible:ring-2 focus-visible:ring-vibe-text/25",
            defaults.day_button,
          ),
          selected: cn(
            "[&>button]:bg-vibe-primary [&>button]:font-semibold [&>button]:text-vibe-primary-fg [&>button]:hover:bg-vibe-primary",
            defaults.selected,
          ),
          today: cn(
            "[&>button]:font-semibold [&>button]:ring-1 [&>button]:ring-vibe-border",
            defaults.today,
          ),
          outside: cn(
            "[&>button]:text-vibe-text-muted [&>button]:opacity-40",
            defaults.outside,
          ),
          disabled: cn(
            "[&>button]:pointer-events-none [&>button]:text-vibe-text-muted [&>button]:opacity-30",
            defaults.disabled,
          ),
          hidden: cn("invisible", defaults.hidden),
          chevron: cn("size-4", defaults.chevron),
        },
        classNames,
      )}
      components={{
        Chevron: ({ orientation, className: chevronClass }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return (
            <Icon className={cn("size-4 text-vibe-text", chevronClass)} aria-hidden />
          );
        },
      }}
      {...props}
    />
  );
}
