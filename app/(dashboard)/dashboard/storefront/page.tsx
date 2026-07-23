import { ArrowUpRight } from "lucide-react";

import { StorefrontEditor } from "@/components/dashboard/storefront-editor";
import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { getStorefrontPreviewUrl, getStorefrontUrl } from "@/lib/host";
import type { Product } from "@/lib/stores/types";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Storefront — Nomi" };

export default async function StorefrontPage() {
  const { supabase, store } = await requireSellerStore();
  const storeUrl = getStorefrontUrl(store.slug);
  const isPublished = store.status === "published";
  const openUrl = isPublished
    ? storeUrl
    : getStorefrontPreviewUrl(store.slug);

  const { data: products } = await supabase
    .from("products")
    .select("name, price_cents, image_url, category")
    .eq("store_id", store.id)
    .eq("status", "live")
    .order("created_at", { ascending: true })
    .limit(4);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <DashboardBackLink href="/more" label="More" />
        <div className="mt-4">
          <DashboardPageHeader
            title="Storefront"
            description="Choose your vibe, logo, and tagline buyers see first."
            action={
              <a
                href={openUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-brand-dark inline-flex h-11 items-center gap-2 px-5"
              >
                {isPublished ? "Open storefront" : "Preview store"}
                <ArrowUpRight className="size-4" strokeWidth={2.5} />
              </a>
            }
          />
        </div>
      </div>

      <StorefrontEditor
        store={store}
        products={
          (products as Pick<
            Product,
            "name" | "price_cents" | "image_url" | "category"
          >[]) ?? []
        }
      />
    </div>
  );
}
