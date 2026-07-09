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
