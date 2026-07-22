/**
 * Product/fulfilment TypeScript contracts.
 * ProductStatus + choices/variants + lead time.
 */

/** Merchant catalog lifecycle. DB column `products.status`; `archived` bool kept in sync. */
export type ProductStatus = "live" | "archived";

/**
 * Prep constraint in whole days before fulfilment can start.
 * Must be ≥ 0. Default 0. Constraint only — never a buyer date picker.
 */
export type LeadTimeDays = number;
