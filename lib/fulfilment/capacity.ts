import type { SupabaseClient } from "@supabase/supabase-js";

import type { CapacityUsage } from "@/lib/fulfilment/dates";
import { EMPTY_CAPACITY_USAGE } from "@/lib/fulfilment/dates";

type HoldRow = {
  fulfillment_date: string;
  window_id: string;
  held_count: number;
};

/**
 * Load soft-hold counters for capacity gating at checkout.
 * Daily bucket uses window_id = ''; per-window rows use the window id.
 */
export async function loadCapacityUsage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  storeId: string,
  fromDate: string,
): Promise<CapacityUsage> {
  const { data, error } = await supabase
    .from("fulfillment_capacity_holds")
    .select("fulfillment_date, window_id, held_count")
    .eq("store_id", storeId)
    .gte("fulfillment_date", fromDate);

  if (error || !data) return { ...EMPTY_CAPACITY_USAGE };

  const byDate: Record<string, number> = {};
  const byDateWindow: Record<string, Record<string, number>> = {};

  for (const row of data as HoldRow[]) {
    const ymd = row.fulfillment_date;
    const count = row.held_count ?? 0;
    if (row.window_id === "") {
      byDate[ymd] = count;
    } else {
      if (!byDateWindow[ymd]) byDateWindow[ymd] = {};
      byDateWindow[ymd][row.window_id] = count;
    }
  }

  return { byDate, byDateWindow };
}

export type HoldCapacityResult =
  | { ok: true; heldDaily: boolean; heldWindow: boolean }
  | { ok: false; error: string };

/**
 * Atomic soft-hold via DB RPC. No-op (ok) when both caps are null.
 */
export async function holdFulfilmentCapacity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: SupabaseClient<any>,
  args: {
    storeId: string;
    date: string;
    windowId: string | null;
    dailyCap: number | null;
    windowCap: number | null;
  },
): Promise<HoldCapacityResult> {
  if (args.dailyCap === null && args.windowCap === null) {
    return { ok: true, heldDaily: false, heldWindow: false };
  }

  const { data, error } = await admin.rpc("hold_fulfillment_capacity", {
    p_store_id: args.storeId,
    p_date: args.date,
    p_window_id: args.windowId ?? "",
    p_daily_cap: args.dailyCap,
    p_window_cap: args.windowCap,
  });

  if (error) {
    return { ok: false, error: "Could not reserve this date. Please try again." };
  }

  const row = data as {
    ok?: boolean;
    held_daily?: boolean;
    held_window?: boolean;
    error?: string;
  } | null;

  if (!row?.ok) {
    return {
      ok: false,
      error:
        row?.error === "capacity_full"
          ? "That date is fully booked — choose another"
          : "That date is fully booked — choose another",
    };
  }

  return {
    ok: true,
    heldDaily: Boolean(row.held_daily),
    heldWindow: Boolean(row.held_window),
  };
}

/** Release soft-hold after failed insert or via cancel path. */
export async function releaseFulfilmentCapacitySlot(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: SupabaseClient<any>,
  args: {
    storeId: string;
    date: string;
    windowId: string | null;
    heldDaily: boolean;
    heldWindow: boolean;
  },
): Promise<void> {
  if (!args.heldDaily && !args.heldWindow) return;
  await admin.rpc("release_fulfillment_capacity_slot", {
    p_store_id: args.storeId,
    p_date: args.date,
    p_window_id: args.windowId ?? "",
    p_held_daily: args.heldDaily,
    p_held_window: args.heldWindow,
  });
}
