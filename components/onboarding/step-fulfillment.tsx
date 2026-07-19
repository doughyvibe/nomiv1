"use client";

import { Check } from "lucide-react";
import { useState, useTransition } from "react";

import { saveFulfillment } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import type { FulfillmentConfig, Store } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

function configFromToggles(
  pickup: boolean,
  delivery: boolean,
): FulfillmentConfig {
  const config: FulfillmentConfig = {};
  if (pickup) config.pickup = { enabled: true, instructions: "" };
  if (delivery) {
    config.delivery = { enabled: true, fee_cents: 0, instructions: "" };
  }
  return config;
}

export function StepFulfillment({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  const [pickup, setPickup] = useState(
    () => Boolean(store.fulfillment.pickup?.enabled),
  );
  const [delivery, setDelivery] = useState(
    () => Boolean(store.fulfillment.delivery?.enabled),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canContinue = pickup || delivery;

  function handleContinue() {
    if (!canContinue) return;
    setError(null);
    startTransition(async () => {
      const result = await saveFulfillment(configFromToggles(pickup, delivery));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-display text-[2rem] sm:text-[2.25rem] font-extrabold tracking-[-0.02em]">
        How will customers get their orders?
      </h1>

      <div
        className="flex flex-col gap-3"
        role="group"
        aria-label="Fulfillment methods"
      >
        <MethodPill
          label="Pick Up"
          selected={pickup}
          disabled={pending}
          onToggle={() => setPickup((v) => !v)}
        />
        <MethodPill
          label="Delivery"
          selected={delivery}
          disabled={pending}
          onToggle={() => setDelivery((v) => !v)}
        />
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          onClick={handleContinue}
          disabled={pending || !canContinue}
          className="rounded-full"
        >
          {pending ? "Saving…" : "Continue"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          You can set fees, locations, and instructions later in Settings.
        </p>
      </div>
    </section>
  );
}

function MethodPill({
  label,
  selected,
  disabled,
  onToggle,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "flex min-h-14 w-full items-center justify-between rounded-full border px-5 py-3.5 text-lg font-semibold transition-colors",
        "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 focus-visible:outline-none",
        selected
          ? "border-primary bg-primary/15 text-foreground"
          : "border-border bg-muted/30 text-foreground hover:border-primary/60 hover:bg-primary/5",
      )}
    >
      <span>{label}</span>
      {selected ? (
        <Check className="size-5 shrink-0" strokeWidth={2.5} aria-hidden />
      ) : (
        <span className="size-5 shrink-0" aria-hidden />
      )}
    </button>
  );
}
