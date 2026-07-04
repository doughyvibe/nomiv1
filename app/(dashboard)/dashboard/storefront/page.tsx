import { StorefrontEditor } from "@/components/dashboard/storefront-editor";
import { Button } from "@/components/ui/button";
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
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Storefront</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Vibe and hero for your public store
          </p>
        </div>
        <Button
          render={<a href={storeUrl} target="_blank" rel="noreferrer" />}
        >
          Open storefront
        </Button>
      </div>

      <StorefrontEditor
        store={store}
        products={(products as Pick<
          Product,
          "name" | "price_cents" | "image_url" | "category"
        >[]) ?? []}
      />
    </main>
  );
}
