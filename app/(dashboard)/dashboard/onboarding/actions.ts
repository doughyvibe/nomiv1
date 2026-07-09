"use server";

import {
  addProductAction,
  type ProductInput,
} from "@/app/(dashboard)/dashboard/products/actions";
import { friendlyDbError } from "@/lib/errors/friendly-db";
import { isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { isValidSgMobile, isValidUen } from "@/lib/paynow";
import { suggestAlternatives, validateSlugFormat } from "@/lib/slug";
import {
  fulfillmentIsComplete,
  heroIsComplete,
  paynowIsComplete,
  type FulfillmentConfig,
  type HeroConfig,
  type PayNowConfig,
  type Store,
  type TradeHint,
  type Vibe,
} from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function getOwnedStore() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .neq("status", "deleted")
    .maybeSingle<Store>();

  return { supabase, user, store };
}

// ---------------------------------------------------------------------------
// Step 1 — slug check + store creation
// ---------------------------------------------------------------------------

export type SlugCheckResult = {
  available: boolean;
  error?: string;
  suggestions?: string[];
};

export async function checkSlugAvailability(
  slug: string,
): Promise<SlugCheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { available: false, error: "Sign in to check availability" };

  if (await isRateLimited("slug-check", 30, 60_000)) {
    return { available: false, error: RATE_LIMIT_MESSAGE };
  }

  const formatError = validateSlugFormat(slug);
  if (formatError) return { available: false, error: formatError };

  const [{ data: reserved }, { data: existing }] = await Promise.all([
    supabase.from("reserved_slugs").select("slug").eq("slug", slug).maybeSingle(),
    supabase.from("stores").select("id").eq("slug", slug).maybeSingle(),
  ]);

  if (reserved) {
    return { available: false, error: "This name is reserved" };
  }
  if (existing) {
    return {
      available: false,
      error: "Already taken",
      suggestions: suggestAlternatives(slug),
    };
  }
  return { available: true };
}

export async function createStore(
  name: string,
  slug: string,
): Promise<ActionResult> {
  const trimmedName = name.trim();
  if (!trimmedName) return { ok: false, error: "Store name is required" };
  if (trimmedName.length > 60) {
    return { ok: false, error: "Store name must be at most 60 characters" };
  }

  const check = await checkSlugAvailability(slug);
  if (!check.available) {
    return { ok: false, error: check.error ?? "Slug unavailable" };
  }

  const { supabase, user, store } = await getOwnedStore();
  if (store) return { ok: false, error: "You already have a store" };

  const { error } = await supabase.from("stores").insert({
    owner_id: user.id,
    name: trimmedName,
    slug,
  });

  if (error) {
    // unique violation = lost a race for the slug
    if (error.code === "23505") {
      return { ok: false, error: "Already taken" };
    }
    return { ok: false, error: friendlyDbError(error) };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Step 2 — vibe
// ---------------------------------------------------------------------------

const VALID_VIBES: Vibe[] = ["atelier", "outback", "futuristic", "epicurean"];

export async function saveVibe(vibe: Vibe): Promise<ActionResult> {
  if (!VALID_VIBES.includes(vibe)) return { ok: false, error: "Invalid vibe" };

  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { error } = await supabase
    .from("stores")
    .update({ vibe })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
}

export async function saveTradeHint(
  tradeHint: TradeHint,
): Promise<ActionResult> {
  const valid: TradeHint[] = [
    "general",
    "food",
    "handmade",
    "services",
    "plants",
  ];
  if (!valid.includes(tradeHint)) {
    return { ok: false, error: "Invalid store type" };
  }

  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { error } = await supabase
    .from("stores")
    .update({ trade_hint: tradeHint })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
}

// ---------------------------------------------------------------------------
// Step 3 — hero
// ---------------------------------------------------------------------------

export async function saveHero(hero: HeroConfig): Promise<ActionResult> {
  if (!heroIsComplete(hero)) {
    return { ok: false, error: "Hero title is required" };
  }

  const clean: HeroConfig = {
    eyebrow: hero.eyebrow?.trim() || undefined,
    title: hero.title.trim().slice(0, 80),
    subheading: hero.subheading?.trim() || undefined,
    logo_url: hero.logo_url || undefined,
    logo_size:
      hero.logo_url &&
      (hero.logo_size === "s" ||
        hero.logo_size === "m" ||
        hero.logo_size === "l")
        ? hero.logo_size
        : undefined,
    logo_style:
      hero.logo_url &&
      (hero.logo_style === "plain" ||
        hero.logo_style === "rounded" ||
        hero.logo_style === "circle")
        ? hero.logo_style
        : undefined,
  };

  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { error } = await supabase
    .from("stores")
    .update({ hero: clean })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
}

// ---------------------------------------------------------------------------
// Step 4 — products (addProduct lives in dashboard/products/actions.ts)
// ---------------------------------------------------------------------------

export type NewProduct = ProductInput;

export async function addProduct(
  product: NewProduct,
): Promise<ActionResult> {
  const result = await addProductAction(product);
  if ("error" in result) return { ok: false, error: result.error };
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Step 5 — fulfillment
// ---------------------------------------------------------------------------

export async function saveFulfillment(
  config: FulfillmentConfig,
): Promise<ActionResult> {
  if (!fulfillmentIsComplete(config)) {
    return {
      ok: false,
      error:
        "Enable at least one method with its details (delivery needs a fee and instructions).",
    };
  }

  const clean: FulfillmentConfig = {};
  if (config.pickup?.enabled) {
    clean.pickup = {
      enabled: true,
      instructions: config.pickup.instructions.trim(),
      location: config.pickup.location?.trim() || undefined,
    };
  }
  if (config.delivery?.enabled) {
    clean.delivery = {
      enabled: true,
      fee_cents: Math.round(config.delivery.fee_cents),
      instructions: config.delivery.instructions.trim(),
    };
  }

  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { error } = await supabase
    .from("stores")
    .update({ fulfillment: clean })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
}

// ---------------------------------------------------------------------------
// Step 6 — PayNow
// ---------------------------------------------------------------------------

export async function savePayNow(config: PayNowConfig): Promise<ActionResult> {
  if (!paynowIsComplete(config)) {
    return { ok: false, error: "All PayNow fields are required" };
  }

  const value = config.proxy_value.trim();
  if (config.proxy_type === "mobile" && !isValidSgMobile(value)) {
    return {
      ok: false,
      error: "Enter a valid SG mobile (8 digits starting with 8 or 9)",
    };
  }
  if (config.proxy_type === "uen" && !isValidUen(value)) {
    return { ok: false, error: "Enter a valid UEN (e.g. 201403121W)" };
  }

  const clean: PayNowConfig = {
    proxy_type: config.proxy_type,
    proxy_value: value,
    recipient_name: config.recipient_name.trim().slice(0, 50),
    instructions: config.instructions?.trim() || undefined,
  };

  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { error } = await supabase
    .from("stores")
    .update({ paynow: clean })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
}

// ---------------------------------------------------------------------------
// Step 7 — publish
// ---------------------------------------------------------------------------

export async function publishStore(): Promise<ActionResult> {
  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store.id)
    .eq("archived", false);

  const complete =
    store.vibe &&
    heroIsComplete(store.hero) &&
    (count ?? 0) > 0 &&
    fulfillmentIsComplete(store.fulfillment) &&
    paynowIsComplete(store.paynow);

  if (!complete) {
    return { ok: false, error: "Complete all onboarding steps first" };
  }

  const { error } = await supabase
    .from("stores")
    .update({ status: "published" })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
}
