"use server";

import { revalidatePath } from "next/cache";

import { isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { generateOrderReference } from "@/lib/orders/reference";
import { sendVerificationRequestPush } from "@/lib/push/send-verification-alert";
import {
  buildCustomisationSnapshot,
  totalCustomisationFeesCents,
  type CustomisationAnswers,
  type CustomisationSnapshotEntry,
} from "@/lib/products/customisations";
import { assertCartStock } from "@/lib/products/inventory";
import {
  productHasChoices,
  variantUnitPrice,
} from "@/lib/products/variants";
import {
  campaignCheckoutEmptyMessage,
  fulfillmentWithCampaign,
} from "@/lib/fulfilment/campaigns";
import {
  holdFulfilmentCapacity,
  loadCapacityUsage,
  releaseFulfilmentCapacitySlot,
} from "@/lib/fulfilment/capacity";
import {
  allowedFulfilmentDates,
  availableWindowsForDate,
  capacityHoldCaps,
  fulfilmentDateRequired,
  hasCapacityLimits,
  isAllowedFulfilmentDate,
  maxCartLeadDays,
  resolveWindows,
  todaySgYmd,
  windowById,
} from "@/lib/fulfilment/dates";
import { getCheckoutStorefront } from "@/lib/stores/load-storefront";
import type { FulfillmentConfig } from "@/lib/stores/types";
import { paynowIsComplete } from "@/lib/stores/types";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isValidCustomerPhone,
  isValidEmail,
} from "@/lib/validation/customer";

const PAYMENT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LINE_QTY = 99;

type CartLinePayload = {
  productId: string;
  quantity: number;
  variantId?: string | null;
  customisations?: CustomisationAnswers;
  lineKey?: string;
};

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

  let cartLines: CartLinePayload[];
  try {
    cartLines = JSON.parse(String(formData.get("cart") ?? "[]")) as CartLinePayload[];
  } catch {
    return { error: "Invalid cart data" };
  }

  if (!Array.isArray(cartLines) || cartLines.length === 0) {
    return { error: "Your cart is empty" };
  }

  const storefront = await getCheckoutStorefront(slug);
  if (!storefront) return { error: "Store not found" };

  const { store, products } = storefront;
  if (!paynowIsComplete(store.paynow)) {
    return {
      error:
        "This store isn't ready to take PayNow payments yet. Please contact the seller.",
    };
  }
  const fulfillment = fulfillmentWithCampaign(
    store.fulfillment as FulfillmentConfig,
  );

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
    product_id: string;
    product_name: string;
    price_cents: number;
    quantity: number;
    variant_id: string | null;
    variant_label: string | null;
    customisations_snapshot: CustomisationSnapshotEntry[] | null;
  }[] = [];

  for (const line of cartLines) {
    if (!line.productId || typeof line.quantity !== "number") {
      return { error: "Invalid cart data" };
    }
    if (line.quantity < 1 || line.quantity > MAX_LINE_QTY) {
      return { error: "Invalid quantity in cart" };
    }
    const product = productMap.get(line.productId);
    if (!product) {
      return { error: "A product in your cart is no longer available" };
    }

    const defs = product.customisations ?? [];
    const snapResult = buildCustomisationSnapshot(defs, line.customisations);
    if ("error" in snapResult) {
      return { error: snapResult.error };
    }
    const addOnFees = totalCustomisationFeesCents(defs, line.customisations);
    const snapshot =
      snapResult.entries.length > 0 ? snapResult.entries : null;

    if (productHasChoices(product)) {
      const variantId = line.variantId ?? null;
      if (!variantId) {
        return { error: "Choose options for each product before checkout" };
      }
      const variant = (product.variants ?? []).find((v) => v.id === variantId);
      if (!variant) {
        return { error: "A chosen option is no longer available — update your cart" };
      }
      const unit = variantUnitPrice(product.price_cents, variant) + addOnFees;
      subtotalCents += unit * line.quantity;
      lineItems.push({
        product_id: product.id,
        product_name: product.name,
        price_cents: unit,
        quantity: line.quantity,
        variant_id: variant.id,
        variant_label: variant.label,
        customisations_snapshot: snapshot,
      });
    } else {
      const unit = product.price_cents + addOnFees;
      subtotalCents += unit * line.quantity;
      lineItems.push({
        product_id: product.id,
        product_name: product.name,
        price_cents: unit,
        quantity: line.quantity,
        variant_id: null,
        variant_label: null,
        customisations_snapshot: snapshot,
      });
    }
  }

  if (lineItems.length === 0) return { error: "Your cart is empty" };

  const stockError = assertCartStock(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      track_inventory: p.track_inventory,
      stock_qty: p.stock_qty,
      sold_out_policy: p.sold_out_policy,
      variants: p.variants,
    })),
    cartLines.map((l) => ({
      productId: l.productId,
      quantity: l.quantity,
      variantId: l.variantId,
    })),
  );
  if (stockError) return { error: stockError };

  const maxLead = maxCartLeadDays(
    lineItems.map((item) => {
      const product = productMap.get(item.product_id);
      return { lead_time_days: product?.lead_time_days ?? 0 };
    }),
  );
  const needsDate = fulfilmentDateRequired(fulfillment, maxLead);
  const fulfillmentDateRaw = String(formData.get("fulfillment_date") ?? "").trim();
  const fulfillmentWindowRaw = String(
    formData.get("fulfillment_window_id") ?? "",
  ).trim();
  let fulfillmentDate: string | null = null;
  let fulfillmentWindowId: string | null = null;
  let fulfillmentWindowLabel: string | null = null;

  const admin = createAdminClient();
  let usage = undefined;
  if (needsDate && hasCapacityLimits(fulfillment)) {
    usage = await loadCapacityUsage(admin, store.id, todaySgYmd());
  }

  if (needsDate) {
    const allowed = allowedFulfilmentDates({
      cartLeadDays: lineItems.map((item) => {
        const product = productMap.get(item.product_id);
        return product?.lead_time_days ?? 0;
      }),
      fulfillment,
      usage,
    });
    if (allowed.length === 0) {
      const liveMsg = campaignCheckoutEmptyMessage(
        lineItems.map((item) => {
          const product = productMap.get(item.product_id);
          return {
            name: product?.name ?? item.product_name,
            lead_time_days: product?.lead_time_days ?? 0,
          };
        }),
        store.fulfillment as FulfillmentConfig,
      );
      return {
        error:
          liveMsg ??
          "No available dates right now — this week may be fully booked. Please contact the seller.",
      };
    }
    if (!fulfillmentDateRaw) {
      return { error: "Select a fulfillment date" };
    }
    if (!isAllowedFulfilmentDate(fulfillmentDateRaw, allowed)) {
      return { error: "That date is not available — choose another" };
    }
    fulfillmentDate = fulfillmentDateRaw;

    const windows = resolveWindows(fulfillment);
    if (windows.length > 0) {
      const open = availableWindowsForDate(
        fulfillmentDate,
        fulfillment,
        usage,
      );
      if (open.length === 0) {
        return {
          error: "All time windows for this date are full. Pick another date.",
        };
      }
      if (windows.length === 1) {
        fulfillmentWindowId = open[0]?.id ?? windows[0]!.id;
      } else {
        if (!fulfillmentWindowRaw) {
          return { error: "Select a time window" };
        }
        if (!open.some((w) => w.id === fulfillmentWindowRaw)) {
          return {
            error: "That time window is not available — choose another",
          };
        }
        fulfillmentWindowId = fulfillmentWindowRaw;
      }
      const win = windowById(fulfillment, fulfillmentWindowId!);
      fulfillmentWindowLabel = win?.label ?? null;
    }
  }

  const fulfillmentFeeCents =
    method === "delivery" ? (fulfillment.delivery?.fee_cents ?? 0) : 0;
  const totalCents = subtotalCents + fulfillmentFeeCents;

  const { dailyCap, windowCap } = capacityHoldCaps(
    fulfillment,
    fulfillmentWindowId,
  );
  let heldDaily = false;
  let heldWindow = false;
  if (fulfillmentDate && (dailyCap !== null || windowCap !== null)) {
    const hold = await holdFulfilmentCapacity(admin, {
      storeId: store.id,
      date: fulfillmentDate,
      windowId: fulfillmentWindowId,
      dailyCap,
      windowCap,
    });
    if (!hold.ok) return { error: hold.error };
    heldDaily = hold.heldDaily;
    heldWindow = hold.heldWindow;
  }

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
      fulfillment_date: fulfillmentDate,
      fulfillment_window_id: fulfillmentWindowId,
      fulfillment_window_label: fulfillmentWindowLabel,
      capacity_held_daily: heldDaily,
      capacity_held_window: heldWindow,
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
    if (fulfillmentDate && (heldDaily || heldWindow)) {
      await releaseFulfilmentCapacitySlot(admin, {
        storeId: store.id,
        date: fulfillmentDate,
        windowId: fulfillmentWindowId,
        heldDaily,
        heldWindow,
      });
    }
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
    if (fulfillmentDate && (heldDaily || heldWindow)) {
      await releaseFulfilmentCapacitySlot(admin, {
        storeId: store.id,
        date: fulfillmentDate,
        windowId: fulfillmentWindowId,
        heldDaily,
        heldWindow,
      });
    }
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
