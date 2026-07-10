"use client";

import {
  saveHeroAction,
  saveVibeAction,
} from "@/app/(dashboard)/dashboard/storefront/actions";
import { HeroEditor } from "@/components/dashboard/hero-editor";
import { FeaturedSectionEditor } from "@/components/dashboard/featured-section-editor";
import { VibePicker } from "@/components/dashboard/vibe-picker";
import {
  DashboardPanel,
  DashboardPanelBody,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-ui";
import type { Product, Store } from "@/lib/stores/types";

export function StorefrontEditor({
  store,
  products,
}: {
  store: Store;
  products: Pick<Product, "name" | "price_cents" | "image_url" | "category">[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <DashboardPanel>
        <DashboardPanelHeader
          title="Vibe"
          description="Styles your public storefront — dashboard stays the same"
        />
        <DashboardPanelBody>
          <VibePicker
            store={store}
            products={products}
            onSaveVibe={saveVibeAction}
          />
        </DashboardPanelBody>
      </DashboardPanel>

      <DashboardPanel>
        <DashboardPanelHeader
          title="Featured product"
          description="Section title and styling for your highlighted product"
        />
        <DashboardPanelBody>
          <FeaturedSectionEditor store={store} />
        </DashboardPanelBody>
      </DashboardPanel>

      <DashboardPanel>
        <DashboardPanelHeader
          title="Top of your shop"
          description="Logo, shop name, and a short intro buyers see first"
        />
        <DashboardPanelBody>
          <HeroEditor store={store} submitLabel="Save" onSaveHero={saveHeroAction} />
        </DashboardPanelBody>
      </DashboardPanel>
    </div>
  );
}
