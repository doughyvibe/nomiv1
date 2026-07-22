/** Display money in SGD with a plain $ (no currency code). */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
