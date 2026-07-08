import { FEATURED_SECTION_TITLE_DEFAULT, resolveFeaturedSectionTitle } from "@/lib/featured-section";

const cases: [string | null | undefined, string][] = [
  [null, FEATURED_SECTION_TITLE_DEFAULT],
  [undefined, FEATURED_SECTION_TITLE_DEFAULT],
  ["", FEATURED_SECTION_TITLE_DEFAULT],
  ["   ", FEATURED_SECTION_TITLE_DEFAULT],
  ["Signature Pick", "Signature Pick"],
];

for (const [input, expected] of cases) {
  const got = resolveFeaturedSectionTitle(input);
  console.assert(got === expected, `resolveFeaturedSectionTitle(${JSON.stringify(input)}) => ${got}, want ${expected}`);
}

console.log("featured-section self-check ok");
