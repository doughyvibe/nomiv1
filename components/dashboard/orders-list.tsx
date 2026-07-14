import Link from "next/link";

import { CopyStoreLinkButton } from "@/components/dashboard/copy-store-link-button";
import {
  DashboardEmptyState,
  DashboardPanel,
} from "@/components/dashboard/dashboard-ui";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { OrdersStatusFilter } from "@/components/dashboard/orders-status-filter";
import { formatPrice } from "@/lib/money";
import { displayOrderStatus } from "@/lib/orders/status";
import type { OrderRow } from "@/lib/orders/types";

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleString("en-SG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersListView({
  orders,
  statusFilter,
  storeUrl,
}: {
  orders: OrderRow[];
  statusFilter: string;
  storeUrl?: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <OrdersStatusFilter current={statusFilter} />

      {orders.length === 0 ? (
        <DashboardPanel>
          <DashboardEmptyState
            title="No orders yet"
            description={
              statusFilter === "all"
                ? "Share your store link to get your first order."
                : "No orders match this filter."
            }
          >
            {statusFilter === "all" && storeUrl ? (
              <>
                <CopyStoreLinkButton url={storeUrl} />
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-brand-outline inline-flex h-11 items-center px-5"
                >
                  View storefront
                </a>
              </>
            ) : null}
            {statusFilter !== "all" ? (
              <Link
                href="/orders"
                className="btn-brand-outline inline-flex h-11 items-center px-5"
              >
                Clear filter
              </Link>
            ) : null}
          </DashboardEmptyState>
        </DashboardPanel>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {orders.map((order) => {
            const status = displayOrderStatus(order);
            return (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.reference}`}
                  className="dashboard-stat flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/15 hover:shadow-[0_4px_20px_rgba(22,19,14,0.06)] sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-muted-foreground truncate font-mono text-xs">
                      {order.reference}
                    </p>
                    <p className="text-muted-foreground mt-1.5 text-xs">
                      {formatOrderDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <OrderStatusBadge status={status} />
                    <span className="font-display text-base font-extrabold tabular-nums">
                      {formatPrice(order.total_cents)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
