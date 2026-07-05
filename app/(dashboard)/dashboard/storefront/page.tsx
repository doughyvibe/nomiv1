import { ArrowUpRight } from "lucide-react";

import { StorefrontEditor } from "@/components/dashboard/storefront-editor";
import {
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-ui";
import { getStorefrontUrl } from "@/lib/host";
import type { Product } from "@/lib/stores/types";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function StorefrontPage() {
  const { supabase, store } = await requireSellerStore();
  const storeUrl = getStorefrontUrl(store.slug);

  const { data: products } = await supabase
    .from("products")
    .select("name, price_cents, image_url, category")
    .eq("store_id", store.id)
    .eq("archived", false)
    .order("created_at", { ascending: true })
    .limit(4);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        eyebrow={store.name}
        title="Storefront"
        description="Choose your vibe and design the hero buyers see first."
        action={
          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-brand-dark inline-flex h-11 items-center gap-2 px-5"
          >
            Open storefront
            <ArrowUpRight className="size-4" strokeWidth={2.5} />
          </a>
        }
      />

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
