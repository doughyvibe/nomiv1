import {
  Chivo,
  DM_Sans,
  EB_Garamond,
  Hanken_Grotesk,
  Inter,
  JetBrains_Mono,
  Orbitron,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Nomi brand font (marketing + future platform surfaces) — warm geometric sans */
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

/** Epicurean (Noir) vibe display font — docs/sampleDESIGN.md */
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Atelier — display serif (docs/atelier_storefront/atelierDESIGN.md) */
export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Atelier — body / UI sans */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

/** Expedition — industrial display (docs/expedition_storefront/DESIGN.md) */
export const chivo = Chivo({
  subsets: ["latin"],
  variable: "--font-chivo",
  weight: ["400", "700", "900"],
  display: "swap",
});

/** Expedition — technical labels / mono UI */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

/** Cyberpunk — neon display (docs/cyberpunk_storefront/screen.png) */
export const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/** Cyberpunk — body / UI */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
