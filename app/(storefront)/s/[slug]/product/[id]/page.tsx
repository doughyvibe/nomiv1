import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/storefront/product-detail";
import { getPublishedStorefront } from "@/lib/stores/load-storefront";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const storefront = await getPublishedStorefront(slug);
  if (!storefront) notFound();

  const product = storefront.products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <main>
      <ProductDetail product={product} />
    </main>
  );
}
