import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { getStorefrontUrl } from "@/lib/host";
import { loadOrderSummary } from "@/lib/orders/order-summary";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function DashboardPage() {
  const { supabase, store } = await requireSellerStore();
  const summary = await loadOrderSummary(supabase, store.id);
  const storeUrl = getStorefrontUrl(store.slug);

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <DashboardHome store={store} storeUrl={storeUrl} summary={summary} />
      <div className="border-t pt-4">
        <SignOutButton />
      </div>
    </main>
  );
}
