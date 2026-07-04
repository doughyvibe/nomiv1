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
      bg: "linear-gradient(180deg, #f5e6ff, #dbc9f0)",
      primary: "rgb(223 255 0)",
      secondary: "rgb(147 118 224)",
    },
    provisional: false,
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
    provisional: false,
  },
  {
    id: "futuristic",
    name: "Futuristic",
    tagline: "Sleek, sharp, digital neon.",
    suitableFor: "Tech, streetwear, gaming, modern accessories",
    swatch: {
      bg: "rgb(10 10 10)",
      primary: "rgb(0 229 255)",
      secondary: "rgb(176 38 255)",
    },
    provisional: false,
  },
];

export function getVibeMeta(id: Vibe): VibeMeta {
  return VIBES.find((v) => v.id === id)!;
}
