import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nomi — PayNow storefronts for social sellers",
  description:
    "Turn your bio into a PayNow-ready storefront. Built for Singapore social sellers.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-full">{children}</div>;
}
