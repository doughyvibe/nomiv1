"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Wordmark } from "@/components/marketing/wordmark";
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
    <div data-brand className="relative min-h-dvh text-foreground">
      <div
        className="brand-grain pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div
        className="brand-orb animate-brand-drift-1 pointer-events-none absolute top-[10%] left-[5%] size-64 bg-[rgba(247,197,24,0.1)]"
        aria-hidden
      />
      <div
        className="brand-orb animate-brand-drift-2 pointer-events-none absolute right-[8%] bottom-[18%] size-72 bg-[rgba(124,47,224,0.08)]"
        aria-hidden
      />

      <main className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col p-4 sm:p-8">
        <div className="flex shrink-0 flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <Wordmark />
            <SignOutButton />
          </div>

          <header>
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
                      "flex h-11 w-full items-center",
                      s <= derivedStep && s !== step && "cursor-pointer",
                    )}
                  >
                    <span
                      className={cn(
                        "block h-2.5 w-full rounded-full transition-colors",
                        s < derivedStep && "bg-primary/50",
                        s === step && "bg-primary",
                        s > derivedStep && "bg-border",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </header>
        </div>

        {/* Center short steps; scroll when content is taller than the viewport */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="my-auto w-full py-8">
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
          </div>
        </div>
      </main>
    </div>
  );
}
