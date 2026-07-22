import Link from "next/link";

import { NewProductForm } from "@/components/dashboard/new-product-form";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { collectCategories } from "@/lib/products/category";
import type { Product } from "@/lib/stores/types";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add product — Nomi" };

export default async function NewProductPage() {
  const { supabase, store } = await requireSellerStore();

  const { data: products } = await supabase
    .from("products")
    .select("category")
    .eq("store_id", store.id);

  const storeCategories = collectCategories(
    (products as Pick<Product, "category">[] | null) ?? [],
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/products"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to products
        </Link>
        <div className="mt-4">
          <DashboardPageHeader title="Add product" />
        </div>
      </div>
      <NewProductForm
        storeSlug={store.slug}
        storeCategories={storeCategories}
      />
    </div>
  );
}
