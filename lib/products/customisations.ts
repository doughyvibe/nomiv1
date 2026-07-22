/** Typed product customisations. No metafields, no file upload. */

export const CUSTOMISATION_TYPES = [
  "text",
  "single_select",
  "yes_no",
  "multi_select",
] as const;

export type CustomisationType = (typeof CUSTOMISATION_TYPES)[number];

/** Types merchants can create in the editor (yes_no is legacy-only). */
export const EDITOR_CUSTOMISATION_TYPES = [
  "text",
  "single_select",
  "multi_select",
] as const;

export const MAX_CUSTOMISATIONS = 8;
export const MAX_CUSTOMISATION_CHOICES = 20;

export type CustomisationChoice = {
  label: string;
  /** Extra fee when this choice is selected; null = free */
  price_cents: number | null;
};

export type ProductCustomisation = {
  id: string;
  label: string;
  type: CustomisationType;
  required: boolean;
  choices: CustomisationChoice[];
  /** yes_no fee when answered yes */
  price_cents: number | null;
  /** multi_select: minimum selections (null = inherit from required) */
  min_select: number | null;
  /** multi_select: maximum selections (null = all choices) */
  max_select: number | null;
  position: number;
};

/** Merchant form / API payload. */
export type CustomisationsInput = Array<{
  label: string;
  type: CustomisationType;
  required: boolean;
  choices?: Array<{ label: string; price_cents: number | null }>;
  price_cents?: number | null;
  min_select?: number | null;
  max_select?: number | null;
}>;

/** Cart / checkout answer keyed by customisation id. */
export type CustomisationAnswers = Record<
  string,
  string | string[] | boolean
>;

/** Immutable line snapshot for order_items.customisations_snapshot. */
export type CustomisationSnapshotEntry = {
  id: string;
  label: string;
  type: CustomisationType;
  answer: string | string[] | boolean;
  display: string;
  price_cents: number;
};

export function productHasCustomisations(product: {
  customisations?: ProductCustomisation[] | null;
}): boolean {
  return (product.customisations?.length ?? 0) > 0;
}

export function productHasRequiredCustomisations(product: {
  customisations?: ProductCustomisation[] | null;
}): boolean {
  return (product.customisations ?? []).some((c) => c.required);
}

/** Variants or required customisations → block instant Quick Add. */
export function productRequiresConfig(product: {
  variants?: { length: number } | null;
  customisations?: ProductCustomisation[] | null;
}): boolean {
  return (
    (product.variants?.length ?? 0) > 0 ||
    productHasRequiredCustomisations(product)
  );
}

function isCustomisationType(v: string): v is CustomisationType {
  return (CUSTOMISATION_TYPES as readonly string[]).includes(v);
}

function validPrice(cents: number | null | undefined): boolean {
  if (cents == null) return true;
  return (
    Number.isInteger(cents) && cents >= 0 && cents <= 100_000_00
  );
}

/** Effective min for multi_select: explicit min, else 1 if required else 0. */
export function multiSelectMin(def: {
  required: boolean;
  min_select: number | null;
}): number {
  if (def.min_select != null) return def.min_select;
  return def.required ? 1 : 0;
}

/** Effective max for multi_select: explicit max, else choice count. */
export function multiSelectMax(def: {
  choices: { length: number };
  max_select: number | null;
}): number {
  if (def.max_select != null) return def.max_select;
  return def.choices.length;
}

/** Buyer-facing hint for multi_select bounds. */
export function multiSelectHint(def: {
  required: boolean;
  choices: { length: number };
  min_select: number | null;
  max_select: number | null;
}): string | null {
  const min = multiSelectMin(def);
  const max = multiSelectMax(def);
  if (def.choices.length === 0) return null;
  if (min <= 0 && max >= def.choices.length) return null;
  if (min === max) return `Choose exactly ${min}`;
  if (min <= 0) return `Choose up to ${max}`;
  if (max >= def.choices.length) return `Choose at least ${min}`;
  return `Choose ${min}–${max}`;
}

/**
 * Validate merchant customisations payload.
 * Empty array / null = no customisations.
 */
export function validateCustomisationsInput(
  input: CustomisationsInput | null | undefined,
): string | null {
  if (input == null) return null;
  if (!Array.isArray(input)) return "Invalid customisations";
  if (input.length === 0) return null;
  if (input.length > MAX_CUSTOMISATIONS) {
    return `You can ask up to ${MAX_CUSTOMISATIONS} things`;
  }

  const labelsSeen = new Set<string>();

  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    if (!row) return "Each question needs a label";
    const label = String(row.label ?? "").trim();
    if (!label) return "Give each question a label (for example Message on cake)";
    const labelKey = label.toLowerCase();
    if (labelsSeen.has(labelKey)) {
      return "Each question needs a different label";
    }
    labelsSeen.add(labelKey);

    if (!isCustomisationType(String(row.type ?? ""))) {
      return "Choose a question type (text, pick one, or pick multiple)";
    }
    const type = row.type;

    if (type === "text") {
      if (!validPrice(row.price_cents ?? null)) {
        return "Enter a valid add-on price, or leave it blank";
      }
      continue;
    }

    if (type === "yes_no") {
      if (!validPrice(row.price_cents ?? null)) {
        return "Enter a valid add-on price, or leave it blank";
      }
      continue;
    }

    // single_select / multi_select
    const rawChoices = row.choices ?? [];
    if (!Array.isArray(rawChoices) || rawChoices.length === 0) {
      return `Add at least one option for “${label}”`;
    }
    if (rawChoices.length > MAX_CUSTOMISATION_CHOICES) {
      return `Keep options under “${label}” to ${MAX_CUSTOMISATION_CHOICES} or fewer`;
    }
    const choiceSeen = new Set<string>();
    for (const c of rawChoices) {
      const name = String(c?.label ?? "").trim();
      if (!name) return `Remove blank options under “${label}”`;
      const key = name.toLowerCase();
      if (choiceSeen.has(key)) {
        return `“${name}” is listed twice under “${label}”`;
      }
      choiceSeen.add(key);
      if (!validPrice(c?.price_cents ?? null)) {
        return `Enter a valid price for options under “${label}”, or leave blank`;
      }
    }

    if (type === "multi_select") {
      const min =
        row.min_select == null || row.min_select === undefined
          ? null
          : Number(row.min_select);
      const max =
        row.max_select == null || row.max_select === undefined
          ? null
          : Number(row.max_select);
      if (min != null) {
        if (!Number.isInteger(min) || min < 0) {
          return `Minimum picks for “${label}” must be 0 or more`;
        }
        if (min > rawChoices.length) {
          return `Minimum picks for “${label}” can’t exceed the number of options`;
        }
      }
      if (max != null) {
        if (!Number.isInteger(max) || max < 1) {
          return `Maximum picks for “${label}” must be at least 1`;
        }
        if (max > rawChoices.length) {
          return `Maximum picks for “${label}” can’t exceed the number of options`;
        }
      }
      if (min != null && max != null && min > max) {
        return `Minimum picks can’t be more than maximum for “${label}”`;
      }
    }
  }

  return null;
}

/** True when all customisations have valid answers (bounds + required). */
export function customisationAnswersComplete(
  defs: ProductCustomisation[],
  answers: CustomisationAnswers | null | undefined,
): boolean {
  const a = answers ?? {};
  for (const def of defs) {
    const raw = a[def.id];
    if (def.type === "multi_select") {
      const n = Array.isArray(raw) ? raw.length : 0;
      if (n === 0) {
        if (multiSelectMin(def) > 0) return false;
        continue;
      }
      if (!answerSatisfies(def, raw)) return false;
      continue;
    }
    if (!def.required) continue;
    if (!answerSatisfies(def, raw)) return false;
  }
  return true;
}

function answerSatisfies(
  def: ProductCustomisation,
  raw: string | string[] | boolean | undefined,
): boolean {
  if (def.type === "text") {
    return typeof raw === "string" && raw.trim().length > 0;
  }
  if (def.type === "yes_no") {
    return typeof raw === "boolean";
  }
  if (def.type === "single_select") {
    if (typeof raw !== "string" || !raw.trim()) return false;
    return def.choices.some(
      (c) => c.label.toLowerCase() === raw.trim().toLowerCase(),
    );
  }
  if (def.type === "multi_select") {
    if (!Array.isArray(raw)) return false;
    const min = multiSelectMin(def);
    const max = multiSelectMax(def);
    if (raw.length < min || raw.length > max) return false;
    if (raw.length === 0) return min === 0;
    const allowed = new Set(def.choices.map((c) => c.label.toLowerCase()));
    return raw.every(
      (v) => typeof v === "string" && allowed.has(v.trim().toLowerCase()),
    );
  }
  return false;
}

/** Add-on fee cents for one customisation answer (0 if blank/no). */
export function customisationAnswerFeeCents(
  def: ProductCustomisation,
  raw: string | string[] | boolean | undefined,
): number {
  if (def.type === "text") return 0;
  if (def.type === "yes_no") {
    if (raw !== true) return 0;
    return def.price_cents ?? 0;
  }
  if (def.type === "single_select") {
    if (typeof raw !== "string" || !raw.trim()) return 0;
    const choice = def.choices.find(
      (c) => c.label.toLowerCase() === raw.trim().toLowerCase(),
    );
    return choice?.price_cents ?? 0;
  }
  if (def.type === "multi_select") {
    if (!Array.isArray(raw) || raw.length === 0) return 0;
    let sum = 0;
    for (const v of raw) {
      if (typeof v !== "string") continue;
      const choice = def.choices.find(
        (c) => c.label.toLowerCase() === v.trim().toLowerCase(),
      );
      sum += choice?.price_cents ?? 0;
    }
    return sum;
  }
  return 0;
}

export function totalCustomisationFeesCents(
  defs: ProductCustomisation[],
  answers: CustomisationAnswers | null | undefined,
): number {
  const a = answers ?? {};
  let sum = 0;
  for (const def of defs) {
    sum += customisationAnswerFeeCents(def, a[def.id]);
  }
  return sum;
}

function displayForAnswer(
  def: ProductCustomisation,
  raw: string | string[] | boolean,
): string {
  if (def.type === "text") return String(raw).trim();
  if (def.type === "yes_no") return raw === true ? "Yes" : "No";
  if (def.type === "single_select") return String(raw).trim();
  if (def.type === "multi_select" && Array.isArray(raw)) {
    return raw.map((v) => String(v).trim()).filter(Boolean).join(", ");
  }
  return String(raw);
}

/**
 * Build order snapshot entries from defs + answers.
 * Omits blank optional answers. Returns error string if invalid.
 */
export function buildCustomisationSnapshot(
  defs: ProductCustomisation[],
  answers: CustomisationAnswers | null | undefined,
): { error: string } | { entries: CustomisationSnapshotEntry[] } {
  if (!customisationAnswersComplete(defs, answers)) {
    return { error: "Fill in required details before checkout" };
  }
  const a = answers ?? {};
  const entries: CustomisationSnapshotEntry[] = [];

  for (const def of defs) {
    const raw = a[def.id];
    if (raw === undefined) continue;
    if (def.type === "text") {
      if (typeof raw !== "string" || !raw.trim()) {
        if (def.required) return { error: `Enter “${def.label}”` };
        continue;
      }
    } else if (def.type === "yes_no") {
      if (typeof raw !== "boolean") {
        if (def.required) return { error: `Answer “${def.label}”` };
        continue;
      }
    } else if (def.type === "single_select") {
      if (typeof raw !== "string" || !raw.trim()) {
        if (def.required) return { error: `Choose “${def.label}”` };
        continue;
      }
      if (!answerSatisfies(def, raw)) {
        return { error: `“${def.label}” is no longer available — update your cart` };
      }
    } else if (def.type === "multi_select") {
      if (!Array.isArray(raw) || raw.length === 0) {
        if (multiSelectMin(def) > 0) {
          return { error: `Choose “${def.label}”` };
        }
        continue;
      }
      if (!answerSatisfies(def, raw)) {
        const hint = multiSelectHint(def);
        return {
          error: hint
            ? `“${def.label}”: ${hint.toLowerCase()}`
            : `“${def.label}” is no longer available — update your cart`,
        };
      }
    }

    if (!answerSatisfies(def, raw) && def.required) {
      return { error: `Fill in “${def.label}”` };
    }
    if (raw === undefined) continue;
    if (def.type === "yes_no" && raw === false && !def.required) {
      continue;
    }
    if (!answerSatisfies(def, raw) && !def.required) continue;

    entries.push({
      id: def.id,
      label: def.label,
      type: def.type,
      answer: raw as string | string[] | boolean,
      display: displayForAnswer(def, raw as string | string[] | boolean),
      price_cents: customisationAnswerFeeCents(def, raw),
    });
  }

  return { entries };
}

/** Stable string for cart lineKey. Empty when no answers. */
export function serializeCustomisationsForKey(
  answers: CustomisationAnswers | null | undefined,
): string {
  if (!answers) return "";
  const keys = Object.keys(answers).sort();
  if (keys.length === 0) return "";
  return keys
    .map((k) => {
      const v = answers[k];
      if (typeof v === "boolean") return `${k}=${v ? "1" : "0"}`;
      if (Array.isArray(v)) {
        return `${k}=${[...v].map(String).sort().join(",")}`;
      }
      return `${k}=${String(v)}`;
    })
    .join("|");
}

/** Human lines for cart / order UI. */
export function formatCustomisationSnapshotLines(
  snapshot: CustomisationSnapshotEntry[] | null | undefined,
): string[] {
  if (!snapshot?.length) return [];
  return snapshot.map((e) => `${e.label}: ${e.display}`);
}
