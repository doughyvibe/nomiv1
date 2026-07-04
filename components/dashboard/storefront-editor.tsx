"use client";

import {
  saveHeroAction,
  saveVibeAction,
} from "@/app/(dashboard)/dashboard/storefront/actions";
import { HeroEditor } from "@/components/dashboard/hero-editor";
import { VibePicker } from "@/components/dashboard/vibe-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product, Store } from "@/lib/stores/types";

export function StorefrontEditor({
  store,
  products,
}: {
  store: Store;
  products: Pick<Product, "name" | "price_cents" | "image_url" | "category">[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vibe</CardTitle>
          <CardDescription>
            Styles your public storefront — dashboard stays the same
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VibePicker
            store={store}
            products={products}
            onSaveVibe={saveVibeAction}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hero</CardTitle>
          <CardDescription>
            Top section of your store — words, image, and block order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HeroEditor store={store} submitLabel="Save hero" onSaveHero={saveHeroAction} />
        </CardContent>
      </Card>
    </div>
  );
}
