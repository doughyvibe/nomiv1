"use client";

import { BrandErrorScreen } from "@/components/brand/brand-error-screen";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <BrandErrorScreen
      title="Something went wrong"
      description="We hit a snag loading this page. Try again, or go back to your dashboard home."
      onRetry={reset}
      homeHref="/"
      homeLabel="Dashboard home"
    />
  );
}
