import { notFound } from "next/navigation";

import { ConfirmationBuyerActions } from "@/components/dashboard/confirmation-buyer-actions";
import { ContactBuyerActions } from "@/components/dashboard/contact-buyer-actions";
import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link";
import {
  DashboardPanel,
  DashboardPanelBody,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-ui";
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
import { formatCustomisationSnapshotLines } from "@/lib/products/customisations";
import { formatFulfilmentDateLabel } from "@/lib/fulfilment/dates";
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
    <div className="flex flex-col gap-8">
      <header>
        <DashboardBackLink href="/orders" label="Orders" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-display break-all text-[1.75rem] font-extrabold tracking-[-0.02em]">
            {order.reference}
          </h1>
          <OrderStatusBadge status={status} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Placed {formatOrderDate(order.created_at)}
        </p>
      </header>

      <DashboardPanel>
        <DashboardPanelHeader title="Customer" />
        <DashboardPanelBody>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="text-right font-semibold">{order.customer_name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-right">{order.customer_phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all text-right">{order.customer_email}</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-border pt-5">
            <ContactBuyerActions order={order} />
          </div>
        </DashboardPanelBody>
      </DashboardPanel>

      <DashboardPanel>
        <DashboardPanelHeader title="Items" />
        <DashboardPanelBody>
          <ul className="space-y-2.5">
            {items.map((item) => {
              const customLines = formatCustomisationSnapshotLines(
                item.customisations_snapshot,
              );
              return (
              <li key={item.id} className="flex justify-between gap-4 text-sm">
                <span className="min-w-0">
                  <span className="font-medium">
                    {item.product_name} × {item.quantity}
                  </span>
                  {item.variant_label?.trim() ? (
                    <span className="mt-0.5 block text-muted-foreground">
                      {item.variant_label}
                    </span>
                  ) : null}
                  {customLines.map((line) => (
                    <span
                      key={line}
                      className="mt-0.5 block text-muted-foreground"
                    >
                      {line}
                    </span>
                  ))}
                </span>
                <span className="shrink-0 font-semibold">
                  {formatPrice(item.price_cents * item.quantity)}
                </span>
              </li>
              );
            })}
          </ul>
          <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
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
            <div className="flex justify-between font-display text-base font-extrabold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total_cents)}</dd>
            </div>
          </dl>
        </DashboardPanelBody>
      </DashboardPanel>

      <DashboardPanel>
        <DashboardPanelHeader title="Fulfillment" />
        <DashboardPanelBody>
          <p className="text-sm font-semibold capitalize">
            {order.fulfillment_method}
          </p>
          {order.fulfillment_date ? (
            <p className="mt-1 text-sm font-medium">
              {formatFulfilmentDateLabel(order.fulfillment_date)}
              {order.fulfillment_window_label?.trim()
                ? ` · ${order.fulfillment_window_label.trim()}`
                : ""}
            </p>
          ) : null}
          <p className="text-muted-foreground mt-1 text-sm">
            {formatFulfillmentSummary(order)}
          </p>
          {order.order_notes?.trim() ? (
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Order notes
              </p>
              <p className="mt-1.5 text-sm">{order.order_notes}</p>
            </div>
          ) : null}
        </DashboardPanelBody>
      </DashboardPanel>

      {order.status === "payment_pending" && !isPaymentWindowExpired(order) ? (
        <p className="text-muted-foreground text-xs">
          Payment window expires{" "}
          {new Date(order.payment_expires_at).toLocaleString("en-SG")}
        </p>
      ) : null}

      <OrderStatusActions reference={order.reference} status={order.status} />

      {isPaymentVerified(order.status) ? (
        <ConfirmationBuyerActions
          storeName={store.name}
          order={order}
          items={items}
          customerPhone={order.customer_phone}
          customerEmail={order.customer_email}
        />
      ) : null}
    </div>
  );
}
