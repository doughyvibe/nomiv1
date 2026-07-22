import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CustomisationChoice,
  CustomisationType,
  ProductCustomisation,
} from "@/lib/products/customisations";
import type { Product } from "@/lib/stores/types";

type CustomisationRow = {
  id: string;
  product_id: string;
  label: string;
  type: string;
  required: boolean;
  choices: unknown;
  price_cents: number | null;
  min_select: number | null;
  max_select: number | null;
  position: number;
};

function parseChoices(raw: unknown): CustomisationChoice[] {
  if (!Array.isArray(raw)) return [];
  const out: CustomisationChoice[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = String(
      (item as { label?: unknown }).label ?? "",
    ).trim();
    if (!label) continue;
    const priceRaw = (item as { price_cents?: unknown }).price_cents;
    const price_cents =
      priceRaw == null
        ? null
        : typeof priceRaw === "number" && Number.isInteger(priceRaw)
          ? priceRaw
          : null;
    out.push({ label, price_cents });
  }
  return out;
}

/** Attach customisations onto product rows (zero rows = none). */
export async function attachProductCustomisations(
  supabase: SupabaseClient,
  products: Product[],
): Promise<Product[]> {
  if (products.length === 0) return products;

  const productIds = products.map((p) => p.id);
  const { data } = await supabase
    .from("product_customisations")
    .select(
      "id, product_id, label, type, required, choices, price_cents, min_select, max_select, position",
    )
    .in("product_id", productIds)
    .order("position", { ascending: true });

  const rows = (data as CustomisationRow[] | null) ?? [];
  const byProduct = new Map<string, ProductCustomisation[]>();

  for (const row of rows) {
    const list = byProduct.get(row.product_id) ?? [];
    list.push({
      id: row.id,
      label: row.label,
      type: row.type as CustomisationType,
      required: Boolean(row.required),
      choices: parseChoices(row.choices),
      price_cents: row.price_cents,
      min_select: row.min_select ?? null,
      max_select: row.max_select ?? null,
      position: row.position,
    });
    byProduct.set(row.product_id, list);
  }

  return products.map((p) => ({
    ...p,
    customisations: byProduct.get(p.id) ?? [],
  }));
}
