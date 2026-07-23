"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { createOrderAction } from "@/app/(storefront)/s/[slug]/actions";
import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import {
  cartLineCustomisationLines,
  cartLineVariantLabel,
  resolveCartLineUnitPrice,
} from "@/lib/cart/line-price";
import { clearFulfilmentDraft, loadFulfilmentDraft } from "@/lib/cart/fulfillment-draft";
import { clearCart } from "@/lib/cart/storage";
import {
  FulfilmentDatePicker,
  FulfilmentWindowChips,
} from "@/components/storefront/fulfilment-date-picker";
import { buyerNeedsCartFulfilmentStep } from "@/lib/fulfilment/buyer-cart-step";
import {
  campaignCheckoutEmptyMessage,
  fulfillmentWithCampaign,
  resolveActiveCampaign,
} from "@/lib/fulfilment/campaigns";
import {
  centsUntilFreeDelivery,
  resolveDeliveryFeeCents,
  resolveDeliveryMethods,
} from "@/lib/fulfilment/delivery-methods";
import {
  allowedFulfilmentDates,
  availableWindowsForDate,
  EMPTY_CAPACITY_USAGE,
  formatFulfilmentDateLabel,
  fulfilmentDateRequired,
  maxCartLeadDays,
  resolveWindows,
  type CapacityUsage,
} from "@/lib/fulfilment/dates";
import { formatPrice } from "@/lib/money";
import type { FulfillmentConfig } from "@/lib/stores/types";
import { paynowIsComplete } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function CheckoutForm({
  slug,
  capacityUsage = EMPTY_CAPACITY_USAGE,
}: {
  slug: string;
  capacityUsage?: CapacityUsage;
}) {
  const router = useRouter();
  const { cart } = useCart();
  const { store, products } = useStorefront();
  const rawFulfillment = store.fulfillment as FulfillmentConfig;
  const fulfillment = fulfillmentWithCampaign(rawFulfillment);
  const paynowReady = paynowIsComplete(store.paynow);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const atelier = store.vibe === "atelier";
  const expedition = store.vibe === "expedition";
  const cyberpunk = store.vibe === "cyberpunk";
  const candyland = store.vibe === "candyland";
  const market = store.vibe === "market";
  const gallery = store.vibe === "gallery";
  const studio = store.vibe === "studio";
  const laura = store.vibe === "laura";
  const atlantic = store.vibe === "atlantic";
  const strada = store.vibe === "strada";

  const productMap = new Map(products.map((p) => [p.id, p]));
  const lines = cart.items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      const unit = resolveCartLineUnitPrice(item, product);
      if (unit === undefined) return null;
      const variantLabel = cartLineVariantLabel(item, product);
      const customLines = cartLineCustomisationLines(item, product);
      return { item, product, unit, variantLabel, customLines };
    })
    .filter(Boolean) as {
    item: (typeof cart.items)[number];
    product: (typeof products)[number];
    unit: number;
    variantLabel: string | null;
    customLines: string[];
  }[];

  const subtotal = lines.reduce(
    (sum, { item, unit }) => sum + unit * item.quantity,
    0,
  );

  const pickupEnabled = Boolean(fulfillment.pickup?.enabled);
  const deliveryMethods = resolveDeliveryMethods(fulfillment);
  const deliveryEnabled = deliveryMethods.length > 0;
  const liveCampaign = resolveActiveCampaign(rawFulfillment);
  const campaignLocked =
    Boolean(liveCampaign) &&
    (Boolean(liveCampaign?.dates?.length) ||
      Boolean(liveCampaign?.methods?.length) ||
      Boolean(liveCampaign?.windows?.length));
  const defaultMethod = deliveryEnabled && !pickupEnabled
    ? "delivery"
    : pickupEnabled
      ? "pickup"
      : deliveryEnabled
        ? "delivery"
        : "pickup";
  const [method, setMethod] = useState<"pickup" | "delivery">(defaultMethod);
  const [deliveryMethodId, setDeliveryMethodId] = useState(
    () => deliveryMethods[0]?.id ?? "",
  );
  const lockedMethod: "pickup" | "delivery" | null =
    campaignLocked && deliveryEnabled && !pickupEnabled
      ? "delivery"
      : campaignLocked && pickupEnabled && !deliveryEnabled
        ? "pickup"
        : null;
  const effectiveMethod = lockedMethod ?? method;
  const selectedDelivery =
    deliveryMethods.find((m) => m.id === deliveryMethodId) ??
    deliveryMethods[0];
  const effectiveDeliveryMethodId =
    effectiveMethod === "delivery" ? (selectedDelivery?.id ?? "") : "";
  const feeResolved =
    effectiveMethod === "delivery" && effectiveDeliveryMethodId
      ? resolveDeliveryFeeCents({
          fulfillment,
          deliveryMethodId: effectiveDeliveryMethodId,
          subtotalCents: subtotal,
        })
      : { feeCents: 0, waived: false, thresholdCents: null as number | null };
  const appliedDelivery = feeResolved.feeCents;
  const totalDue = subtotal + appliedDelivery;
  const untilFree =
    effectiveMethod === "delivery" && effectiveDeliveryMethodId
      ? centsUntilFreeDelivery({
          fulfillment,
          deliveryMethodId: effectiveDeliveryMethodId,
          subtotalCents: subtotal,
        })
      : null;

  const maxLead = maxCartLeadDays(
    lines.map(({ product }) => ({
      lead_time_days: product.lead_time_days ?? 0,
    })),
  );
  const needsDate = fulfilmentDateRequired(fulfillment, maxLead);
  const allowedDates = needsDate
    ? allowedFulfilmentDates({
        cartLeadDays: lines.map(
          ({ product }) => product.lead_time_days ?? 0,
        ),
        fulfillment,
        usage: capacityUsage,
        method: effectiveMethod,
      })
    : [];
  const singleDateLock = campaignLocked && allowedDates.length === 1;
  const [fulfillmentDate, setFulfillmentDate] = useState(
    () => allowedDates[0] ?? "",
  );
  const selectedDate =
    needsDate && fulfillmentDate && allowedDates.includes(fulfillmentDate)
      ? fulfillmentDate
      : (allowedDates[0] ?? "");
  const configuredWindows = selectedDate
    ? resolveWindows(fulfillment, {
        method: effectiveMethod,
        date: selectedDate,
      })
    : [];
  const openWindows =
    needsDate && selectedDate && configuredWindows.length > 0
      ? availableWindowsForDate(
          selectedDate,
          fulfillment,
          capacityUsage,
          effectiveMethod,
        )
      : [];
  const needsWindow = configuredWindows.length > 1;
  const [fulfillmentWindowId, setFulfillmentWindowId] = useState(
    () => openWindows[0]?.id ?? configuredWindows[0]?.id ?? "",
  );
  const selectedWindowId =
    openWindows.length === 0
      ? ""
      : openWindows.some((w) => w.id === fulfillmentWindowId)
        ? fulfillmentWindowId
        : (openWindows[0]?.id ?? "");
  const singleWindowId =
    configuredWindows.length === 1 ? (openWindows[0]?.id ?? "") : "";
  const effectiveWindowId = needsWindow
    ? selectedWindowId
    : singleWindowId;
  const dateUnavailable = needsDate && allowedDates.length === 0;
  const windowUnavailable =
    needsDate &&
    configuredWindows.length > 0 &&
    Boolean(selectedDate) &&
    openWindows.length === 0;
  const liveEmptyMessage = dateUnavailable
    ? campaignCheckoutEmptyMessage(
        lines.map(({ product }) => ({
          name: product.name,
          lead_time_days: product.lead_time_days ?? 0,
        })),
        rawFulfillment,
      )
    : null;

  const needsCartStep = buyerNeedsCartFulfilmentStep(
    fulfillment,
    lines.map(({ product }) => ({
      lead_time_days: product.lead_time_days ?? 0,
    })),
  );
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const d = loadFulfilmentDraft(slug);
    setHasDraft(Boolean(d));
    if (d?.method === "pickup" || d?.method === "delivery") {
      setMethod(d.method);
    }
    if (d?.deliveryMethodId) setDeliveryMethodId(d.deliveryMethodId);
    if (d?.date) setFulfillmentDate(d.date);
    if (d?.windowId) setFulfillmentWindowId(d.windowId);
    setDraftHydrated(true);
    // ponytail: hydrate once per slug
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const draftLooksValid =
    (!needsDate || Boolean(selectedDate)) &&
    (!needsWindow || Boolean(effectiveWindowId)) &&
    !dateUnavailable &&
    !windowUnavailable;

  useEffect(() => {
    if (!draftHydrated) return;
    if (needsCartStep && (!hasDraft || !draftLooksValid)) {
      router.replace("/cart");
    }
  }, [draftHydrated, needsCartStep, hasDraft, draftLooksValid, router]);

  const showFulfilmentRecap =
    draftHydrated && needsCartStep && hasDraft && draftLooksValid;

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createOrderAction(slug, formData);
      if ("error" in result) return { error: result.error };
      clearCart(slug);
      clearFulfilmentDraft(slug);
      router.push(result.redirectTo);
      return null;
    },
    null,
  );

  useEffect(() => {
    if (state?.error) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      errorRef.current?.focus();
    }
  }, [state?.error]);

  const staleCount = cart.items.length - lines.length;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center px-5 py-16 text-center sm:px-6">
        <p
          className={cn(
            "vibe-display font-display text-lg font-bold uppercase",
            strada && "checkout-strada-title",
          )}
        >
          Your cart is empty
        </p>
        <p className="mt-2 max-w-xs text-sm text-vibe-text-muted">
          Add something from the shop, then come back to check out.
        </p>
        <Link
          href="/"
          className={cn(
            "vibe-display mt-8 inline-flex rounded-[var(--vibe-radius)] bg-vibe-primary px-6 py-3.5 text-sm font-semibold text-vibe-primary-fg uppercase",
            atelier && "checkout-atelier-cta",
            expedition && "checkout-expedition-cta",
            cyberpunk && "checkout-cyberpunk-cta",
            candyland && "checkout-candyland-cta",
            market && "checkout-market-cta",
            gallery && "checkout-gallery-cta",
            studio && "checkout-studio-cta",
            laura && "checkout-laura-cta",
            atlantic && "checkout-atlantic-cta",
            strada && "checkout-strada-cta",
          )}
        >
          Continue shopping
        </Link>
        <Link
          href="/cart"
          className={cn(
            "mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-vibe-text-muted",
            atelier && "checkout-atelier-back",
            expedition && "checkout-expedition-back",
            cyberpunk && "checkout-cyberpunk-back",
            candyland && "checkout-candyland-back",
            market && "checkout-market-back",
            gallery && "checkout-gallery-back",
            studio && "checkout-studio-back",
            laura && "checkout-laura-back",
            atlantic && "checkout-atlantic-back",
            strada && "checkout-strada-back",
          )}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to cart
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className={cn(
        "flex flex-col gap-6 px-5 py-6 sm:px-6",
        atelier && "checkout-atelier",
        expedition && "checkout-expedition",
        cyberpunk && "checkout-cyberpunk",
        candyland && "checkout-candyland",
          market && "checkout-market",
          gallery && "checkout-gallery",
          studio && "checkout-studio",
          laura && "checkout-laura",
          atlantic && "checkout-atlantic",
          strada && "checkout-strada",
      )}
    >
      <div>
        <Link
          href="/cart"
          className={cn(
            "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-vibe-text-muted transition-colors hover:text-vibe-text",
            atelier && "checkout-atelier-back",
            expedition && "checkout-expedition-back",
            cyberpunk && "checkout-cyberpunk-back",
            candyland && "checkout-candyland-back",
          market && "checkout-market-back",
          gallery && "checkout-gallery-back",
          studio && "checkout-studio-back",
          laura && "checkout-laura-back",
          atlantic && "checkout-atlantic-back",
          strada && "checkout-strada-back",
          )}
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Back to cart
        </Link>
        <h1
          className={cn(
            "vibe-display mt-4 font-display text-xl font-bold uppercase",
            atelier && "checkout-atelier-title",
            expedition && "checkout-expedition-title",
            cyberpunk && "checkout-cyberpunk-title",
            candyland && "checkout-candyland-title",
          market && "checkout-market-title",
          gallery && "checkout-gallery-title",
          studio && "checkout-studio-title",
          laura && "checkout-laura-title",
          atlantic && "checkout-atlantic-title",
          strada && "checkout-strada-title",
            )}
        >
          Checkout
        </h1>
      </div>

      {state?.error ? (
        <p
          ref={errorRef}
          tabIndex={-1}
          className="rounded-[var(--vibe-radius)] border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400 outline-none"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <input type="hidden" name="cart" value={JSON.stringify(cart.items)} />

      {staleCount > 0 && (
        <p className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-vibe-text-muted">
          {staleCount === 1
            ? "One item was removed — it is no longer available."
            : `${staleCount} items were removed — they are no longer available.`}
        </p>
      )}

      <section
        className={cn(
          "metal-panel rust-edge rounded-[var(--vibe-radius)] p-4",
          atelier && "checkout-atelier-panel",
          expedition && "checkout-expedition-panel",
          cyberpunk && "checkout-cyberpunk-panel",
          candyland && "checkout-candyland-panel",
          market && "checkout-market-panel",
          gallery && "checkout-gallery-panel",
          studio && "checkout-studio-panel",
          laura && "checkout-laura-panel",
          atlantic && "checkout-atlantic-panel",
          strada && "checkout-strada-panel",
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
          atlantic && "checkout-atlantic-section-label",
          strada && "checkout-strada-section-label",
          )}
        >
          Order summary
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {lines.map(({ item, product, unit, variantLabel, customLines }) => (
            <li
              key={item.lineKey}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="min-w-0 break-words">
                {product.name}
                {variantLabel ? ` (${variantLabel})` : ""} × {item.quantity}
                {customLines.length > 0 ? (
                  <span className="mt-0.5 block text-xs text-vibe-text-muted">
                    {customLines.join(" · ")}
                  </span>
                ) : null}
              </span>
              <span>{formatPrice(unit * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>

      {showFulfilmentRecap ? (
        <div className="flex items-start justify-between gap-3 rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-3 text-sm">
          <input type="hidden" name="fulfillment_method" value={effectiveMethod} />
          {effectiveMethod === "delivery" && effectiveDeliveryMethodId ? (
            <input
              type="hidden"
              name="delivery_method_id"
              value={effectiveDeliveryMethodId}
            />
          ) : null}
          {needsDate && selectedDate ? (
            <input type="hidden" name="fulfillment_date" value={selectedDate} />
          ) : null}
          {needsDate && effectiveWindowId ? (
            <input
              type="hidden"
              name="fulfillment_window_id"
              value={effectiveWindowId}
            />
          ) : null}
          <p className="min-w-0 font-medium leading-snug">
            {effectiveMethod === "delivery"
              ? (selectedDelivery?.name ?? "Delivery")
              : "Pickup"}
            {needsDate && selectedDate
              ? ` · ${formatFulfilmentDateLabel(selectedDate)}`
              : ""}
            {needsDate && openWindows.find((w) => w.id === effectiveWindowId)?.label
              ? ` · ${openWindows.find((w) => w.id === effectiveWindowId)?.label}`
              : ""}
          </p>
          <Link
            href="/cart"
            className="shrink-0 font-semibold underline-offset-2 hover:underline"
          >
            Edit
          </Link>
        </div>
      ) : (
        <>
      {(pickupEnabled || deliveryEnabled) && (
        <fieldset className="flex flex-col gap-3">
          <legend
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
          atlantic && "checkout-atlantic-section-label",
          strada && "checkout-strada-section-label",
            )}
          >
            Fulfillment
          </legend>
          {campaignLocked && pickupEnabled !== deliveryEnabled ? (
            <>
              <input
                type="hidden"
                name="fulfillment_method"
                value={deliveryEnabled ? "delivery" : "pickup"}
              />
              {deliveryEnabled && effectiveDeliveryMethodId ? (
                <input
                  type="hidden"
                  name="delivery_method_id"
                  value={effectiveDeliveryMethodId}
                />
              ) : null}
              <p className="rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-sm">
                <span className="font-medium">
                  {deliveryEnabled
                    ? `${selectedDelivery?.name ?? "Delivery"} (${
                        feeResolved.waived
                          ? "Free"
                          : `+${formatPrice(feeResolved.feeCents)}`
                      })`
                    : "Pickup"}
                </span>
                <span className="mt-0.5 block text-xs text-vibe-text-muted">
                  Locked for Live
                  {deliveryEnabled && selectedDelivery?.instructions
                    ? ` — ${selectedDelivery.instructions}`
                    : !deliveryEnabled && fulfillment.pickup?.instructions
                      ? ` — ${fulfillment.pickup.instructions}`
                      : ""}
                </span>
              </p>
            </>
          ) : (
            <>
          {pickupEnabled && (
            <label
              className={cn(
                "metal-panel rust-edge flex cursor-pointer items-start gap-3 rounded-[var(--vibe-radius)] p-3",
                atelier && "checkout-atelier-option",
                expedition && "checkout-expedition-option",
                cyberpunk && "checkout-cyberpunk-option",
                candyland && "checkout-candyland-option",
          market && "checkout-market-option",
          gallery && "checkout-gallery-option",
          studio && "checkout-studio-option",
          laura && "checkout-laura-option",
          atlantic && "checkout-atlantic-option",
          strada && "checkout-strada-option",
              )}
            >
              <input
                type="radio"
                name="fulfillment_method"
                value="pickup"
                checked={method === "pickup"}
                onChange={() => setMethod("pickup")}
                className={cn("mt-1", atelier && "checkout-atelier-radio",
                  expedition && "checkout-expedition-radio",
                  cyberpunk && "checkout-cyberpunk-radio",
                  candyland && "checkout-candyland-radio",
          market && "checkout-market-radio",
          gallery && "checkout-gallery-radio",
          studio && "checkout-studio-radio",
          laura && "checkout-laura-radio",
          atlantic && "checkout-atlantic-radio",
          strada && "checkout-strada-radio")}
              />
              <span>
                <span
                  className={cn(
                    "vibe-display block text-sm font-semibold uppercase",
                    atelier && "checkout-atelier-option-title",
                  )}
                >
                  Pickup
                </span>
                {fulfillment.pickup?.instructions && (
                  <span className="text-xs text-vibe-text-muted">
                    {fulfillment.pickup.instructions}
                  </span>
                )}
              </span>
            </label>
          )}
          {deliveryMethods.map((dm) => {
            const dmFee = resolveDeliveryFeeCents({
              fulfillment,
              deliveryMethodId: dm.id,
              subtotalCents: subtotal,
            });
            return (
            <label
              key={dm.id}
              className={cn(
                "metal-panel rust-edge flex cursor-pointer items-start gap-3 rounded-[var(--vibe-radius)] p-3",
                atelier && "checkout-atelier-option",
                expedition && "checkout-expedition-option",
                cyberpunk && "checkout-cyberpunk-option",
                candyland && "checkout-candyland-option",
          market && "checkout-market-option",
          gallery && "checkout-gallery-option",
          studio && "checkout-studio-option",
          laura && "checkout-laura-option",
          atlantic && "checkout-atlantic-option",
          strada && "checkout-strada-option",
              )}
            >
              <input
                type="radio"
                name="fulfillment_method"
                value="delivery"
                checked={
                  method === "delivery" && deliveryMethodId === dm.id
                }
                onChange={() => {
                  setMethod("delivery");
                  setDeliveryMethodId(dm.id);
                }}
                className={cn("mt-1", atelier && "checkout-atelier-radio",
                  expedition && "checkout-expedition-radio",
                  cyberpunk && "checkout-cyberpunk-radio",
                  candyland && "checkout-candyland-radio",
          market && "checkout-market-radio",
          gallery && "checkout-gallery-radio",
          studio && "checkout-studio-radio",
          laura && "checkout-laura-radio",
          atlantic && "checkout-atlantic-radio",
          strada && "checkout-strada-radio")}
              />
              <span>
                <span
                  className={cn(
                    "vibe-display block text-sm font-semibold uppercase",
                    atelier && "checkout-atelier-option-title",
                  )}
                >
                  {dm.name} (
                  {dmFee.waived ? "Free" : `+${formatPrice(dmFee.feeCents)}`})
                </span>
                {dm.instructions ? (
                  <span className="text-xs text-vibe-text-muted">
                    {dm.instructions}
                  </span>
                ) : null}
              </span>
            </label>
            );
          })}
          {method === "delivery" && effectiveDeliveryMethodId ? (
            <input
              type="hidden"
              name="delivery_method_id"
              value={effectiveDeliveryMethodId}
            />
          ) : null}
            </>
          )}
        </fieldset>
      )}

      {needsDate ? (
        <fieldset className="flex flex-col gap-3">
          <legend
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
              atlantic && "checkout-atlantic-section-label",
              strada && "checkout-strada-section-label",
            )}
          >
            {effectiveMethod === "delivery" ? "Delivery date" : "Pickup date"}
          </legend>
          {dateUnavailable ? (
            <p
              className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-vibe-text"
              role="alert"
            >
              {liveEmptyMessage ??
                "No available dates right now — this week may be fully booked. Please contact the seller."}
            </p>
          ) : singleDateLock ? (
            <>
              <input
                type="hidden"
                name="fulfillment_date"
                value={selectedDate}
              />
              <p className="rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-sm">
                <span className="font-medium">
                  {formatFulfilmentDateLabel(selectedDate)}
                </span>
                <span className="mt-0.5 block text-xs text-vibe-text-muted">
                  Locked for Live
                  {maxLead > 0
                    ? ` · needs ${maxLead} ${maxLead === 1 ? "day" : "days"} prep`
                    : ""}
                </span>
              </p>
              {windowUnavailable ? (
                <p
                  className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-vibe-text"
                  role="alert"
                >
                  All time windows for this date are full. Pick another date.
                </p>
              ) : needsWindow ? (
                <FulfilmentWindowChips
                  name="fulfillment_window_id"
                  windows={openWindows}
                  value={selectedWindowId}
                  onChange={setFulfillmentWindowId}
                />
              ) : configuredWindows.length === 1 && effectiveWindowId ? (
                <input
                  type="hidden"
                  name="fulfillment_window_id"
                  value={effectiveWindowId}
                />
              ) : null}
            </>
          ) : (
            <>
              <FulfilmentDatePicker
                name="fulfillment_date"
                dates={allowedDates}
                value={selectedDate}
                onChange={setFulfillmentDate}
              />
              {windowUnavailable ? (
                <p
                  className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-vibe-text"
                  role="alert"
                >
                  All windows for this date are full.
                </p>
              ) : needsWindow ? (
                <FulfilmentWindowChips
                  name="fulfillment_window_id"
                  windows={openWindows}
                  value={selectedWindowId}
                  onChange={setFulfillmentWindowId}
                />
              ) : configuredWindows.length === 1 && effectiveWindowId ? (
                <input
                  type="hidden"
                  name="fulfillment_window_id"
                  value={effectiveWindowId}
                />
              ) : null}
            </>
          )}
        </fieldset>
      ) : null}
        </>
      )}

      <section
        className={cn(
          "metal-panel rust-edge rounded-[var(--vibe-radius)] p-4",
          atelier && "checkout-atelier-panel",
          expedition && "checkout-expedition-panel",
          cyberpunk && "checkout-cyberpunk-panel",
          candyland && "checkout-candyland-panel",
          market && "checkout-market-panel",
          gallery && "checkout-gallery-panel",
          studio && "checkout-studio-panel",
          laura && "checkout-laura-panel",
          atlantic && "checkout-atlantic-panel",
          strada && "checkout-strada-panel",
        )}
        aria-live="polite"
      >
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-vibe-text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {effectiveMethod === "delivery" && (
            <div className="flex justify-between text-vibe-text-muted">
              <span>Delivery</span>
              <span>
                {feeResolved.waived ? "Free" : formatPrice(appliedDelivery)}
              </span>
            </div>
          )}
          {untilFree !== null && (
            <p className="text-xs text-vibe-text-muted">
              {formatPrice(untilFree)} more for free delivery
            </p>
          )}
          <div className="flex justify-between border-t border-vibe-border/30 pt-2 font-medium text-vibe-text">
            <span>Total due</span>
            <span>{formatPrice(totalDue)}</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
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
          atlantic && "checkout-atlantic-section-label",
          strada && "checkout-strada-section-label",
          )}
        >
          Your details
        </h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-vibe-text-muted">Name</span>
          <input
            name="customer_name"
            required
            autoComplete="name"
            className={cn(
              "rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary",
              atelier && "checkout-atelier-input",
              expedition && "checkout-expedition-input",
              cyberpunk && "checkout-cyberpunk-input",
              candyland && "checkout-candyland-input",
          market && "checkout-market-input",
          gallery && "checkout-gallery-input",
          studio && "checkout-studio-input",
          laura && "checkout-laura-input",
          atlantic && "checkout-atlantic-input",
          strada && "checkout-strada-input",
            )}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-vibe-text-muted">
            Mobile (Singapore)
          </span>
          <input
            name="customer_phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="91234567"
            className={cn(
              "rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary",
              atelier && "checkout-atelier-input",
              expedition && "checkout-expedition-input",
              cyberpunk && "checkout-cyberpunk-input",
              candyland && "checkout-candyland-input",
          market && "checkout-market-input",
          gallery && "checkout-gallery-input",
          studio && "checkout-studio-input",
          laura && "checkout-laura-input",
          atlantic && "checkout-atlantic-input",
          strada && "checkout-strada-input",
            )}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-vibe-text-muted">Email</span>
          <input
            name="customer_email"
            required
            type="email"
            autoComplete="email"
            className={cn(
              "rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary",
              atelier && "checkout-atelier-input",
              expedition && "checkout-expedition-input",
              cyberpunk && "checkout-cyberpunk-input",
              candyland && "checkout-candyland-input",
          market && "checkout-market-input",
          gallery && "checkout-gallery-input",
          studio && "checkout-studio-input",
          laura && "checkout-laura-input",
          atlantic && "checkout-atlantic-input",
          strada && "checkout-strada-input",
            )}
          />
          <span className="text-[11px] text-vibe-text-muted">
            So the seller can reach you about this order. Bookmark the next page
            for your receipt and status.
          </span>
        </label>
        {deliveryEnabled && effectiveMethod === "delivery" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-vibe-text-muted">
              Delivery address
            </span>
            <textarea
              name="delivery_address"
              required
              rows={2}
              className={cn(
                "rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary",
                atelier && "checkout-atelier-input",
              expedition && "checkout-expedition-input",
              cyberpunk && "checkout-cyberpunk-input",
              candyland && "checkout-candyland-input",
          market && "checkout-market-input",
          gallery && "checkout-gallery-input",
          studio && "checkout-studio-input",
          laura && "checkout-laura-input",
          atlantic && "checkout-atlantic-input",
          strada && "checkout-strada-input",
              )}
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-vibe-text-muted">
            Order notes (optional)
          </span>
          <textarea
            name="order_notes"
            rows={2}
            className={cn(
              "rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary",
              atelier && "checkout-atelier-input",
              expedition && "checkout-expedition-input",
              cyberpunk && "checkout-cyberpunk-input",
              candyland && "checkout-candyland-input",
          market && "checkout-market-input",
          gallery && "checkout-gallery-input",
          studio && "checkout-studio-input",
          laura && "checkout-laura-input",
          atlantic && "checkout-atlantic-input",
          strada && "checkout-strada-input",
            )}
          />
        </label>
      </section>

      {!paynowReady && (
        <p
          className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-vibe-text"
          role="alert"
        >
          This store isn&apos;t ready to take PayNow payments yet. Please
          contact the seller.
        </p>
      )}

      {paynowReady ? (
        <p className="text-center text-xs text-vibe-text-muted">
          Next: PayNow QR → pay the exact amount → notify the seller to verify.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !paynowReady || dateUnavailable || windowUnavailable}
        className={cn(
          "vibe-display w-full rounded-[var(--vibe-radius)] bg-vibe-primary py-3.5 text-sm font-semibold text-vibe-primary-fg uppercase transition-transform active:scale-[0.98] disabled:opacity-60",
          atelier && "checkout-atelier-cta",
          expedition && "checkout-expedition-cta",
          cyberpunk && "checkout-cyberpunk-cta",
          candyland && "checkout-candyland-cta",
          market && "checkout-market-cta",
          gallery && "checkout-gallery-cta",
          studio && "checkout-studio-cta",
          laura && "checkout-laura-cta",
          atlantic && "checkout-atlantic-cta",
          strada && "checkout-strada-cta",
        )}
      >
        {pending ? "Creating order…" : "Place order & pay"}
      </button>
    </form>
  );
}
