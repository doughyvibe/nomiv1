import type { SupabaseClient } from "@supabase/supabase-js";

import type { CustomisationsInput } from "@/lib/products/customisations";

/**
 * Replace all customisation rows for a product (delete + recreate).
 * Pass null / [] to clear.
 */
export async function replaceProductCustomisations(
  supabase: SupabaseClient,
  productId: string,
  input: CustomisationsInput | null,
): Promise<{ error: string } | { success: true }> {
  const { error: delErr } = await supabase
    .from("product_customisations")
    .delete()
    .eq("product_id", productId);
  if (delErr) return { error: delErr.message };

  if (input == null || input.length === 0) {
    return { success: true };
  }

  const rows = input.map((row, position) => {
    const type = row.type;
    const choices =
      type === "single_select" || type === "multi_select"
        ? (row.choices ?? []).map((c) => ({
            label: c.label.trim(),
            price_cents: c.price_cents,
          }))
        : [];

    return {
      product_id: productId,
      label: row.label.trim(),
      type,
      required: Boolean(row.required),
      choices,
      price_cents:
        type === "yes_no" ? (row.price_cents ?? null) : null,
      min_select: type === "multi_select" ? (row.min_select ?? null) : null,
      max_select: type === "multi_select" ? (row.max_select ?? null) : null,
      position,
    };
  });

  const { error: insErr } = await supabase
    .from("product_customisations")
    .insert(rows);

  if (insErr) return { error: insErr.message };
  return { success: true };
}
