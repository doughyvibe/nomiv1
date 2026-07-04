import Link from "next/link";

import { CopyStoreLinkButton } from "@/components/dashboard/copy-store-link-button";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { OrdersStatusFilter } from "@/components/dashboard/orders-status-filter";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-4">
      <OrdersStatusFilter current={statusFilter} />

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">No orders yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {statusFilter === "all"
              ? "Share your store link to get your first order."
              : "No orders match this filter."}
          </p>
          {statusFilter === "all" && storeUrl && (
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <CopyStoreLinkButton url={storeUrl} />
              <Button
                variant="ghost"
                size="sm"
                render={
                  <a href={storeUrl} target="_blank" rel="noreferrer" />
                }
              >
                View storefront
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {orders.map((order) => {
            const status = displayOrderStatus(order);
            return (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.reference}`}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-muted-foreground truncate text-sm">
                      {order.reference}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatOrderDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <OrderStatusBadge status={status} />
                    <span className="text-sm font-semibold">
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
