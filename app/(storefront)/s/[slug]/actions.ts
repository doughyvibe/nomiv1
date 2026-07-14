"use server";

import { revalidatePath } from "next/cache";

import { isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { generateOrderReference } from "@/lib/orders/reference";
import { sendVerificationRequestPush } from "@/lib/push/send-verification-alert";
import { getPublishedStorefront } from "@/lib/stores/load-storefront";
import type { FulfillmentConfig } from "@/lib/stores/types";
import { paynowIsComplete } from "@/lib/stores/types";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isValidCustomerPhone,
  isValidEmail,
} from "@/lib/validation/customer";

const PAYMENT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LINE_QTY = 99;

type CartLine = { productId: string; quantity: number };

function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("65") ? digits.slice(2) : digits;
  return `+65${local}`;
}

async function uniqueReference(admin: ReturnType<typeof createAdminClient>) {
  for (let i = 0; i < 8; i++) {
    const reference = generateOrderReference();
    const { data } = await admin
      .from("orders")
      .select("id")
      .eq("reference", reference)
      .maybeSingle();
    if (!data) return reference;
  }
  throw new Error("Could not generate order reference");
}

export type CheckoutResult = { error: string } | { redirectTo: string };

export async function createOrderAction(
  slug: string,
  formData: FormData,
): Promise<CheckoutResult> {
  if (await isRateLimited(`order:${slug}`, 10, 60_000)) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  let cartLines: CartLine[];
  try {
    cartLines = JSON.parse(String(formData.get("cart") ?? "[]")) as CartLine[];
  } catch {
    return { error: "Invalid cart data" };
  }

  if (!Array.isArray(cartLines) || cartLines.length === 0) {
    return { error: "Your cart is empty" };
  }

  const storefront = await getPublishedStorefront(slug);
  if (!storefront) return { error: "Store not found" };

  const { store, products } = storefront;
  if (!paynowIsComplete(store.paynow)) {
    return {
      error:
        "This store isn't ready to take PayNow payments yet. Please contact the seller.",
    };
  }
  const fulfillment = store.fulfillment as FulfillmentConfig;

  const method = String(formData.get("fulfillment_method") ?? "");
  if (method !== "pickup" && method !== "delivery") {
    return { error: "Select a fulfillment method" };
  }
  if (method === "pickup" && !fulfillment.pickup?.enabled) {
    return { error: "Pickup is not available" };
  }
  if (method === "delivery" && !fulfillment.delivery?.enabled) {
    return { error: "Delivery is not available" };
  }

  const customerName = String(formData.get("customer_name") ?? "").trim();
  const customerPhone = String(formData.get("customer_phone") ?? "").trim();
  const customerEmail = String(formData.get("customer_email") ?? "").trim();
  const deliveryAddress = String(formData.get("delivery_address") ?? "").trim();
  const orderNotes = String(formData.get("order_notes") ?? "").trim();

  if (!customerName) return { error: "Name is required" };
  if (!isValidCustomerPhone(customerPhone)) {
    return { error: "Enter a valid Singapore mobile (8 digits starting with 8 or 9)" };
  }
  if (!isValidEmail(customerEmail)) return { error: "Enter a valid email" };
  if (method === "delivery" && !deliveryAddress) {
    return { error: "Delivery address is required" };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let subtotalCents = 0;
  const lineItems: {
    product_name: string;
    price_cents: number;
    quantity: number;
  }[] = [];

  for (const line of cartLines) {
    if (!line.productId || typeof line.quantity !== "number") {
      return { error: "Invalid cart data" };
    }
    if (line.quantity < 1 || line.quantity > MAX_LINE_QTY) {
      return { error: "Invalid quantity in cart" };
    }
    const product = productMap.get(line.productId);
    if (!product) return { error: "A product in your cart is no longer available" };
    subtotalCents += product.price_cents * line.quantity;
    lineItems.push({
      product_name: product.name,
      price_cents: product.price_cents,
      quantity: line.quantity,
    });
  }

  if (lineItems.length === 0) return { error: "Your cart is empty" };

  const fulfillmentFeeCents =
    method === "delivery" ? (fulfillment.delivery?.fee_cents ?? 0) : 0;
  const totalCents = subtotalCents + fulfillmentFeeCents;

  const admin = createAdminClient();
  const reference = await uniqueReference(admin);
  const paymentExpiresAt = new Date(Date.now() + PAYMENT_WINDOW_MS).toISOString();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      store_id: store.id,
      reference,
      status: "payment_pending",
      customer_name: customerName,
      customer_phone: normalizePhone(customerPhone),
      customer_email: customerEmail,
      fulfillment_method: method,
      delivery_address: method === "delivery" ? deliveryAddress : null,
      order_notes: orderNotes || null,
      subtotal_cents: subtotalCents,
      fulfillment_fee_cents: fulfillmentFeeCents,
      total_cents: totalCents,
      payment_expires_at: paymentExpiresAt,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "Could not create order. Please try again." };
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    lineItems.map((item) => ({
      order_id: order.id,
      ...item,
    })),
  );

  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    return { error: "Could not create order. Please try again." };
  }

  revalidatePath(`/s/${slug}/order/${reference}`);
  return { redirectTo: `/order/${reference}` };
}

export type NotifyResult = { error: string } | { success: true };

export async function notifySellerAction(
  slug: string,
  reference: string,
): Promise<NotifyResult> {
  if (await isRateLimited(`notify:${reference}`, 5, 60_000)) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, store_id, status, payment_expires_at, reference, total_cents")
    .eq("reference", reference)
    .maybeSingle();

  if (!order) return { error: "Order not found" };

  const { data: store } = await admin
    .from("stores")
    .select("slug, owner_id")
    .eq("id", order.store_id)
    .single();

  if (!store || store.slug !== slug) return { error: "Order not found" };

  if (order.status === "seller_verification_requested") {
    return { success: true };
  }

  if (order.status !== "payment_pending") {
    return { error: "This order can no longer be updated" };
  }

  if (new Date(order.payment_expires_at) < new Date()) {
    return { error: "Payment window has expired" };
  }

  const { error } = await admin
    .from("orders")
    .update({ status: "seller_verification_requested" })
    .eq("id", order.id);

  if (error) return { error: "Could not notify seller. Please try again." };

  void sendVerificationRequestPush({
    ownerId: store.owner_id,
    reference: order.reference,
    totalCents: order.total_cents,
  });

  revalidatePath(`/s/${slug}/order/${reference}`);
  return { success: true };
}
