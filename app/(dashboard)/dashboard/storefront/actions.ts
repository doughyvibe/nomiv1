"use server";

import {
  saveHero,
  saveVibe,
} from "@/app/(dashboard)/dashboard/onboarding/actions";
import { revalidateDashboardStore } from "@/lib/stores/revalidate";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { HeroConfig, Store, Vibe } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string } | { success: true };

async function sellerContext(): Promise<
  | { error: string }
  | { supabase: Awaited<ReturnType<typeof createClient>>; store: Store }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .neq("status", "deleted")
    .maybeSingle<Store>();

  if (!store) return { error: "No store yet" };

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store.id)
    .eq("archived", false);

  if (deriveOnboardingStep(store, count ?? 0) !== "done") {
    return { error: "Store not ready" };
  }

  return { supabase, store };
}

export async function saveVibeAction(vibe: Vibe): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const result = await saveVibe(vibe);
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(ctx.store);
  return { success: true };
}

export async function saveHeroAction(hero: HeroConfig): Promise<ActionResult> {
  const ctx = await sellerContext();
  if ("error" in ctx) return ctx;

  const result = await saveHero(hero);
  if (!result.ok) return { error: result.error };

  revalidateDashboardStore(ctx.store);
  return { success: true };
}
