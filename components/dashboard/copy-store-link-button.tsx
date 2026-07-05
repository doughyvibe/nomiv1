"use client";

import { useState } from "react";

import { copyText } from "@/lib/clipboard/copy-text";
import { cn } from "@/lib/utils";

export function CopyStoreLinkButton({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
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
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        type="button"
        onClick={handleCopy}
        className="btn-brand-outline inline-flex h-11 items-center px-5"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      {copyError ? (
        <p className="text-destructive text-xs">
          Copy failed — select and copy manually.
        </p>
      ) : null}
    </div>
  );
}
