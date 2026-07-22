/**
 * Optional inventory (Phase 4).
 * track_inventory=false → unlimited. Per-variant qty when choices exist; else product-level.
 */

import { productHasChoices, type ProductVariant } from "@/lib/products/variants";

export const SOLD_OUT_POLICIES = ["hide", "show"] as const;
export type SoldOutPolicy = (typeof SOLD_OUT_POLICIES)[number];

export type InventoryProduct = {
  track_inventory?: boolean | null;
  stock_qty?: number | null;
  sold_out_policy?: SoldOutPolicy | string | null;
  variants?: ProductVariant[] | null;
};

export function parseSoldOutPolicy(
  value: unknown,
): SoldOutPolicy | null {
  if (value === "hide" || value === "show") return value;
  return null;
}

/** null = unlimited (not tracking). */
export function availableQty(
  product: InventoryProduct,
  variantId?: string | null,
): number | null {
  if (!product.track_inventory) return null;

  if (productHasChoices(product)) {
    const variant = (product.variants ?? []).find((v) => v.id === variantId);
    if (!variant) return 0;
    return Math.max(0, variant.stock_qty ?? 0);
  }

  return Math.max(0, product.stock_qty ?? 0);
}

export function isVariantSoldOut(
  product: InventoryProduct,
  variant: ProductVariant | null | undefined,
): boolean {
  if (!product.track_inventory) return false;
  if (!variant) return true;
  return (variant.stock_qty ?? 0) <= 0;
}

/** True when nothing sellable remains (all variants OOS, or product qty 0). */
export function isProductSoldOut(product: InventoryProduct): boolean {
  if (!product.track_inventory) return false;

  if (productHasChoices(product)) {
    const variants = product.variants ?? [];
    if (variants.length === 0) return false;
    return variants.every((v) => (v.stock_qty ?? 0) <= 0);
  }

  return (product.stock_qty ?? 0) <= 0;
}

/** Hide policy removes OOS offers from the public catalog. */
export function shouldHideSoldOut(product: InventoryProduct): boolean {
  if (!isProductSoldOut(product)) return false;
  return product.sold_out_policy === "hide";
}

export function filterVisibleStorefrontProducts<T extends InventoryProduct>(
  products: T[],
): T[] {
  return products.filter((p) => !shouldHideSoldOut(p));
}

export type StockDemandLine = {
  productId: string;
  quantity: number;
  variantId?: string | null;
};

/**
 * Aggregate cart demand and reject oversell / OOS.
 * Returns a friendly error or null when ok.
 */
export function assertCartStock(
  products: Array<InventoryProduct & { id: string; name: string }>,
  lines: StockDemandLine[],
): string | null {
  const productMap = new Map(products.map((p) => [p.id, p]));

  // key = productId\0variantId| (empty variant for simple)
  const demand = new Map<string, { productId: string; variantId: string | null; qty: number }>();

  for (const line of lines) {
    if (!line.productId || typeof line.quantity !== "number" || line.quantity < 1) {
      return "Invalid cart data";
    }
    const variantId = line.variantId ?? null;
    const key = `${line.productId}\0${variantId ?? ""}`;
    const prev = demand.get(key);
    if (prev) {
      prev.qty += line.quantity;
    } else {
      demand.set(key, {
        productId: line.productId,
        variantId,
        qty: line.quantity,
      });
    }
  }

  for (const { productId, variantId, qty } of demand.values()) {
    const product = productMap.get(productId);
    if (!product) {
      return "A product in your cart is no longer available";
    }
    if (!product.track_inventory) continue;

    if (productHasChoices(product)) {
      if (!variantId) {
        return "Choose options for each product before checkout";
      }
      const variant = (product.variants ?? []).find((v) => v.id === variantId);
      if (!variant) {
        return "A chosen option is no longer available — update your cart";
      }
      const avail = variant.stock_qty ?? 0;
      if (avail < qty) {
        if (avail <= 0) {
          return `${product.name} (${variant.label}) is sold out`;
        }
        return `Only ${avail} left of ${product.name} (${variant.label})`;
      }
    } else {
      const avail = product.stock_qty ?? 0;
      if (avail < qty) {
        if (avail <= 0) {
          return `${product.name} is sold out`;
        }
        return `Only ${avail} left of ${product.name}`;
      }
    }
  }

  return null;
}

export type InventoryInput = {
  track_inventory: boolean;
  /** Product-level qty when not using choices. Ignored when choices on. */
  stock_qty: number | null;
  sold_out_policy: SoldOutPolicy;
};

/** Validate inventory fields on product save. choicesOn = product has / will have variants. */
export function validateInventoryInput(
  inventory: InventoryInput | null | undefined,
  choicesOn: boolean,
  variantStocks?: Array<number | null | undefined>,
): string | null {
  if (inventory == null) return null;
  if (!inventory.track_inventory) return null;

  if (parseSoldOutPolicy(inventory.sold_out_policy) == null) {
    return "Choose whether to hide sold-out items or show them as sold out";
  }

  if (choicesOn) {
    if (!variantStocks || variantStocks.length === 0) {
      return "Set a quantity for each choice combination";
    }
    for (const q of variantStocks) {
      if (q == null || !Number.isInteger(q) || q < 0) {
        return "Enter a whole-number quantity (0 or more) for each combination";
      }
    }
    return null;
  }

  if (
    inventory.stock_qty == null ||
    !Number.isInteger(inventory.stock_qty) ||
    inventory.stock_qty < 0
  ) {
    return "Enter how many you have in stock (0 or more)";
  }
  return null;
}
