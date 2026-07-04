"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard/copy-text";
import {
  formatBuyerDetailsCopy,
  mailtoBuyerUrl,
  whatsAppBuyerUrl,
} from "@/lib/orders/contact-buyer";
import type { OrderRow } from "@/lib/orders/types";

type ContactBuyerActionsProps = {
  order: Pick<
    OrderRow,
    "customer_name" | "customer_phone" | "customer_email" | "reference"
  >;
};

export function ContactBuyerActions({ order }: ContactBuyerActionsProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function handleCopy() {
    const ok = await copyText(formatBuyerDetailsCopy(order));
    if (!ok) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2500);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Contact buyer
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          render={
            <a
              href={whatsAppBuyerUrl(order.customer_phone)}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          Open WhatsApp
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={
            <a
              href={mailtoBuyerUrl(order.customer_email, {
                subject: `Regarding order ${order.reference}`,
              })}
            />
          }
        >
          Open email draft
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={handleCopy}>
          {copied ? "Copied" : "Copy buyer details"}
        </Button>
      </div>
      {copyError && (
        <p className="text-destructive text-xs">Copy failed — select and copy manually.</p>
      )}
    </div>
  );
}
