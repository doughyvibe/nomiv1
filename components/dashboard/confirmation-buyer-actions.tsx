"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard/copy-text";
import {
  buildConfirmationCopyText,
  buildEmailConfirmation,
  buildWhatsAppConfirmationMessage,
  whatsAppConfirmationUrl,
} from "@/lib/orders/confirmation-message";
import { mailtoBuyerUrl } from "@/lib/orders/contact-buyer";
import type { ConfirmationMessageInput } from "@/lib/orders/confirmation-message";

type ConfirmationBuyerActionsProps = ConfirmationMessageInput & {
  customerPhone: string;
  customerEmail: string;
};

export function ConfirmationBuyerActions(props: ConfirmationBuyerActionsProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const whatsApp = buildWhatsAppConfirmationMessage(props);
  const email = buildEmailConfirmation(props);
  const copy = buildConfirmationCopyText(props);

  async function handleCopy() {
    const ok = await copyText(copy);
    if (!ok) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2500);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
      <h2 className="text-sm font-medium">Send confirmation manually</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Nomi does not send this for you. Open a draft, review it, then send from
        your own app.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          render={
            <a
              href={whatsAppConfirmationUrl(props.customerPhone, whatsApp)}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          Open WhatsApp confirmation
        </Button>
        <Button
          variant="outline"
          size="sm"
          render={
            <a
              href={mailtoBuyerUrl(props.customerEmail, {
                subject: email.subject,
                body: email.body,
              })}
            />
          }
        >
          Open email confirmation draft
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={handleCopy}>
          {copied ? "Copied" : "Copy confirmation message"}
        </Button>
      </div>
      {copyError && (
        <p className="text-destructive mt-2 text-xs">Copy failed — select and copy manually.</p>
      )}
    </section>
  );
}
