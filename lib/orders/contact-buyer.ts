import type { OrderRow } from "./types";
import { formatFulfilmentDateLabel } from "@/lib/fulfilment/dates";

/** Digits-only international format for wa.me (e.g. 6591234567). */
export function whatsAppPhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("65") && digits.length === 10) return digits;
  if (digits.length === 8) return `65${digits}`;
  return digits;
}

export function whatsAppBuyerUrl(phone: string): string {
  return `https://wa.me/${whatsAppPhoneDigits(phone)}`;
}

export function mailtoBuyerUrl(
  email: string,
  opts?: { subject?: string; body?: string },
): string {
  const params = new URLSearchParams();
  if (opts?.subject) params.set("subject", opts.subject);
  if (opts?.body) params.set("body", opts.body);
  const qs = params.toString();
  return qs ? `mailto:${email}?${qs}` : `mailto:${email}`;
}

export function formatBuyerDetailsCopy(
  order: Pick<OrderRow, "customer_name" | "customer_phone" | "customer_email">,
): string {
  return [
    `Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Email: ${order.customer_email}`,
  ].join("\n");
}

export function formatFulfillmentSummary(
  order: Pick<
    OrderRow,
    | "fulfillment_method"
    | "delivery_address"
    | "fulfillment_fee_cents"
    | "delivery_method_label"
  >,
): string {
  if (order.fulfillment_method === "pickup") return "Pickup";
  const label = order.delivery_method_label?.trim() || "Delivery";
  const fee =
    order.fulfillment_fee_cents > 0
      ? ` (fee $${(order.fulfillment_fee_cents / 100).toFixed(2)})`
      : " (free)";
  const addr = order.delivery_address?.trim();
  return addr ? `${label}${fee}: ${addr}` : `${label}${fee}`;
}

/** Method + optional handoff date/window for WhatsApp / email copy. */
export function formatFulfillmentWithDate(
  order: Pick<
    OrderRow,
    | "fulfillment_method"
    | "delivery_address"
    | "fulfillment_fee_cents"
    | "delivery_method_label"
    | "fulfillment_date"
    | "fulfillment_window_label"
  >,
): string {
  const base = formatFulfillmentSummary(order);
  if (!order.fulfillment_date?.trim()) return base;
  const dateLine = `Date: ${formatFulfilmentDateLabel(order.fulfillment_date.trim())}`;
  const window = order.fulfillment_window_label?.trim();
  return window
    ? `${base}\n${dateLine}\nWindow: ${window}`
    : `${base}\n${dateLine}`;
}
