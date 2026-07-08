import { notFound } from "next/navigation";

import { FeaturedProduct } from "@/components/storefront/featured-product";
import { ProductCatalog } from "@/components/storefront/product-catalog";
import { StorefrontHero } from "@/components/storefront/storefront-hero";
import {
  catalogProducts,
  resolveFeaturedProduct,
} from "@/lib/products/featured";
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
  const featured = resolveFeaturedProduct(store, products);
  const catalog = catalogProducts(products, featured);

  return (
    <main className="flex flex-col pt-[max(0px,env(safe-area-inset-top,0px))]">
      <StorefrontHero
        storeName={store.name}
        hero={store.hero}
        vibe={store.vibe ?? "epicurean"}
      />

      {featured ? (
        <FeaturedProduct
          product={featured}
          sectionTitle={store.featured_section_title}
          vibe={store.vibe ?? "epicurean"}
        />
      ) : null}

      {catalog.length > 0 ? (
        <ProductCatalog products={catalog} />
      ) : products.length === 0 ? (
        <section className="px-5 py-12 text-center sm:px-6">
          <div className="vibe-card mx-auto max-w-md rounded-[var(--vibe-radius)] px-6 py-12">
            <p className="font-display text-lg font-semibold text-vibe-text">
              No products yet
            </p>
            <p className="mt-2 text-sm text-vibe-text-muted">
              Check back soon — the seller is still setting up.
            </p>
          </div>
        </section>
      ) : null}
    </main>
  );
}
