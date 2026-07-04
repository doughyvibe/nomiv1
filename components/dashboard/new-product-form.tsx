"use client";

import { useRouter } from "next/navigation";

import { addProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { ProductForm } from "@/components/dashboard/product-form";

export function NewProductForm() {
  const router = useRouter();

  return (
    <ProductForm
      submitLabel="Save product"
      onSubmit={addProductAction}
      onSuccess={() => {
        router.push("/products");
        router.refresh();
      }}
    />
  );
}
