import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/onboarding/wizard";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import { heroIsComplete, type Product, type Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .neq("status", "deleted")
    .maybeSingle<Store>();

  // Backfill defaults for drafts created before vibe/hero were set at claim
  if (store && (!store.vibe || !heroIsComplete(store.hero))) {
    const patch: Partial<Store> = {};
    if (!store.vibe) patch.vibe = "atelier";
    if (!heroIsComplete(store.hero)) {
      patch.hero = { ...store.hero, title: store.name.slice(0, 80) };
    }
    const { data: updated } = await supabase
      .from("stores")
      .update(patch)
      .eq("id", store.id)
      .select("*")
      .single<Store>();
    if (updated) store = updated;
  }

  let products: Product[] = [];
  if (store) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .neq("status", "archived")
      .order("created_at", { ascending: true });
    products = (data as Product[]) ?? [];
  }

  const step = deriveOnboardingStep(store, products.length);
  if (step === "done") redirect("/");

  return (
    <OnboardingWizard
      store={store}
      products={products}
      derivedStep={step}
    />
  );
}
