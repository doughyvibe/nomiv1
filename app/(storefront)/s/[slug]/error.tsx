"use client";

import Link from "next/link";

import { getMarketingUrl } from "@/lib/host";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      data-surface="storefront"
      className="flex min-h-dvh flex-col items-center justify-center bg-vibe-bg px-5 py-12 text-center text-vibe-text"
    >
      <main className="max-w-sm">
        <p className="font-display text-sm tracking-widest text-vibe-text-muted uppercase">
          Error
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-vibe-text-muted">
          This storefront page failed to load. Try again, or return to Nomi.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-vibe-primary px-5 text-sm font-semibold text-vibe-primary-fg"
          >
            Try again
          </button>
          <Link
            href={getMarketingUrl()}
            className="text-sm font-medium text-vibe-primary underline-offset-4 hover:underline"
          >
            Go to Nomi
          </Link>
        </div>
      </main>
    </div>
  );
}
