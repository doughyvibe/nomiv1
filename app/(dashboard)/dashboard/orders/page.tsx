import Link from "next/link";

import { OrdersListView } from "@/components/dashboard/orders-list";
import { getStorefrontUrl } from "@/lib/host";
import { loadSellerOrders } from "@/lib/orders/load-seller-orders";
import { requireSellerStore } from "@/lib/stores/require-seller";

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
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
      <div>
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-muted-foreground mt-1 text-sm">{store.name}</p>
      </div>

      <OrdersListView
        orders={orders}
        statusFilter={statusFilter}
        storeUrl={getStorefrontUrl(store.slug)}
      />
    </main>
  );
}
