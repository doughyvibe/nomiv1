import type { Vibe } from "@/lib/stores/types";

export type VibeMeta = {
  id: Vibe;
  name: string;
  tagline: string;
  suitableFor: string;
  /** Preview swatches for the picker (bg / primary / secondary as CSS colors) */
  swatch: { bg: string; primary: string; secondary: string };
  provisional: boolean;
};

export const VIBES: VibeMeta[] = [
  {
    id: "epicurean",
    name: "Noir",
    tagline: "Dark, premium, cinematic.",
    suitableFor: "Any trade — food, handmade, retail, services",
    swatch: {
      bg: "rgb(18 20 20)",
      primary: "rgb(255 181 152)",
      secondary: "rgb(154 241 49)",
    },
    provisional: false,
  },
  {
    id: "atelier",
    name: "Atelier",
    tagline: "Quiet luxury, organic minimalism.",
    suitableFor: "Plants, ceramics, handmade, lifestyle, florals",
    swatch: {
      bg: "rgb(251 249 244)",
      primary: "rgb(51 69 55)",
      secondary: "rgb(103 93 80)",
    },
    provisional: false,
  },
  {
    id: "expedition",
    name: "Expedition",
    tagline: "Rugged, technical, built for the trail.",
    suitableFor: "Outdoor gear, tools, cycling, fishing, apparel",
    swatch: {
      bg: "rgb(12 20 28)",
      primary: "rgb(255 209 0)",
      secondary: "rgb(142 155 168)",
    },
    provisional: false,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    tagline: "Neon, digital, built for the night.",
    suitableFor: "Tech, streetwear, gaming, audio, modern accessories",
    swatch: {
      bg: "rgb(0 0 0)",
      primary: "rgb(0 229 255)",
      secondary: "rgb(176 38 255)",
    },
    provisional: false,
  },
  {
    id: "candyland",
    name: "Candyland",
    tagline: "Playful pastels, sweet and bold.",
    suitableFor: "Sweets, kids, gifts, beauty, party goods",
    swatch: {
      bg: "rgb(255 255 255)",
      primary: "rgb(255 45 138)",
      secondary: "rgb(123 47 255)",
    },
    provisional: false,
  },
  {
    id: "gallery",
    name: "Gallery",
    tagline: "White cube calm for curated works.",
    suitableFor: "Art, prints, photography, design, collectibles",
    swatch: {
      bg: "rgb(249 249 249)",
      primary: "rgb(18 18 18)",
      secondary: "rgb(116 120 120)",
    },
    provisional: false,
  },
  {
    id: "market",
    name: "Market",
    tagline: "Quiet luxury for the modern agrarian.",
    suitableFor: "Produce, bakeries, pantry goods, farm stalls",
    swatch: {
      bg: "rgb(253 218 200)",
      primary: "rgb(136 69 48)",
      secondary: "rgb(115 89 75)",
    },
    provisional: false,
  },
  {
    id: "studio",
    name: "Studio",
    tagline: "Bold, graphic, creatively fearless.",
    suitableFor: "Design studios, brand kits, UI, creative services",
    swatch: {
      bg: "rgb(255 255 255)",
      primary: "rgb(15 82 255)",
      secondary: "rgb(12 12 12)",
    },
    provisional: false,
  },
  {
    id: "laura",
    name: "Laura",
    tagline: "Soft blush glass, quietly pretty.",
    suitableFor: "Beauty, lifestyle, florals, soft goods",
    swatch: {
      bg: "rgb(252 240 245)",
      primary: "rgb(125 91 109)",
      secondary: "rgb(149 132 139)",
    },
    provisional: false,
  },
  {
    id: "atlantic",
    name: "Atlantic",
    tagline: "Cool coastal calm, easy and clear.",
    suitableFor: "Apparel, travel, wellness, everyday retail",
    swatch: {
      bg: "rgb(246 249 251)",
      primary: "rgb(74 110 140)",
      secondary: "rgb(110 122 132)",
    },
    provisional: true,
  },
  {
    id: "vows",
    name: "Vows",
    tagline: "Warm ivory, gentle and ceremonial.",
    suitableFor: "Weddings, gifts, stationery, keepsakes",
    swatch: {
      bg: "rgb(252 250 246)",
      primary: "rgb(140 118 96)",
      secondary: "rgb(168 148 138)",
    },
    provisional: true,
  },
  {
    id: "strada",
    name: "Strada",
    tagline: "Quiet stone and olive, street-simple.",
    suitableFor: "Cafes, homewares, neighborhood shops",
    swatch: {
      bg: "rgb(248 247 244)",
      primary: "rgb(96 108 88)",
      secondary: "rgb(130 122 112)",
    },
    provisional: true,
  },
];

export function getVibeMeta(id: Vibe): VibeMeta {
  return VIBES.find((v) => v.id === id)!;
}
