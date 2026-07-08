"use client";

import { useRouter } from "next/navigation";

import { addProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { ProductForm } from "@/components/dashboard/product-form";
import { collectCategories } from "@/lib/products/category";
import type { TradeHint } from "@/lib/stores/types";

export function NewProductForm({
  existingCategories,
  tradeHint,
  storeSlug,
}: {
  existingCategories: string[];
  tradeHint: TradeHint | null;
  storeSlug: string;
}) {
  const router = useRouter();

  return (
    <ProductForm
      existingCategories={existingCategories}
      tradeHint={tradeHint}
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
