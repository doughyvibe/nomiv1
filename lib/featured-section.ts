export const FEATURED_SECTION_TITLE_SUGGESTIONS = [
  "Signature Pick",
  "Featured Service",
  "Spotlight Deal",
] as const;

export const FEATURED_SECTION_TITLE_DEFAULT = "Feature Product";

export function resolveFeaturedSectionTitle(
  stored: string | null | undefined,
): string {
  const trimmed = stored?.trim();
  return trimmed || FEATURED_SECTION_TITLE_DEFAULT;
}
