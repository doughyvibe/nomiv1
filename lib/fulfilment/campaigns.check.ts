import assert from "node:assert/strict";

import type { FulfillmentConfig } from "@/lib/stores/types";

import {
  buildTomorrowDeliveryLiveCampaign,
  campaignCheckoutEmptyMessage,
  campaignDatesForLead,
  detectCampaignLeadConflicts,
  fulfillmentWithCampaign,
  isCampaignExpired,
  resolveActiveCampaign,
} from "./campaigns";
import {
  addDaysYmd,
  allowedFulfilmentDates,
  resolveWindows,
} from "./dates";

const MON = "2026-07-20"; // Mon
const TUE = "2026-07-21";

const base: FulfillmentConfig = {
  pickup: { enabled: true, instructions: "Door" },
  delivery: { enabled: true, fee_cents: 500, instructions: "Ring" },
  calendar: {
    enabled: true,
    allowed_weekdays: [1, 2, 3, 4, 5, 6],
    horizon_days: 14,
    windows: [
      { id: "am", label: "Morning (AM)" },
      { id: "pm", label: "Afternoon (PM)" },
    ],
  },
};

const live = buildTomorrowDeliveryLiveCampaign(MON);
assert.deepEqual(live.dates, [TUE]);
assert.deepEqual(live.methods, ["delivery"]);
assert.equal(live.windows?.[0]?.id, "live_1_5");
assert.ok(live.expires_at);

const withLive: FulfillmentConfig = { ...base, campaign: live };
const active = resolveActiveCampaign(withLive, new Date("2026-07-20T10:00:00+08:00"));
assert.ok(active);
assert.equal(active?.preset, "tomorrow_delivery_1_5");

// expired → inactive
const expiredCamp = {
  ...live,
  expires_at: "2026-07-20T00:00:00+08:00",
};
assert.equal(
  resolveActiveCampaign(
    { ...base, campaign: expiredCamp },
    new Date("2026-07-20T10:00:00+08:00"),
  ),
  null,
);
assert.equal(isCampaignExpired(expiredCamp, new Date("2026-07-20T10:00:00+08:00")), true);

const effective = fulfillmentWithCampaign(
  withLive,
  new Date("2026-07-20T10:00:00+08:00"),
);
assert.equal(effective.pickup, undefined);
assert.ok(effective.delivery?.enabled);
assert.deepEqual(
  resolveWindows(effective).map((w) => w.id),
  ["live_1_5"],
);

// lead 0 → tomorrow only, pickup window gone
const dates0 = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: effective,
  today: MON,
});
assert.deepEqual(dates0, [TUE]);

// lead 3 → empty (Wed earliest > Tue campaign)
assert.deepEqual(campaignDatesForLead(live, 3, MON), []);
const dates3 = allowedFulfilmentDates({
  cartLeadDays: [3],
  fulfillment: effective,
  today: MON,
});
assert.deepEqual(dates3, []);

const conflict = detectCampaignLeadConflicts(live, [
  { name: "Cookies", lead_time_days: 0 },
  { name: "Brownies", lead_time_days: 3 },
], MON);
assert.ok(conflict);
assert.equal(conflict!.products.length, 1);
assert.equal(conflict!.products[0]?.name, "Brownies");

const msg = campaignCheckoutEmptyMessage(
  [{ name: "Brownies", lead_time_days: 3 }],
  withLive,
  MON,
  new Date("2026-07-20T10:00:00+08:00"),
);
assert.ok(msg);
assert.match(msg!, /Brownies need 3 days/);

// campaign off → normal calendar restored
const off = fulfillmentWithCampaign(
  { ...base, campaign: { ...live, active: false } },
  new Date("2026-07-20T10:00:00+08:00"),
);
assert.equal(off.campaign, undefined);
const normal = allowedFulfilmentDates({
  cartLeadDays: [0],
  fulfillment: off,
  today: MON,
  horizonDays: 3,
});
assert.ok(normal.includes(MON));
assert.ok(normal.includes(TUE));
assert.ok(normal.includes(addDaysYmd(MON, 2)));

console.log("fulfilment/campaigns.check: ok");
