import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { StorefrontProvider } from "@/components/storefront/storefront-context";
import { StoreUnavailable } from "@/components/storefront/store-unavailable";
import { getOrderStorefrontChrome } from "@/lib/orders/load-order";
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
    // Existing order URLs must survive unpublish; catalogue stays blocked.
    const pathname = (await headers()).get("x-nomi-pathname") ?? "";
    const isOrderRoute = pathname.includes(`/s/${slug}/order/`);
    if (isOrderRoute) {
      const chrome = await getOrderStorefrontChrome(slug);
      if (chrome) {
        const vibe = chrome.store.vibe ?? "atelier";
        return (
          <div
            data-surface="storefront"
            data-vibe={vibe}
            className="min-h-dvh bg-vibe-bg text-vibe-text"
          >
            <StorefrontProvider value={chrome}>
              <StorefrontShell slug={slug}>{children}</StorefrontShell>
            </StorefrontProvider>
          </div>
        );
      }
    }

    return (
      <div data-surface="storefront" className="min-h-dvh">
        <StoreUnavailable slug={slug} />
      </div>
    );
  }

  const storefront = await getPublishedStorefront(slug);
  if (!storefront) notFound();

  const vibe = storefront.store.vibe ?? "atelier";

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
