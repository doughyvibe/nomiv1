import { notFound } from "next/navigation";

import { ProductCatalog } from "@/components/storefront/product-catalog";
import { StorefrontHero } from "@/components/storefront/storefront-hero";
import { getPublishedStorefront } from "@/lib/stores/load-storefront";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const storefront = await getPublishedStorefront(slug);

  if (!storefront) notFound();

  const { store, products } = storefront;

  return (
    <main className="flex flex-col pt-[max(0px,env(safe-area-inset-top,0px))]">
      <StorefrontHero storeName={store.name} hero={store.hero} />
      <ProductCatalog products={products} />
    </main>
  );
}
