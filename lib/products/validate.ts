import { parseLeadTimeDays } from "@/lib/products/lead-time";
import { parseEditableStatus } from "@/lib/products/status";
import {
  type CustomisationsInput,
  validateCustomisationsInput,
} from "@/lib/products/customisations";
import {
  type InventoryInput,
  validateInventoryInput,
} from "@/lib/products/inventory";
import {
  type ChoicesInput,
  validateChoicesInput,
} from "@/lib/products/variants";

export type ProductInput = {
  name: string;
  price_cents: number;
  description: string;
  image_url?: string;
  category?: string;
  /** Always live on create/update. Remove via archive action. */
  status?: "live";
  /**
   * Prep constraint in whole days. Default 0 when omitted.
   * Dashboard Prep section always sends an explicit value.
   */
  lead_time_days?: number;
  /**
   * Opt-in choices. `null` / omit on create = no choices.
   * On update, `null` clears existing choices; omit leaves them unchanged only if
   * the form always sends an explicit value (dashboard always sends).
   */
  choices?: ChoicesInput | null;
  /**
   * Opt-in customisations. `null` / [] clears; omit on create = none.
   * Dashboard always sends an explicit value when showCustomisations is on.
   */
  customisations?: CustomisationsInput | null;
  /** Opt-in stock (Phase 4). Omit = defaults off on create / leave unchanged if omitted. */
  inventory?: InventoryInput | null;
};

export function validateProductInput(product: ProductInput): string | null {
  const name = product.name.trim();
  if (!name) return "Product name is required";
  if (
    !Number.isInteger(product.price_cents) ||
    product.price_cents < 0 ||
    product.price_cents > 100_000_00
  ) {
    return "Enter a valid price";
  }
  if (product.status != null && parseEditableStatus(product.status) == null) {
    return "Invalid product status";
  }
  if (product.lead_time_days !== undefined) {
    if (parseLeadTimeDays(product.lead_time_days) == null) {
      return "Prep days must be a whole number of 0 or more";
    }
  }
  if (product.choices !== undefined) {
    const choicesError = validateChoicesInput(product.choices);
    if (choicesError) return choicesError;
  }
  if (product.customisations !== undefined) {
    const customsError = validateCustomisationsInput(product.customisations);
    if (customsError) return customsError;
  }
  if (product.inventory !== undefined && product.inventory !== null) {
    const choicesOn =
      product.choices != null && (product.choices.options?.length ?? 0) > 0;
    const variantStocks = choicesOn
      ? product.choices!.variants.map((v) => v.stock_qty)
      : undefined;
    const invError = validateInventoryInput(
      product.inventory,
      choicesOn,
      variantStocks,
    );
    if (invError) return invError;
  }
  return null;
}

export function parsePriceToCents(price: string): number | null {
  const value = Number.parseFloat(price);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}
