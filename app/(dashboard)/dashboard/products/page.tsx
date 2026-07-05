import Link from "next/link";

import { ProductsListView } from "@/components/dashboard/products-list";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import type { Product } from "@/lib/stores/types";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const { archived } = await searchParams;
  const showArchived = archived === "1";
  const { supabase, store } = await requireSellerStore();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("archived", showArchived)
    .order("created_at", { ascending: true });

  const { count: archivedCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store.id)
    .eq("archived", true);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        eyebrow={store.name}
        title={showArchived ? "Archived products" : "Products"}
        description={
          showArchived
            ? "Hidden from your public storefront."
            : "Manage what buyers see when they visit your store."
        }
        action={
          !showArchived ? (
            <Link
              href="/products/new"
              className="btn-brand-dark inline-flex h-11 items-center px-5"
            >
              Add product
            </Link>
          ) : undefined
        }
      />
      <ProductsListView
        products={(products as Product[]) ?? []}
        showArchived={showArchived}
        archivedCount={archivedCount ?? 0}
      />
    </div>
  );
}
