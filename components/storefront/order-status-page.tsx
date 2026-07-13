"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import QRCode from "react-qr-code";

import { notifySellerAction } from "@/app/(storefront)/s/[slug]/actions";
import { OrderReceipt } from "@/components/storefront/order-receipt";
import { useStorefront } from "@/components/storefront/storefront-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadPayNowQrImage } from "@/lib/paynow/download-qr-image";
import { formatPrice } from "@/lib/money";
import type { LoadedOrder } from "@/lib/orders/load-order";
import { buyerOrderView } from "@/lib/orders/status";
import { cn } from "@/lib/utils";

type OrderStatusPageProps = {
  slug: string;
  data: LoadedOrder;
  payload: string;
};

function useCountdown(expiresAt: string) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  );

  useEffect(() => {
    const tick = () => {
      setRemainingMs(
        Math.max(0, new Date(expiresAt).getTime() - Date.now()),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const totalSec = Math.ceil(remainingMs / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return {
    expired: remainingMs <= 0,
    label: `${min}:${sec.toString().padStart(2, "0")}`,
  };
}

function StatusShell({
  title,
  children,
  atelier,
  expedition,
  cyberpunk,
  candyland,
  market,
  gallery,
  studio,
  laura,
}: {
  title: string;
  children: React.ReactNode;
  atelier: boolean;
  expedition: boolean;
  cyberpunk: boolean;
  candyland: boolean;
  market: boolean;
  gallery: boolean;
  studio: boolean;
  laura: boolean;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-8 text-center sm:px-6">
      <p
        className={cn(
          "vibe-display font-display text-xl font-bold uppercase",
          atelier && "pay-atelier-status-title",
          expedition && "pay-expedition-status-title",
          cyberpunk && "pay-cyberpunk-status-title",
          candyland && "pay-candyland-status-title",
          market && "pay-market-status-title",
          gallery && "pay-gallery-status-title",
          studio && "pay-studio-status-title",
          laura && "pay-laura-status-title",
        )}
      >
        {title}
      </p>
      <div className="mt-6 w-full">{children}</div>
    </div>
  );
}

export function OrderStatusPageContent({
  slug,
  data,
  payload,
}: OrderStatusPageProps) {
  const router = useRouter();
  const { store: liveStore } = useStorefront();
  const atelier = liveStore.vibe === "atelier";
  const expedition = liveStore.vibe === "expedition";
  const cyberpunk = liveStore.vibe === "cyberpunk";
  const candyland = liveStore.vibe === "candyland";
  const market = liveStore.vibe === "market";
  const gallery = liveStore.vibe === "gallery";
  const laura = liveStore.vibe === "laura";
  const studio = liveStore.vibe === "studio";
  const { order, store } = data;
  const qrRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [savingQr, setSavingQr] = useState(false);
  const [saveQrError, setSaveQrError] = useState<string | null>(null);
  const [notifyState, notifyAction, notifyPending] = useActionState(
    async () => {
      const result = await notifySellerAction(slug, order.reference);
      if ("error" in result) return { error: result.error };
      return { success: true as const };
    },
    null,
  );
  const [, startTransition] = useTransition();

  const countdown = useCountdown(order.payment_expires_at);
  const view = buyerOrderView(order);
  const awaiting =
    view === "awaiting_verification" || notifyState?.success;

  useEffect(() => {
    if (notifyState?.success) router.refresh();
  }, [notifyState, router]);

  async function handleSaveQr() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    setSavingQr(true);
    setSaveQrError(null);
    try {
      await downloadPayNowQrImage({
        storeName: store.name,
        amountLabel: formatPrice(order.total_cents),
        reference: order.reference,
        qrSvg: svg,
        filename: `paynow-${order.reference}.png`,
      });
    } catch {
      setSaveQrError("Could not save QR. Try a screenshot instead.");
    } finally {
      setSavingQr(false);
    }
  }

  function handleNotify() {
    startTransition(() => {
      notifyAction();
    });
    setModalOpen(false);
  }

  if (view === "confirmed") {
    const title =
      order.status === "completed" ? "Order completed" : "Order confirmed";

    return (
      <StatusShell title={title} atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura}>
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-vibe-text-muted">
          {store.name} has verified your payment. Your order is being prepared.
        </p>
        <OrderReceipt data={data} showPaidLabel atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura} />
        <p className="mt-6 text-xs text-vibe-text-muted">
          Bookmark this page to check your order status any time.
        </p>
      </StatusShell>
    );
  }

  if (view === "cancelled") {
    return (
      <StatusShell title="Order cancelled" atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura}>
        <p className="mb-6 max-w-sm text-sm text-vibe-text-muted">
          This order was cancelled. If you have questions, contact {store.name}{" "}
          with reference{" "}
          <strong className="text-vibe-text">{order.reference}</strong>.
        </p>
        <OrderReceipt data={data} showPaidLabel={false} atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura} />
      </StatusShell>
    );
  }

  if (awaiting) {
    return (
      <StatusShell title="Awaiting seller verification" atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura}>
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-vibe-text-muted">
          The seller will verify your payment manually. Check back on this page
          for updates — your order is not confirmed until they verify payment.
        </p>
        <OrderReceipt data={data} atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura} />
        <p className="mt-6 text-xs text-vibe-text-muted">
          Bookmark this page to see when your order is confirmed.
        </p>
      </StatusShell>
    );
  }

  if (view === "expired" || countdown.expired) {
    return (
      <StatusShell title="Payment window expired" atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura}>
        <p className="mb-6 max-w-sm text-sm text-vibe-text-muted">
          If you already paid, contact {store.name} with your order reference{" "}
          <strong className="text-vibe-text">{order.reference}</strong>.
        </p>
        <OrderReceipt data={data} atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura} />
      </StatusShell>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 px-5 py-6 sm:px-6",
        atelier && "pay-atelier",
        expedition && "pay-expedition",
        cyberpunk && "pay-cyberpunk",
        candyland && "pay-candyland",
          market && "pay-market",
          gallery && "pay-gallery",
          studio && "pay-studio",
          laura && "pay-laura",
      )}
    >
      <div className="text-center">
        <p
          className={cn(
            "vibe-display text-xs tracking-widest text-vibe-text-muted uppercase",
            atelier && "checkout-atelier-section-label",
            expedition && "checkout-expedition-section-label",
            cyberpunk && "checkout-cyberpunk-section-label",
            candyland && "checkout-candyland-section-label",
          market && "checkout-market-section-label",
          gallery && "checkout-gallery-section-label",
          studio && "checkout-studio-section-label",
          laura && "checkout-laura-section-label",
          )}
        >
          Payment pending
        </p>
        <h1
          className={cn(
            "vibe-display mt-2 font-display text-2xl font-bold uppercase",
            atelier && "pay-atelier-amount",
            expedition && "pay-expedition-amount",
            cyberpunk && "pay-cyberpunk-amount",
            candyland && "pay-candyland-amount",
          market && "pay-market-amount",
          gallery && "pay-gallery-amount",
          studio && "pay-studio-amount",
          laura && "pay-laura-amount",
          )}
        >
          {formatPrice(order.total_cents)}
        </h1>
        <p className="mt-1 text-sm text-vibe-text-muted">
          Order {order.reference}
        </p>
      </div>

      {payload ? (
        <div
          className={cn(
            "metal-panel rust-edge flex flex-col items-center rounded-[var(--vibe-radius)] p-6",
            atelier && "checkout-atelier-panel",
            expedition && "checkout-expedition-panel",
            cyberpunk && "checkout-cyberpunk-panel",
            candyland && "checkout-candyland-panel",
          market && "checkout-market-panel",
          gallery && "checkout-gallery-panel",
          studio && "checkout-studio-panel",
          laura && "checkout-laura-panel",
          )}
        >
          <div ref={qrRef} className="rounded-lg bg-white p-4">
            <QRCode value={payload} size={220} />
          </div>
          <p
            className={cn(
              "mt-4 text-sm font-medium text-vibe-primary",
              atelier && "pay-atelier-timer",
            )}
          >
            Complete payment within {countdown.label}
          </p>
          <p className="mt-1 text-xs text-vibe-text-muted">
            10-minute payment window
          </p>
        </div>
      ) : (
        <p className="text-center text-sm text-vibe-text-muted">
          Payment QR unavailable. Contact the seller with reference{" "}
          {order.reference}.
        </p>
      )}

      {payload && (
        <>
          <button
            type="button"
            onClick={handleSaveQr}
            disabled={savingQr}
            className={cn(
              "vibe-display w-full rounded-[var(--vibe-radius)] border border-vibe-border/40 py-3 text-sm font-semibold uppercase transition-transform active:scale-[0.98] disabled:opacity-50",
              atelier && "pay-atelier-secondary",
              expedition && "pay-expedition-secondary",
              cyberpunk && "pay-cyberpunk-secondary",
              candyland && "pay-candyland-secondary",
          market && "pay-market-secondary",
          gallery && "pay-gallery-secondary",
          studio && "pay-studio-secondary",
          laura && "pay-laura-secondary",
            )}
          >
            {savingQr ? "Saving…" : "Save QR code"}
          </button>
          {saveQrError && (
            <p className="text-center text-sm text-red-400" role="alert">
              {saveQrError}
            </p>
          )}
        </>
      )}

      <section
        className={cn(
          "metal-panel rust-edge rounded-[var(--vibe-radius)] p-4 text-sm",
          atelier && "checkout-atelier-panel",
            expedition && "checkout-expedition-panel",
            cyberpunk && "checkout-cyberpunk-panel",
            candyland && "checkout-candyland-panel",
          market && "checkout-market-panel",
          gallery && "checkout-gallery-panel",
          studio && "checkout-studio-panel",
          laura && "checkout-laura-panel",
        )}
      >
        <h2
          className={cn(
            "vibe-display text-xs font-semibold text-vibe-text-muted uppercase",
            atelier && "checkout-atelier-section-label",
            expedition && "checkout-expedition-section-label",
            cyberpunk && "checkout-cyberpunk-section-label",
            candyland && "checkout-candyland-section-label",
          market && "checkout-market-section-label",
          gallery && "checkout-gallery-section-label",
          studio && "checkout-studio-section-label",
          laura && "checkout-laura-section-label",
          )}
        >
          How to pay
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-4 text-vibe-text-muted">
          <li>Open your banking app and scan the QR code</li>
          <li>Confirm the amount and reference match</li>
          <li>Complete payment, then notify the seller below</li>
        </ol>
        <p className="mt-3 text-xs text-vibe-text-muted">
          Tip: You can screenshot the QR code instead of saving it.
        </p>
      </section>

      <OrderReceipt data={data} atelier={atelier} expedition={expedition} cyberpunk={cyberpunk} candyland={candyland} market={market} gallery={gallery} studio={studio} laura={laura} />

      {notifyState?.error && (
        <p className="text-sm text-red-400" role="alert">
          {notifyState.error}
        </p>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={notifyPending}
        className={cn(
          "vibe-display w-full rounded-[var(--vibe-radius)] bg-vibe-primary py-3.5 text-sm font-semibold text-vibe-primary-fg uppercase transition-transform active:scale-[0.98] disabled:opacity-50",
          atelier && "checkout-atelier-cta",
          expedition && "checkout-expedition-cta",
          cyberpunk && "checkout-cyberpunk-cta",
          candyland && "checkout-candyland-cta",
          market && "checkout-market-cta",
          gallery && "checkout-gallery-cta",
          studio && "checkout-studio-cta",
          laura && "checkout-laura-cta",
        )}
      >
        {notifyPending ? "Notifying…" : "Notify seller to verify payment"}
      </button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          showCloseButton
          className="border-vibe-border/40 bg-vibe-surface text-vibe-text sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle
              className={cn(
                "vibe-display font-display uppercase",
                atelier && "pay-atelier-dialog-title",
              )}
            >
              Notify seller to verify payment?
            </DialogTitle>
            <DialogDescription className="text-vibe-text-muted">
              Only continue after you have paid{" "}
              {formatPrice(order.total_cents)} for order {order.reference}.
              Your order is not confirmed yet. The seller will manually verify
              payment before accepting the order.
            </DialogDescription>
          </DialogHeader>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className={cn("mt-1", atelier && "checkout-atelier-radio",
                expedition && "checkout-expedition-radio",
                cyberpunk && "checkout-cyberpunk-radio",
                candyland && "checkout-candyland-radio",
          market && "checkout-market-radio",
          gallery && "checkout-gallery-radio",
          studio && "checkout-studio-radio",
          laura && "checkout-laura-radio")}
            />
            <span>I have completed payment using the QR code above.</span>
          </label>

          <DialogFooter className="border-vibe-border/30 bg-transparent sm:justify-end">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-[var(--vibe-radius)] px-4 py-2 text-sm text-vibe-text-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!checked || notifyPending}
              onClick={handleNotify}
              className={cn(
                "vibe-display rounded-[var(--vibe-radius)] bg-vibe-primary px-4 py-2 text-sm font-semibold text-vibe-primary-fg uppercase disabled:opacity-50",
                atelier && "checkout-atelier-cta px-5 py-2.5",
                expedition && "checkout-expedition-cta px-5 py-2.5",
                cyberpunk && "checkout-cyberpunk-cta px-5 py-2.5",
                candyland && "checkout-candyland-cta px-5 py-2.5",
          market && "checkout-market-cta px-5 py-2.5",
          gallery && "checkout-gallery-cta px-5 py-2.5",
          studio && "checkout-studio-cta px-5 py-2.5",
          laura && "checkout-laura-cta px-5 py-2.5",
              )}
            >
              Yes, notify seller
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** @deprecated Use OrderStatusPageContent */
export const PaymentPageContent = OrderStatusPageContent;
