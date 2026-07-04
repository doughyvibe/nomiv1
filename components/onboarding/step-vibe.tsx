"use client";

import { saveVibe } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { VibePicker } from "@/components/dashboard/vibe-picker";
import type { Store, Vibe } from "@/lib/stores/types";

export function StepVibe({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  async function handleSave(vibe: Vibe) {
    const result = await saveVibe(vibe);
    if (!result.ok) return { error: result.error };
    return { success: true as const };
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Choose your storefront vibe</h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          Swipe through styles and pick the one that matches your brand. This
          only affects your public storefront — your dashboard stays the same.
        </p>
      </div>

      <VibePicker store={store} onSaveVibe={handleSave} onSuccess={onDone} />
    </section>
  );
}
