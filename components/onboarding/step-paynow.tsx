"use client";

import { useState } from "react";

import {
  publishStore,
  savePayNow,
} from "@/app/(dashboard)/dashboard/onboarding/actions";
import { StepLive } from "@/components/onboarding/step-live";
import { PayNowForm } from "@/components/dashboard/paynow-form";
import {
  paynowIsComplete,
  type PayNowConfig,
  type Store,
} from "@/lib/stores/types";

export function StepPayNow({ store }: { store: Store }) {
  const [live, setLive] = useState(store.status === "published");
  const needsPublishRetry =
    store.status === "draft" && paynowIsComplete(store.paynow);

  async function handleSave(config: PayNowConfig) {
    const saved = await savePayNow(config);
    if (!saved.ok) return { error: saved.error };

    const published = await publishStore();
    if (!published.ok) {
      return {
        error:
          published.error === "Complete all onboarding steps first"
            ? published.error
            : "PayNow was saved, but publishing failed. Tap Continue to try again.",
      };
    }
    return { success: true as const };
  }

  if (live) {
    return <StepLive />;
  }

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-display text-[2rem] sm:text-[2.25rem] font-extrabold tracking-[-0.02em]">
        Set up PayNow payment
      </h1>

      {needsPublishRetry ? (
        <p
          className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
          role="status"
        >
          Your PayNow details are saved, but the store isn&apos;t live yet.
          Tap <span className="font-semibold">Continue</span> to publish.
        </p>
      ) : null}

      <PayNowForm
        store={store}
        submitLabel={needsPublishRetry ? "Continue — publish store" : "Continue"}
        onSave={handleSave}
        onSuccess={() => setLive(true)}
        showInstructions={false}
        refreshOnSuccess={false}
        notice="Your store will generate a PayNow QR for each order with the exact amount and order reference number."
      />
    </section>
  );
}
