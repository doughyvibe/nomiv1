"use client";

import { savePayNow } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { PayNowForm } from "@/components/dashboard/paynow-form";
import type { PayNowConfig, Store } from "@/lib/stores/types";

export function StepPayNow({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  async function handleSave(config: PayNowConfig) {
    const result = await savePayNow(config);
    if (!result.ok) return { error: result.error };
    return { success: true as const };
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">Set up PayNow payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your store will generate a PayNow QR for each order with the exact
          amount and order reference.
        </p>
      </div>

      <PayNowForm
        store={store}
        submitLabel="Continue"
        onSave={handleSave}
        onSuccess={onDone}
      />
    </section>
  );
}
