"use client";

import { useMemo, useState, useTransition } from "react";
import QRCode from "react-qr-code";

import { savePayNow } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildPayNowPayload,
  isValidSgMobile,
  isValidUen,
  type PayNowProxyType,
} from "@/lib/paynow";
import type { Store } from "@/lib/stores/types";

export function StepPayNow({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  const p = store.paynow;
  const [proxyType, setProxyType] = useState<PayNowProxyType>(
    p.proxy_type ?? "mobile",
  );
  const [proxyValue, setProxyValue] = useState(p.proxy_value ?? "");
  const [recipientName, setRecipientName] = useState(
    p.recipient_name ?? store.name,
  );
  const [instructions, setInstructions] = useState(p.instructions ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const inputValid =
    proxyType === "mobile"
      ? isValidSgMobile(proxyValue)
      : isValidUen(proxyValue);

  // Live sample QR with the seller's own details (reuses Phase 2 utility)
  const sampleQr = useMemo(() => {
    if (!inputValid) return null;
    try {
      return buildPayNowPayload({
        proxyType,
        proxyValue,
        amount: 23,
        reference: "SAMPLE-001",
        merchantName: recipientName || store.name,
      });
    } catch {
      return null;
    }
  }, [proxyType, proxyValue, recipientName, store.name, inputValid]);

  function handleContinue() {
    setError(null);
    startTransition(async () => {
      const result = await savePayNow({
        proxy_type: proxyType,
        proxy_value: proxyValue,
        recipient_name: recipientName,
        instructions: instructions || undefined,
      });
      if (result.ok) onDone();
      else setError(result.error);
    });
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Set up PayNow payment</h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          Your store will generate a PayNow QR for each order with the exact
          amount and order reference.
        </p>
      </div>

      <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        Payment is <strong>not automatically verified</strong>. The buyer will
        notify you after payment — check your bank or PayLah app before marking
        an order as paid.
      </div>

      <div className="flex flex-col gap-2">
        <Label>PayNow type</Label>
        <div className="flex gap-4">
          {(["mobile", "uen"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paynow-type"
                checked={proxyType === t}
                onChange={() => setProxyType(t)}
                className="size-4 accent-dashboard-primary"
              />
              {t === "mobile" ? "Mobile number" : "UEN"}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paynow-value">
          {proxyType === "mobile" ? "PayNow mobile number" : "PayNow UEN"}
        </Label>
        <Input
          id="paynow-value"
          value={proxyValue}
          onChange={(e) => setProxyValue(e.target.value)}
          placeholder={proxyType === "mobile" ? "91234567" : "201403121W"}
        />
        {proxyValue && !inputValid && (
          <p className="text-xs text-destructive">
            {proxyType === "mobile"
              ? "Enter 8 digits starting with 8 or 9"
              : "Enter a valid UEN, e.g. 201403121W"}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paynow-name">Payment recipient name</Label>
        <Input
          id="paynow-name"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Sarah Bakes / Sarah Tan"
          maxLength={50}
        />
        <p className="text-xs text-dashboard-muted">
          Shown to buyers so they can confirm they&apos;re paying the right
          person.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paynow-instructions">
          Additional payment instruction (optional)
        </Label>
        <Input
          id="paynow-instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          maxLength={200}
        />
      </div>

      {sampleQr && (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashboard-border p-4">
          <p className="text-xs font-medium text-dashboard-muted">
            Sample payment QR (S$23.00 · SAMPLE-001) using your details
          </p>
          <div className="rounded bg-white p-3">
            <QRCode value={sampleQr} size={140} />
          </div>
          <p className="text-xs text-dashboard-muted">
            Each real order gets its own QR with the exact amount and reference.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        onClick={handleContinue}
        disabled={pending || !inputValid || !recipientName.trim()}
      >
        {pending ? "Saving…" : "Continue"}
      </Button>
    </section>
  );
}
