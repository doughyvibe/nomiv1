import { OrdersListView } from "@/components/dashboard/orders-list";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { getStorefrontUrl } from "@/lib/host";
import { loadSellerOrders } from "@/lib/orders/load-seller-orders";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Nomi" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const statusFilter = rawStatus ?? "all";
  const { supabase, store } = await requireSellerStore();
  const orders = await loadSellerOrders(supabase, store.id, statusFilter);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Orders" />
      <OrdersListView
        orders={orders}
        statusFilter={statusFilter}
        storeUrl={getStorefrontUrl(store.slug)}
      />
    </div>
  );
}
