import type {
  BlackoutRange,
  FulfilmentCalendarConfig,
  FulfilmentHourRange,
  FulfilmentHoursConfig,
  FulfilmentHoursDay,
  FulfilmentWindow,
  FulfillmentConfig,
} from "@/lib/stores/types";
import {
  mirrorDeliveryFromMethods,
  normalizeDeliveryMethods,
  normalizeFreeDeliveryAboveCents,
  resolveDeliveryMethods,
} from "@/lib/fulfilment/delivery-methods";

/** How many calendar days from earliest to scan for allowed handoff dates. */
export const DEFAULT_FULFILMENT_HORIZON_DAYS = 28;

/** Merchant preview length in settings. */
export const MERCHANT_DATE_PREVIEW_COUNT = 7;

/** Default when merchant enables calendar (Mon–Sat). */
export const DEFAULT_ALLOWED_WEEKDAYS = [1, 2, 3, 4, 5, 6] as const;

const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export type CartLeadLine = { lead_time_days?: number | null };

/** Soft-hold usage for capacity gating (Phase 7). */
export type CapacityUsage = {
  /** YYYY-MM-DD → held order count (daily bucket). */
  byDate: Record<string, number>;
  /** YYYY-MM-DD → window_id → held count. */
  byDateWindow: Record<string, Record<string, number>>;
};

export const EMPTY_CAPACITY_USAGE: CapacityUsage = {
  byDate: {},
  byDateWindow: {},
};

/** Max prep days across cart lines; empty cart → 0. */
export function maxCartLeadDays(lines: CartLeadLine[]): number {
  if (lines.length === 0) return 0;
  let max = 0;
  for (const line of lines) {
    const d = line.lead_time_days ?? 0;
    if (Number.isInteger(d) && d > max) max = d;
  }
  return max;
}

/**
 * Founder §8 #2: ask for a date when merchant enables calendar
 * OR cart max(lead_time_days) > 0
 * OR active campaign locks dates.
 */
export function fulfilmentDateRequired(
  fulfillment: FulfillmentConfig,
  maxLeadDays: number,
): boolean {
  if (Boolean(fulfillment.calendar?.enabled) || maxLeadDays > 0) return true;
  const dates = fulfillment.campaign?.dates;
  return Boolean(
    fulfillment.campaign?.active &&
      Array.isArray(dates) &&
      dates.some(isValidYmd),
  );
}

/** Weekdays used by the engine (0=Sun … 6=Sat). */
export function resolveAllowedWeekdays(
  fulfillment: FulfillmentConfig,
  method?: "pickup" | "delivery",
): number[] {
  if (!fulfillment.calendar?.enabled) {
    return [...ALL_WEEKDAYS];
  }

  const fromHours = weekdaysFromHours(fulfillment, method);
  if (fromHours !== null) return fromHours;

  // Date-only (slots off): every weekday. Legacy allowed_weekdays ignored.
  return [...ALL_WEEKDAYS];
}

/** Weekdays with ≥1 open range for method hours; null if hours not in play. */
function weekdaysFromHours(
  fulfillment: FulfillmentConfig,
  method?: "pickup" | "delivery",
): number[] | null {
  // Hours only apply when the date calendar is on.
  if (!fulfillment.calendar?.enabled) return null;

  const configs: FulfilmentHoursConfig[] = [];
  if (method === "pickup") {
    if (fulfillment.pickup_hours?.enabled) configs.push(fulfillment.pickup_hours);
  } else if (method === "delivery") {
    if (fulfillment.delivery_hours?.enabled) {
      configs.push(fulfillment.delivery_hours);
    }
  } else {
    if (fulfillment.pickup_hours?.enabled) configs.push(fulfillment.pickup_hours);
    if (fulfillment.delivery_hours?.enabled) {
      configs.push(fulfillment.delivery_hours);
    }
  }
  if (configs.length === 0) return null;

  const days = new Set<number>();
  for (const h of configs) {
    for (const day of h.days ?? []) {
      if (
        day.enabled &&
        Number.isInteger(day.weekday) &&
        day.weekday >= 0 &&
        day.weekday <= 6 &&
        (day.ranges ?? []).some(isValidHourRange)
      ) {
        days.add(day.weekday);
      }
    }
  }
  // Enabled flag but zero open days → not in play (date-only / legacy).
  if (days.size === 0) return null;
  return [...days].sort((a, b) => a - b);
}

const HHMM = /^\d{2}:\d{2}$/;

export function isValidHourRange(r: FulfilmentHourRange): boolean {
  if (!HHMM.test(r.start) || !HHMM.test(r.end)) return false;
  return r.start < r.end;
}

export function formatHourLabel(hhmm: string): string {
  const [hs, ms] = hhmm.split(":").map(Number);
  if (!Number.isFinite(hs) || !Number.isFinite(ms)) return hhmm;
  const period = hs >= 12 ? "PM" : "AM";
  const h12 = hs % 12 === 0 ? 12 : hs % 12;
  return `${h12}:${String(ms).padStart(2, "0")} ${period}`;
}

export function formatHourRangeLabel(start: string, end: string): string {
  return `${formatHourLabel(start)} – ${formatHourLabel(end)}`;
}

export function hourWindowId(
  method: "pickup" | "delivery",
  weekday: number,
  start: string,
  end: string,
): string {
  return `${method}_${weekday}_${start.replace(":", "")}_${end.replace(":", "")}`;
}

export function defaultFulfilmentHoursDays(): FulfilmentHoursDay[] {
  // Mon–Sat open 09:00–17:00; Sun off
  return [1, 2, 3, 4, 5, 6, 0].map((weekday) => ({
    weekday,
    enabled: weekday !== 0,
    ranges: [{ start: "09:00", end: "17:00" }],
  }));
}

/** Half-hour options for hour pickers. */
export const FULFILMENT_TIME_OPTIONS: string[] = Array.from(
  { length: 48 },
  (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2, "0")}:${m}`;
  },
);

export function windowsFromHoursForDate(
  hours: FulfilmentHoursConfig | undefined,
  method: "pickup" | "delivery",
  ymd: string,
): FulfilmentWindow[] {
  if (!hours?.enabled || !isValidYmd(ymd)) return [];
  const wd = weekdayOfYmd(ymd);
  const day = (hours.days ?? []).find((d) => d.weekday === wd && d.enabled);
  if (!day) return [];
  const seen = new Set<string>();
  const out: FulfilmentWindow[] = [];
  for (const r of day.ranges ?? []) {
    if (!isValidHourRange(r)) continue;
    const id = hourWindowId(method, wd, r.start, r.end);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      label: formatHourRangeLabel(r.start, r.end),
    });
  }
  return out;
}

export type ResolveWindowsOpts = {
  method?: "pickup" | "delivery";
  /** YYYY-MM-DD — required to resolve hour ranges for a day. */
  date?: string;
};

/** Windows for checkout: hours for method+date, else legacy calendar.windows. */
export function resolveWindows(
  fulfillment: FulfillmentConfig,
  opts?: ResolveWindowsOpts,
): FulfilmentWindow[] {
  const method = opts?.method;
  const date = opts?.date;

  // Hours only when calendar is on and method has ≥1 open day (stale/empty hours → legacy).
  if (
    method &&
    date &&
    fulfillment.calendar?.enabled &&
    methodHoursEnabled(fulfillment, method)
  ) {
    const hours =
      method === "pickup"
        ? fulfillment.pickup_hours
        : fulfillment.delivery_hours;
    return windowsFromHoursForDate(hours, method, date);
  }

  // Legacy / campaign named windows on calendar
  const raw = fulfillment.calendar?.windows ?? [];
  return raw.filter(
    (w) =>
      typeof w?.id === "string" &&
      w.id.trim() &&
      typeof w?.label === "string" &&
      w.label.trim(),
  );
}

/** True when method uses hours-based slots (not date-only). */
export function methodHoursEnabled(
  fulfillment: FulfillmentConfig,
  method: "pickup" | "delivery",
): boolean {
  if (!fulfillment.calendar?.enabled) return false;
  const hours =
    method === "pickup"
      ? fulfillment.pickup_hours
      : fulfillment.delivery_hours;
  if (!hours?.enabled) return false;
  // Enabled flag with zero open days → treat as off (date-only / legacy).
  const days = weekdaysFromHours(fulfillment, method);
  return days !== null && days.length > 0;
}

/** Civil today in Asia/Singapore as YYYY-MM-DD. */
export function todaySgYmd(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function parseYmd(ymd: string): { y: number; m: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

export function isValidYmd(ymd: string): boolean {
  return parseYmd(ymd) !== null;
}

/** Add whole days to a YYYY-MM-DD (date-only; UTC noon avoids DST skew). */
export function addDaysYmd(ymd: string, days: number): string {
  const parsed = parseYmd(ymd);
  if (!parsed) throw new Error(`Invalid date: ${ymd}`);
  const dt = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d + days, 12));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function weekdayOfYmd(ymd: string): number {
  const parsed = parseYmd(ymd);
  if (!parsed) throw new Error(`Invalid date: ${ymd}`);
  return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d, 12)).getUTCDay();
}

export function formatFulfilmentDateLabel(ymd: string): string {
  const parsed = parseYmd(ymd);
  if (!parsed) return ymd;
  const dt = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d, 12));
  return dt.toLocaleDateString("en-SG", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Compact card parts for buyer date picker (TODAY / FRI · 23 · JUL). */
export function fulfilmentDateCardParts(
  ymd: string,
  todayYmd: string = todaySgYmd(),
): { weekday: string; day: string; month: string } {
  const parsed = parseYmd(ymd);
  if (!parsed) return { weekday: "", day: ymd, month: "" };
  const dt = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d, 12));
  if (ymd === todayYmd) {
    return {
      weekday: "TODAY",
      day: String(parsed.d),
      month: dt
        .toLocaleDateString("en-SG", { timeZone: "UTC", month: "short" })
        .toUpperCase(),
    };
  }
  return {
    weekday: dt
      .toLocaleDateString("en-SG", { timeZone: "UTC", weekday: "short" })
      .toUpperCase(),
    day: String(parsed.d),
    month: dt
      .toLocaleDateString("en-SG", { timeZone: "UTC", month: "short" })
      .toUpperCase(),
  };
}

/** Expand inclusive YYYY-MM-DD range into individual dates (cap 366 days). */
export function expandBlackoutRange(range: BlackoutRange): string[] {
  if (!isValidYmd(range.start) || !isValidYmd(range.end)) return [];
  if (range.start > range.end) return [];
  const out: string[] = [];
  let cur = range.start;
  // ponytail: 366-day ceiling prevents bad merchant input from hanging the engine
  for (let i = 0; i < 366; i++) {
    out.push(cur);
    if (cur === range.end) break;
    cur = addDaysYmd(cur, 1);
  }
  return out;
}

export function isValidBlackoutRange(range: BlackoutRange): boolean {
  return (
    isValidYmd(range.start) &&
    isValidYmd(range.end) &&
    range.start <= range.end
  );
}

export function normalizeBlackoutRanges(
  raw: BlackoutRange[] | undefined,
): BlackoutRange[] | undefined {
  if (!raw || raw.length === 0) return undefined;
  const seen = new Set<string>();
  const out: BlackoutRange[] = [];
  for (const r of raw) {
    if (!isValidBlackoutRange(r)) continue;
    const key = `${r.start}_${r.end}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ start: r.start, end: r.end });
  }
  out.sort((a, b) =>
    a.start === b.start
      ? a.end.localeCompare(b.end)
      : a.start.localeCompare(b.start),
  );
  return out.length > 0 ? out : undefined;
}

export function formatBlackoutRangeLabel(range: BlackoutRange): string {
  if (range.start === range.end) return range.start;
  return `${range.start} – ${range.end}`;
}

export function resolveBlackouts(
  fulfillment: FulfillmentConfig,
): Set<string> {
  const out = new Set<string>();
  for (const ymd of fulfillment.calendar?.blackouts ?? []) {
    if (isValidYmd(ymd)) out.add(ymd);
  }
  for (const range of fulfillment.calendar?.blackout_ranges ?? []) {
    for (const ymd of expandBlackoutRange(range)) out.add(ymd);
  }
  return out;
}

export function windowById(
  fulfillment: FulfillmentConfig,
  windowId: string,
): FulfilmentWindow | undefined {
  const fromCal = resolveWindows(fulfillment).find((w) => w.id === windowId);
  if (fromCal) return fromCal;
  for (const method of ["pickup", "delivery"] as const) {
    const hours =
      method === "pickup"
        ? fulfillment.pickup_hours
        : fulfillment.delivery_hours;
    if (!hours?.enabled) continue;
    for (const day of hours.days ?? []) {
      for (const r of day.ranges ?? []) {
        if (!isValidHourRange(r)) continue;
        const id = hourWindowId(method, day.weekday, r.start, r.end);
        if (id === windowId) {
          return {
            id,
            label: formatHourRangeLabel(r.start, r.end),
          };
        }
      }
    }
  }
  return undefined;
}

export function resolveDailyCapacity(
  fulfillment: FulfillmentConfig,
): number | null {
  const n = fulfillment.calendar?.daily_capacity;
  if (typeof n === "number" && Number.isInteger(n) && n > 0) return n;
  return null;
}

export function dailyHeld(
  usage: CapacityUsage,
  ymd: string,
): number {
  return usage.byDate[ymd] ?? 0;
}

export function windowHeld(
  usage: CapacityUsage,
  ymd: string,
  windowId: string,
): number {
  return usage.byDateWindow[ymd]?.[windowId] ?? 0;
}

/** True when daily bucket still has room (or unlimited). */
export function dateHasDailyCapacity(
  ymd: string,
  fulfillment: FulfillmentConfig,
  usage: CapacityUsage = EMPTY_CAPACITY_USAGE,
): boolean {
  const cap = resolveDailyCapacity(fulfillment);
  if (cap === null) return true;
  return dailyHeld(usage, ymd) < cap;
}

/** Remaining slots for a window; null = unlimited. */
export function windowRemaining(
  ymd: string,
  window: FulfilmentWindow,
  usage: CapacityUsage = EMPTY_CAPACITY_USAGE,
): number | null {
  const cap =
    typeof window.capacity === "number" &&
    Number.isInteger(window.capacity) &&
    window.capacity > 0
      ? window.capacity
      : null;
  if (cap === null) return null;
  return Math.max(0, cap - windowHeld(usage, ymd, window.id));
}

/**
 * Windows still bookable on a date (daily room ∩ per-window room).
 * Empty config windows → [] (caller treats as date-only).
 */
export function availableWindowsForDate(
  ymd: string,
  fulfillment: FulfillmentConfig,
  usage: CapacityUsage = EMPTY_CAPACITY_USAGE,
  method?: "pickup" | "delivery",
): FulfilmentWindow[] {
  const windows = resolveWindows(fulfillment, { method, date: ymd });
  if (windows.length === 0) return [];
  if (!dateHasDailyCapacity(ymd, fulfillment, usage)) return [];
  return windows.filter((w) => {
    const rem = windowRemaining(ymd, w, usage);
    return rem === null || rem > 0;
  });
}

export type AllowedFulfilmentDatesInput = {
  /** Per-line lead_time_days (physical lines). */
  cartLeadDays: number[];
  fulfillment: FulfillmentConfig;
  /** YYYY-MM-DD; defaults to SG today. */
  today?: string;
  /** Override horizon; else calendar.horizon_days or default. */
  horizonDays?: number;
  /** Soft-hold usage; omit when no capacity configured. */
  usage?: CapacityUsage;
  /** When set, filter by that method's hours. */
  method?: "pickup" | "delivery";
};

/**
 * Store calendar ∩ [today + max(lead) …) ∩ ¬blackouts ∩ campaign ∩ capacity
 * for horizon days.
 * Returns [] when date not required, empty weekdays, or empty cart with no calendar.
 * Dates with windows are kept only if ≥1 window still has room.
 * Active campaign with `dates` → those dates ∩ lead earliest ∩ capacity (weekdays ignored).
 */
export function allowedFulfilmentDates(
  input: AllowedFulfilmentDatesInput,
): string[] {
  const maxLead = maxCartLeadDays(
    input.cartLeadDays.map((d) => ({ lead_time_days: d })),
  );

  if (!fulfilmentDateRequired(input.fulfillment, maxLead)) return [];

  const today = input.today ?? todaySgYmd();
  const earliest = addDaysYmd(today, maxLead);
  const usage = input.usage ?? EMPTY_CAPACITY_USAGE;
  const method = input.method;
  const hoursOn = method
    ? methodHoursEnabled(input.fulfillment, method)
    : methodHoursEnabled(input.fulfillment, "pickup") ||
      methodHoursEnabled(input.fulfillment, "delivery");

  // Phase 8: campaign date lock — prefer campaign ∩ lead ∩ capacity
  const campaignDates = (
    input.fulfillment.campaign?.active
      ? (input.fulfillment.campaign.dates ?? [])
      : []
  ).filter(isValidYmd);
  if (campaignDates.length > 0) {
    const out: string[] = [];
    for (const ymd of [...campaignDates].sort()) {
      if (ymd < earliest) continue;
      if (!dateHasDailyCapacity(ymd, input.fulfillment, usage)) continue;
      const windows = resolveWindows(input.fulfillment, { method, date: ymd });
      if (windows.length > 0) {
        if (
          availableWindowsForDate(ymd, input.fulfillment, usage, method)
            .length === 0
        ) {
          continue;
        }
      } else if (hoursOn && method) {
        continue;
      }
      out.push(ymd);
    }
    return out;
  }

  const weekdays = resolveAllowedWeekdays(input.fulfillment, method);
  if (weekdays.length === 0) return [];

  const horizon =
    input.horizonDays ??
    input.fulfillment.calendar?.horizon_days ??
    DEFAULT_FULFILMENT_HORIZON_DAYS;
  const blackouts = resolveBlackouts(input.fulfillment);

  const out: string[] = [];
  for (let i = 0; i < horizon; i++) {
    const ymd = addDaysYmd(earliest, i);
    if (!weekdays.includes(weekdayOfYmd(ymd))) continue;
    if (blackouts.has(ymd)) continue;
    if (!dateHasDailyCapacity(ymd, input.fulfillment, usage)) continue;
    const windows = resolveWindows(input.fulfillment, { method, date: ymd });
    if (windows.length > 0) {
      if (
        availableWindowsForDate(ymd, input.fulfillment, usage, method)
          .length === 0
      ) {
        continue;
      }
    } else if (hoursOn && method) {
      // Hours on but this weekday has no ranges → skip
      continue;
    } else if (
      !hoursOn &&
      (input.fulfillment.calendar?.windows?.length ?? 0) > 0
    ) {
      // Legacy named windows: date needs ≥1 open window
      if (
        availableWindowsForDate(ymd, input.fulfillment, usage).length === 0
      ) {
        continue;
      }
    }
    out.push(ymd);
  }
  return out;
}

/** Next N allowed dates for merchant settings preview (lead 0 = calendar only). */
export function previewAllowedFulfilmentDates(
  fulfillment: FulfillmentConfig,
  count: number = MERCHANT_DATE_PREVIEW_COUNT,
  today?: string,
  usage?: CapacityUsage,
): string[] {
  if (!fulfillment.calendar?.enabled) return [];
  const all = allowedFulfilmentDates({
    cartLeadDays: [0],
    fulfillment,
    today,
    // Scan far enough to fill preview even with sparse weekdays
    horizonDays: Math.max(DEFAULT_FULFILMENT_HORIZON_DAYS, count * 7),
    usage,
  });
  return all.slice(0, count);
}

export function isAllowedFulfilmentDate(
  ymd: string,
  allowed: string[],
): boolean {
  return allowed.includes(ymd);
}

function normalizeWindows(
  windows: FulfilmentWindow[] | undefined,
): FulfilmentWindow[] | undefined {
  if (!windows || windows.length === 0) return undefined;
  const out: FulfilmentWindow[] = [];
  const seen = new Set<string>();
  for (const w of windows) {
    const id = typeof w.id === "string" ? w.id.trim() : "";
    const label = typeof w.label === "string" ? w.label.trim() : "";
    if (!id || !label || seen.has(id)) continue;
    seen.add(id);
    const cap =
      typeof w.capacity === "number" &&
      Number.isInteger(w.capacity) &&
      w.capacity > 0
        ? w.capacity
        : undefined;
    out.push(cap !== undefined ? { id, label, capacity: cap } : { id, label });
  }
  return out.length > 0 ? out : undefined;
}

function normalizeBlackouts(raw: string[] | undefined): string[] | undefined {
  if (!raw || raw.length === 0) return undefined;
  const cleaned = [
    ...new Set(raw.map((s) => s.trim()).filter(isValidYmd)),
  ].sort();
  return cleaned.length > 0 ? cleaned : undefined;
}

/** Normalize calendar blob from merchant form / JSON. */
export function normalizeCalendarConfig(
  calendar: FulfillmentConfig["calendar"] | undefined,
  opts?: { clearWindows?: boolean },
): FulfillmentConfig["calendar"] | undefined {
  if (!calendar?.enabled) return undefined;
  const weekdays = [
    ...new Set(
      (calendar.allowed_weekdays ?? [...ALL_WEEKDAYS]).filter(
        (d) => Number.isInteger(d) && d >= 0 && d <= 6,
      ),
    ),
  ].sort((a, b) => a - b);
  const horizon =
    typeof calendar.horizon_days === "number" &&
    Number.isInteger(calendar.horizon_days) &&
    calendar.horizon_days >= 7 &&
    calendar.horizon_days <= 90
      ? calendar.horizon_days
      : DEFAULT_FULFILMENT_HORIZON_DAYS;

  const blackouts = normalizeBlackouts(calendar.blackouts);
  const blackoutRanges = normalizeBlackoutRanges(calendar.blackout_ranges);
  const windows = opts?.clearWindows
    ? undefined
    : normalizeWindows(calendar.windows);
  const daily =
    typeof calendar.daily_capacity === "number" &&
    Number.isInteger(calendar.daily_capacity) &&
    calendar.daily_capacity > 0
      ? calendar.daily_capacity
      : undefined;

  const out: FulfilmentCalendarConfig = {
    enabled: true,
    allowed_weekdays:
      weekdays.length > 0 ? weekdays : [...ALL_WEEKDAYS],
    horizon_days: horizon,
  };
  if (blackouts) out.blackouts = blackouts;
  if (blackoutRanges) out.blackout_ranges = blackoutRanges;
  if (windows) out.windows = windows;
  if (daily !== undefined) out.daily_capacity = daily;
  return out;
}

/** Normalize pickup/delivery hours from merchant form. */
export function normalizeHoursConfig(
  hours: FulfilmentHoursConfig | undefined,
): FulfilmentHoursConfig | undefined {
  if (!hours?.enabled) return undefined;
  const byWd = new Map<number, FulfilmentHoursDay>();
  for (const day of hours.days ?? []) {
    if (!Number.isInteger(day.weekday) || day.weekday < 0 || day.weekday > 6) {
      continue;
    }
    const ranges = (day.ranges ?? []).filter(isValidHourRange);
    // Deduplicate identical ranges
    const seen = new Set<string>();
    const unique = ranges.filter((r) => {
      const k = `${r.start}-${r.end}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    byWd.set(day.weekday, {
      weekday: day.weekday,
      enabled: Boolean(day.enabled) && unique.length > 0,
      ranges:
        unique.length > 0 ? unique : [{ start: "09:00", end: "17:00" }],
    });
  }
  const days = [1, 2, 3, 4, 5, 6, 0].map(
    (weekday) =>
      byWd.get(weekday) ?? {
        weekday,
        enabled: false,
        ranges: [{ start: "09:00", end: "17:00" }],
      },
  );
  // Hours with zero open days → treat as off (don't brick checkout).
  if (!days.some((d) => d.enabled && d.ranges.some(isValidHourRange))) {
    return undefined;
  }
  return { enabled: true, days };
}

/**
 * Coerce a fulfilment blob into a safe persisted shape.
 * Drops hours when calendar/method off or empty; clears legacy windows only if hours survive.
 */
export function sanitizeFulfillmentConfig(
  config: FulfillmentConfig,
): FulfillmentConfig {
  const out: FulfillmentConfig = {};

  if (config.pickup?.enabled) {
    const notesEnabled =
      config.pickup.notes_enabled ??
      Boolean(config.pickup.instructions?.trim());
    out.pickup = {
      enabled: true,
      instructions: notesEnabled
        ? (config.pickup.instructions?.trim() ?? "")
        : "",
      location: config.pickup.location?.trim() || undefined,
      notes_enabled: notesEnabled,
    };
  }

  // Prefer delivery_methods; else legacy delivery; mirror first method onto delivery.
  const fromPayload = normalizeDeliveryMethods(config.delivery_methods);
  const methods =
    fromPayload ??
    (config.delivery?.enabled
      ? resolveDeliveryMethods({ delivery: config.delivery })
      : undefined);
  if (methods && methods.length > 0) {
    out.delivery_methods = methods;
    out.delivery = mirrorDeliveryFromMethods(methods);
    const freeAbove = normalizeFreeDeliveryAboveCents(
      config.delivery_free_above_cents,
    );
    if (freeAbove !== null) out.delivery_free_above_cents = freeAbove;
  }

  const calendarOn = Boolean(config.calendar?.enabled);
  const pickupHours =
    calendarOn && out.pickup?.enabled
      ? normalizeHoursConfig(config.pickup_hours)
      : undefined;
  const deliveryHours =
    calendarOn && out.delivery?.enabled
      ? normalizeHoursConfig(config.delivery_hours)
      : undefined;

  const calendar = normalizeCalendarConfig(config.calendar, {
    clearWindows: Boolean(pickupHours || deliveryHours),
  });
  if (calendar) out.calendar = calendar;
  if (pickupHours) out.pickup_hours = pickupHours;
  if (deliveryHours) out.delivery_hours = deliveryHours;
  if (config.campaign) out.campaign = config.campaign;
  return out;
}

/** Caps to pass into hold RPC (null = unlimited / skip that bucket). */
export function capacityHoldCaps(
  fulfillment: FulfillmentConfig,
  windowId: string | null,
): { dailyCap: number | null; windowCap: number | null } {
  const dailyCap = resolveDailyCapacity(fulfillment);
  let windowCap: number | null = null;
  if (windowId) {
    const w = windowById(fulfillment, windowId);
    if (
      w &&
      typeof w.capacity === "number" &&
      Number.isInteger(w.capacity) &&
      w.capacity > 0
    ) {
      windowCap = w.capacity;
    }
  }
  return { dailyCap, windowCap };
}

/** True when any capacity limit is configured. */
export function hasCapacityLimits(fulfillment: FulfillmentConfig): boolean {
  if (resolveDailyCapacity(fulfillment) !== null) return true;
  return resolveWindows(fulfillment).some(
    (w) =>
      typeof w.capacity === "number" &&
      Number.isInteger(w.capacity) &&
      w.capacity > 0,
  );
}
