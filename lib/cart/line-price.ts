import {
  productHasChoices,
  variantUnitPrice,
} from "@/lib/products/variants";
import {
  customisationAnswersComplete,
  totalCustomisationFeesCents,
  type CustomisationSnapshotEntry,
  formatCustomisationSnapshotLines,
} from "@/lib/products/customisations";
import type { CartLine } from "@/lib/cart/types";
import type { Product } from "@/lib/stores/types";

/** Resolve unit price for a cart line; undefined if product/variant/customs invalid. */
export function resolveCartLineUnitPrice(
  line: CartLine,
  product: Product | undefined,
): number | undefined {
  if (!product) return undefined;

  let base: number;
  if (productHasChoices(product)) {
    if (!line.variantId) return undefined;
    const variant = (product.variants ?? []).find((v) => v.id === line.variantId);
    if (!variant) return undefined;
    base = variantUnitPrice(product.price_cents, variant);
  } else {
    base = product.price_cents;
  }

  const defs = product.customisations ?? [];
  if (defs.length > 0) {
    if (!customisationAnswersComplete(defs, line.customisations)) {
      return undefined;
    }
  }

  return base + totalCustomisationFeesCents(defs, line.customisations);
}

export function cartLineVariantLabel(
  line: CartLine,
  product: Product | undefined,
): string | null {
  if (!product || !line.variantId) return null;
  const variant = (product.variants ?? []).find((v) => v.id === line.variantId);
  return variant?.label ?? null;
}

/** Live catalog lines for cart UI (not order snapshot). */
export function cartLineCustomisationLines(
  line: CartLine,
  product: Product | undefined,
): string[] {
  if (!product) return [];
  const defs = product.customisations ?? [];
  if (defs.length === 0 || !line.customisations) return [];
  const entries: CustomisationSnapshotEntry[] = [];
  for (const def of defs) {
    const raw = line.customisations[def.id];
    if (raw === undefined) continue;
    if (def.type === "text" && (typeof raw !== "string" || !raw.trim())) {
      continue;
    }
    if (def.type === "yes_no" && raw !== true && raw !== false) continue;
    if (def.type === "yes_no" && raw === false && !def.required) continue;
    if (
      def.type === "single_select" &&
      (typeof raw !== "string" || !raw.trim())
    ) {
      continue;
    }
    if (
      def.type === "multi_select" &&
      (!Array.isArray(raw) || raw.length === 0)
    ) {
      continue;
    }
    let display: string;
    if (def.type === "yes_no") display = raw === true ? "Yes" : "No";
    else if (def.type === "multi_select" && Array.isArray(raw)) {
      display = raw.map(String).join(", ");
    } else display = String(raw).trim();
    entries.push({
      id: def.id,
      label: def.label,
      type: def.type,
      answer: raw,
      display,
      price_cents: 0,
    });
  }
  return formatCustomisationSnapshotLines(entries);
}
