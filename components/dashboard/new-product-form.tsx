"use client";

import { useRouter } from "next/navigation";

import { addProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { ProductForm } from "@/components/dashboard/product-form";

export function NewProductForm({ storeSlug }: { storeSlug: string }) {
  const router = useRouter();

  return (
    <ProductForm
      storeSlug={storeSlug}
      submitLabel="Save product"
      onSubmit={addProductAction}
      onSuccess={() => {
        router.push("/products");
        router.refresh();
      }}
    />
  );
}
