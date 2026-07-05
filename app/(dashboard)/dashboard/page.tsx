import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { getStorefrontUrl } from "@/lib/host";
import { loadOrderSummary } from "@/lib/orders/order-summary";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function DashboardPage() {
  const { supabase, store } = await requireSellerStore();
  const summary = await loadOrderSummary(supabase, store.id);
  const storeUrl = getStorefrontUrl(store.slug);

  return <DashboardHome store={store} storeUrl={storeUrl} summary={summary} />;
}
