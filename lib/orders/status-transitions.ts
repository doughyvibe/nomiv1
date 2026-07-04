import type { OrderStatus } from "./types";

export function canMarkPaymentVerified(status: OrderStatus): boolean {
  return (
    status === "payment_pending" || status === "seller_verification_requested"
  );
}

export function canMarkCompleted(status: OrderStatus): boolean {
  return status === "seller_confirmed_paid";
}

export function canMarkCancelled(status: OrderStatus): boolean {
  return (
    status === "payment_pending" ||
    status === "seller_verification_requested" ||
    status === "seller_confirmed_paid"
  );
}

export function isPaymentVerified(status: OrderStatus): boolean {
  return status === "seller_confirmed_paid" || status === "completed";
}
