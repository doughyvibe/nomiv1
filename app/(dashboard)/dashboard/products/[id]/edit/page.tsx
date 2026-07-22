import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteProductButton } from "@/components/dashboard/delete-product-button";
import { EditProductForm } from "@/components/dashboard/edit-product-form";
import { ProductStatusBadge } from "@/components/dashboard/product-status-badge";
import { RestoreProductButton } from "@/components/dashboard/restore-product-button";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { collectCategories, normalizeCategory } from "@/lib/products/category";
import { attachProductChoices } from "@/lib/products/load-choices";
import { attachProductCustomisations } from "@/lib/products/load-customisations";
import type { Product } from "@/lib/stores/types";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, store } = await requireSellerStore();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("store_id", store.id)
    .maybeSingle<Product>();

  if (!product) notFound();

  const [{ data: categoryRows }, [withChoices]] = await Promise.all([
    supabase.from("products").select("category").eq("store_id", store.id),
    attachProductChoices(supabase, [product]),
  ]);
  const [withExtras] = await attachProductCustomisations(supabase, [
    withChoices,
  ]);
  const status =
    withExtras.status ?? (withExtras.archived ? "archived" : "live");
  const isArchived = status === "archived";

  const storeCategories = collectCategories(
    (categoryRows as Pick<Product, "category">[] | null) ?? [],
  );
  const current = normalizeCategory(withExtras.category);
  if (current && !storeCategories.includes(current)) {
    storeCategories.push(current);
    storeCategories.sort((a, b) => a.localeCompare(b));
  }

  const { count: orderItemCount } = await supabase
    .from("order_items")
    .select("*", { count: "exact", head: true })
    .eq("product_id", withExtras.id);

  const canDelete = (orderItemCount ?? 0) === 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/products"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Products
        </Link>
        <div className="mt-4">
          <DashboardPageHeader
            title={
              <span className="inline-flex flex-wrap items-center gap-3">
                {withExtras.name}
                <ProductStatusBadge
                  status={status}
                  className="align-middle text-sm font-semibold normal-case tracking-normal"
                />
              </span>
            }
          />
        </div>
      </div>

      <EditProductForm
        product={withExtras}
        storeSlug={store.slug}
        storeCategories={storeCategories}
      />

      {isArchived ? (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <RestoreProductButton productId={withExtras.id} />
          {canDelete ? (
            <DeleteProductButton productId={withExtras.id} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
