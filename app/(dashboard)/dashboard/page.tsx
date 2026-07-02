import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStorefrontUrl } from "@/lib/host";
import { deriveOnboardingStep } from "@/lib/stores/progress";
import type { Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .neq("status", "deleted")
    .maybeSingle<Store>();

  // New sellers (or incomplete onboarding) go to the wizard
  let productCount = 0;
  if (store) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("archived", false);
    productCount = count ?? 0;
  }

  if (deriveOnboardingStep(store, productCount) !== "done") {
    redirect("/onboarding");
  }

  const storeUrl = getStorefrontUrl(store!.slug);

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center p-8">
      <Card>
        <CardHeader>
          <CardTitle>{store!.name}</CardTitle>
          <CardDescription>
            Signed in as {user.email ?? "seller"} · Store{" "}
            {store!.status === "published" ? "live" : store!.status}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            render={<a href={storeUrl} target="_blank" rel="noreferrer" />}
          >
            Open Store
          </Button>
          <SignOutButton />
        </CardContent>
      </Card>
    </main>
  );
}
