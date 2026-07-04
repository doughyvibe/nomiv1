import { createClient } from "@/lib/supabase/server";
import { countPendingVerification } from "@/lib/orders/load-seller-orders";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
};

export default async function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let pendingCount = 0;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("owner_id", user.id)
      .neq("status", "deleted")
      .maybeSingle();

    if (store) {
      pendingCount = await countPendingVerification(supabase, store.id);
    }
  }

  return (
    <>
      <DashboardNav pendingCount={pendingCount} />
      <div className="pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </div>
    </>
  );
}
