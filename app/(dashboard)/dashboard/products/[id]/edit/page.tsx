import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveProductButton } from "@/components/dashboard/archive-product-button";
import { EditProductForm } from "@/components/dashboard/edit-product-form";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { collectCategories } from "@/lib/products/category";
import type { Product } from "@/lib/stores/types";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, store } = await requireSellerStore();

  const [{ data: product }, { data: allProducts }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("store_id", store.id)
      .maybeSingle<Product>(),
    supabase
      .from("products")
      .select("category")
      .eq("store_id", store.id)
      .eq("archived", false),
  ]);

  if (!product) notFound();

  const existingCategories = collectCategories(allProducts ?? []);

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
          <DashboardPageHeader
            title={product.archived ? "Archived product" : "Edit product"}
            description={
              product.archived
                ? "This product is hidden from your storefront."
                : "Update details buyers see on your store."
            }
          />
        </div>
      </div>

      <EditProductForm
        product={product}
        existingCategories={existingCategories}
        tradeHint={store.trade_hint ?? null}
        storeSlug={store.slug}
      />

      {!product.archived ? (
        <div className="border-t border-border pt-6">
          <ArchiveProductButton productId={product.id} />
        </div>
      ) : null}
    </div>
  );
}
