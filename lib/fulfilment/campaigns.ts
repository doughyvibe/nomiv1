import type {
  FulfilmentCampaign,
  FulfilmentWindow,
  FulfillmentConfig,
} from "@/lib/stores/types";

import {
  addDaysYmd,
  formatFulfilmentDateLabel,
  isValidYmd,
  todaySgYmd,
} from "./dates";

/** Preset id for TikTok-style tomorrow delivery 1–5. */
export const LIVE_PRESET_TOMORROW_DELIVERY_1_5 = "tomorrow_delivery_1_5";

const LIVE_WINDOW: FulfilmentWindow = {
  id: "live_1_5",
  label: "1–5pm",
};

/** End of SG civil day as ISO (for auto-expire). */
export function endOfSgDayIso(ymd: string): string {
  // ponytail: SG is fixed +08; ceiling = next calendar day 00:00+08
  return `${addDaysYmd(ymd, 1)}T00:00:00+08:00`;
}

export function isCampaignExpired(
  campaign: FulfilmentCampaign,
  now: Date = new Date(),
): boolean {
  if (!campaign.expires_at) return false;
  const t = Date.parse(campaign.expires_at);
  if (!Number.isFinite(t)) return false;
  return now.getTime() >= t;
}

/**
 * Active Live campaign, or null if off / expired.
 * Expired campaigns do not affect the engine (forgotten Live cannot brick).
 */
export function resolveActiveCampaign(
  fulfillment: FulfillmentConfig,
  now: Date = new Date(),
): FulfilmentCampaign | null {
  const c = fulfillment.campaign;
  if (!c?.active) return null;
  if (isCampaignExpired(c, now)) return null;
  return c;
}

/** True when merchant left `active` but expiry already passed (dashboard signal). */
export function isCampaignStaleActive(
  fulfillment: FulfillmentConfig,
  now: Date = new Date(),
): boolean {
  const c = fulfillment.campaign;
  return Boolean(c?.active && isCampaignExpired(c, now));
}

export function campaignBannerText(campaign: FulfilmentCampaign): string {
  const raw = campaign.banner?.trim();
  if (raw) return raw;
  return "Live drop — limited fulfillment options.";
}

/** Methods buyers may pick while Live is on (falls back to store methods). */
export function campaignAllowedMethods(
  fulfillment: FulfillmentConfig,
  now: Date = new Date(),
): { pickup: boolean; delivery: boolean } {
  const c = resolveActiveCampaign(fulfillment, now);
  const storePickup = Boolean(fulfillment.pickup?.enabled);
  const storeDelivery = Boolean(fulfillment.delivery?.enabled);
  if (!c?.methods?.length) {
    return { pickup: storePickup, delivery: storeDelivery };
  }
  return {
    pickup: c.methods.includes("pickup") && storePickup,
    delivery: c.methods.includes("delivery") && storeDelivery,
  };
}

/**
 * Fulfillment view for engine + checkout while campaign is active:
 * methods locked, windows overridden, calendar forced on when dates locked.
 */
export function fulfillmentWithCampaign(
  fulfillment: FulfillmentConfig,
  now: Date = new Date(),
): FulfillmentConfig {
  const c = resolveActiveCampaign(fulfillment, now);
  if (!c) {
    if (
      fulfillment.campaign &&
      (!fulfillment.campaign.active || isCampaignExpired(fulfillment.campaign, now))
    ) {
      const { campaign: _drop, ...rest } = fulfillment;
      return rest;
    }
    return fulfillment;
  }

  const methods = campaignAllowedMethods(fulfillment, now);
  const out: FulfillmentConfig = {
    pickup: methods.pickup ? fulfillment.pickup : undefined,
    delivery: methods.delivery ? fulfillment.delivery : undefined,
    delivery_methods: methods.delivery
      ? fulfillment.delivery_methods
      : undefined,
    delivery_free_above_cents: methods.delivery
      ? fulfillment.delivery_free_above_cents
      : undefined,
    campaign: c,
  };

  const dates = (c.dates ?? []).filter(isValidYmd);
  const windows =
    c.windows && c.windows.length > 0
      ? c.windows
      : c.window_ids?.length && fulfillment.calendar?.windows
        ? fulfillment.calendar.windows.filter((w) =>
            c.window_ids!.includes(w.id),
          )
        : fulfillment.calendar?.windows;
  const campaignOwnsWindows = Boolean(windows && windows.length > 0);

  if (dates.length > 0 || campaignOwnsWindows) {
    out.calendar = {
      enabled: true,
      allowed_weekdays: fulfillment.calendar?.allowed_weekdays?.length
        ? [...fulfillment.calendar.allowed_weekdays]
        : [0, 1, 2, 3, 4, 5, 6],
      horizon_days: fulfillment.calendar?.horizon_days,
      blackouts: fulfillment.calendar?.blackouts,
      blackout_ranges: fulfillment.calendar?.blackout_ranges,
      daily_capacity: fulfillment.calendar?.daily_capacity,
      windows: campaignOwnsWindows ? windows : undefined,
    };
  } else if (fulfillment.calendar) {
    out.calendar = fulfillment.calendar;
  }

  // Campaign named windows win; otherwise keep store hours for method+date.
  if (!campaignOwnsWindows) {
    if (fulfillment.pickup_hours) out.pickup_hours = fulfillment.pickup_hours;
    if (fulfillment.delivery_hours) {
      out.delivery_hours = fulfillment.delivery_hours;
    }
  }

  return out;
}

/**
 * Build friendly "Tomorrow delivery 1–5 only" Live preset.
 * Requires delivery method already enabled on the store.
 */
export function buildTomorrowDeliveryLiveCampaign(
  today: string = todaySgYmd(),
): FulfilmentCampaign {
  const tomorrow = addDaysYmd(today, 1);
  return {
    active: true,
    preset: LIVE_PRESET_TOMORROW_DELIVERY_1_5,
    banner: `Live drop: delivery ${formatFulfilmentDateLabel(tomorrow)} 1–5pm only.`,
    methods: ["delivery"],
    dates: [tomorrow],
    windows: [LIVE_WINDOW],
    started_at: new Date().toISOString(),
    expires_at: endOfSgDayIso(tomorrow),
  };
}

export function normalizeCampaignConfig(
  campaign: FulfilmentCampaign | null | undefined,
): FulfilmentCampaign | undefined {
  if (!campaign || !campaign.active) return undefined;

  const methods = (campaign.methods ?? []).filter(
    (m): m is "pickup" | "delivery" => m === "pickup" || m === "delivery",
  );
  const dates = [...new Set((campaign.dates ?? []).filter(isValidYmd))].sort();
  const windows = (campaign.windows ?? [])
    .filter(
      (w) =>
        typeof w?.id === "string" &&
        w.id.trim() &&
        typeof w?.label === "string" &&
        w.label.trim(),
    )
    .map((w) => ({
      id: w.id.trim(),
      label: w.label.trim(),
      ...(typeof w.capacity === "number" &&
      Number.isInteger(w.capacity) &&
      w.capacity > 0
        ? { capacity: w.capacity }
        : {}),
    }));
  const window_ids = [
    ...new Set(
      (campaign.window_ids ?? [])
        .filter((id) => typeof id === "string" && id.trim())
        .map((id) => id.trim()),
    ),
  ];

  const out: FulfilmentCampaign = {
    active: true,
    banner:
      typeof campaign.banner === "string"
        ? campaign.banner.trim().slice(0, 160)
        : "",
    started_at:
      typeof campaign.started_at === "string" && campaign.started_at
        ? campaign.started_at
        : new Date().toISOString(),
  };
  if (campaign.preset) out.preset = campaign.preset;
  if (methods.length) out.methods = methods;
  if (dates.length) out.dates = dates;
  if (windows.length) out.windows = windows;
  else if (window_ids.length) out.window_ids = window_ids;
  if (campaign.expires_at) out.expires_at = campaign.expires_at;
  return out;
}

/** Campaign date lock ∩ lead-time earliest (no capacity — dashboard preview). */
export function campaignDatesForLead(
  campaign: FulfilmentCampaign,
  leadDays: number,
  today: string = todaySgYmd(),
): string[] {
  const dates = (campaign.dates ?? []).filter(isValidYmd);
  if (dates.length === 0) return [];
  const earliest = addDaysYmd(today, Math.max(0, leadDays));
  return dates.filter((d) => d >= earliest).sort();
}

export type CampaignLeadConflict = {
  products: { name: string; lead_time_days: number }[];
  warning: string;
};

/**
 * Dashboard: warn before enable when some catalog items make Live dates empty.
 * Does not block (§8 #4 warn + allow).
 */
export function detectCampaignLeadConflicts(
  campaign: FulfilmentCampaign,
  products: { name: string; lead_time_days?: number | null }[],
  today: string = todaySgYmd(),
): CampaignLeadConflict | null {
  if (!(campaign.dates ?? []).some(isValidYmd)) return null;

  const conflicting: { name: string; lead_time_days: number }[] = [];
  for (const p of products) {
    const lead = p.lead_time_days ?? 0;
    if (!Number.isInteger(lead) || lead <= 0) continue;
    if (campaignDatesForLead(campaign, lead, today).length === 0) {
      conflicting.push({ name: p.name, lead_time_days: lead });
    }
  }
  if (conflicting.length === 0) return null;

  const names = conflicting.map((p) => p.name).join(", ");
  const maxLead = Math.max(...conflicting.map((p) => p.lead_time_days));
  return {
    products: conflicting,
    warning: `${names} need ${maxLead} ${maxLead === 1 ? "day" : "days"} prep — buyers with those items in cart won't see Live dates. You can still go Live.`,
  };
}

/**
 * Checkout: clear empty-set message when Live + lead time conflict.
 */
export function campaignCheckoutEmptyMessage(
  lines: { name: string; lead_time_days?: number | null }[],
  fulfillment: FulfillmentConfig,
  today: string = todaySgYmd(),
  now: Date = new Date(),
): string | null {
  const c = resolveActiveCampaign(fulfillment, now);
  if (!c) return null;

  const leads = lines.map((l) => l.lead_time_days ?? 0);
  const maxLead = Math.max(0, ...leads);

  if ((c.dates ?? []).some(isValidYmd)) {
    if (campaignDatesForLead(c, maxLead, today).length > 0) return null;
  } else {
    return null;
  }

  if (maxLead <= 0) {
    return "Live fulfillment isn't available right now. Please contact the seller.";
  }

  const blockers = lines.filter((l) => (l.lead_time_days ?? 0) === maxLead);
  const names =
    blockers.map((l) => l.name).filter(Boolean).join(", ") || "Some items";
  return `${names} need ${maxLead} ${maxLead === 1 ? "day" : "days"} — remove them or end the live window.`;
}
