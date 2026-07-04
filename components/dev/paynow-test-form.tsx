"use client";

import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyText } from "@/lib/clipboard/copy-text";
import {
  buildPayNowPayload,
  validatePayloadCrc,
  type PayNowProxyType,
} from "@/lib/paynow";

export function PayNowTestForm() {
  const [proxyType, setProxyType] = useState<PayNowProxyType>("mobile");
  const [proxyValue, setProxyValue] = useState("91234567");
  const [amount, setAmount] = useState("0.50");
  const [reference, setReference] = useState("TEST-001");
  const [merchantName, setMerchantName] = useState("Sarah Bakes");
  const [expiry, setExpiry] = useState("");

  const result = useMemo(() => {
    const parsedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(parsedAmount)) {
      return { error: "Enter a valid amount" as const };
    }

    try {
      const payload = buildPayNowPayload({
        proxyType,
        proxyValue,
        amount: parsedAmount,
        reference,
        merchantName,
        expiry: expiry.trim() || undefined,
        editable: false,
      });
      return {
        error: null,
        payload,
        crcValid: validatePayloadCrc(payload),
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Invalid input",
      };
    }
  }, [proxyType, proxyValue, amount, reference, merchantName, expiry]);

  const payload = result && "payload" in result ? result.payload : null;
  const crcValid = result && "crcValid" in result ? result.crcValid : false;
  const error = result?.error ?? null;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">PayNow QR test</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Internal dev tool — generates EMVCo PayNow payloads for Task 2.2
          banking app validation.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="proxyType">Proxy type</Label>
          <select
            id="proxyType"
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
            value={proxyType}
            onChange={(e) => setProxyType(e.target.value as PayNowProxyType)}
          >
            <option value="mobile">Mobile</option>
            <option value="uen">UEN</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="proxyValue">
            {proxyType === "mobile" ? "Mobile number" : "UEN"}
          </Label>
          <Input
            id="proxyValue"
            value={proxyValue}
            onChange={(e) => setProxyValue(e.target.value)}
            placeholder={proxyType === "mobile" ? "91234567" : "201403121W"}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Amount (SGD)</Label>
          <Input
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="merchantName">Merchant name</Label>
          <Input
            id="merchantName"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="expiry">Expiry (optional, YYYYMMDD)</Label>
          <Input
            id="expiry"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="20261231"
          />
        </div>
      </div>

      {error ? (
        <p className="text-destructive text-sm">{error}</p>
      ) : payload ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border p-6">
          <div className="rounded-lg bg-white p-4">
            <QRCode value={payload} size={220} />
          </div>
          <p className="text-sm">
            CRC:{" "}
            <span className={crcValid ? "text-green-600" : "text-red-600"}>
              {crcValid ? "valid" : "invalid"}
            </span>
          </p>
          <pre className="bg-muted w-full overflow-x-auto rounded p-3 text-xs break-all whitespace-pre-wrap">
            {payload}
          </pre>
        </div>
      ) : null}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          if (payload) void copyText(payload);
        }}
        disabled={!payload}
      >
        Copy payload
      </Button>
    </div>
  );
}
