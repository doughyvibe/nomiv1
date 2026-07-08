"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { StepFulfillment } from "@/components/onboarding/step-fulfillment";
import { StepHero } from "@/components/onboarding/step-hero";
import { StepNameSlug } from "@/components/onboarding/step-name-slug";
import { StepPayNow } from "@/components/onboarding/step-paynow";
import { StepProduct } from "@/components/onboarding/step-product";
import { StepPublish } from "@/components/onboarding/step-publish";
import { StepVibe } from "@/components/onboarding/step-vibe";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/lib/stores/progress";
import type { Product, Store } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type WizardProps = {
  store: Store | null;
  products: Product[];
  derivedStep: OnboardingStep;
};

export function OnboardingWizard({ store, products, derivedStep }: WizardProps) {
  const router = useRouter();
  // stepOverride lets the seller revisit a completed step; null = follow server
  const [stepOverride, setStepOverride] = useState<OnboardingStep | null>(null);
  const step = stepOverride ?? derivedStep;

  function advance() {
    setStepOverride(null);
    router.refresh();
  }

  function goTo(target: OnboardingStep) {
    if (target <= derivedStep) setStepOverride(target);
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-xl flex-col gap-6 p-4 pb-16 sm:p-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-dashboard-muted">
          Set up your store
        </p>
        {/* Step indicator: 7 dots, tappable for completed steps */}
        <ol className="flex items-center gap-1.5">
          {ONBOARDING_STEPS.map(({ step: s, label }) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                onClick={() => goTo(s as OnboardingStep)}
                disabled={s > derivedStep}
                aria-label={`Step ${s}: ${label}`}
                aria-current={s === step ? "step" : undefined}
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors",
                  s < derivedStep && "bg-dashboard-primary/50",
                  s === step && "bg-dashboard-primary",
                  s > derivedStep && "bg-dashboard-border",
                  s <= derivedStep && s !== step && "cursor-pointer",
                )}
              />
            </li>
          ))}
        </ol>
        <p className="text-xs text-dashboard-muted">
          Step {step} of 7 — {ONBOARDING_STEPS[step - 1].label}
        </p>
      </header>

      {step === 1 && <StepNameSlug onDone={advance} />}
      {step === 2 && store && (
        <StepVibe store={store} onDone={advance} />
      )}
      {step === 3 && store && <StepHero store={store} onDone={advance} />}
      {step === 4 && store && (
        <StepProduct store={store} products={products} onDone={advance} />
      )}
      {step === 5 && store && (
        <StepFulfillment store={store} onDone={advance} />
      )}
      {step === 6 && store && <StepPayNow store={store} onDone={advance} />}
      {step === 7 && store && (
        <StepPublish store={store} products={products} />
      )}
    </main>
  );
}
