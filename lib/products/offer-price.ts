import { formatPrice } from "@/lib/money";
import {
  minOfferPriceCents,
  variantPricesDiffer,
} from "@/lib/products/variants";
import type { Product } from "@/lib/stores/types";

/** Catalog/featured price: "From $X" when variant prices differ. */
export function formatOfferPrice(product: Product): string {
  if (variantPricesDiffer(product)) {
    return `From ${formatPrice(minOfferPriceCents(product))}`;
  }
  return formatPrice(product.price_cents);
}
