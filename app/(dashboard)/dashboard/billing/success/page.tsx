import Link from "next/link";
import { redirect } from "next/navigation";

import { publishStore } from "@/app/(dashboard)/dashboard/onboarding/actions";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelBody,
} from "@/components/dashboard/dashboard-ui";
import { Button } from "@/components/ui/button";
import { isBillingEnabled } from "@/lib/billing/plans";
import { getStripe } from "@/lib/billing/stripe";
import {
  applySubscriptionToStore,
  patchFromSubscription,
} from "@/lib/billing/sync";
import { getStorefrontUrl } from "@/lib/host";
import { requireSellerStore } from "@/lib/stores/require-seller";
import { createClient } from "@/lib/supabase/server";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "You're live — Nomi" };

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { store } = await requireSellerStore();
  const { session_id: sessionId } = await searchParams;

  if (!isBillingEnabled()) redirect("/");
  if (!sessionId) redirect("/billing/publish");

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (session.metadata?.store_id && session.metadata.store_id !== store.id) {
    redirect("/");
  }

  if (session.subscription) {
    const sub =
      typeof session.subscription === "string"
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription;
    const plan = session.metadata?.plan ?? sub.metadata?.plan ?? null;
    await applySubscriptionToStore(store.id, patchFromSubscription(sub, plan));
  }

  const published = await publishStore();
  const supabase = await createClient();
  const { data: fresh } = await supabase
    .from("stores")
    .select("status, slug")
    .eq("id", store.id)
    .single();

  const live = fresh?.status === "published" || published.ok;
  const storeUrl = getStorefrontUrl(fresh?.slug ?? store.slug);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 text-center">
      <DashboardPageHeader
        title={live ? "Your store is live 🎉" : "Payment received"}
        description={
          live
            ? "Share your link and start taking orders."
            : published.ok === false
              ? published.error
              : "Finish any remaining setup, then publish from your dashboard."
        }
      />

      <DashboardPanel>
        <DashboardPanelBody className="flex flex-col items-center gap-4">
          {live ? (
            <>
              <p className="break-all font-mono text-sm font-medium">{storeUrl}</p>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  render={
                    <a href={storeUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  Open store
                </Button>
                <Button render={<Link href="/" />} variant="outline">
                  Go to dashboard
                </Button>
              </div>
            </>
          ) : (
            <Button render={<Link href="/" />}>Go to dashboard</Button>
          )}
        </DashboardPanelBody>
      </DashboardPanel>
    </div>
  );
}
