"use client";

import { saveFulfillment } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { FulfillmentForm } from "@/components/dashboard/fulfillment-form";
import type { FulfillmentConfig, Store } from "@/lib/stores/types";

export function StepFulfillment({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  async function handleSave(config: FulfillmentConfig) {
    const result = await saveFulfillment(config);
    if (!result.ok) return { error: result.error };
    return { success: true as const };
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">
          How will customers receive their orders?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose one or both. The delivery fee is added to the buyer&apos;s
          PayNow total.
        </p>
      </div>

      <FulfillmentForm
        store={store}
        submitLabel="Continue"
        onSave={handleSave}
        onSuccess={onDone}
      />
    </section>
  );
}
