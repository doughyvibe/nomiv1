import { cache } from "react";

import type { Product, Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export type StorefrontGate =
  | { kind: "not_found" }
  | { kind: "unavailable" }
  | { kind: "published" };

export type PublishedStorefront = {
  store: Store;
  products: Product[];
};

/** Distinguish missing slug vs unpublished (RLS hides non-published rows from anon). */
export const resolveStorefrontGate = cache(
  async (slug: string): Promise<StorefrontGate> => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("resolve_storefront_slug", {
      p_slug: slug,
    });

    if (error) {
      // ponytail: if migration not applied yet, fall back to direct published lookup
      const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      return store ? { kind: "published" } : { kind: "not_found" };
    }

    if (data === "published") return { kind: "published" };
    if (data === "unavailable") return { kind: "unavailable" };
    return { kind: "not_found" };
  },
);

/** Load a published store + active products. Deduped per request via React cache. */
export const getPublishedStorefront = cache(
  async (slug: string): Promise<PublishedStorefront | null> => {
    const supabase = await createClient();

    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle<Store>();

    if (!store) return null;

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("archived", false)
      .order("created_at", { ascending: true });

    return { store, products: (products as Product[]) ?? [] };
  },
);
