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
];

export function getVibeMeta(id: Vibe): VibeMeta {
  return VIBES.find((v) => v.id === id)!;
}
