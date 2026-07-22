import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ProductOption,
  ProductOptionValue,
  ProductVariant,
} from "@/lib/products/variants";
import type { Product } from "@/lib/stores/types";

type OptionRow = {
  id: string;
  product_id: string;
  name: string;
  position: number;
};

type ValueRow = {
  id: string;
  option_id: string;
  name: string;
  position: number;
};

type VariantRow = {
  id: string;
  product_id: string;
  option_value_ids: string[];
  label: string;
  price_cents: number | null;
  stock_qty: number | null;
};

/** Attach options + variants onto flat product rows (zero rows = simple product). */
export async function attachProductChoices(
  supabase: SupabaseClient,
  products: Product[],
): Promise<Product[]> {
  if (products.length === 0) return products;

  const productIds = products.map((p) => p.id);

  const { data: optionRows } = await supabase
    .from("product_options")
    .select("id, product_id, name, position")
    .in("product_id", productIds)
    .order("position", { ascending: true });

  const options = (optionRows as OptionRow[] | null) ?? [];
  const optionIds = options.map((o) => o.id);

  const { data: valueRows } =
    optionIds.length === 0
      ? { data: [] as ValueRow[] }
      : await supabase
          .from("product_option_values")
          .select("id, option_id, name, position")
          .in("option_id", optionIds)
          .order("position", { ascending: true });

  const values = (valueRows as ValueRow[] | null) ?? [];

  const { data: variantRows } = await supabase
    .from("product_variants")
    .select("id, product_id, option_value_ids, label, price_cents, stock_qty")
    .in("product_id", productIds);

  const variants = (variantRows as VariantRow[] | null) ?? [];

  const valuesByOption = new Map<string, ProductOptionValue[]>();
  for (const v of values) {
    const list = valuesByOption.get(v.option_id) ?? [];
    list.push({ id: v.id, name: v.name, position: v.position });
    valuesByOption.set(v.option_id, list);
  }

  const optionsByProduct = new Map<string, ProductOption[]>();
  for (const o of options) {
    const list = optionsByProduct.get(o.product_id) ?? [];
    list.push({
      id: o.id,
      name: o.name,
      position: o.position,
      values: valuesByOption.get(o.id) ?? [],
    });
    optionsByProduct.set(o.product_id, list);
  }

  const variantsByProduct = new Map<string, ProductVariant[]>();
  for (const v of variants) {
    const list = variantsByProduct.get(v.product_id) ?? [];
    list.push({
      id: v.id,
      option_value_ids: v.option_value_ids ?? [],
      label: v.label,
      price_cents: v.price_cents,
      stock_qty: v.stock_qty,
    });
    variantsByProduct.set(v.product_id, list);
  }

  return products.map((p) => ({
    ...p,
    options: optionsByProduct.get(p.id) ?? [],
    variants: variantsByProduct.get(p.id) ?? [],
  }));
}
