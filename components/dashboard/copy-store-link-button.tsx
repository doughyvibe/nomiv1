"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard/copy-text";

export function CopyStoreLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function handleCopy() {
    const ok = await copyText(url);
    if (!ok) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2500);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button type="button" variant="outline" onClick={handleCopy}>
        {copied ? "Copied" : "Copy link"}
      </Button>
      {copyError && (
        <p className="text-destructive text-xs">Copy failed — select and copy manually.</p>
      )}
    </div>
  );
}
