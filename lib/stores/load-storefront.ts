import { cache } from "react";

import { attachProductChoices } from "@/lib/products/load-choices";
import { attachProductCustomisations } from "@/lib/products/load-customisations";
import { filterVisibleStorefrontProducts } from "@/lib/products/inventory";
import type { Product, Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

async function attachProductExtras(
  supabase: Awaited<ReturnType<typeof createClient>>,
  products: Product[],
): Promise<Product[]> {
  const withChoices = await attachProductChoices(supabase, products);
  return attachProductCustomisations(supabase, withChoices);
}

export type StorefrontGate =
  | { kind: "not_found" }
  | { kind: "coming_soon"; name: string }
  | { kind: "unavailable"; name?: string; status?: string }
  | { kind: "published" };

export type PublishedStorefront = {
  store: Store;
  products: Product[];
  /** Owner-only private preview of a non-live store */
  previewMode?: boolean;
};

/** Distinguish missing slug vs draft / unpublished without exposing private data. */
export const resolveStorefrontGate = cache(
  async (slug: string): Promise<StorefrontGate> => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("resolve_storefront_public", {
      p_slug: slug,
    });

    if (!error && data && typeof data === "object") {
      const row = data as {
        kind?: string;
        name?: string;
        status?: string;
      };
      if (row.kind === "published") return { kind: "published" };
      if (row.kind === "coming_soon") {
        return { kind: "coming_soon", name: row.name?.trim() || slug };
      }
      if (row.kind === "unavailable") {
        return {
          kind: "unavailable",
          name: row.name?.trim() || undefined,
          status: row.status,
        };
      }
      if (row.kind === "not_found") return { kind: "not_found" };
    }

    // ponytail: fall back if migration not applied yet
    const { data: legacy, error: legacyError } = await supabase.rpc(
      "resolve_storefront_slug",
      { p_slug: slug },
    );

    if (!legacyError && typeof legacy === "string") {
      if (legacy === "published") return { kind: "published" };
      if (legacy === "unavailable") return { kind: "unavailable" };
      return { kind: "not_found" };
    }

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    return store ? { kind: "published" } : { kind: "not_found" };
  },
);

/** Load a published store + live products (includes OOS; catalog callers filter). */
export const getPublishedStorefrontRaw = cache(
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
      .eq("status", "live")
      .order("created_at", { ascending: true });

    const withExtras = await attachProductExtras(
      supabase,
      (products as Product[]) ?? [],
    );
    return { store, products: withExtras };
  },
);

/** Public catalog: hide policy removes sold-out offers. */
export const getPublishedStorefront = cache(
  async (slug: string): Promise<PublishedStorefront | null> => {
    const raw = await getPublishedStorefrontRaw(slug);
    if (!raw) return null;
    return {
      ...raw,
      products: filterVisibleStorefrontProducts(raw.products),
    };
  },
);

/**
 * Full catalogue for the logged-in store owner (draft / unpublished).
 * Requires shared auth cookies across app.* and {slug}.* .
 */
export const getOwnerPreviewStorefront = cache(
  async (slug: string): Promise<PublishedStorefront | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .eq("owner_id", user.id)
      .neq("status", "deleted")
      .maybeSingle<Store>();

    if (!store || store.status === "published") {
      // Published shops use the normal public path
      return null;
    }

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("status", "live")
      .order("created_at", { ascending: true });

    const withChoices = await attachProductExtras(
      supabase,
      (products as Product[]) ?? [],
    );
    return {
      store,
      products: withChoices,
      previewMode: true,
    };
  },
);

/** Published shop (unfiltered for stock checks), or owner preview. */
export async function getCheckoutStorefront(
  slug: string,
): Promise<PublishedStorefront | null> {
  const published = await getPublishedStorefrontRaw(slug);
  if (published) return published;
  return getOwnerPreviewStorefront(slug);
}
