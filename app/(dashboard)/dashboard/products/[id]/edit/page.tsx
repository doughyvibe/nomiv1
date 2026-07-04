import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveProductButton } from "@/components/dashboard/archive-product-button";
import { EditProductForm } from "@/components/dashboard/edit-product-form";
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

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <div>
        <Link
          href="/products"
          className="text-primary text-sm font-medium hover:underline"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 text-xl font-semibold">
          {product.archived ? "Archived product" : "Edit product"}
        </h1>
        {product.archived && (
          <p className="text-muted-foreground mt-1 text-sm">
            This product is hidden from your storefront.
          </p>
        )}
      </div>

      <EditProductForm product={product} />

      {!product.archived && (
        <div className="border-t pt-6">
          <ArchiveProductButton productId={product.id} />
        </div>
      )}
    </main>
  );
}
