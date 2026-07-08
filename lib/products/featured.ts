import type { Product, Store } from "@/lib/stores/types";

export function resolveFeaturedProduct(
  store: Pick<Store, "featured_product_id">,
  products: Product[],
): Product | null {
  if (products.length === 0) return null;
  if (store.featured_product_id) {
    const match = products.find((p) => p.id === store.featured_product_id);
    if (match) return match;
  }
  return products[0] ?? null;
}

export function catalogProducts(
  products: Product[],
  featured: Product | null,
): Product[] {
  if (!featured) return products;
  return products.filter((p) => p.id !== featured.id);
}
