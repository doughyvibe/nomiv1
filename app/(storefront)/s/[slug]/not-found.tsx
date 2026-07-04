import Link from "next/link";

import { getMarketingUrl } from "@/lib/host";

export default function StorefrontNotFound() {
  return (
    <div data-surface="storefront" className="min-h-full">
      <main className="flex min-h-full flex-col items-center justify-center p-8 text-center">
        <p className="font-display text-sm tracking-widest uppercase text-vibe-text-muted">
          404
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold text-vibe-text">
          Store not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-vibe-text-muted">
          This Nomi store link doesn&apos;t exist. Double-check the URL or ask
          the seller for their latest link.
        </p>
        <Link
          href={getMarketingUrl()}
          className="mt-6 text-sm font-medium text-vibe-primary underline-offset-4 hover:underline"
        >
          Go to Nomi
        </Link>
      </main>
    </div>
  );
}
