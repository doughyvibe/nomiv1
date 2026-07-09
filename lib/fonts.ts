import {
  Bebas_Neue,
  DM_Sans,
  EB_Garamond,
  Hanken_Grotesk,
  Inter,
  Plus_Jakarta_Sans,
  Syne,
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

/** Outback — warm rugged display (docs/outback/orangeTheme.md) */
export const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

/** Futuristic — neon urban display (docs/futuristic/neonTheme.md) */
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});
