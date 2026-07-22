"use client";

import { useRouter } from "next/navigation";

import { updateProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { ArchiveProductButton } from "@/components/dashboard/archive-product-button";
import { ProductForm } from "@/components/dashboard/product-form";
import type { Product } from "@/lib/stores/types";

export function EditProductForm({
  product,
  storeSlug,
  storeCategories = [],
}: {
  product: Product;
  storeSlug: string;
  storeCategories?: string[];
}) {
  const router = useRouter();
  const isArchived = product.status === "archived" || product.archived;

  return (
    <ProductForm
      initial={{
        name: product.name,
        price_cents: product.price_cents,
        description: product.description,
        image_url: product.image_url ?? undefined,
        category: product.category ?? undefined,
        lead_time_days: product.lead_time_days ?? 0,
        options: product.options,
        variants: product.variants,
        customisations: product.customisations,
        track_inventory: product.track_inventory,
        stock_qty: product.stock_qty,
        sold_out_policy: product.sold_out_policy,
      }}
      storeSlug={storeSlug}
      storeCategories={storeCategories}
      submitLabel="Save changes"
      showChoices
      showCustomisations
      showStock
      showPrep
      disabled={isArchived}
      optionsFooter={
        isArchived ? null : <ArchiveProductButton productId={product.id} />
      }
      onSubmit={(data) => updateProductAction(product.id, data)}
      onSuccess={() => router.refresh()}
    />
  );
}
