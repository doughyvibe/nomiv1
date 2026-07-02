import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nomi",
  description: "Turn your bio into a PayNow-ready storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
