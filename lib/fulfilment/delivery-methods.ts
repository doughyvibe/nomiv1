import type {
  DeliveryMethodConfig,
  FulfillmentConfig,
} from "@/lib/stores/types";
import { MAX_DELIVERY_METHODS } from "@/lib/stores/types";

export function newDeliveryMethodId(): string {
  return `d_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Buyer-facing delivery options. Legacy `delivery.enabled` → one synthetic method.
 */
export function resolveDeliveryMethods(
  fulfillment: FulfillmentConfig,
): DeliveryMethodConfig[] {
  const raw = fulfillment.delivery_methods;
  if (Array.isArray(raw) && raw.length > 0) {
    return normalizeDeliveryMethods(raw) ?? [];
  }
  if (fulfillment.delivery?.enabled) {
    const notesEnabled =
      fulfillment.delivery.notes_enabled ??
      Boolean(fulfillment.delivery.instructions?.trim());
    return [
      {
        id: "default",
        name: "Delivery",
        fee_cents: Math.max(0, Math.round(fulfillment.delivery.fee_cents || 0)),
        notes_enabled: notesEnabled,
        instructions: notesEnabled
          ? (fulfillment.delivery.instructions?.trim() ?? "")
          : "",
      },
    ];
  }
  return [];
}

/** Cap at 3; drop empty names; stable ids. */
export function normalizeDeliveryMethods(
  methods: DeliveryMethodConfig[] | undefined,
): DeliveryMethodConfig[] | undefined {
  if (!methods || methods.length === 0) return undefined;
  const out: DeliveryMethodConfig[] = [];
  const seen = new Set<string>();
  for (const m of methods) {
    if (out.length >= MAX_DELIVERY_METHODS) break;
    const name = typeof m.name === "string" ? m.name.trim() : "";
    if (!name) continue;
    let id = typeof m.id === "string" ? m.id.trim() : "";
    if (!id || seen.has(id)) id = newDeliveryMethodId();
    seen.add(id);
    const fee = Number(m.fee_cents);
    const feeCents =
      Number.isFinite(fee) && fee >= 0 ? Math.round(fee) : 0;
    const notesEnabled =
      m.notes_enabled ?? Boolean(m.instructions?.trim());
    out.push({
      id,
      name: name.slice(0, 60),
      fee_cents: feeCents,
      notes_enabled: notesEnabled,
      instructions: notesEnabled
        ? (m.instructions?.trim() ?? "").slice(0, 200)
        : "",
    });
  }
  return out.length > 0 ? out : undefined;
}

/** Mirror first method onto legacy `delivery` for Live Mode / old readers. */
export function mirrorDeliveryFromMethods(
  methods: DeliveryMethodConfig[],
): FulfillmentConfig["delivery"] {
  const first = methods[0];
  if (!first) return undefined;
  return {
    enabled: true,
    fee_cents: first.fee_cents,
    instructions: first.instructions ?? "",
    notes_enabled: first.notes_enabled,
  };
}

export function deliveryMethodById(
  fulfillment: FulfillmentConfig,
  id: string,
): DeliveryMethodConfig | undefined {
  return resolveDeliveryMethods(fulfillment).find((m) => m.id === id);
}

/** Positive cents threshold, or null when rule is off. */
export function normalizeFreeDeliveryAboveCents(
  raw: number | null | undefined,
): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  const n = Math.round(raw);
  return n > 0 ? n : null;
}

export type ResolveDeliveryFeeInput = {
  fulfillment: FulfillmentConfig;
  deliveryMethodId: string | null | undefined;
  subtotalCents: number;
};

export type ResolveDeliveryFeeResult = {
  feeCents: number;
  waived: boolean;
  thresholdCents: number | null;
};

/**
 * Delivery fee after store-wide free-above-threshold rule.
 * Subtotal = line items only (before delivery).
 */
export function resolveDeliveryFeeCents(
  input: ResolveDeliveryFeeInput,
): ResolveDeliveryFeeResult {
  const thresholdCents = normalizeFreeDeliveryAboveCents(
    input.fulfillment.delivery_free_above_cents,
  );
  const id = input.deliveryMethodId?.trim() || "";
  const method = id
    ? deliveryMethodById(input.fulfillment, id)
    : undefined;
  if (!method) {
    return { feeCents: 0, waived: false, thresholdCents };
  }
  const subtotal = Math.max(0, Math.round(input.subtotalCents) || 0);
  if (thresholdCents !== null && subtotal >= thresholdCents) {
    return { feeCents: 0, waived: true, thresholdCents };
  }
  return {
    feeCents: method.fee_cents,
    waived: false,
    thresholdCents,
  };
}

/** Cents still needed to hit free delivery; null if N/A or already waived. */
export function centsUntilFreeDelivery(
  input: ResolveDeliveryFeeInput,
): number | null {
  const { waived, thresholdCents } = resolveDeliveryFeeCents(input);
  if (waived || thresholdCents === null) return null;
  const subtotal = Math.max(0, Math.round(input.subtotalCents) || 0);
  const remaining = thresholdCents - subtotal;
  return remaining > 0 ? remaining : null;
}
