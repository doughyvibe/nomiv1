"use client";

import Link from "next/link";

import {
  BrandCta,
  BrandLinkOutline,
} from "@/components/dashboard/dashboard-ui";
import { Wordmark } from "@/components/marketing/wordmark";

export function BrandErrorScreen({
  title,
  description,
  onRetry,
  homeHref = "/",
  homeLabel = "Back to home",
}: {
  title: string;
  description: string;
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
}) {
  return (
    <div
      data-brand
      className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-12 text-foreground"
    >
      <div
        className="brand-grain pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <main className="relative w-full max-w-md text-center">
        <div className="flex justify-center">
          <Link href={homeHref} aria-label="Nomi home">
            <Wordmark />
          </Link>
        </div>
        <h1 className="font-display mt-8 text-2xl font-extrabold tracking-[-0.02em]">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          {onRetry ? (
            <BrandCta type="button" onClick={onRetry} className="sm:min-w-36">
              Try again
            </BrandCta>
          ) : null}
          <BrandLinkOutline href={homeHref} className="sm:min-w-36">
            {homeLabel}
          </BrandLinkOutline>
        </div>
      </main>
    </div>
  );
}
