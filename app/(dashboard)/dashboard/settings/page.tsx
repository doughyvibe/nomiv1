import Link from "next/link";

import {
  saveFulfillmentAction,
  savePayNowAction,
  saveStoreIdentityAction,
} from "@/app/(dashboard)/dashboard/settings/actions";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { FulfillmentForm } from "@/components/dashboard/fulfillment-form";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelBody,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-ui";
import { ManageBillingButton } from "@/components/dashboard/manage-billing-button";
import { PayNowForm } from "@/components/dashboard/paynow-form";
import { PushAlertsSettings } from "@/components/dashboard/push-alerts-settings";
import { StoreIdentityForm } from "@/components/dashboard/store-identity-form";
import { StoreStatusSettings } from "@/components/dashboard/store-status-settings";
import { ResetOnboardingButton } from "@/components/onboarding/reset-onboarding-button";
import { Button } from "@/components/ui/button";
import { listUserPushSubscriptions } from "@/lib/push/subscriptions";
import { getVapidPublicKey } from "@/lib/push/vapid";
import {
  isBillingEnabled,
  subscriptionAllowsPublish,
} from "@/lib/billing/plans";
import { storePublishIssues } from "@/lib/stores/publish-readiness";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Nomi" };

const isDev = process.env.NODE_ENV === "development";

export default async function SettingsPage() {
  const { supabase, store } = await requireSellerStore();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: productCount }, subscriptions] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("archived", false),
    user ? listUserPushSubscriptions(supabase, user.id) : Promise.resolve([]),
  ]);

  const publishIssues = storePublishIssues(store, productCount ?? 0);
  const billingEnabled = isBillingEnabled();
  const hasActivePlan = subscriptionAllowsPublish(store.subscription_status);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        eyebrow={store.name}
        title="Settings"
        description="Store identity, fulfillment, PayNow, status, and notifications."
      />

      <div className="flex flex-col gap-5">
        <DashboardPanel>
          <DashboardPanelHeader
            title="Store identity"
            description="Name, link, and what you sell"
          />
          <DashboardPanelBody>
            <StoreIdentityForm store={store} onSave={saveStoreIdentityAction} />
          </DashboardPanelBody>
        </DashboardPanel>

        <DashboardPanel>
          <DashboardPanelHeader
            title="Store status"
            description="Publish or hide your storefront"
          />
          <DashboardPanelBody>
            <StoreStatusSettings
              store={store}
              publishIssues={publishIssues}
              billingEnabled={billingEnabled}
              hasActivePlan={hasActivePlan}
            />
            {billingEnabled && hasActivePlan ? (
              <div className="mt-4 border-t border-border pt-4">
                <ManageBillingButton />
              </div>
            ) : null}
          </DashboardPanelBody>
        </DashboardPanel>

        <DashboardPanel>
          <DashboardPanelHeader
            title="Fulfillment"
            description="Pickup and delivery options for buyers"
          />
          <DashboardPanelBody>
            <FulfillmentForm store={store} onSave={saveFulfillmentAction} />
          </DashboardPanelBody>
        </DashboardPanel>

        <DashboardPanel>
          <DashboardPanelHeader
            title="PayNow payment"
            description="QR details and manual verification reminder"
          />
          <DashboardPanelBody>
            <PayNowForm store={store} onSave={savePayNowAction} />
          </DashboardPanelBody>
        </DashboardPanel>

        <DashboardPanel>
          <DashboardPanelHeader
            title="Push notifications"
            description="Browser alerts when buyers request payment verification"
          />
          <DashboardPanelBody>
            <PushAlertsSettings
              vapidPublicKey={getVapidPublicKey()}
              serverSubscriptionCount={subscriptions.length}
            />
          </DashboardPanelBody>
        </DashboardPanel>

        <DashboardPanel>
          <DashboardPanelHeader
            title="Install Nomi App"
            description="Add Nomi to your phone for order alerts and quick access"
            action={
              <Button render={<Link href="/settings/install" />} size="sm">
                Open
              </Button>
            }
          />
        </DashboardPanel>

        {isDev ? (
          <DashboardPanel>
            <DashboardPanelHeader
              title="Developer"
              description="Local-only tools for retesting onboarding"
            />
            <DashboardPanelBody>
              <ResetOnboardingButton align="start" />
            </DashboardPanelBody>
          </DashboardPanel>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-6 lg:hidden">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Account
        </p>
        <SignOutButton className="w-full" />
      </div>
    </div>
  );
}
