"use client";

import { Check, Copy, QrCode } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

import {
  DashboardPanel,
  DashboardPanelBody,
} from "@/components/dashboard/dashboard-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copyText } from "@/lib/clipboard/copy-text";
import { getStorefrontPreviewUrl } from "@/lib/host";
import type { Store, StoreStatus } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type StatusView = {
  label: string;
  line: string;
  tone: "live" | "paused" | "neutral" | "danger";
};

function statusView(status: StoreStatus): StatusView {
  switch (status) {
    case "published":
      return {
        label: "Live",
        line: "Your store is online and accepting orders.",
        tone: "live",
      };
    case "unpublished":
      return {
        label: "Paused",
        line: "Customers cannot currently place orders.",
        tone: "paused",
      };
    case "suspended":
      return {
        label: "Suspended",
        line: "Store is offline. Contact support if this is unexpected.",
        tone: "danger",
      };
    case "deleted":
      return {
        label: "Unavailable",
        line: "This store is no longer available.",
        tone: "neutral",
      };
    default:
      return {
        label: "Not live yet",
        line: "Visitors see Coming Soon until you publish.",
        tone: "neutral",
      };
  }
}

export function StoreControlCard({
  store,
  storeUrl,
}: {
  store: Store;
  storeUrl: string;
}) {
  const displayUrl = storeUrl.replace(/^https?:\/\//, "");
  const view = statusView(store.status);
  const isLive = store.status === "published";
  const previewHref = isLive
    ? storeUrl
    : getStorefrontPreviewUrl(store.slug);

  const [copied, setCopied] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  async function handleCopy() {
    const ok = await copyText(storeUrl);
    if (!ok) {
      setShareNote("Copy failed — select the link and copy manually.");
      setTimeout(() => setShareNote(null), 2500);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    setShareNote(null);
    // Native share sheet when available (mobile); else copy (Context7 unavailable for Web Share; MDN: navigator.share)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: store.name,
          text: `Shop at ${store.name}`,
          url: storeUrl,
        });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // fall through to copy
      }
    }
    const ok = await copyText(storeUrl);
    setShareNote(ok ? "Link copied — paste it anywhere." : "Couldn’t share or copy.");
    setTimeout(() => setShareNote(null), 2500);
  }

  return (
    <DashboardPanel>
      <DashboardPanelBody className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                view.tone === "live" &&
                  "bg-[var(--brand-mint)] animate-brand-pulse",
                view.tone === "paused" && "bg-amber-500",
                view.tone === "danger" && "bg-destructive",
                view.tone === "neutral" && "bg-muted-foreground/50",
              )}
              aria-hidden
            />
            <p className="font-display text-lg font-bold text-foreground">
              {view.label}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {view.line}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-[var(--brand-bg-soft)] px-3 py-2.5">
          <p className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
            {displayUrl}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label={copied ? "Copied" : "Copy store link"}
          >
            {copied ? (
              <Check className="size-3.5" strokeWidth={2.5} />
            ) : (
              <Copy className="size-3.5" strokeWidth={2.5} />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <Button type="button" onClick={handleShare} className="w-full">
          Share Store
        </Button>

        <div className="flex items-center justify-center gap-3 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="inline-flex items-center gap-1.5 text-foreground underline-offset-2 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none rounded-sm"
          >
            <QrCode className="size-3.5" strokeWidth={2.5} />
            QR Code
          </button>
          <span className="text-muted-foreground/40" aria-hidden>
            ·
          </span>
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline-offset-2 hover:underline"
          >
            {isLive ? "View store" : "Preview"}
          </a>
        </div>

        {shareNote ? (
          <p className="text-center text-xs text-muted-foreground" role="status">
            {shareNote}
          </p>
        ) : null}
      </DashboardPanelBody>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Store QR code</DialogTitle>
            <DialogDescription>
              Scan to open {displayUrl}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center rounded-2xl bg-white p-6">
            <QRCode value={storeUrl} size={180} />
          </div>
        </DialogContent>
      </Dialog>
    </DashboardPanel>
  );
}
