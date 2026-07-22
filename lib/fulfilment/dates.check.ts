import assert from "node:assert/strict";

import type { FulfillmentConfig } from "@/lib/stores/types";

import {
  addDaysYmd,
  allowedFulfilmentDates,
  availableWindowsForDate,
  fulfilmentDateRequired,
  maxCartLeadDays,
  previewAllowedFulfilmentDates,
  weekdayOfYmd,
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

// empty weekdays → empty set
const emptyWd: FulfillmentConfig = {
  ...withCal,
  calendar: { enabled: true, allowed_weekdays: [], horizon_days: 14 },
};
assert.deepEqual(
  allowedFulfilmentDates({ cartLeadDays: [0], fulfillment: emptyWd, today: MON }),
  [],
);

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

console.log("fulfilment/dates.check: ok");
