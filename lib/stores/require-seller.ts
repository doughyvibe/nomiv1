import { redirect } from "next/navigation";

import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export async function requireSellerStore(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  store: Store;
}> {
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

  let productCount = 0;
  if (store) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id)
      .neq("status", "archived");
    productCount = count ?? 0;
  }

  if (deriveOnboardingStep(store, productCount) !== "done") {
    redirect("/onboarding");
  }

  if (!store) redirect("/onboarding");

  return { supabase, store };
}
