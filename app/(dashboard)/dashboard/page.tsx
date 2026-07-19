import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { getStorefrontUrl } from "@/lib/host";
import { loadOrderSummary } from "@/lib/orders/order-summary";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function DashboardPage() {
  const { supabase, store } = await requireSellerStore();
  const [summary, productCountResult] = await Promise.all([
    loadOrderSummary(supabase, store.id),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("archived", false),
  ]);
  const storeUrl = getStorefrontUrl(store.slug);

  return (
    <DashboardHome
      store={store}
      storeUrl={storeUrl}
      summary={summary}
      productCount={productCountResult.count ?? 0}
    />
  );
}
