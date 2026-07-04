import Link from "next/link";

import { ProductsListView } from "@/components/dashboard/products-list";
import { Button } from "@/components/ui/button";
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
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            {showArchived ? "Archived products" : "Products"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {showArchived
              ? "Hidden from your storefront"
              : "Manage what buyers see in your store"}
          </p>
        </div>
        {!showArchived && (
          <Button render={<Link href="/products/new" />}>Add product</Button>
        )}
      </div>

      <ProductsListView
        products={(products as Product[]) ?? []}
        showArchived={showArchived}
        archivedCount={archivedCount ?? 0}
      />
    </main>
  );
}
