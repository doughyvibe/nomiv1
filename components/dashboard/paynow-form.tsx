"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildPayNowPayload,
  isValidSgMobile,
  isValidUen,
  type PayNowProxyType,
} from "@/lib/paynow";
import type { PayNowConfig, Store } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type PayNowFormProps = {
  store: Store;
  submitLabel?: string;
  onSave: (config: PayNowConfig) => Promise<{ error: string } | { success: true }>;
  onSuccess?: () => void;
};

export function PayNowForm({
  store,
  submitLabel = "Save PayNow",
  onSave,
  onSuccess,
}: PayNowFormProps) {
  const router = useRouter();
  const p = store.paynow;
  const [proxyType, setProxyType] = useState<PayNowProxyType>(
    p.proxy_type ?? "mobile",
  );
  const [proxyValue, setProxyValue] = useState(p.proxy_value ?? "");
  const [recipientName, setRecipientName] = useState(
    p.recipient_name ?? store.name,
  );
  const [instructions, setInstructions] = useState(p.instructions ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const inputValid =
    proxyType === "mobile"
      ? isValidSgMobile(proxyValue)
      : isValidUen(proxyValue);

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

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await onSave({
        proxy_type: proxyType,
        proxy_value: proxyValue,
        recipient_name: recipientName,
        instructions: instructions || undefined,
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

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
        Payment is <strong>not automatically verified</strong>. Check your bank
        or PayLah app before marking an order as paid.
      </div>

      <div className="flex flex-col gap-2">
        <Label>PayNow type</Label>
        <div className="flex gap-4">
          {(["mobile", "uen"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  proxyType === t
                    ? "border-foreground"
                    : "border-border",
                )}
                aria-hidden
              >
                {proxyType === t && (
                  <span className="size-2.5 rounded-full bg-foreground" />
                )}
              </span>
              <input
                type="radio"
                name="paynow-type"
                checked={proxyType === t}
                onChange={() => setProxyType(t)}
                className="sr-only"
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
          aria-invalid={proxyValue.trim().length > 0 && !inputValid ? true : undefined}
          aria-describedby={
            proxyValue.trim().length > 0 && !inputValid
              ? "paynow-value-hint"
              : undefined
          }
        />
        {proxyValue.trim().length > 0 && !inputValid ? (
          <p id="paynow-value-hint" className="text-destructive text-xs" role="alert">
            {proxyType === "mobile"
              ? "Enter a valid SG mobile (8 digits starting with 8 or 9)"
              : "Enter a valid UEN (e.g. 201403121W)"}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paynow-name">Payment recipient name</Label>
        <Input
          id="paynow-name"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          maxLength={50}
        />
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
        <div className="flex flex-col items-center gap-2 rounded-md border p-4">
          <p className="text-muted-foreground text-xs font-medium">
            Sample QR (S$23.00 · SAMPLE-001)
          </p>
          <div className="rounded bg-white p-3">
            <QRCode value={sampleQr} size={140} />
          </div>
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={handleSave}
        disabled={pending || !inputValid || !recipientName.trim()}
      >
        {pending ? "Saving…" : saved ? "Saved" : submitLabel}
      </Button>
    </div>
  );
}
