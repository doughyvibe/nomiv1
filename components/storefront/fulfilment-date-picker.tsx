"use client";

import { useEffect, useMemo, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStorefront } from "@/components/storefront/storefront-context";
import { fulfilmentDateCardParts } from "@/lib/fulfilment/dates";
import { cn } from "@/lib/utils";

const PREVIEW = 4;

/** Local calendar date — DayPicker works in local time (not UTC). */
function ymdToLocalDate(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function localDateToYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function FulfilmentDatePicker({
  dates,
  value,
  onChange,
  name,
  className,
}: {
  dates: string[];
  value: string;
  onChange: (ymd: string) => void;
  name?: string;
  className?: string;
}) {
  const { store } = useStorefront();
  const vibe = store.vibe ?? "atelier";
  const [open, setOpen] = useState(false);
  const preview = dates.slice(0, PREVIEW);
  const hasMore = dates.length > PREVIEW;
  const selectedOutside = Boolean(value && !preview.includes(value));
  const allowed = useMemo(() => new Set(dates), [dates]);

  const selectedDate = value ? ymdToLocalDate(value) : undefined;
  const startMonth = dates[0] ? startOfLocalMonth(ymdToLocalDate(dates[0])) : undefined;
  const endMonth = dates.length
    ? startOfLocalMonth(ymdToLocalDate(dates[dates.length - 1]!))
    : undefined;
  const seedMonth =
    selectedDate ?? (dates[0] ? ymdToLocalDate(dates[0]) : new Date());

  const [month, setMonth] = useState(seedMonth);
  const seedKey = seedMonth.getTime();

  useEffect(() => {
    if (!open) return;
    setMonth(new Date(seedKey));
  }, [open, seedKey]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <div className="grid grid-cols-4 gap-2">
        {preview.map((ymd) => {
          const parts = fulfilmentDateCardParts(ymd);
          const selected = ymd === value;
          return (
            <button
              key={ymd}
              type="button"
              onClick={() => onChange(ymd)}
              aria-pressed={selected}
              className={cn(
                "flex min-h-[4.25rem] flex-col items-center justify-center gap-0.5 rounded-[var(--vibe-radius)] px-1 py-2 transition-colors",
                selected ? "storefront-date-chip-active" : "storefront-date-chip",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wide uppercase",
                  selected ? "text-vibe-text" : "text-vibe-text-muted",
                )}
              >
                {parts.weekday}
              </span>
              <span className="font-display text-xl font-bold tabular-nums leading-none text-vibe-text">
                {parts.day}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wide uppercase",
                  selected ? "text-vibe-text" : "text-vibe-text-muted",
                )}
              >
                {parts.month}
              </span>
            </button>
          );
        })}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "text-center text-sm font-semibold underline-offset-2 hover:underline",
            selectedOutside ? "text-vibe-primary" : "text-vibe-text-muted",
          )}
        >
          {selectedOutside
            ? (() => {
                const p = fulfilmentDateCardParts(value);
                return `${p.weekday} ${p.day} ${p.month} · More dates`;
              })()
            : "More dates"}
        </button>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          chrome="storefront"
          vibe={vibe}
          className="w-auto max-w-[calc(100vw-2rem)] sm:max-w-fit"
        >
          <DialogHeader>
            <DialogTitle className="text-vibe-text">Date</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            startMonth={startMonth}
            endMonth={endMonth}
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              const ymd = localDateToYmd(date);
              if (!allowed.has(ymd)) return;
              onChange(ymd);
              setOpen(false);
            }}
            disabled={(date) => !allowed.has(localDateToYmd(date))}
            className="rounded-[var(--vibe-radius)]"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function FulfilmentWindowChips({
  windows,
  value,
  onChange,
  name,
}: {
  windows: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  name?: string;
}) {
  if (windows.length <= 1) {
    const only = windows[0]?.id ?? "";
    return only && name ? (
      <input type="hidden" name={name} value={only} />
    ) : null;
  }

  return (
    <div className="flex flex-col gap-2">
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <div className="flex flex-wrap gap-2">
        {windows.map((w) => {
          const selected = w.id === value;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onChange(w.id)}
              aria-pressed={selected}
              className={cn(
                "min-h-11 rounded-full px-3.5 text-sm font-semibold transition-colors",
                selected ? "storefront-window-chip-active" : "storefront-window-chip",
              )}
            >
              {w.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
