"use client";

import { BrandErrorScreen } from "@/components/brand/brand-error-screen";
import { getMarketingUrl } from "@/lib/host";

export default function MarketingError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <BrandErrorScreen
      title="Something went wrong"
      description="This page failed to load. Try again, or head back to the Nomi home page."
      onRetry={reset}
      homeHref={getMarketingUrl("/")}
      homeLabel="Back to Nomi"
    />
  );
}
