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
};
