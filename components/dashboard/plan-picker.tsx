"use client";

import { useState, useTransition } from "react";

import { startCheckoutAction } from "@/app/(dashboard)/dashboard/billing/actions";
import { Button } from "@/components/ui/button";
import { BILLING_COPY, type BillingInterval } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

export function PlanPicker() {
  const [interval, setInterval] = useState<BillingInterval>("four_weekly");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function checkout() {
    setError(null);
    startTransition(async () => {
      const result = await startCheckoutAction(interval);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setInterval("four_weekly")}
          className={cn(
            "rounded-2xl border px-5 py-4 text-left transition-colors",
            interval === "four_weekly"
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:bg-muted/40",
          )}
        >
          <p className="font-display text-2xl font-bold">
            {BILLING_COPY.weeklyPrice}
            <span className="ml-1 text-base font-semibold text-muted-foreground">
              {BILLING_COPY.weeklyCadence}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {BILLING_COPY.billedEvery}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setInterval("yearly")}
          className={cn(
            "rounded-2xl border px-5 py-4 text-left transition-colors",
            interval === "yearly"
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:bg-muted/40",
          )}
        >
          <p className="font-display text-2xl font-bold">
            {BILLING_COPY.yearlyPrice}
            <span className="ml-1 text-base font-semibold text-muted-foreground">
              {BILLING_COPY.yearlyCadence}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Best value — pay once a year
          </p>
        </button>
      </div>

      <Button
        type="button"
        disabled={pending}
        onClick={checkout}
        className="w-full sm:w-auto"
      >
        {pending ? "Redirecting…" : "Subscribe & publish"}
      </Button>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
