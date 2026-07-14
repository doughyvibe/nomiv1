import Link from "next/link";

import { Wordmark } from "@/components/marketing/wordmark";
import { getLoginUrl, getMarketingUrl } from "@/lib/host";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div data-brand className="relative min-h-dvh text-foreground">
      <div
        className="brand-grain pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
        <header className="flex items-center justify-between gap-4">
          <Link href={getMarketingUrl("/")} aria-label="Nomi home">
            <Wordmark />
          </Link>
          <Link
            href={getLoginUrl("create")}
            className="text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Sign in
          </Link>
        </header>

        <main className="mt-10">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated {updated}
          </p>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {children}
          </div>
        </main>

        <p className="mt-12 text-sm text-muted-foreground">
          <Link
            href={getMarketingUrl("/")}
            className="underline underline-offset-2 hover:text-foreground"
          >
            ← Back to Nomi
          </Link>
        </p>
      </div>
    </div>
  );
}
