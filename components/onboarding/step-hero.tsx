"use client";

import { saveHero } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { HeroEditor } from "@/components/dashboard/hero-editor";
import type { HeroConfig, Store } from "@/lib/stores/types";

export function StepHero({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  async function handleSave(hero: HeroConfig) {
    const result = await saveHero(hero);
    if (!result.ok) return { error: result.error };
    return { success: true as const };
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">
          Introduce your shop
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your logo, shop name, and a short line about what you sell.
        </p>
      </div>

      <HeroEditor
        store={store}
        submitLabel="Continue"
        onSaveHero={handleSave}
        onSuccess={onDone}
      />
    </section>
  );
}
