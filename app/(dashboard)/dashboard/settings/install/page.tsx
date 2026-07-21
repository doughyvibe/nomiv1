import Link from "next/link";

import { InstallNomiApp } from "@/components/dashboard/install-nomi-app";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { Button } from "@/components/ui/button";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Install Nomi App — Nomi" };

export default async function InstallNomiAppPage() {
  const { store } = await requireSellerStore();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <DashboardPageHeader
        eyebrow={store.name}
        title="Install Nomi App"
        description="Add Nomi to your phone so you can manage your store and get new order notifications."
        action={
          <Button render={<Link href="/settings" />} variant="outline" size="sm">
            Back
          </Button>
        }
      />

      <InstallNomiApp />
    </div>
  );
}
