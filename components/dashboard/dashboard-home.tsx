import { PublishStoreCta } from "@/components/dashboard/publish-store-cta";
import { StoreControlCard } from "@/components/dashboard/store-control-card";
import { StoreReadinessChecklist } from "@/components/dashboard/store-readiness-checklist";
import {
  isBillingEnabled,
  subscriptionAllowsPublish,
} from "@/lib/billing/plans";
import { getStorefrontPreviewUrl } from "@/lib/host";
import { storePublishIssues } from "@/lib/stores/publish-readiness";
import type { Store } from "@/lib/stores/types";

type DashboardHomeProps = {
  store: Store;
  storeUrl: string;
  productCount: number;
};

export function DashboardHome({
  store,
  storeUrl,
  productCount,
}: DashboardHomeProps) {
  const isPublished = store.status === "published";
  const publishIssues = storePublishIssues(store, productCount);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-[2rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[2.25rem]">
          👋 Welcome Back
        </h1>
      </header>

      <StoreReadinessChecklist
        store={store}
        productCount={productCount}
        storeUrl={storeUrl}
      />

      <PublishStoreCta
        isPublished={isPublished}
        issues={publishIssues}
        billingEnabled={isBillingEnabled()}
        hasActivePlan={subscriptionAllowsPublish(store.subscription_status)}
        previewUrl={getStorefrontPreviewUrl(store.slug)}
      />

      <StoreControlCard store={store} storeUrl={storeUrl} />
    </div>
  );
}
