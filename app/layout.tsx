import type { Metadata, Viewport } from "next";
import {
  archivoBlack,
  bebasNeue,
  hankenGrotesk,
  inter,
  oswald,
  syne,
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
      className={`${inter.variable} ${hankenGrotesk.variable} ${oswald.variable} ${archivoBlack.variable} ${syne.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">{children}</body>
    </html>
  );
}
