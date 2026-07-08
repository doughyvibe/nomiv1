/** Normalize category labels so storefront pills stay deduplicated. */
export function normalizeCategory(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  return trimmed
    .split(" ")
    .map((word) =>
      word.length <= 3 && word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

export function collectCategories(
  products: { category: string | null }[],
): string[] {
  const set = new Set<string>();
  for (const p of products) {
    const c = normalizeCategory(p.category);
    if (c) set.add(c);
  }
  return [...set].sort();
}
