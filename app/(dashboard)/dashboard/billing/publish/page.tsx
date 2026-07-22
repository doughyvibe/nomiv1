import Link from "next/link";
import { redirect } from "next/navigation";

import { PlanPicker } from "@/components/dashboard/plan-picker";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelBody,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-ui";
import { Button } from "@/components/ui/button";
import { isBillingEnabled } from "@/lib/billing/plans";
import { subscriptionAllowsPublish } from "@/lib/billing/plans";
import { storePublishIssues } from "@/lib/stores/publish-readiness";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Publish — Nomi" };

export default async function BillingPublishPage() {
  const { supabase, store } = await requireSellerStore();

  if (store.status === "published") {
    redirect("/");
  }

  if (!isBillingEnabled()) {
    redirect("/settings");
  }

  if (subscriptionAllowsPublish(store.subscription_status)) {
    redirect("/");
  }

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("store_id", store.id)
    .neq("status", "archived");

  const issues = storePublishIssues(store, count ?? 0);
  const ready = issues.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <DashboardPageHeader
        eyebrow={store.name}
        title="Publish your store"
        description="Choose how you want to pay for Nomi — then go live."
      />

      {!ready ? (
        <DashboardPanel>
          <DashboardPanelHeader title="Almost there" />
          <DashboardPanelBody className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Finish these before you can subscribe and publish:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {issues.map((issue) => (
                <li key={issue.message}>
                  <Link
                    href={issue.href}
                    className="underline underline-offset-2"
                  >
                    {issue.message}
                  </Link>
                </li>
              ))}
            </ul>
            <Button render={<Link href="/" />} variant="outline">
              Back to dashboard
            </Button>
          </DashboardPanelBody>
        </DashboardPanel>
      ) : (
        <DashboardPanel>
          <DashboardPanelHeader
            title="Choose your plan"
            description="Free to build. Pay only when you go live."
          />
          <DashboardPanelBody>
            <PlanPicker />
          </DashboardPanelBody>
        </DashboardPanel>
      )}
    </div>
  );
}
