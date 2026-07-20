import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { getStorefrontUrl } from "@/lib/host";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function DashboardPage() {
  const { supabase, store } = await requireSellerStore();
  const productCountResult = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store.id)
    .eq("archived", false);
  const storeUrl = getStorefrontUrl(store.slug);

  return (
    <DashboardHome
      store={store}
      storeUrl={storeUrl}
      productCount={productCountResult.count ?? 0}
    />
  );
}
