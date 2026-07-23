"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  newDeliveryMethodId,
  resolveDeliveryMethods,
} from "@/lib/fulfilment/delivery-methods";
import {
  defaultFulfilmentHoursDays,
  formatBlackoutRangeLabel,
  FULFILMENT_TIME_OPTIONS,
  formatHourLabel,
  isValidYmd,
} from "@/lib/fulfilment/dates";
import type {
  BlackoutRange,
  DeliveryMethodConfig,
  FulfilmentHoursConfig,
  FulfilmentHoursDay,
  FulfillmentConfig,
  Store,
} from "@/lib/stores/types";
import { MAX_DELIVERY_METHODS } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS: { weekday: number; label: string }[] = [
  { weekday: 1, label: "Mon" },
  { weekday: 2, label: "Tue" },
  { weekday: 3, label: "Wed" },
  { weekday: 4, label: "Thu" },
  { weekday: 5, label: "Fri" },
  { weekday: 6, label: "Sat" },
  { weekday: 0, label: "Sun" },
];

function hoursFromStore(
  hours: FulfilmentHoursConfig | undefined,
): FulfilmentHoursConfig {
  if (hours?.days?.length) {
    return {
      enabled: Boolean(hours.enabled),
      days: WEEKDAY_LABELS.map(({ weekday }) => {
        const found = hours.days.find((d) => d.weekday === weekday);
        return (
          found ?? {
            weekday,
            enabled: false,
            ranges: [{ start: "09:00", end: "17:00" }],
          }
        );
      }),
    };
  }
  return { enabled: false, days: defaultFulfilmentHoursDays() };
}

function blackoutRangesFromStore(
  calendar: FulfillmentConfig["calendar"],
): BlackoutRange[] {
  const ranges = [...(calendar?.blackout_ranges ?? [])].filter(
    (r) => isValidYmd(r.start) && isValidYmd(r.end) && r.start <= r.end,
  );
  const singles = (calendar?.blackouts ?? [])
    .filter(isValidYmd)
    .filter(
      (ymd) =>
        !ranges.some((r) => ymd >= r.start && ymd <= r.end),
    )
    .map((ymd) => ({ start: ymd, end: ymd }));
  return [...ranges, ...singles].sort((a, b) =>
    a.start === b.start
      ? a.end.localeCompare(b.end)
      : a.start.localeCompare(b.start),
  );
}

function defaultDeliveryMethod(): DeliveryMethodConfig {
  return {
    id: newDeliveryMethodId(),
    name: "Delivery",
    fee_cents: 0,
    notes_enabled: false,
    instructions: "",
  };
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
  submitLabel = "Save fulfilment",
  onSave,
  onSuccess,
}: FulfillmentFormProps) {
  const router = useRouter();
  const f = store.fulfillment;

  const [pickupEnabled, setPickupEnabled] = useState(f.pickup?.enabled ?? false);
  const [pickupLocation, setPickupLocation] = useState(
    f.pickup?.location ?? "",
  );
  const [pickupNotesOn, setPickupNotesOn] = useState(
    () =>
      f.pickup?.notes_enabled ?? Boolean(f.pickup?.instructions?.trim()),
  );
  const [pickupNotes, setPickupNotes] = useState(
    f.pickup?.instructions ?? "",
  );

  const [deliveryEnabled, setDeliveryEnabled] = useState(
    () => resolveDeliveryMethods(f).length > 0,
  );
  const [deliveryMethods, setDeliveryMethods] = useState<
    DeliveryMethodConfig[]
  >(() => {
    const resolved = resolveDeliveryMethods(f);
    return resolved.length > 0 ? resolved : [];
  });
  const [deliveryFees, setDeliveryFees] = useState<Record<string, string>>(
    () => {
      const map: Record<string, string> = {};
      for (const m of resolveDeliveryMethods(f)) {
        map[m.id] = (m.fee_cents / 100).toFixed(2);
      }
      return map;
    },
  );
  const [freeDeliveryOn, setFreeDeliveryOn] = useState(
    () =>
      typeof f.delivery_free_above_cents === "number" &&
      f.delivery_free_above_cents > 0,
  );
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(() =>
    typeof f.delivery_free_above_cents === "number" &&
    f.delivery_free_above_cents > 0
      ? (f.delivery_free_above_cents / 100).toFixed(2)
      : "",
  );

  const [calendarEnabled, setCalendarEnabled] = useState(
    f.calendar?.enabled ?? false,
  );
  const [blackoutRanges, setBlackoutRanges] = useState<BlackoutRange[]>(() =>
    blackoutRangesFromStore(f.calendar),
  );
  const [blackoutSingle, setBlackoutSingle] = useState("");
  const [blackoutFrom, setBlackoutFrom] = useState("");
  const [blackoutTo, setBlackoutTo] = useState("");

  const [pickupHours, setPickupHours] = useState(() =>
    hoursFromStore(f.pickup_hours),
  );
  const [deliveryHours, setDeliveryHours] = useState(() =>
    hoursFromStore(f.delivery_hours),
  );

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const valid = pickupEnabled || (deliveryEnabled && deliveryMethods.length > 0);

  function addBlackoutSingle() {
    const ymd = blackoutSingle.trim();
    if (!isValidYmd(ymd)) {
      setError("Blackout must be YYYY-MM-DD");
      return;
    }
    setError(null);
    setBlackoutRanges((prev) => {
      if (prev.some((r) => ymd >= r.start && ymd <= r.end)) return prev;
      return [...prev, { start: ymd, end: ymd }].sort((a, b) =>
        a.start.localeCompare(b.start),
      );
    });
    setBlackoutSingle("");
  }

  function addBlackoutRange() {
    const start = blackoutFrom.trim();
    const end = blackoutTo.trim();
    if (!isValidYmd(start) || !isValidYmd(end)) {
      setError("Range needs valid From and To dates");
      return;
    }
    if (start > end) {
      setError("From date must be on or before To date");
      return;
    }
    setError(null);
    setBlackoutRanges((prev) => {
      if (prev.some((r) => r.start === start && r.end === end)) return prev;
      return [...prev, { start, end }].sort((a, b) =>
        a.start === b.start
          ? a.end.localeCompare(b.end)
          : a.start.localeCompare(b.start),
      );
    });
    setBlackoutFrom("");
    setBlackoutTo("");
  }

  function hoursHaveOpenDay(hours: FulfilmentHoursConfig): boolean {
    return hours.days.some(
      (d) =>
        d.enabled &&
        d.ranges.some((r) => r.start < r.end && r.start && r.end),
    );
  }

  function handleSave() {
    setError(null);

    if (!pickupEnabled && !(deliveryEnabled && deliveryMethods.length > 0)) {
      setError("Enable pickup or delivery");
      return;
    }

    if (deliveryEnabled) {
      for (const m of deliveryMethods) {
        if (!m.name.trim()) {
          setError("Each delivery method needs a name");
          return;
        }
        const feeValue = Number.parseFloat(deliveryFees[m.id] ?? "");
        if (!Number.isFinite(feeValue) || feeValue < 0) {
          setError(`Enter a valid fee for “${m.name.trim()}”, e.g. 5.00`);
          return;
        }
      }
      if (freeDeliveryOn) {
        const minValue = Number.parseFloat(freeDeliveryAbove);
        if (!Number.isFinite(minValue) || minValue <= 0) {
          setError("Enter a free-delivery minimum above $0, e.g. 50.00");
          return;
        }
      }
    }

    const wantPickupHours =
      calendarEnabled && pickupEnabled && pickupHours.enabled;
    const wantDeliveryHours =
      calendarEnabled &&
      deliveryEnabled &&
      deliveryMethods.length > 0 &&
      deliveryHours.enabled;

    if (wantPickupHours && !hoursHaveOpenDay(pickupHours)) {
      setError(
        "Pickup time slots need at least one day with a valid start–end range",
      );
      return;
    }
    if (wantDeliveryHours && !hoursHaveOpenDay(deliveryHours)) {
      setError(
        "Delivery time slots need at least one day with a valid start–end range",
      );
      return;
    }

    for (const [label, hours, on] of [
      ["Pickup", pickupHours, wantPickupHours],
      ["Delivery", deliveryHours, wantDeliveryHours],
    ] as const) {
      if (!on) continue;
      for (const day of hours.days) {
        if (!day.enabled) continue;
        for (const r of day.ranges) {
          if (!(r.start < r.end)) {
            setError(
              `${label} hours: end time must be after start on each open day`,
            );
            return;
          }
        }
      }
    }

    const methodsPayload =
      deliveryEnabled && deliveryMethods.length > 0
        ? deliveryMethods.map((m) => ({
            id: m.id,
            name: m.name.trim(),
            fee_cents: Math.round(
              Number.parseFloat(deliveryFees[m.id] ?? "0") * 100,
            ),
            notes_enabled: Boolean(m.notes_enabled),
            instructions: m.notes_enabled ? (m.instructions ?? "") : "",
          }))
        : [];

    startTransition(async () => {
      const result = await onSave({
        pickup: pickupEnabled
          ? {
              enabled: true,
              location: pickupLocation.trim() || undefined,
              notes_enabled: pickupNotesOn,
              instructions: pickupNotesOn ? pickupNotes : "",
            }
          : undefined,
        delivery:
          methodsPayload.length > 0
            ? {
                enabled: true,
                fee_cents: methodsPayload[0]!.fee_cents,
                notes_enabled: methodsPayload[0]!.notes_enabled,
                instructions: methodsPayload[0]!.instructions ?? "",
              }
            : undefined,
        delivery_methods: methodsPayload,
        delivery_free_above_cents:
          methodsPayload.length > 0 && freeDeliveryOn
            ? Math.round(Number.parseFloat(freeDeliveryAbove) * 100)
            : null,
        calendar: calendarEnabled
          ? {
              enabled: true,
              allowed_weekdays: [0, 1, 2, 3, 4, 5, 6],
              blackout_ranges: blackoutRanges.length
                ? blackoutRanges
                : undefined,
              blackouts: undefined,
            }
          : { enabled: false, allowed_weekdays: [] },
        pickup_hours: wantPickupHours
          ? { enabled: true, days: pickupHours.days }
          : { enabled: false, days: [] },
        delivery_hours: wantDeliveryHours
          ? { enabled: true, days: deliveryHours.days }
          : { enabled: false, days: [] },
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

  return (
    <div className="flex flex-col gap-4">
      {/* Dates Yes/No */}
      <section className="rounded-[24px] border border-primary/30 bg-primary/12 p-5 shadow-[0_4px_18px_rgba(22,19,14,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <p className="min-w-0 text-base font-bold tracking-tight">
            Allow customer to pick a date or time slot for their order.
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                !calendarEnabled ? "text-foreground" : "text-muted-foreground",
              )}
            >
              No
            </span>
            <Switch
              checked={calendarEnabled}
              onCheckedChange={(v) => {
                setCalendarEnabled(v);
                if (!v) {
                  setPickupHours((h) => ({ ...h, enabled: false }));
                  setDeliveryHours((h) => ({ ...h, enabled: false }));
                }
              }}
              aria-label="Allow customer to pick a date or time slot for their order"
            />
            <span
              className={cn(
                "text-sm font-medium",
                calendarEnabled ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Yes
            </span>
          </div>
        </div>
      </section>

      {/* Blackouts — own card */}
      <section
        className={cn(
          "rounded-[24px] border border-primary/30 bg-primary/12 p-5 shadow-[0_4px_18px_rgba(22,19,14,0.05)]",
          !calendarEnabled && "opacity-60",
        )}
      >
        <p className="text-base font-bold tracking-tight">Blackout dates</p>
        {!calendarEnabled ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Turn on date picking above to set blackouts.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Single date</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={blackoutSingle}
                  onChange={(e) => setBlackoutSingle(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBlackoutSingle}
                  disabled={!blackoutSingle}
                >
                  <Plus className="size-4" aria-hidden />
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Date range</Label>
              <div className="flex flex-wrap gap-2">
                <Input
                  type="date"
                  value={blackoutFrom}
                  onChange={(e) => setBlackoutFrom(e.target.value)}
                  className="min-w-[9rem] flex-1"
                  aria-label="Blackout from"
                />
                <span className="self-center text-sm text-muted-foreground">
                  to
                </span>
                <Input
                  type="date"
                  value={blackoutTo}
                  onChange={(e) => setBlackoutTo(e.target.value)}
                  className="min-w-[9rem] flex-1"
                  aria-label="Blackout to"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBlackoutRange}
                  disabled={!blackoutFrom || !blackoutTo}
                >
                  <Plus className="size-4" aria-hidden />
                  Add range
                </Button>
              </div>
            </div>
            {blackoutRanges.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {blackoutRanges.map((r) => (
                  <li
                    key={`${r.start}_${r.end}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2 text-sm"
                  >
                    <span className="font-medium tabular-nums">
                      {formatBlackoutRangeLabel(r)}
                    </span>
                    <button
                      type="button"
                      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Remove blackout ${formatBlackoutRangeLabel(r)}`}
                      onClick={() =>
                        setBlackoutRanges((prev) =>
                          prev.filter(
                            (x) => !(x.start === r.start && x.end === r.end),
                          ),
                        )
                      }
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </section>

      {/* Pickup — header toggle expands */}
      <MethodToggleCard
        title="Pickup"
        enabled={pickupEnabled}
        onEnabledChange={(v) => {
          setPickupEnabled(v);
          if (!v) setPickupHours((h) => ({ ...h, enabled: false }));
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pickup-location">Location</Label>
            <Input
              id="pickup-location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              maxLength={120}
              placeholder="e.g. Blk 123 #01-01"
            />
          </div>
          <ToggleRow
            label="Additional notes to customer"
            checked={pickupNotesOn}
            onCheckedChange={setPickupNotesOn}
          />
          {pickupNotesOn && (
            <Input
              value={pickupNotes}
              onChange={(e) => setPickupNotes(e.target.value)}
              maxLength={200}
              placeholder="e.g. Ring the doorbell"
              aria-label="Pickup notes"
            />
          )}
          {calendarEnabled ? (
            <HoursBlock
              title="Pickup time slots"
              hours={pickupHours}
              onChange={setPickupHours}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Turn on date picking to set pickup time slots.
            </p>
          )}
        </div>
      </MethodToggleCard>

      {/* Delivery — header toggle + up to 3 methods */}
      <MethodToggleCard
        title="Delivery"
        enabled={deliveryEnabled}
        onEnabledChange={(v) => {
          setDeliveryEnabled(v);
          if (v && deliveryMethods.length === 0) {
            const m = defaultDeliveryMethod();
            setDeliveryMethods([m]);
            setDeliveryFees({ [m.id]: "0.00" });
          }
          if (!v) {
            setDeliveryMethods([]);
            setDeliveryFees({});
            setDeliveryHours((h) => ({ ...h, enabled: false }));
            setFreeDeliveryOn(false);
          }
        }}
      >
        <div className="flex flex-col gap-4">
          {deliveryMethods.map((m, index) => (
            <div
              key={m.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">
                  Method {index + 1}
                </p>
                {deliveryMethods.length > 1 && (
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                    aria-label={`Remove ${m.name || `method ${index + 1}`}`}
                    onClick={() => {
                      setDeliveryMethods((prev) =>
                        prev.filter((x) => x.id !== m.id),
                      );
                      setDeliveryFees((prev) => {
                        const next = { ...prev };
                        delete next[m.id];
                        return next;
                      });
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`dm-name-${m.id}`}>Name</Label>
                <Input
                  id={`dm-name-${m.id}`}
                  value={m.name}
                  onChange={(e) =>
                    setDeliveryMethods((prev) =>
                      prev.map((x) =>
                        x.id === m.id ? { ...x, name: e.target.value } : x,
                      ),
                    )
                  }
                  maxLength={60}
                  placeholder="e.g. Standard"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`dm-fee-${m.id}`}>Fee ($)</Label>
                <Input
                  id={`dm-fee-${m.id}`}
                  inputMode="decimal"
                  value={deliveryFees[m.id] ?? ""}
                  onChange={(e) =>
                    setDeliveryFees((prev) => ({
                      ...prev,
                      [m.id]: e.target.value,
                    }))
                  }
                  placeholder="5.00"
                />
              </div>
              <ToggleRow
                label="Additional notes to customer"
                checked={Boolean(m.notes_enabled)}
                onCheckedChange={(v) =>
                  setDeliveryMethods((prev) =>
                    prev.map((x) =>
                      x.id === m.id ? { ...x, notes_enabled: v } : x,
                    ),
                  )
                }
              />
              {m.notes_enabled && (
                <Input
                  value={m.instructions ?? ""}
                  onChange={(e) =>
                    setDeliveryMethods((prev) =>
                      prev.map((x) =>
                        x.id === m.id
                          ? { ...x, instructions: e.target.value }
                          : x,
                      ),
                    )
                  }
                  maxLength={200}
                  placeholder="e.g. Leave at door"
                  aria-label={`${m.name || "Delivery"} notes`}
                />
              )}
            </div>
          ))}

          {deliveryMethods.length < MAX_DELIVERY_METHODS && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                const m = defaultDeliveryMethod();
                setDeliveryMethods((prev) => [...prev, m]);
                setDeliveryFees((prev) => ({
                  ...prev,
                  [m.id]: "0.00",
                }));
              }}
            >
              <Plus className="size-4" aria-hidden />
              Add delivery method
            </Button>
          )}

          <div className="rounded-2xl border border-border/60 p-4">
            <ToggleRow
              label="Free delivery above a minimum"
              checked={freeDeliveryOn}
              onCheckedChange={setFreeDeliveryOn}
            />
            {freeDeliveryOn && (
              <div className="mt-3 flex flex-col gap-2">
                <Label htmlFor="free-delivery-above">
                  Free when cart reaches this amount ($)
                </Label>
                <Input
                  id="free-delivery-above"
                  inputMode="decimal"
                  value={freeDeliveryAbove}
                  onChange={(e) => setFreeDeliveryAbove(e.target.value)}
                  placeholder="50.00"
                />
              </div>
            )}
          </div>

          {calendarEnabled ? (
            <HoursBlock
              title="Delivery time slots"
              hours={deliveryHours}
              onChange={setDeliveryHours}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Turn on date picking to set delivery time slots.
            </p>
          )}
        </div>
      </MethodToggleCard>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="shrink-0 pb-24 lg:pb-24" aria-hidden />

      <div
        className={cn(
          "pointer-events-none fixed z-30 px-4 sm:px-6 lg:px-10",
          "inset-x-0 bottom-[calc(6.5rem+0.75rem+env(safe-area-inset-bottom,0px))]",
          "lg:inset-x-auto lg:left-[17.5rem] lg:right-0 lg:bottom-6",
        )}
      >
        <div className="pointer-events-auto mx-auto w-full max-w-3xl lg:max-w-4xl">
          <Button
            type="button"
            onClick={handleSave}
            disabled={pending || !valid}
            className="h-14 w-full rounded-2xl text-base font-bold shadow-[0_8px_24px_rgb(0_0_0/0.18)]"
            aria-live="polite"
          >
            {pending ? "Saving…" : saved ? "Saved" : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MethodToggleCard({
  title,
  enabled,
  onEnabledChange,
  children,
}: {
  title: string;
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-primary/30 bg-primary/12 shadow-[0_4px_18px_rgba(22,19,14,0.05)]">
      <div className="flex min-h-16 items-center justify-between gap-3 px-5 py-3.5">
        <p className="text-base font-bold tracking-tight">{title}</p>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          aria-label={`Offer ${title.toLowerCase()}`}
        />
      </div>
      {enabled && (
        <div className="border-t border-primary/25 bg-card/80 px-5 py-5">
          {children}
        </div>
      )}
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium">{label}</span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
    </div>
  );
}

function HoursBlock({
  title,
  hours,
  onChange,
}: {
  title: string;
  hours: FulfilmentHoursConfig;
  onChange: (next: FulfilmentHoursConfig) => void;
}) {
  function patchDay(weekday: number, patch: Partial<FulfilmentHoursDay>) {
    onChange({
      ...hours,
      days: hours.days.map((d) =>
        d.weekday === weekday ? { ...d, ...patch } : d,
      ),
    });
  }

  function patchRange(
    weekday: number,
    index: number,
    patch: { start?: string; end?: string },
  ) {
    const day = hours.days.find((d) => d.weekday === weekday);
    if (!day) return;
    const ranges = day.ranges.map((r, i) =>
      i === index ? { ...r, ...patch } : r,
    );
    patchDay(weekday, { ranges, enabled: true });
  }

  return (
    <div className="rounded-2xl border border-border/60 p-4">
      <ToggleRow
        label={title}
        checked={hours.enabled}
        onCheckedChange={(v) => onChange({ ...hours, enabled: v })}
      />
      {hours.enabled && (
        <div className="mt-4 flex flex-col gap-3">
          {WEEKDAY_LABELS.map(({ weekday, label }) => {
            const day =
              hours.days.find((d) => d.weekday === weekday) ??
              ({
                weekday,
                enabled: false,
                ranges: [{ start: "09:00", end: "17:00" }],
              } satisfies FulfilmentHoursDay);
            return (
              <div key={weekday} className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <label className="mt-2 flex w-12 shrink-0 items-center gap-1.5 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(e) =>
                        patchDay(weekday, { enabled: e.target.checked })
                      }
                      className="size-4 rounded border-border"
                    />
                    {label}
                  </label>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    {day.ranges.map((range, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap items-center gap-1.5"
                      >
                        <select
                          value={range.start}
                          disabled={!day.enabled}
                          onChange={(e) =>
                            patchRange(weekday, i, { start: e.target.value })
                          }
                          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 text-sm disabled:opacity-50"
                          aria-label={`${label} start`}
                        >
                          {FULFILMENT_TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {formatHourLabel(t)}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-muted-foreground">to</span>
                        <select
                          value={range.end}
                          disabled={!day.enabled}
                          onChange={(e) =>
                            patchRange(weekday, i, { end: e.target.value })
                          }
                          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 text-sm disabled:opacity-50"
                          aria-label={`${label} end`}
                        >
                          {FULFILMENT_TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {formatHourLabel(t)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!day.enabled}
                          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
                          aria-label={`Add range for ${label}`}
                          onClick={() =>
                            patchDay(weekday, {
                              enabled: true,
                              ranges: [
                                ...day.ranges,
                                { start: "09:00", end: "17:00" },
                              ],
                            })
                          }
                        >
                          <Plus className="size-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          disabled={!day.enabled || day.ranges.length <= 1}
                          className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
                          aria-label={`Remove range for ${label}`}
                          onClick={() =>
                            patchDay(weekday, {
                              ranges: day.ranges.filter((_, j) => j !== i),
                            })
                          }
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
