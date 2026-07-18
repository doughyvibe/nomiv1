import { getStorefrontUrl } from "@/lib/host";

/** Curated marketing tour concepts (tall scroll screens + live demo slugs). */
export const DEMO_CONCEPTS = [
  {
    id: "bakery",
    label: "Artisan Cafe",
    slug: "eatnightdemo",
    demoCta: "Demo EATNight",
    image: "/marketing/demos/tall/eatnight-scroll.png",
    alt: "EATNight artisan cafe storefront preview on Noir",
    scrollable: true,
  },
  {
    id: "music",
    label: "Audio Lab",
    slug: "cpaldemo",
    demoCta: "Demo CYBERPUNK AUDIO",
    image: "/marketing/demos/tall/cyberpunk-scroll.png",
    alt: "Cyberpunk Audio Lab storefront preview",
    scrollable: true,
  },
  {
    id: "florist",
    label: "Exotic Succulents",
    slug: "botanicademo",
    demoCta: "Demo BOTANICA",
    image: "/marketing/demos/tall/botanica-scroll.png",
    alt: "BOTANICA exotic succulents storefront preview on Atelier",
    scrollable: true,
  },
  {
    id: "candy",
    label: "Sweet Treats",
    slug: "mira-kdemo",
    demoCta: "Demo CANDYSHOP",
    image: "/marketing/demos/tall/candyshop-scroll.png",
    alt: "CANDYSHOP sweet treats storefront preview on Candyland",
    scrollable: true,
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
