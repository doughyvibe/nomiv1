import assert from "node:assert/strict";

import type { FulfillmentConfig } from "@/lib/stores/types";

import {
  addDaysYmd,
  allowedFulfilmentDates,
  availableWindowsForDate,
  formatHourRangeLabel,
  fulfilmentDateRequired,
  maxCartLeadDays,
  methodHoursEnabled,
  normalizeHoursConfig,
  previewAllowedFulfilmentDates,
  resolveWindows,
  sanitizeFulfillmentConfig,
  weekdayOfYmd,
  windowsFromHoursForDate,
  type CapacityUsage,
} from "./dates";

// Mon 2026-07-20
const MON = "2026-07-20";
assert.equal(weekdayOfYmd(MON), 1);
assert.equal(addDaysYmd(MON, 3), "2026-07-23"); // Thu
assert.equal(weekdayOfYmd("2026-07-23"), 4);

assert.equal(maxCartLeadDays([]), 0);
assert.equal(maxCartLeadDays([{ lead_time_days: 0 }, { lead_time_days: 3 }]), 3);
assert.equal(maxCartLeadDays([{ lead_time_days: null }]), 0);

const noCal: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "Door" },
};
assert.equal(fulfilmentDateRequired(noCal, 0), false);
assert.equal(fulfilmentDateRequired(noCal, 3), true);

const withCal: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "Door" },
  calendar: {
    enabled: true,
    allowed_weekdays: [1, 2, 3, 4, 5, 6], // Mon–Sat
    horizon_days: 14,
  },
};
assert.equal(fulfilmentDateRequired(withCal, 0), true);

// Mon + lead 3 → earliest Thu; Tue/Wed not in list; Thu selectable
const dates = allowedFulfilmentDates({
  cartLeadDays: [3],
  fulfillment: withCal,
  today: MON,
});
assert.ok(!dates.includes("2026-07-21")); // Tue
assert.ok(!dates.includes("2026-07-22")); // Wed
assert.ok(dates.includes("2026-07-23")); // Thu
assert.equal(dates[0], "2026-07-23");

// lead 0 + calendar → today if weekday allowed
const sameDay = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: withCal,
  today: MON,
});
assert.equal(sameDay[0], MON);

// calendar off, lead 0 → no dates
assert.deepEqual(
  allowedFulfilmentDates({ cartLeadDays: [0], fulfillment: noCal, today: MON }),
  [],
);

// calendar off, lead > 0 → all weekdays from earliest
const forced = allowedFulfilmentDates({
  cartLeadDays: [2],
  fulfillment: noCal,
  today: MON,
  horizonDays: 5,
});
assert.equal(forced[0], "2026-07-22"); // Wed
assert.ok(forced.includes("2026-07-26")); // Sun ok when calendar off

// date-only (no hours): all weekdays, even if allowed_weekdays empty/legacy
const emptyWd: FulfillmentConfig = {
  ...withCal,
  calendar: { enabled: true, allowed_weekdays: [], horizon_days: 14 },
};
const emptyWdDates = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: emptyWd,
  today: MON,
  horizonDays: 2,
});
assert.ok(emptyWdDates.includes(MON));
assert.ok(emptyWdDates.includes("2026-07-21")); // Tue — all weekdays when slots off

// --- Hours → windows for method+date ---
const withHours: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "" },
  calendar: { enabled: true, allowed_weekdays: [1], horizon_days: 14 },
  pickup_hours: {
    enabled: true,
    days: [
      {
        weekday: 1,
        enabled: true,
        ranges: [
          { start: "09:00", end: "12:00" },
          { start: "14:00", end: "17:00" },
        ],
      },
      ...[2, 3, 4, 5, 6, 0].map((weekday) => ({
        weekday,
        enabled: false,
        ranges: [{ start: "09:00", end: "17:00" }],
      })),
    ],
  },
};
const hourWins = availableWindowsForDate(MON, withHours, undefined, "pickup");
assert.equal(hourWins.length, 2);
assert.equal(hourWins[0]?.label, "9:00 AM – 12:00 PM");
assert.equal(hourWins[1]?.label, "2:00 PM – 5:00 PM");
const hourDates = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: withHours,
  today: MON,
  horizonDays: 8,
  method: "pickup",
});
assert.ok(hourDates.includes(MON));
assert.ok(!hourDates.includes("2026-07-21")); // Tue — no pickup hours
assert.deepEqual(
  availableWindowsForDate(MON, withHours, undefined, "delivery"),
  [],
); // delivery hours off → legacy empty

// merchant preview
const preview = previewAllowedFulfilmentDates(withCal, 3, MON);
assert.equal(preview.length, 3);
assert.equal(preview[0], MON);

assert.deepEqual(previewAllowedFulfilmentDates(noCal, 3, MON), []);

// --- Phase 7: blackouts ---
const withBlackout: FulfillmentConfig = {
  ...withCal,
  calendar: {
    ...withCal.calendar!,
    blackouts: ["2026-07-20", "2026-07-22"],
  },
};
const noBlackoutDates = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: withBlackout,
  today: MON,
  horizonDays: 5,
});
assert.ok(!noBlackoutDates.includes("2026-07-20"));
assert.ok(!noBlackoutDates.includes("2026-07-22"));
assert.ok(noBlackoutDates.includes("2026-07-21"));

// --- Phase 7: daily capacity ---
const withDailyCap: FulfillmentConfig = {
  ...withCal,
  calendar: {
    ...withCal.calendar!,
    daily_capacity: 2,
  },
};
const fullSatUsage: CapacityUsage = {
  byDate: { "2026-07-25": 2 }, // Sat
  byDateWindow: {},
};
const capped = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: withDailyCap,
  today: MON,
  horizonDays: 7,
  usage: fullSatUsage,
});
assert.ok(!capped.includes("2026-07-25"));
assert.ok(capped.includes("2026-07-24")); // Fri still open

// --- Phase 7: windows + per-window capacity ---
const withWindows: FulfillmentConfig = {
  ...withCal,
  calendar: {
    ...withCal.calendar!,
    windows: [
      { id: "am", label: "Morning (AM)", capacity: 1 },
      { id: "pm", label: "Afternoon (PM)", capacity: 1 },
    ],
  },
};
const winUsage: CapacityUsage = {
  byDate: {},
  byDateWindow: { [MON]: { am: 1, pm: 1 } },
};
assert.deepEqual(
  availableWindowsForDate(MON, withWindows, winUsage),
  [],
);
assert.ok(
  !allowedFulfilmentDates({
    cartLeadDays: [0],
    fulfillment: withWindows,
    today: MON,
    horizonDays: 1,
    usage: winUsage,
  }).includes(MON),
);

const amFull: CapacityUsage = {
  byDate: {},
  byDateWindow: { [MON]: { am: 1 } },
};
const openWins = availableWindowsForDate(MON, withWindows, amFull);
assert.equal(openWins.length, 1);
assert.equal(openWins[0]?.id, "pm");
assert.ok(
  allowedFulfilmentDates({
    cartLeadDays: [0],
    fulfillment: withWindows,
    today: MON,
    horizonDays: 1,
    usage: amFull,
  }).includes(MON),
);

// --- Matrix / edge combos ---

// Hours flag on but every day off → treat as date-only (don't brick)
const emptyHours: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "" },
  calendar: {
    enabled: true,
    allowed_weekdays: [0, 1, 2, 3, 4, 5, 6],
    horizon_days: 7,
    windows: [{ id: "am", label: "Morning" }],
  },
  pickup_hours: {
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
      weekday,
      enabled: false,
      ranges: [{ start: "09:00", end: "17:00" }],
    })),
  },
};
assert.equal(methodHoursEnabled(emptyHours, "pickup"), false);
assert.deepEqual(resolveWindows(emptyHours, { method: "pickup", date: MON }).map((w) => w.id), [
  "am",
]); // falls back to legacy windows
assert.ok(
  allowedFulfilmentDates({
    cartLeadDays: [0],
    fulfillment: emptyHours,
    today: MON,
    horizonDays: 1,
    method: "pickup",
  }).includes(MON),
);

// Stale hours while calendar off + lead > 0 → ignore hours (all weekdays, no windows)
const staleHoursNoCal: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "" },
  pickup_hours: {
    enabled: true,
    days: [
      {
        weekday: 1,
        enabled: true,
        ranges: [{ start: "09:00", end: "12:00" }],
      },
    ],
  },
};
assert.equal(methodHoursEnabled(staleHoursNoCal, "pickup"), false);
assert.deepEqual(
  resolveWindows(staleHoursNoCal, { method: "pickup", date: MON }),
  [],
);
const leadOnly = allowedFulfilmentDates({
  cartLeadDays: [1],
  fulfillment: staleHoursNoCal,
  today: MON,
  horizonDays: 3,
  method: "pickup",
});
assert.ok(leadOnly.includes("2026-07-21")); // Tue — not restricted to Mon hours

// Asymmetric: pickup hours Mon-only; delivery date-only
const asymmetric: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "" },
  delivery: { enabled: true, fee_cents: 500, instructions: "" },
  calendar: { enabled: true, allowed_weekdays: [0, 1, 2, 3, 4, 5, 6], horizon_days: 8 },
  pickup_hours: withHours.pickup_hours,
};
const pickupOnlyMon = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: asymmetric,
  today: MON,
  horizonDays: 8,
  method: "pickup",
});
assert.ok(pickupOnlyMon.includes(MON));
assert.ok(!pickupOnlyMon.includes("2026-07-21"));
const deliveryAny = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: asymmetric,
  today: MON,
  horizonDays: 3,
  method: "delivery",
});
assert.ok(deliveryAny.includes(MON));
assert.ok(deliveryAny.includes("2026-07-21"));
assert.deepEqual(
  availableWindowsForDate(MON, asymmetric, undefined, "delivery"),
  [],
);

// Duplicate ranges → one window
const dup = windowsFromHoursForDate(
  {
    enabled: true,
    days: [
      {
        weekday: 1,
        enabled: true,
        ranges: [
          { start: "09:00", end: "12:00" },
          { start: "09:00", end: "12:00" },
        ],
      },
    ],
  },
  "pickup",
  MON,
);
assert.equal(dup.length, 1);
assert.equal(dup[0]?.label, formatHourRangeLabel("09:00", "12:00"));

// Invalid range (start >= end) dropped; normalize empties → undefined
assert.equal(
  normalizeHoursConfig({
    enabled: true,
    days: [
      {
        weekday: 1,
        enabled: true,
        ranges: [{ start: "17:00", end: "09:00" }],
      },
    ],
  }),
  undefined,
);

// Sanitize: hours for disabled method dropped; empty hours dropped; calendar off drops hours
const sanitized = sanitizeFulfillmentConfig({
  pickup: { enabled: true, instructions: "x", notes_enabled: true },
  delivery: { enabled: false, fee_cents: 0, instructions: "" },
  calendar: { enabled: true, allowed_weekdays: [1, 2, 3, 4, 5, 6] },
  pickup_hours: withHours.pickup_hours,
  delivery_hours: {
    enabled: true,
    days: defaultDaysOpen(),
  },
});
assert.ok(sanitized.pickup_hours?.enabled);
assert.equal(sanitized.delivery_hours, undefined); // delivery method off
assert.equal(sanitized.delivery, undefined);

const sanitizedOffCal = sanitizeFulfillmentConfig({
  pickup: { enabled: true, instructions: "" },
  calendar: { enabled: false, allowed_weekdays: [] },
  pickup_hours: withHours.pickup_hours,
});
assert.equal(sanitizedOffCal.calendar, undefined);
assert.equal(sanitizedOffCal.pickup_hours, undefined);

// Notes off clears instructions
const notesOff = sanitizeFulfillmentConfig({
  pickup: {
    enabled: true,
    notes_enabled: false,
    instructions: "should clear",
    location: "A",
  },
});
assert.equal(notesOff.pickup?.instructions, "");
assert.equal(notesOff.pickup?.notes_enabled, false);
assert.equal(notesOff.pickup?.location, "A");

// Both methods off → sanitize still produces empty methods (save rejects earlier)
const neither = sanitizeFulfillmentConfig({});
assert.equal(neither.pickup, undefined);
assert.equal(neither.delivery, undefined);

// Blackout ranges expand into resolveBlackouts
const withRange: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "" },
  calendar: {
    enabled: true,
    allowed_weekdays: [0, 1, 2, 3, 4, 5, 6],
    horizon_days: 10,
    blackout_ranges: [{ start: "2026-07-21", end: "2026-07-23" }],
    blackouts: ["2026-07-25"],
  },
};
const rangeBlocked = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: withRange,
  today: MON,
  horizonDays: 7,
});
assert.ok(!rangeBlocked.includes("2026-07-21"));
assert.ok(!rangeBlocked.includes("2026-07-22"));
assert.ok(!rangeBlocked.includes("2026-07-23"));
assert.ok(!rangeBlocked.includes("2026-07-25"));
assert.ok(rangeBlocked.includes(MON));
assert.ok(rangeBlocked.includes("2026-07-24"));

// Sanitize caps delivery methods at 3 and mirrors first onto delivery
const manyMethods = sanitizeFulfillmentConfig({
  delivery_methods: [
    { id: "a", name: "Standard", fee_cents: 500 },
    { id: "b", name: "Express", fee_cents: 1200 },
    { id: "c", name: "Same day", fee_cents: 2000 },
    { id: "d", name: "Too many", fee_cents: 3000 },
  ],
});
assert.equal(manyMethods.delivery_methods?.length, 3);
assert.equal(manyMethods.delivery?.enabled, true);
assert.equal(manyMethods.delivery?.fee_cents, 500);

function defaultDaysOpen() {
  return [1, 2, 3, 4, 5, 6, 0].map((weekday) => ({
    weekday,
    enabled: weekday !== 0,
    ranges: [{ start: "10:00", end: "14:00" }],
  }));
}

console.log("fulfilment/dates.check: ok");
