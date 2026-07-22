/** Opt-in product choices. Caps: ≤2 option dims, ≤50 variants. */

export const MAX_OPTION_DIMENSIONS = 2;
export const MAX_VARIANTS = 50;

export type ProductOptionValue = {
  id: string;
  name: string;
  position: number;
};

export type ProductOption = {
  id: string;
  name: string;
  position: number;
  values: ProductOptionValue[];
};

export type ProductVariant = {
  id: string;
  option_value_ids: string[];
  label: string;
  /** null → use product.price_cents */
  price_cents: number | null;
  /** When product.track_inventory; null treated as 0 when tracking. */
  stock_qty?: number | null;
};

/** Merchant form / API payload for saving choices. */
export type ChoicesInput = {
  options: Array<{
    name: string;
    values: string[];
  }>;
  /** Parallel to cartesian of option values; price_cents null = product price */
  variants: Array<{
    valueNames: string[];
    price_cents: number | null;
    /** Required when product tracks inventory */
    stock_qty?: number | null;
  }>;
};

export function productHasChoices(product: {
  variants?: ProductVariant[] | null;
}): boolean {
  return (product.variants?.length ?? 0) > 0;
}

export function variantUnitPrice(
  productPriceCents: number,
  variant: ProductVariant | null | undefined,
): number {
  if (variant?.price_cents != null) return variant.price_cents;
  return productPriceCents;
}

/** Min effective unit price across variants (or product price if none). */
export function minOfferPriceCents(product: {
  price_cents: number;
  variants?: ProductVariant[] | null;
}): number {
  const variants = product.variants ?? [];
  if (variants.length === 0) return product.price_cents;
  let min = Number.POSITIVE_INFINITY;
  for (const v of variants) {
    min = Math.min(min, variantUnitPrice(product.price_cents, v));
  }
  return Number.isFinite(min) ? min : product.price_cents;
}

export function variantPricesDiffer(product: {
  price_cents: number;
  variants?: ProductVariant[] | null;
}): boolean {
  const variants = product.variants ?? [];
  if (variants.length < 2) return false;
  const prices = new Set(
    variants.map((v) => variantUnitPrice(product.price_cents, v)),
  );
  return prices.size > 1;
}

export function formatVariantLabel(valueNames: string[]): string {
  return valueNames.map((n) => n.trim()).filter(Boolean).join(" · ");
}

/** Cartesian product of value-name arrays (option order preserved). */
export function cartesianValueNames(options: string[][]): string[][] {
  if (options.length === 0) return [];
  return options.reduce<string[][]>(
    (acc, values) => {
      if (acc.length === 0) return values.map((v) => [v]);
      const next: string[][] = [];
      for (const prefix of acc) {
        for (const v of values) next.push([...prefix, v]);
      }
      return next;
    },
    [],
  );
}

export function expectedVariantCount(valueCounts: number[]): number {
  if (valueCounts.length === 0) return 0;
  return valueCounts.reduce((a, b) => a * b, 1);
}

/**
 * Validate merchant choices payload.
 * Returns a friendly error string or null when ok.
 * Empty/disabled choices: pass `null` (caller deletes rows).
 */
export function validateChoicesInput(
  choices: ChoicesInput | null | undefined,
): string | null {
  if (choices == null) return null;

  const { options, variants } = choices;
  if (!Array.isArray(options) || options.length === 0) {
    return "Add at least one choice (for example Flavour or Size), or turn choices off";
  }
  if (options.length > MAX_OPTION_DIMENSIONS) {
    return `You can add up to ${MAX_OPTION_DIMENSIONS} kinds of choices (for example Flavour and Size)`;
  }

  const normalizedOptions: { name: string; values: string[] }[] = [];
  const optionNamesSeen = new Set<string>();

  for (let i = 0; i < options.length; i++) {
    const name = String(options[i]?.name ?? "").trim();
    if (!name) return "Give each choice a name (for example Flavour)";
    const nameKey = name.toLowerCase();
    if (optionNamesSeen.has(nameKey)) {
      return "Each choice needs a different name";
    }
    optionNamesSeen.add(nameKey);

    const rawValues = options[i]?.values ?? [];
    if (!Array.isArray(rawValues) || rawValues.length === 0) {
      return `Add at least one option for “${name}”`;
    }

    const values: string[] = [];
    const valueSeen = new Set<string>();
    for (const raw of rawValues) {
      const v = String(raw ?? "").trim();
      if (!v) return `Remove blank options under “${name}”`;
      const key = v.toLowerCase();
      if (valueSeen.has(key)) {
        return `“${v}” is listed twice under “${name}”`;
      }
      valueSeen.add(key);
      values.push(v);
    }
    normalizedOptions.push({ name, values });
  }

  const comboCount = expectedVariantCount(
    normalizedOptions.map((o) => o.values.length),
  );
  if (comboCount > MAX_VARIANTS) {
    return `Too many combinations (${comboCount}). Keep it to ${MAX_VARIANTS} or fewer — try fewer options under each choice`;
  }
  if (comboCount < 1) {
    return "Add at least one complete set of choices buyers can pick";
  }

  if (!Array.isArray(variants) || variants.length === 0) {
    return "Add at least one complete set of choices buyers can pick";
  }
  if (variants.length !== comboCount) {
    return "Some choice combinations are missing. Check every Flavour × Size pairing";
  }

  const expectedKeys = new Set(
    cartesianValueNames(normalizedOptions.map((o) => o.values)).map((names) =>
      names.map((n) => n.toLowerCase()).join("\0"),
    ),
  );
  const seenKeys = new Set<string>();

  for (const row of variants) {
    if (!row || !Array.isArray(row.valueNames)) {
      return "Each combination needs its choices filled in";
    }
    if (row.valueNames.length !== normalizedOptions.length) {
      return "Each combination needs one pick for every choice";
    }
    for (let i = 0; i < row.valueNames.length; i++) {
      const v = String(row.valueNames[i] ?? "").trim();
      if (!v) return "Each combination needs its choices filled in";
      const allowed = normalizedOptions[i].values.map((x) => x.toLowerCase());
      if (!allowed.includes(v.toLowerCase())) {
        return `“${v}” is not a valid option for “${normalizedOptions[i].name}”`;
      }
    }
    const key = row.valueNames.map((n) => n.trim().toLowerCase()).join("\0");
    if (seenKeys.has(key)) {
      return "Duplicate choice combinations — each pairing should appear once";
    }
    seenKeys.add(key);
    if (!expectedKeys.has(key)) {
      return "Some choice combinations don’t match your options";
    }
    if (
      row.price_cents != null &&
      (!Number.isInteger(row.price_cents) ||
        row.price_cents < 0 ||
        row.price_cents > 100_000_00)
    ) {
      return "Enter a valid price for each combination (or leave blank to use the product price)";
    }
  }

  if (seenKeys.size !== expectedKeys.size) {
    return "Some choice combinations are missing. Check every pairing";
  }

  return null;
}

/** Find variant matching selected value ids (order-insensitive). */
export function findVariantByValueIds(
  variants: ProductVariant[],
  selectedValueIds: string[],
): ProductVariant | undefined {
  if (selectedValueIds.length === 0) return undefined;
  const want = new Set(selectedValueIds);
  return variants.find((v) => {
    if (v.option_value_ids.length !== want.size) return false;
    return v.option_value_ids.every((id) => want.has(id));
  });
}
