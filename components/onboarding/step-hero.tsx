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
        <h1 className="text-xl font-semibold">Design your storefront hero</h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          The top section of your store. Your vibe controls the design — you
          control the words and image.
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
