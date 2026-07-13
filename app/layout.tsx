import type { Metadata, Viewport } from "next";
import {
  chivo,
  dmSans,
  ebGaramond,
  hankenGrotesk,
  inter,
  jetbrainsMono,
  leagueSpartan,
  libreCaslonText,
  orbitron,
  playfairDisplay,
  poppins,
  plusJakartaSans,
  satoshi,
  spaceGrotesk,
} from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nomi",
  description: "Turn your bio into a PayNow-ready storefront.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hankenGrotesk.variable} ${plusJakartaSans.variable} ${ebGaramond.variable} ${dmSans.variable} ${chivo.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${spaceGrotesk.variable} ${leagueSpartan.variable} ${satoshi.variable} ${libreCaslonText.variable} ${playfairDisplay.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">{children}</body>
    </html>
  );
}
