import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { StoreComingSoon } from "@/components/storefront/store-coming-soon";
import { StorefrontPreviewBanner } from "@/components/storefront/storefront-preview-banner";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { StorefrontProvider } from "@/components/storefront/storefront-context";
import { StoreUnavailable } from "@/components/storefront/store-unavailable";
import { getOrderStorefrontChrome } from "@/lib/orders/load-order";
import {
  getOwnerPreviewStorefront,
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
  const headerList = await headers();
  const pathname = headerList.get("x-nomi-pathname") ?? "";
  const wantsPreview = headerList.get("x-nomi-preview") === "1";

  if (gate.kind === "not_found") notFound();

  if (gate.kind === "published") {
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

  // Draft / unpublished: owner preview unlocks the full shop
  if (wantsPreview) {
    const preview = await getOwnerPreviewStorefront(slug);
    if (preview) {
      const vibe = preview.store.vibe ?? "atelier";
      return (
        <div
          data-surface="storefront"
          data-vibe={vibe}
          className="min-h-dvh bg-vibe-bg text-vibe-text"
        >
          <StorefrontProvider value={preview}>
            <StorefrontPreviewBanner />
            <StorefrontShell slug={slug}>{children}</StorefrontShell>
          </StorefrontProvider>
        </div>
      );
    }
  }

  // Existing order URLs must survive unpublish; catalogue stays blocked.
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

  if (gate.kind === "coming_soon") {
    return (
      <div data-surface="storefront" className="min-h-dvh">
        <StoreComingSoon storeName={gate.name} slug={slug} />
      </div>
    );
  }

  return (
    <div data-surface="storefront" className="min-h-dvh">
      <StoreUnavailable slug={slug} storeName={gate.name} />
    </div>
  );
}
