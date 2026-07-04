import Link from "next/link";

import { CopyStoreLinkButton } from "@/components/dashboard/copy-store-link-button";
import { StoreStatusBadge } from "@/components/dashboard/store-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrderSummary } from "@/lib/orders/order-summary";
import type { Store } from "@/lib/stores/types";

type DashboardHomeProps = {
  store: Store;
  storeUrl: string;
  summary: OrderSummary;
};

export function DashboardHome({
  store,
  storeUrl,
  summary,
}: DashboardHomeProps) {
  const hasOrders = summary.total > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold">{store.name}</h1>
          <StoreStatusBadge status={store.status} />
        </div>
        <p className="text-muted-foreground mt-1 text-sm">Your Nomi storefront</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Store link</CardTitle>
          <CardDescription className="break-all">{storeUrl}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <CopyStoreLinkButton url={storeUrl} />
          <Button
            render={<a href={storeUrl} target="_blank" rel="noreferrer" />}
          >
            Open storefront
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Orders</CardTitle>
          {!hasOrders && (
            <CardDescription>
              No orders yet. Share your Nomi store link to start receiving
              orders.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {hasOrders ? (
            <dl className="grid grid-cols-3 gap-3 text-center">
              <Link
                href="/orders?status=seller_verification_requested"
                className="hover:bg-muted rounded-lg border p-3 transition-colors"
              >
                <dt className="text-muted-foreground text-xs">
                  Awaiting verification
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {summary.awaitingVerification}
                </dd>
              </Link>
              <Link
                href="/orders?status=seller_confirmed_paid"
                className="hover:bg-muted rounded-lg border p-3 transition-colors"
              >
                <dt className="text-muted-foreground text-xs">Paid</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {summary.paid}
                </dd>
              </Link>
              <Link
                href="/orders"
                className="hover:bg-muted rounded-lg border p-3 transition-colors"
              >
                <dt className="text-muted-foreground text-xs">Total</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  {summary.total}
                </dd>
              </Link>
            </dl>
          ) : (
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>· Copy store link and add it to your Instagram bio</li>
              <li>
                ·{" "}
                <Link href="/products" className="text-primary underline">
                  Add more products
                </Link>
              </li>
              <li>
                ·{" "}
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Test checkout
                </a>{" "}
                on your public store
              </li>
              <li>
                ·{" "}
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  View public store
                </a>
              </li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
