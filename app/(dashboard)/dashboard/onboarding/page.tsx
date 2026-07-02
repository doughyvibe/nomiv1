import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/onboarding/wizard";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { Product, Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .neq("status", "deleted")
    .maybeSingle<Store>();

  let products: Product[] = [];
  if (store) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("archived", false)
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
