"use client";

import { useState, useTransition } from "react";

import { saveFulfillment } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Store } from "@/lib/stores/types";

export function StepFulfillment({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
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
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleContinue() {
    setError(null);

    const feeValue = Number.parseFloat(deliveryFee);
    if (deliveryEnabled && (!Number.isFinite(feeValue) || feeValue < 0)) {
      setError("Enter a valid delivery fee, e.g. 5.00");
      return;
    }

    startTransition(async () => {
      const result = await saveFulfillment({
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
      if (result.ok) onDone();
      else setError(result.error);
    });
  }

  const valid =
    (pickupEnabled && pickupInstructions.trim()) ||
    (deliveryEnabled && deliveryFee.trim() && deliveryInstructions.trim());

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">
          How will customers receive their orders?
        </h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          Choose one or both. The delivery fee is added to the buyer&apos;s
          PayNow total.
        </p>
      </div>

      {/* Self-pickup */}
      <div className="rounded-md border border-dashboard-border p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={pickupEnabled}
            onChange={(e) => setPickupEnabled(e.target.checked)}
            className="size-4 accent-dashboard-primary"
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
                placeholder="Pickup at Tanjong Pagar MRT after confirmation."
                maxLength={200}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pickup-location">Pickup location (optional)</Label>
              <Input
                id="pickup-location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Tanjong Pagar MRT, Exit A"
                maxLength={120}
              />
            </div>
          </div>
        )}
      </div>

      {/* Local delivery */}
      <div className="rounded-md border border-dashboard-border p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={deliveryEnabled}
            onChange={(e) => setDeliveryEnabled(e.target.checked)}
            className="size-4 accent-dashboard-primary"
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
              <Label htmlFor="delivery-instructions">
                Delivery instructions
              </Label>
              <Input
                id="delivery-instructions"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Delivery within 2–3 days after payment confirmation."
                maxLength={200}
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleContinue} disabled={pending || !valid}>
        {pending ? "Saving…" : "Continue"}
      </Button>
    </section>
  );
}
