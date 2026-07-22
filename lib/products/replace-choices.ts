import type { SupabaseClient } from "@supabase/supabase-js";

import {
  formatVariantLabel,
  type ChoicesInput,
} from "@/lib/products/variants";

/**
 * Replace all choice rows for a product (delete + recreate).
 * Pass null to clear choices (simple product = zero variant rows).
 */
export async function replaceProductChoices(
  supabase: SupabaseClient,
  productId: string,
  choices: ChoicesInput | null,
): Promise<{ error: string } | { success: true }> {
  // Cascade deletes values; variants are on product_id
  const { error: delOptErr } = await supabase
    .from("product_options")
    .delete()
    .eq("product_id", productId);
  if (delOptErr) return { error: delOptErr.message };

  const { error: delVarErr } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", productId);
  if (delVarErr) return { error: delVarErr.message };

  if (choices == null || choices.options.length === 0) {
    return { success: true };
  }

  const optionIdByName = new Map<string, string>();
  const valueIdByKey = new Map<string, string>(); // `${optionPos}\0${valueNameLower}` → id

  for (let oi = 0; oi < choices.options.length; oi++) {
    const opt = choices.options[oi];
    const name = opt.name.trim();
    const { data: optionRow, error: optErr } = await supabase
      .from("product_options")
      .insert({
        product_id: productId,
        name,
        position: oi,
      })
      .select("id")
      .single();

    if (optErr || !optionRow) {
      return { error: optErr?.message ?? "Could not save choices" };
    }
    optionIdByName.set(name.toLowerCase(), optionRow.id);

    for (let vi = 0; vi < opt.values.length; vi++) {
      const valueName = opt.values[vi].trim();
      const { data: valueRow, error: valErr } = await supabase
        .from("product_option_values")
        .insert({
          option_id: optionRow.id,
          name: valueName,
          position: vi,
        })
        .select("id")
        .single();

      if (valErr || !valueRow) {
        return { error: valErr?.message ?? "Could not save choice options" };
      }
      valueIdByKey.set(`${oi}\0${valueName.toLowerCase()}`, valueRow.id);
    }
  }

  const variantRows = [];
  for (const v of choices.variants) {
    const valueNames = v.valueNames.map((n) => n.trim());
    const option_value_ids: string[] = [];
    for (let i = 0; i < valueNames.length; i++) {
      const id = valueIdByKey.get(`${i}\0${valueNames[i].toLowerCase()}`);
      if (!id) {
        return { error: "Could not save choice combinations" };
      }
      option_value_ids.push(id);
    }
    variantRows.push({
      product_id: productId,
      option_value_ids,
      label: formatVariantLabel(valueNames),
      price_cents: v.price_cents,
      stock_qty: v.stock_qty ?? null,
    });
  }

  const { error: varErr } = await supabase
    .from("product_variants")
    .insert(variantRows);

  if (varErr) return { error: varErr.message };
  return { success: true };
}
