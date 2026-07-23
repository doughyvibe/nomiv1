import type { CustomisationSnapshotEntry } from "@/lib/products/customisations";

export type OrderStatus =
  | "payment_pending"
  | "seller_verification_requested"
  | "seller_confirmed_paid"
  | "expired"
  | "cancelled"
  | "completed";

export type OrderRow = {
  id: string;
  store_id: string;
  reference: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  fulfillment_method: "pickup" | "delivery";
  /** Buyer-chosen handoff date (YYYY-MM-DD), Phase 6. Null when not collected. */
  fulfillment_date?: string | null;
  /** Window id snapshot (Phase 7). Null when date-only. */
  fulfillment_window_id?: string | null;
  /** Window label snapshot (Phase 7). */
  fulfillment_window_label?: string | null;
  /** Named delivery option id (when method=delivery). */
  delivery_method_id?: string | null;
  /** Named delivery option label snapshot. */
  delivery_method_label?: string | null;
  delivery_address: string | null;
  order_notes: string | null;
  subtotal_cents: number;
  fulfillment_fee_cents: number;
  total_cents: number;
  payment_expires_at: string;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_name: string;
  price_cents: number;
  quantity: number;
  created_at: string;
  product_id?: string | null;
  variant_id?: string | null;
  variant_label?: string | null;
  /** Snapshotted customisation answers (Phase 3). */
  customisations_snapshot?: CustomisationSnapshotEntry[] | null;
};
