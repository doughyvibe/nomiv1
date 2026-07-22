import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/storefront/product-detail";
import { shouldHideSoldOut } from "@/lib/products/inventory";
import { getCheckoutStorefront } from "@/lib/stores/load-storefront";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const storefront = await getCheckoutStorefront(slug);
  if (!storefront) notFound();

  const product = storefront.products.find((p) => p.id === id);
  if (!product) notFound();
  if (!storefront.previewMode && shouldHideSoldOut(product)) notFound();

  return (
    <main>
      <ProductDetail product={product} />
    </main>
  );
}
