import type {
  FulfilmentCalendarConfig,
  FulfilmentWindow,
  FulfillmentConfig,
} from "@/lib/stores/types";

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
export function resolveAllowedWeekdays(fulfillment: FulfillmentConfig): number[] {
  if (fulfillment.calendar?.enabled) {
    const raw = fulfillment.calendar.allowed_weekdays ?? [];
    const cleaned = [
      ...new Set(
        raw.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6),
      ),
    ].sort((a, b) => a - b);
    return cleaned;
  }
  // Lead-time forced, calendar off → any weekday
  return [...ALL_WEEKDAYS];
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

export function resolveBlackouts(
  fulfillment: FulfillmentConfig,
): Set<string> {
  const raw = fulfillment.calendar?.blackouts ?? [];
  return new Set(raw.filter(isValidYmd));
}

/** Windows configured on the calendar (may be empty = date-only). */
export function resolveWindows(
  fulfillment: FulfillmentConfig,
): FulfilmentWindow[] {
  const raw = fulfillment.calendar?.windows ?? [];
  return raw.filter(
    (w) =>
      typeof w?.id === "string" &&
      w.id.trim() &&
      typeof w?.label === "string" &&
      w.label.trim(),
  );
}

export function windowById(
  fulfillment: FulfillmentConfig,
  windowId: string,
): FulfilmentWindow | undefined {
  return resolveWindows(fulfillment).find((w) => w.id === windowId);
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
): FulfilmentWindow[] {
  const windows = resolveWindows(fulfillment);
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
  const windows = resolveWindows(input.fulfillment);

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
      if (windows.length > 0) {
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

  const weekdays = resolveAllowedWeekdays(input.fulfillment);
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
    if (windows.length > 0) {
      if (availableWindowsForDate(ymd, input.fulfillment, usage).length === 0) {
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
): FulfillmentConfig["calendar"] | undefined {
  if (!calendar?.enabled) return undefined;
  const weekdays = [
    ...new Set(
      (calendar.allowed_weekdays ?? [...DEFAULT_ALLOWED_WEEKDAYS]).filter(
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
  const windows = normalizeWindows(calendar.windows);
  const daily =
    typeof calendar.daily_capacity === "number" &&
    Number.isInteger(calendar.daily_capacity) &&
    calendar.daily_capacity > 0
      ? calendar.daily_capacity
      : undefined;

  const out: FulfilmentCalendarConfig = {
    enabled: true,
    allowed_weekdays:
      weekdays.length > 0 ? weekdays : [...DEFAULT_ALLOWED_WEEKDAYS],
    horizon_days: horizon,
  };
  if (blackouts) out.blackouts = blackouts;
  if (windows) out.windows = windows;
  if (daily !== undefined) out.daily_capacity = daily;
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
