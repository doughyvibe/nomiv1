import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfirmationBuyerActions } from "@/components/dashboard/confirmation-buyer-actions";
import { ContactBuyerActions } from "@/components/dashboard/contact-buyer-actions";
import { OrderStatusActions } from "@/components/dashboard/order-status-actions";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { formatPrice } from "@/lib/money";
import { formatFulfillmentSummary } from "@/lib/orders/contact-buyer";
import { loadSellerOrderByReference } from "@/lib/orders/load-seller-orders";
import {
  displayOrderStatus,
  isPaymentWindowExpired,
} from "@/lib/orders/status";
import { isPaymentVerified } from "@/lib/orders/status-transitions";
import { requireSellerStore } from "@/lib/stores/require-seller";

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const { supabase, store } = await requireSellerStore();
  const data = await loadSellerOrderByReference(supabase, store.id, reference);

  if (!data) notFound();

  const { order, items } = data;
  const status = displayOrderStatus(order);

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <div>
        <Link
          href="/orders"
          className="text-primary text-sm font-medium hover:underline"
        >
          ← Back to orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="break-all text-xl font-semibold">{order.reference}</h1>
          <OrderStatusBadge status={status} />
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Placed {formatOrderDate(order.created_at)}
        </p>
      </div>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Customer</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-right font-medium">{order.customer_name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="text-right">{order.customer_phone}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-right break-all">{order.customer_email}</dd>
          </div>
        </dl>
        <div className="mt-4 border-t pt-4">
          <ContactBuyerActions order={order} />
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Items</h2>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span className="shrink-0 font-medium">
                {formatPrice(item.price_cents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(order.subtotal_cents)}</dd>
          </div>
          {order.fulfillment_fee_cents > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery fee</dt>
              <dd>{formatPrice(order.fulfillment_fee_cents)}</dd>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total_cents)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium">Fulfillment</h2>
        <p className="mt-2 text-sm capitalize">{order.fulfillment_method}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {formatFulfillmentSummary(order)}
        </p>
        {order.order_notes?.trim() && (
          <div className="mt-4 border-t pt-3">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Order notes
            </p>
            <p className="mt-1 text-sm">{order.order_notes}</p>
          </div>
        )}
      </section>

      {order.status === "payment_pending" && !isPaymentWindowExpired(order) && (
        <p className="text-muted-foreground text-xs">
          Payment window expires{" "}
          {new Date(order.payment_expires_at).toLocaleString("en-SG")}
        </p>
      )}

      <OrderStatusActions reference={order.reference} status={order.status} />

      {isPaymentVerified(order.status) && (
        <ConfirmationBuyerActions
          storeName={store.name}
          order={order}
          items={items}
          customerPhone={order.customer_phone}
          customerEmail={order.customer_email}
        />
      )}
    </main>
  );
}
