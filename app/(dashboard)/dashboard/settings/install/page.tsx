import { InstallNomiApp } from "@/components/dashboard/install-nomi-app";
import { DashboardBackLink } from "@/components/dashboard/dashboard-back-link";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Install Nomi App — Nomi" };

export default async function InstallNomiAppPage() {
  await requireSellerStore();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <div>
        <DashboardBackLink href="/more" label="More" />
        <div className="mt-4">
          <DashboardPageHeader
            title="Install Nomi App"
            description="Add Nomi to your phone so you can manage your store and get new order notifications."
          />
        </div>
      </div>

      <InstallNomiApp />
    </div>
  );
}
