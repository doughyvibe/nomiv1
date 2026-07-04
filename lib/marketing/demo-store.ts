/** Public demo storefront slug (PRD §15.1 — e.g. jigwave.nomi.store). */
export function getDemoStoreSlug(): string {
  return process.env.NEXT_PUBLIC_DEMO_STORE_SLUG ?? "jigwave";
}
