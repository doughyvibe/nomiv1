import type { OrderRow, OrderStatus } from "./types";

export type DisplayStatus = {
  key: OrderStatus | "expired_display";
  label: string;
  tone: "default" | "warning" | "success" | "muted" | "destructive";
};

export function isPaymentWindowExpired(order: Pick<OrderRow, "status" | "payment_expires_at">): boolean {
  return (
    order.status === "payment_pending" &&
    new Date(order.payment_expires_at) < new Date()
  );
}

/** Buyer-facing display status; expired is derived from payment_pending + past expiry. */
export function displayOrderStatus(
  order: Pick<OrderRow, "status" | "payment_expires_at">,
): DisplayStatus {
  if (isPaymentWindowExpired(order)) {
    return { key: "expired_display", label: "Expired", tone: "muted" };
  }

  const map: Record<OrderStatus, DisplayStatus> = {
    payment_pending: {
      key: "payment_pending",
      label: "Payment pending",
      tone: "warning",
    },
    seller_verification_requested: {
      key: "seller_verification_requested",
      label: "Awaiting verification",
      tone: "warning",
    },
    seller_confirmed_paid: {
      key: "seller_confirmed_paid",
      label: "Payment verified",
      tone: "success",
    },
    expired: { key: "expired", label: "Expired", tone: "muted" },
    cancelled: { key: "cancelled", label: "Cancelled", tone: "destructive" },
    completed: { key: "completed", label: "Completed", tone: "success" },
  };

  return map[order.status];
}

export const ORDER_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "seller_verification_requested", label: "Awaiting verification" },
  { value: "payment_pending", label: "Payment pending" },
  { value: "seller_confirmed_paid", label: "Payment verified" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export type BuyerOrderView =
  | "payment_pending"
  | "awaiting_verification"
  | "confirmed"
  | "cancelled"
  | "expired";

/** Which buyer-facing screen to render on `/order/[reference]`. */
export function buyerOrderView(
  order: Pick<OrderRow, "status" | "payment_expires_at">,
): BuyerOrderView {
  if (order.status === "cancelled") return "cancelled";
  if (
    order.status === "seller_confirmed_paid" ||
    order.status === "completed"
  ) {
    return "confirmed";
  }
  if (order.status === "seller_verification_requested") {
    return "awaiting_verification";
  }
  if (order.status === "expired" || isPaymentWindowExpired(order)) {
    return "expired";
  }
  return "payment_pending";
}
