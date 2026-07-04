import { formatPrice } from "@/lib/money";

import { formatFulfillmentSummary } from "./contact-buyer";
import type { OrderItemRow, OrderRow } from "./types";

export type ConfirmationMessageInput = {
  storeName: string;
  order: Pick<OrderRow, "customer_name" | "reference" | "total_cents"> &
    Pick<
      OrderRow,
      "fulfillment_method" | "delivery_address" | "fulfillment_fee_cents"
    >;
  items: Pick<OrderItemRow, "product_name" | "quantity" | "price_cents">[];
};

function formatOrderItemsLines(
  items: ConfirmationMessageInput["items"],
): string {
  return items
    .map(
      (i) =>
        `${i.product_name} × ${i.quantity} — ${formatPrice(i.price_cents * i.quantity)}`,
    )
    .join("\n");
}

export function buildWhatsAppConfirmationMessage(
  input: ConfirmationMessageInput,
): string {
  const { order, storeName, items } = input;
  const fulfillment = formatFulfillmentSummary(order);
  const total = formatPrice(order.total_cents).replace(/^S\$/, "");

  return [
    `Hi ${order.customer_name}, your order ${order.reference} from ${storeName} has been confirmed ✅`,
    "We've verified your payment and your order is now being prepared.",
    "",
    "Order summary:",
    formatOrderItemsLines(items),
    "",
    `Total paid: S$${total}`,
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
  const fulfillment = formatFulfillmentSummary(order);
  const total = formatPrice(order.total_cents).replace(/^S\$/, "");

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
      `S$${total}`,
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
