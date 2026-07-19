"use client";

import { useRouter } from "next/navigation";

import { updateProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { ProductForm } from "@/components/dashboard/product-form";
import type { Product } from "@/lib/stores/types";

export function EditProductForm({
  product,
  storeSlug,
}: {
  product: Product;
  storeSlug: string;
}) {
  const router = useRouter();

  return (
    <ProductForm
      initial={{
        name: product.name,
        price_cents: product.price_cents,
        description: product.description,
        image_url: product.image_url ?? undefined,
        category: product.category ?? undefined,
      }}
      storeSlug={storeSlug}
      submitLabel="Save changes"
      disabled={product.archived}
      onSubmit={(data) => updateProductAction(product.id, data)}
      onSuccess={() => router.refresh()}
    />
  );
}
