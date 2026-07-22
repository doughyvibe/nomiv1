import { formatPrice } from "@/lib/money";
import { formatCustomisationSnapshotLines } from "@/lib/products/customisations";

import { formatFulfillmentWithDate } from "./contact-buyer";
import type { OrderItemRow, OrderRow } from "./types";

export type ConfirmationMessageInput = {
  storeName: string;
  order: Pick<OrderRow, "customer_name" | "reference" | "total_cents"> &
    Pick<
      OrderRow,
      | "fulfillment_method"
      | "delivery_address"
      | "fulfillment_fee_cents"
      | "fulfillment_date"
      | "fulfillment_window_label"
    >;
  items: Pick<
    OrderItemRow,
    | "product_name"
    | "quantity"
    | "price_cents"
    | "variant_label"
    | "customisations_snapshot"
  >[];
};

function formatOrderItemsLines(
  items: ConfirmationMessageInput["items"],
): string {
  return items
    .map((i) => {
      const label =
        "variant_label" in i &&
        typeof i.variant_label === "string" &&
        i.variant_label.trim()
          ? ` (${i.variant_label.trim()})`
          : "";
      const customs = formatCustomisationSnapshotLines(
        i.customisations_snapshot,
      );
      const customsSuffix = customs.length
        ? `\n  ${customs.join("\n  ")}`
        : "";
      return `${i.product_name}${label} × ${i.quantity} — ${formatPrice(i.price_cents * i.quantity)}${customsSuffix}`;
    })
    .join("\n");
}

export function buildWhatsAppConfirmationMessage(
  input: ConfirmationMessageInput,
): string {
  const { order, storeName, items } = input;
  const fulfillment = formatFulfillmentWithDate(order);
  const total = formatPrice(order.total_cents);

  return [
    `Hi ${order.customer_name}, your order ${order.reference} from ${storeName} has been confirmed ✅`,
    "We've verified your payment and your order is now being prepared.",
    "",
    "Order summary:",
    formatOrderItemsLines(items),
    "",
    `Total paid: ${total}`,
    "",
    "Fulfillment:",
    fulfillment,
    "",
    "Thank you!",
  ].join("\n");
}

export function buildEmailConfirmation(
  input: ConfirmationMessageInput,
): { subject: string; body: string } {
  const { order, storeName, items } = input;
  const fulfillment = formatFulfillmentWithDate(order);
  const total = formatPrice(order.total_cents);

  return {
    subject: `Your order is confirmed — ${order.reference}`,
    body: [
      `Hi ${order.customer_name},`,
      "",
      `Your order ${order.reference} from ${storeName} has been confirmed.`,
      "We have verified your payment and your order is now being prepared.",
      "",
      "Order summary:",
      formatOrderItemsLines(items),
      "",
      "Total paid:",
      total,
      "",
      "Fulfillment:",
      fulfillment,
      "",
      `Thank you,`,
      storeName,
    ].join("\n"),
  };
}

export function buildConfirmationCopyText(
  input: ConfirmationMessageInput,
): string {
  return buildWhatsAppConfirmationMessage(input);
}

export function whatsAppConfirmationUrl(
  phone: string,
  message: string,
): string {
  const digits = phone.replace(/\D/g, "");
  const intl =
    digits.startsWith("65") && digits.length === 10
      ? digits
      : digits.length === 8
        ? `65${digits}`
        : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
