export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 40;

/** Store name → slug suggestion (PRD §7): lowercase, alnum + hyphens only. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}

/** PRD §7 format rules. Returns null when valid, else a user-facing error. */
export function validateSlugFormat(slug: string): string | null {
  if (slug.length < SLUG_MIN_LENGTH) {
    return `Must be at least ${SLUG_MIN_LENGTH} characters`;
  }
  if (slug.length > SLUG_MAX_LENGTH) {
    return `Must be at most ${SLUG_MAX_LENGTH} characters`;
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return "Only lowercase letters, numbers, and hyphens allowed";
  }
  if (slug.startsWith("-") || slug.endsWith("-")) {
    return "Cannot start or end with a hyphen";
  }
  if (slug.includes("--")) {
    return "Cannot contain consecutive hyphens";
  }
  return null;
}

/** Alternatives when a slug is taken (PRD §7 examples). */
export function suggestAlternatives(slug: string): string[] {
  const year = new Date().getFullYear();
  return [
    `${slug}-sg`,
    `${slug}official`,
    `${slug}${year}`,
    `${slug}-shop`,
  ].filter((s) => s.length <= SLUG_MAX_LENGTH);
}
