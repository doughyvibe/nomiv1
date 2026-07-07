"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FulfillmentConfig, Store } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type FulfillmentFormProps = {
  store: Store;
  submitLabel?: string;
  onSave: (
    config: FulfillmentConfig,
  ) => Promise<{ error: string } | { success: true }>;
  onSuccess?: () => void;
};

export function FulfillmentForm({
  store,
  submitLabel = "Save fulfillment",
  onSave,
  onSuccess,
}: FulfillmentFormProps) {
  const router = useRouter();
  const f = store.fulfillment;
  const [pickupEnabled, setPickupEnabled] = useState(f.pickup?.enabled ?? false);
  const [pickupInstructions, setPickupInstructions] = useState(
    f.pickup?.instructions ?? "",
  );
  const [pickupLocation, setPickupLocation] = useState(
    f.pickup?.location ?? "",
  );
  const [deliveryEnabled, setDeliveryEnabled] = useState(
    f.delivery?.enabled ?? false,
  );
  const [deliveryFee, setDeliveryFee] = useState(
    f.delivery ? (f.delivery.fee_cents / 100).toFixed(2) : "",
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    f.delivery?.instructions ?? "",
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);

    const feeValue = Number.parseFloat(deliveryFee);
    if (deliveryEnabled && (!Number.isFinite(feeValue) || feeValue < 0)) {
      setError("Enter a valid delivery fee, e.g. 5.00");
      return;
    }

    startTransition(async () => {
      const result = await onSave({
        pickup: pickupEnabled
          ? {
              enabled: true,
              instructions: pickupInstructions,
              location: pickupLocation || undefined,
            }
          : undefined,
        delivery: deliveryEnabled
          ? {
              enabled: true,
              fee_cents: Math.round(feeValue * 100),
              instructions: deliveryInstructions,
            }
          : undefined,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSuccess?.();
      router.refresh();
    });
  }

  const valid =
    (pickupEnabled && pickupInstructions.trim()) ||
    (deliveryEnabled && deliveryFee.trim() && deliveryInstructions.trim());

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              pickupEnabled
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-card",
            )}
            aria-hidden
          >
            {pickupEnabled && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={pickupEnabled}
            onChange={(e) => setPickupEnabled(e.target.checked)}
            className="sr-only"
          />
          <span className="font-medium">Self-pickup</span>
        </label>
        {pickupEnabled && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pickup-instructions">Pickup instructions</Label>
              <Input
                id="pickup-instructions"
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pickup-location">Pickup location (optional)</Label>
              <Input
                id="pickup-location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                maxLength={120}
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              deliveryEnabled
                ? "border-foreground bg-foreground text-white"
                : "border-border bg-card",
            )}
            aria-hidden
          >
            {deliveryEnabled && (
              <svg className="size-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={deliveryEnabled}
            onChange={(e) => setDeliveryEnabled(e.target.checked)}
            className="sr-only"
          />
          <span className="font-medium">Local delivery</span>
        </label>
        {deliveryEnabled && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="delivery-fee">Delivery fee (S$)</Label>
              <Input
                id="delivery-fee"
                inputMode="decimal"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="5.00"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="delivery-instructions">Delivery instructions</Label>
              <Input
                id="delivery-instructions"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                maxLength={200}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button type="button" onClick={handleSave} disabled={pending || !valid}>
        {pending ? "Saving…" : saved ? "Saved" : submitLabel}
      </Button>
    </div>
  );
}
