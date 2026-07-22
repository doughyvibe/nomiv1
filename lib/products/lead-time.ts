import type { LeadTimeDays } from "@/lib/products/contracts";

/** Parse / normalize lead_time_days. Returns null if invalid. */
export function parseLeadTimeDays(value: unknown): LeadTimeDays | null {
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value < 0) return null;
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number.parseInt(value, 10);
    if (!Number.isInteger(n) || n < 0 || String(n) !== value.trim()) return null;
    return n;
  }
  return null;
}

/** Buyer-facing prep promise when days > 0; null when no prep needed. */
export function formatPrepCopy(leadTimeDays: number): string | null {
  if (!Number.isInteger(leadTimeDays) || leadTimeDays <= 0) return null;
  const unit = leadTimeDays === 1 ? "day" : "days";
  return `Needs ${leadTimeDays} ${unit} to prepare`;
}
