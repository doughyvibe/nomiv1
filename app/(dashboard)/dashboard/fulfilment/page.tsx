import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link";
import { saveFulfillmentAction } from "@/app/(dashboard)/dashboard/settings/actions";
import { FulfillmentForm } from "@/components/dashboard/fulfillment-form";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelBody,
} from "@/components/dashboard/dashboard-ui";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fulfilment — Nomi" };

export default async function FulfilmentPage() {
  const { store } = await requireSellerStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <DashboardBackLink href="/more" label="More" />
        <div className="mt-4">
          <DashboardPageHeader
            title="Fulfilment"
            description="Pickup, delivery, dates buyers can choose, and capacity."
          />
        </div>
      </div>

      <DashboardPanel>
        <DashboardPanelBody>
          <FulfillmentForm store={store} onSave={saveFulfillmentAction} />
        </DashboardPanelBody>
      </DashboardPanel>
    </div>
  );
}
