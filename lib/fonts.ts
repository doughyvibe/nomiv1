import {
  Archivo_Black,
  Bebas_Neue,
  Hanken_Grotesk,
  Inter,
  Oswald,
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

/** Industrial vibe display font (PRD §10) */
export const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

/** Unicorn — soft pastel display (docs/unicorn/lavenderTheme.md) */
export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
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
