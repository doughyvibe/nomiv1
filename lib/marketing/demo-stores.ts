import { getStorefrontUrl } from "@/lib/host";

/** Curated marketing tour concepts (static mockups + live demo slugs). */
export const DEMO_CONCEPTS = [
  {
    id: "bakery",
    label: "Artisan Cafe",
    slug: "eatnightdemo",
    image: "/marketing/demos/bakery-noir-eatnight.png",
    alt: "EATNight artisan cafe storefront preview on Noir",
  },
  {
    id: "music",
    label: "Audio Lab",
    slug: "cpaldemo",
    image: "/marketing/demos/music-cyberpunk-audio-lab.png",
    alt: "Cyberpunk Audio Lab storefront preview",
  },
  {
    id: "florist",
    label: "Exotic Succulents",
    slug: "botanicademo",
    image: "/marketing/demos/florist-atelier-botanica.png",
    alt: "BOTANICA exotic succulents storefront preview on Atelier",
  },
  {
    id: "candy",
    label: "Sweet Treats",
    slug: "mira-kdemo",
    image: "/marketing/demos/candy-candyland-mira-k.png",
    alt: "CANDYSHOP sweet treats storefront preview on Candyland",
  },
] as const;

export type DemoConceptId = (typeof DEMO_CONCEPTS)[number]["id"];

export function getDemoConceptUrl(slug: string): string {
  return getStorefrontUrl(slug);
}

/** @deprecated Prefer DEMO_CONCEPTS — kept for any single-slug callers. */
export function getDemoStoreSlug(): string {
  return process.env.NEXT_PUBLIC_DEMO_STORE_SLUG ?? DEMO_CONCEPTS[0].slug;
}
