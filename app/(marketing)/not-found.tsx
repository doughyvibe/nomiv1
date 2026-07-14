import Link from "next/link";

import { BrandLink } from "@/components/dashboard/dashboard-ui";
import { Wordmark } from "@/components/marketing/wordmark";
import { getLoginUrl, getMarketingUrl } from "@/lib/host";

export default function MarketingNotFound() {
  return (
    <div
      data-brand
      className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-12 text-foreground"
    >
      <div
        className="brand-grain pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <main className="relative max-w-md text-center">
        <Link href={getMarketingUrl("/")} aria-label="Nomi home">
          <Wordmark />
        </Link>
        <p className="mt-8 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          404
        </p>
        <h1 className="font-display mt-2 text-2xl font-extrabold tracking-[-0.02em]">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That link doesn&apos;t exist on Nomi.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <BrandLink href={getMarketingUrl("/")}>Back to Nomi</BrandLink>
          <Link
            href={getLoginUrl("create")}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Create a store
          </Link>
        </div>
      </main>
    </div>
  );
}
