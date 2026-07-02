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
    id: "industrial",
    name: "Industrial",
    tagline: "Rugged, dark, forged metal at night.",
    suitableFor: "Outdoor gear, tools, fishing, performance products",
    swatch: {
      bg: "rgb(8 14 19)",
      primary: "rgb(45 212 191)",
      secondary: "rgb(168 106 58)",
    },
    provisional: false,
  },
  {
    id: "unicorn",
    name: "Unicorn",
    tagline: "Soft, dreamy, playful pastels.",
    suitableFor: "Bakes, gifts, crafts, florals, handmade",
    swatch: {
      bg: "rgb(253 246 252)",
      primary: "rgb(217 70 160)",
      secondary: "rgb(147 118 224)",
    },
    provisional: true,
  },
  {
    id: "outback",
    name: "Outback",
    tagline: "Earthy, warm, rugged and grounded.",
    suitableFor: "Coffee, food, plants, leather, natural products",
    swatch: {
      bg: "rgb(247 241 231)",
      primary: "rgb(154 84 41)",
      secondary: "rgb(94 111 71)",
    },
    provisional: true,
  },
  {
    id: "futuristic",
    name: "Futuristic",
    tagline: "Sleek, sharp, digital neon.",
    suitableFor: "Tech, streetwear, gaming, modern accessories",
    swatch: {
      bg: "rgb(6 8 18)",
      primary: "rgb(94 234 212)",
      secondary: "rgb(192 132 252)",
    },
    provisional: true,
  },
];

export function getVibeMeta(id: Vibe): VibeMeta {
  return VIBES.find((v) => v.id === id)!;
}
