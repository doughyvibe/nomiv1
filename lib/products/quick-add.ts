import type { Product } from "@/lib/stores/types";

/** ponytail: simple heuristic — long descriptions imply read-before-buy (services, courses). */
export const QUICK_ADD_MAX_DESCRIPTION = 100;

export function allowsQuickAdd(
  product: Pick<Product, "description">,
): boolean {
  return product.description.trim().length <= QUICK_ADD_MAX_DESCRIPTION;
}
