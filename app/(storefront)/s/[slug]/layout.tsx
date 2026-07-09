import { notFound } from "next/navigation";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { StorefrontProvider } from "@/components/storefront/storefront-context";
import { StoreUnavailable } from "@/components/storefront/store-unavailable";
import {
  getPublishedStorefront,
  resolveStorefrontGate,
} from "@/lib/stores/load-storefront";

export default async function StorefrontSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gate = await resolveStorefrontGate(slug);

  if (gate.kind === "not_found") notFound();

  if (gate.kind === "unavailable") {
    return (
      <div data-surface="storefront" className="min-h-dvh">
        <StoreUnavailable slug={slug} />
      </div>
    );
  }

  const storefront = await getPublishedStorefront(slug);
  if (!storefront) notFound();

  const vibe = storefront.store.vibe ?? "epicurean";

  return (
    <div
      data-surface="storefront"
      data-vibe={vibe}
      className="min-h-dvh bg-vibe-bg text-vibe-text"
    >
      <StorefrontProvider value={storefront}>
        <StorefrontShell slug={slug}>{children}</StorefrontShell>
      </StorefrontProvider>
    </div>
  );
}
