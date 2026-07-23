"use server";

import { revalidatePath } from "next/cache";

import {
  addProductAction,
  type ProductInput,
} from "@/app/(dashboard)/dashboard/products/actions";
import { friendlyDbError } from "@/lib/errors/friendly-db";
import { normalizeCampaignConfig } from "@/lib/fulfilment/campaigns";
import { sanitizeFulfillmentConfig } from "@/lib/fulfilment/dates";
import { isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { isValidSgMobile, isValidUen } from "@/lib/paynow";
import { suggestAlternatives, validateSlugFormat } from "@/lib/slug";
import {
  isBillingEnabled,
  subscriptionAllowsPublish,
} from "@/lib/billing/plans";
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

const VALID_TRADE_HINTS: TradeHint[] = [
  "general",
  "food",
  "handmade",
  "services",
  "plants",
];

/** Shared name + trade hint update (onboarding / settings). */
export async function updateStoreIdentity(input: {
  name: string;
  tradeHint: TradeHint | null;
}): Promise<ActionResult> {
  const trimmedName = input.name.trim();
  if (!trimmedName) return { ok: false, error: "Store name is required" };
  if (trimmedName.length > 60) {
    return { ok: false, error: "Store name must be at most 60 characters" };
  }
  if (input.tradeHint !== null && !VALID_TRADE_HINTS.includes(input.tradeHint)) {
    return { ok: false, error: "Invalid store type" };
  }

  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { error } = await supabase
    .from("stores")
    .update({
      name: trimmedName,
      trade_hint: input.tradeHint,
    })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
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

  // Bypass stores RLS via SECURITY DEFINER — draft slugs must count as taken
  // without exposing other merchants' rows (see is_store_slug_available).
  const { data: available, error: rpcError } = await supabase.rpc(
    "is_store_slug_available",
    { p_slug: slug },
  );

  if (rpcError) {
    return { available: false, error: friendlyDbError(rpcError) };
  }

  if (available) return { available: true };

  // Own current slug is fine when revisiting step 1
  const { data: ownStore } = await supabase
    .from("stores")
    .select("slug")
    .eq("owner_id", user.id)
    .neq("status", "deleted")
    .maybeSingle();
  if (ownStore?.slug === slug) return { available: true };

  const { data: reserved } = await supabase
    .from("reserved_slugs")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (reserved) {
    return { available: false, error: "This name is reserved" };
  }
  return {
    available: false,
    error: "Already taken",
    suggestions: suggestAlternatives(slug),
  };
}

/** Create draft store, or update name/slug while still draft (step 1 revisit). */
export async function saveStoreNameSlug(
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

  if (!store) {
    const { error } = await supabase.from("stores").insert({
      owner_id: user.id,
      name: trimmedName,
      slug,
      // ponytail: Atelier + hero title at claim — vibe/hero polish later on /storefront
      vibe: "atelier",
      hero: { title: trimmedName.slice(0, 80) },
    });

    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Already taken" };
      }
      return { ok: false, error: friendlyDbError(error) };
    }
    return { ok: true };
  }

  if (store.status !== "draft") {
    return {
      ok: false,
      error: "Store link can only be changed while setting up",
    };
  }

  if (store.name === trimmedName && store.slug === slug) {
    return { ok: true };
  }

  const hero =
    (store.hero.title ?? "").trim() === store.name.trim()
      ? { ...store.hero, title: trimmedName.slice(0, 80) }
      : store.hero;

  const { error } = await supabase
    .from("stores")
    .update({ name: trimmedName, slug, hero })
    .eq("id", store.id)
    .eq("owner_id", user.id);

  if (error) {
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

const VALID_VIBES: Vibe[] = [
  "atelier",
  "expedition",
  "cyberpunk",
  "epicurean",
  "candyland",
  "gallery",
  "market",
  "studio",
  "laura",
  "atlantic",
  "vows",
  "strada",
];

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
  if (!VALID_TRADE_HINTS.includes(tradeHint)) {
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
  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const title = (hero.title?.trim() || store.name).slice(0, 80);
  if (!title) {
    return { ok: false, error: "Hero title is required" };
  }

  const brandingDone =
    hero.onboarding_branding_done === true ||
    store.hero.onboarding_branding_done === true;

  const clean: HeroConfig = {
    eyebrow: hero.eyebrow?.trim() || undefined,
    title,
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
    onboarding_branding_done: brandingDone || undefined,
  };

  if (!heroIsComplete(clean)) {
    return { ok: false, error: "Hero title is required" };
  }

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
      error: "Enable at least one fulfillment method",
    };
  }

  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const draft: FulfillmentConfig = {
    pickup: config.pickup,
    delivery: config.delivery,
  };

  // Settings sends delivery_methods; onboarding omits → preserve / synthesize later
  if ("delivery_methods" in config) {
    draft.delivery_methods = config.delivery_methods;
  } else if (store.fulfillment?.delivery_methods?.length) {
    draft.delivery_methods = store.fulfillment.delivery_methods;
  }

  if ("delivery_free_above_cents" in config) {
    draft.delivery_free_above_cents = config.delivery_free_above_cents;
  } else if (store.fulfillment?.delivery_free_above_cents) {
    draft.delivery_free_above_cents =
      store.fulfillment.delivery_free_above_cents;
  }

  // Settings always sends `calendar`; onboarding omits it → preserve existing
  if ("calendar" in config) {
    const incoming = config.calendar;
    draft.calendar = incoming?.enabled
      ? {
          ...incoming,
          horizon_days:
            incoming.horizon_days ??
            store.fulfillment?.calendar?.horizon_days,
          daily_capacity:
            incoming.daily_capacity ??
            store.fulfillment?.calendar?.daily_capacity,
          windows:
            incoming.windows ?? store.fulfillment?.calendar?.windows,
          blackouts: incoming.blackouts,
          blackout_ranges:
            incoming.blackout_ranges ??
            store.fulfillment?.calendar?.blackout_ranges,
          allowed_weekdays: incoming.allowed_weekdays?.length
            ? incoming.allowed_weekdays
            : [0, 1, 2, 3, 4, 5, 6],
        }
      : incoming;
  } else if (store.fulfillment?.calendar?.enabled) {
    draft.calendar = store.fulfillment.calendar;
  }

  // Hours: settings form sends keys; onboarding omits → preserve
  if ("pickup_hours" in config || "delivery_hours" in config) {
    draft.pickup_hours = config.pickup_hours;
    draft.delivery_hours = config.delivery_hours;
  } else {
    draft.pickup_hours = store.fulfillment?.pickup_hours;
    draft.delivery_hours = store.fulfillment?.delivery_hours;
  }

  if ("campaign" in config) {
    const campaign = normalizeCampaignConfig(config.campaign);
    if (campaign) draft.campaign = campaign;
  } else if (store.fulfillment?.campaign?.active) {
    draft.campaign = store.fulfillment.campaign;
  }

  const clean = sanitizeFulfillmentConfig(draft);

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
// Publish (seller-initiated; gated on completeness — billing gate in Phase 2)
// ---------------------------------------------------------------------------

export async function publishStore(): Promise<ActionResult> {
  const { supabase, store } = await getOwnedStore();
  if (!store) return { ok: false, error: "No store yet" };

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store.id)
    .neq("status", "archived");

  const complete =
    store.vibe &&
    heroIsComplete(store.hero) &&
    (count ?? 0) > 0 &&
    fulfillmentIsComplete(store.fulfillment) &&
    paynowIsComplete(store.paynow);

  if (!complete) {
    return { ok: false, error: "Complete all onboarding steps first" };
  }

  if (
    isBillingEnabled() &&
    !subscriptionAllowsPublish(store.subscription_status)
  ) {
    return { ok: false, error: "Subscribe to publish your store" };
  }

  const { error } = await supabase
    .from("stores")
    .update({ status: "published" })
    .eq("id", store.id);

  return error ? { ok: false, error: friendlyDbError(error) } : { ok: true };
}

// ---------------------------------------------------------------------------
// Dev-only — hard-delete store so onboarding can restart (frees slug)
// ---------------------------------------------------------------------------

export async function resetOnboarding(): Promise<ActionResult> {
  if (process.env.NODE_ENV !== "development") {
    return { ok: false, error: "Reset is only available in development" };
  }

  const { supabase, user, store } = await getOwnedStore();
  if (!store) {
    revalidatePath("/onboarding");
    return { ok: true };
  }

  const { error } = await supabase
    .from("stores")
    .delete()
    .eq("id", store.id)
    .eq("owner_id", user.id);

  if (error) return { ok: false, error: friendlyDbError(error) };

  revalidatePath("/onboarding");
  revalidatePath("/");
  return { ok: true };
}
