"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_ALLOWED_WEEKDAYS,
  formatFulfilmentDateLabel,
  previewAllowedFulfilmentDates,
} from "@/lib/fulfilment/dates";
import type {
  FulfilmentWindow,
  FulfillmentConfig,
  Store,
} from "@/lib/stores/types";
import { cn } from "@/lib/utils";

const WEEKDAY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

function newWindowId(): string {
  return `w_${Math.random().toString(36).slice(2, 10)}`;
}

type FulfillmentFormProps = {
  store: Store;
  submitLabel?: string;
  onSave: (
    config: FulfillmentConfig,
  ) => Promise<{ error: string } | { success: true }>;
  onSuccess?: () => void;
};

export function FulfillmentForm({
  store,
  submitLabel = "Save fulfillment",
  onSave,
  onSuccess,
}: FulfillmentFormProps) {
  const router = useRouter();
  const f = store.fulfillment;
  const [pickupEnabled, setPickupEnabled] = useState(f.pickup?.enabled ?? false);
  const [pickupInstructions, setPickupInstructions] = useState(
    f.pickup?.instructions ?? "",
  );
  const [pickupLocation, setPickupLocation] = useState(
    f.pickup?.location ?? "",
  );
  const [deliveryEnabled, setDeliveryEnabled] = useState(
    f.delivery?.enabled ?? false,
  );
  const [deliveryFee, setDeliveryFee] = useState(
    f.delivery ? (f.delivery.fee_cents / 100).toFixed(2) : "",
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    f.delivery?.instructions ?? "",
  );
  const [calendarEnabled, setCalendarEnabled] = useState(
    f.calendar?.enabled ?? false,
  );
  const [allowedWeekdays, setAllowedWeekdays] = useState<number[]>(
    () =>
      f.calendar?.allowed_weekdays?.length
        ? [...f.calendar.allowed_weekdays]
        : [...DEFAULT_ALLOWED_WEEKDAYS],
  );
  const [blackoutsText, setBlackoutsText] = useState(() =>
    (f.calendar?.blackouts ?? []).join("\n"),
  );
  const [windowsEnabled, setWindowsEnabled] = useState(
    () => (f.calendar?.windows?.length ?? 0) > 0,
  );
  const [windows, setWindows] = useState<FulfilmentWindow[]>(() =>
    f.calendar?.windows?.length
      ? f.calendar.windows.map((w) => ({ ...w }))
      : [
          { id: "am", label: "Morning (AM)" },
          { id: "pm", label: "Afternoon (PM)" },
        ],
  );
  const [dailyCapacity, setDailyCapacity] = useState(
    f.calendar?.daily_capacity != null
      ? String(f.calendar.daily_capacity)
      : "",
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const blackouts = blackoutsText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const draftCalendar: FulfillmentConfig["calendar"] | undefined =
    calendarEnabled
      ? {
          enabled: true,
          allowed_weekdays: allowedWeekdays,
          blackouts: blackouts.length ? blackouts : undefined,
          windows: windowsEnabled
            ? windows.filter((w) => w.label.trim())
            : undefined,
          daily_capacity: dailyCapacity.trim()
            ? Number.parseInt(dailyCapacity, 10)
            : undefined,
        }
      : undefined;

  const previewDates = calendarEnabled
    ? previewAllowedFulfilmentDates({
        pickup: pickupEnabled
          ? { enabled: true, instructions: pickupInstructions }
          : undefined,
        delivery: deliveryEnabled
          ? { enabled: true, fee_cents: 0, instructions: deliveryInstructions }
          : undefined,
        calendar: draftCalendar,
      })
    : [];

  function toggleWeekday(day: number) {
    setAllowedWeekdays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b),
    );
  }

  function updateWindow(
    index: number,
    patch: Partial<FulfilmentWindow>,
  ) {
    setWindows((prev) =>
      prev.map((w, i) => (i === index ? { ...w, ...patch } : w)),
    );
  }

  function handleSave() {
    setError(null);

    const feeValue = Number.parseFloat(deliveryFee);
    if (deliveryEnabled && (!Number.isFinite(feeValue) || feeValue < 0)) {
      setError("Enter a valid delivery fee, e.g. 5.00");
      return;
    }
    if (calendarEnabled && allowedWeekdays.length === 0) {
      setError("Pick at least one day buyers can choose");
      return;
    }
    if (calendarEnabled && windowsEnabled) {
      const labelled = windows.filter((w) => w.label.trim());
      if (labelled.length === 0) {
        setError("Add at least one time window, or turn windows off");
        return;
      }
    }
    let dailyCap: number | undefined;
    if (calendarEnabled && dailyCapacity.trim()) {
      dailyCap = Number.parseInt(dailyCapacity, 10);
      if (!Number.isInteger(dailyCap) || dailyCap < 1) {
        setError("Daily capacity must be a whole number ≥ 1");
        return;
      }
    }

    startTransition(async () => {
      const result = await onSave({
        pickup: pickupEnabled
          ? {
              enabled: true,
              instructions: pickupInstructions,
              location: pickupLocation || undefined,
            }
          : undefined,
        delivery: deliveryEnabled
          ? {
              enabled: true,
              fee_cents: Math.round(feeValue * 100),
              instructions: deliveryInstructions,
            }
          : undefined,
        calendar: calendarEnabled
          ? {
              enabled: true,
              allowed_weekdays: allowedWeekdays,
              blackouts: blackouts.length ? blackouts : undefined,
              windows: windowsEnabled
                ? windows
                    .filter((w) => w.label.trim())
                    .map((w) => ({
                      id: w.id || newWindowId(),
                      label: w.label.trim(),
                      capacity:
                        typeof w.capacity === "number" && w.capacity > 0
                          ? w.capacity
                          : undefined,
                    }))
                : undefined,
              daily_capacity: dailyCap,
            }
          : undefined,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSuccess?.();
      router.refresh();
    });
  }

  const valid =
    (pickupEnabled && pickupInstructions.trim()) ||
    (deliveryEnabled && deliveryFee.trim() && deliveryInstructions.trim());

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              pickupEnabled
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-card",
            )}
            aria-hidden
          >
            {pickupEnabled && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={pickupEnabled}
            onChange={(e) => setPickupEnabled(e.target.checked)}
            className="sr-only"
          />
          <span className="font-medium">Self-pickup</span>
        </label>
        {pickupEnabled && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pickup-instructions">Pickup instructions</Label>
              <Input
                id="pickup-instructions"
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pickup-location">Pickup location (optional)</Label>
              <Input
                id="pickup-location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                maxLength={120}
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              deliveryEnabled
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-card",
            )}
            aria-hidden
          >
            {deliveryEnabled && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={deliveryEnabled}
            onChange={(e) => setDeliveryEnabled(e.target.checked)}
            className="sr-only"
          />
          <span className="font-medium">Local delivery</span>
        </label>
        {deliveryEnabled && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="delivery-fee">Delivery fee ($)</Label>
              <Input
                id="delivery-fee"
                inputMode="decimal"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="5.00"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="delivery-instructions">Delivery instructions</Label>
              <Input
                id="delivery-instructions"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                maxLength={200}
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              calendarEnabled
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-card",
            )}
            aria-hidden
          >
            {calendarEnabled && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={calendarEnabled}
            onChange={(e) => setCalendarEnabled(e.target.checked)}
            className="sr-only"
          />
          <span className="font-medium">Ask for a date</span>
        </label>
        {calendarEnabled && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Days</p>
              <div className="flex flex-wrap gap-2">
                {WEEKDAY_OPTIONS.map(({ value, label }) => {
                  const on = allowedWeekdays.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleWeekday(value)}
                      className={cn(
                        "min-h-10 rounded-md border px-3 text-sm font-medium transition-colors",
                        on
                          ? "border-foreground bg-foreground text-white"
                          : "border-border bg-card text-muted-foreground",
                      )}
                      aria-pressed={on}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="blackouts">Blackouts</Label>
              <textarea
                id="blackouts"
                value={blackoutsText}
                onChange={(e) => setBlackoutsText(e.target.value)}
                rows={3}
                placeholder={"2026-12-25\n2027-01-01"}
                className="min-h-[4.5rem] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="daily-capacity">Daily cap</Label>
              <Input
                id="daily-capacity"
                inputMode="numeric"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(e.target.value)}
                placeholder="Blank = unlimited"
              />
            </div>

            <div className="rounded-md border border-dashed p-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                    windowsEnabled
                      ? "border-foreground bg-foreground text-white"
                      : "border-border bg-card",
                  )}
                  aria-hidden
                >
                  {windowsEnabled && (
                    <svg className="size-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={windowsEnabled}
                  onChange={(e) => setWindowsEnabled(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">Time windows</span>
              </label>
              {windowsEnabled && (
                <div className="mt-3 flex flex-col gap-3">
                  {windows.map((w, i) => (
                    <div
                      key={w.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-end"
                    >
                      <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor={`window-label-${i}`}>Label</Label>
                        <Input
                          id={`window-label-${i}`}
                          value={w.label}
                          onChange={(e) =>
                            updateWindow(i, { label: e.target.value })
                          }
                          maxLength={40}
                          placeholder="Afternoon (1–5pm)"
                        />
                      </div>
                      <div className="flex w-full flex-col gap-1.5 sm:w-28">
                        <Label htmlFor={`window-cap-${i}`}>Cap</Label>
                        <Input
                          id={`window-cap-${i}`}
                          inputMode="numeric"
                          value={
                            w.capacity != null && w.capacity > 0
                              ? String(w.capacity)
                              : ""
                          }
                          onChange={(e) => {
                            const n = Number.parseInt(e.target.value, 10);
                            updateWindow(i, {
                              capacity:
                                e.target.value.trim() &&
                                Number.isInteger(n) &&
                                n > 0
                                  ? n
                                  : undefined,
                            });
                          }}
                          placeholder="∞"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="sm:mb-0"
                        disabled={windows.length <= 1}
                        onClick={() =>
                          setWindows((prev) => prev.filter((_, j) => j !== i))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setWindows((prev) => [
                        ...prev,
                        { id: newWindowId(), label: "" },
                      ])
                    }
                  >
                    Add window
                  </Button>
                </div>
              )}
            </div>

            {previewDates.length > 0 ? (
              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                <p className="font-medium">Next available dates</p>
                <ul className="mt-1 list-inside list-disc text-muted-foreground">
                  {previewDates.map((ymd) => (
                    <li key={ymd}>{formatFulfilmentDateLabel(ymd)}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-destructive" role="status">
                No dates available — check weekdays and blackouts.
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button type="button" onClick={handleSave} disabled={pending || !valid}>
        {pending ? "Saving…" : saved ? "Saved" : submitLabel}
      </Button>
    </div>
  );
}
