"use client";

import { Timer } from "lucide-react";
import QRCode from "react-qr-code";

/**
 * Marketing mock of the buyer payment card: sample dynamic PayNow QR with a
 * locked amount, order reference, and expiry — the product's USP made visual.
 */
export function PayNowQrCard() {
  return (
    <div className="relative mx-auto w-full max-w-[21rem]">
      <div className="rotate-2 rounded-[20px] border border-border bg-card p-6 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:rotate-1 sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold tracking-tight">PayNow</p>
          <span className="rounded-full bg-[var(--brand-purple-soft)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[var(--brand-purple)]">
            SGQR
          </span>
        </div>

        <div className="mt-5 rounded-[14px] border border-border bg-white p-4">
          <QRCode
            value="https://nomi.store"
            className="h-auto w-full"
            bgColor="#ffffff"
            fgColor="#16130e"
            aria-label="Sample PayNow QR code"
          />
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Amount due
            </p>
            <p className="font-display text-3xl font-extrabold tracking-tight">
              S$48.00
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Order
            </p>
            <p className="text-sm font-semibold">NM-8F2KQ3</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[var(--brand-bg-soft)] px-3 py-2.5 text-xs leading-snug text-muted-foreground">
          <Timer className="size-3.5 shrink-0" aria-hidden />
          Expires in 14:32 — amount and reference locked to this order
        </div>
      </div>

      <span className="absolute -top-4 -right-2 rotate-6 rounded-full bg-foreground px-3.5 py-2 text-xs font-bold text-[var(--brand-yellow)] shadow-md sm:-right-4">
        0% fees
      </span>
    </div>
  );
}
