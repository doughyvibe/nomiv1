"use client";

import { useState } from "react";

import { savePayNow } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { StepLive } from "@/components/onboarding/step-live";
import { PayNowForm } from "@/components/dashboard/paynow-form";
import {
  paynowIsComplete,
  type PayNowConfig,
  type Store,
} from "@/lib/stores/types";

export function StepPayNow({ store }: { store: Store }) {
  const [done, setDone] = useState(paynowIsComplete(store.paynow));

  async function handleSave(config: PayNowConfig) {
    const saved = await savePayNow(config);
    if (!saved.ok) return { error: saved.error };
    return { success: true as const };
  }

  if (done) {
    return <StepLive />;
  }

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-display text-[2rem] sm:text-[2.25rem] font-extrabold tracking-[-0.02em]">
        Set up PayNow payment
      </h1>

      <PayNowForm
        store={store}
        submitLabel="Continue"
        onSave={handleSave}
        onSuccess={() => setDone(true)}
        showInstructions={false}
        refreshOnSuccess={false}
        notice="Your store will generate a PayNow QR for each order with the exact amount and order reference number."
      />
    </section>
  );
}
