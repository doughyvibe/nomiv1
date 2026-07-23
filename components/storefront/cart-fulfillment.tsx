"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CartTotals } from "@/components/storefront/cart-totals";
import {
  FulfilmentDatePicker,
  FulfilmentWindowChips,
} from "@/components/storefront/fulfilment-date-picker";
import { StorefrontSegmentedChoice } from "@/components/storefront/storefront-segmented-choice";
import { useStorefront } from "@/components/storefront/storefront-context";
import {
  cartCtaClass,
  checkoutSectionLabelClass,
  vibeFlags,
} from "@/components/storefront/vibe-ui";
import {
  clearFulfilmentDraft,
  saveFulfilmentDraft,
  type FulfilmentDraft,
} from "@/lib/cart/fulfillment-draft";
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
import { cn } from "@/lib/utils";

type LeadProduct = { name: string; lead_time_days?: number | null };

export function CartFulfilmentSection({
  slug,
  fulfillment: rawFulfillment,
  subtotal,
  cartLeadLines,
  capacityUsage = EMPTY_CAPACITY_USAGE,
}: {
  slug: string;
  fulfillment: FulfillmentConfig;
  subtotal: number;
  cartLeadLines: LeadProduct[];
  capacityUsage?: CapacityUsage;
}) {
  const { store } = useStorefront();
  const flags = vibeFlags(store.vibe);
  const fulfillment = fulfillmentWithCampaign(rawFulfillment);
  const pickupEnabled = Boolean(fulfillment.pickup?.enabled);
  const deliveryMethods = resolveDeliveryMethods(fulfillment);
  const deliveryEnabled = deliveryMethods.length > 0;
  const liveCampaign = resolveActiveCampaign(rawFulfillment);
  const campaignLocked =
    Boolean(liveCampaign) &&
    (Boolean(liveCampaign?.dates?.length) ||
      Boolean(liveCampaign?.methods?.length) ||
      Boolean(liveCampaign?.windows?.length));

  const defaultMethod =
    deliveryEnabled && !pickupEnabled
      ? "delivery"
      : pickupEnabled
        ? "pickup"
        : "delivery";

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
  const untilFree =
    effectiveMethod === "delivery" && effectiveDeliveryMethodId
      ? centsUntilFreeDelivery({
          fulfillment,
          deliveryMethodId: effectiveDeliveryMethodId,
          subtotalCents: subtotal,
        })
      : null;

  const maxLead = maxCartLeadDays(cartLeadLines);
  const needsDate = fulfilmentDateRequired(fulfillment, maxLead);
  const allowedDates = needsDate
    ? allowedFulfilmentDates({
        cartLeadDays: cartLeadLines.map((p) => p.lead_time_days ?? 0),
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
  const effectiveWindowId = needsWindow ? selectedWindowId : singleWindowId;
  const dateUnavailable = needsDate && allowedDates.length === 0;
  const windowUnavailable =
    needsDate &&
    configuredWindows.length > 0 &&
    Boolean(selectedDate) &&
    openWindows.length === 0;
  const liveEmptyMessage = dateUnavailable
    ? campaignCheckoutEmptyMessage(cartLeadLines, rawFulfillment)
    : null;

  const methodChoiceCount =
    (pickupEnabled ? 1 : 0) + deliveryMethods.length;
  const showMethodUi =
    methodChoiceCount > 1 &&
    !(campaignLocked && pickupEnabled !== deliveryEnabled);

  const draft: FulfilmentDraft = useMemo(
    () => ({
      method: effectiveMethod,
      deliveryMethodId:
        effectiveMethod === "delivery"
          ? effectiveDeliveryMethodId || undefined
          : undefined,
      date: needsDate ? selectedDate || undefined : undefined,
      windowId: needsDate ? effectiveWindowId || undefined : undefined,
    }),
    [
      effectiveMethod,
      effectiveDeliveryMethodId,
      needsDate,
      selectedDate,
      effectiveWindowId,
    ],
  );

  useEffect(() => {
    const blocked = dateUnavailable || windowUnavailable;
    if (blocked) {
      clearFulfilmentDraft(slug);
      return;
    }
    if (!pickupEnabled && !deliveryEnabled) {
      clearFulfilmentDraft(slug);
      return;
    }
    if (needsDate && !selectedDate) return;
    if (needsWindow && !effectiveWindowId) return;
    saveFulfilmentDraft(slug, draft);
  }, [
    slug,
    draft,
    dateUnavailable,
    windowUnavailable,
    pickupEnabled,
    deliveryEnabled,
    needsDate,
    selectedDate,
    needsWindow,
    effectiveWindowId,
  ]);

  const canContinue =
    (pickupEnabled || deliveryEnabled) &&
    !dateUnavailable &&
    !windowUnavailable &&
    (!needsDate || Boolean(selectedDate)) &&
    (!needsWindow || Boolean(effectiveWindowId));

  const totalDue = subtotal + feeResolved.feeCents;

  if (!pickupEnabled && !deliveryEnabled) return null;

  const segmentOptions = [
    ...(pickupEnabled
      ? [
          {
            id: "pickup",
            label: "Pickup",
            selected: effectiveMethod === "pickup",
            onSelect: () => setMethod("pickup"),
          },
        ]
      : []),
    ...deliveryMethods.map((dm) => {
      const dmFee = resolveDeliveryFeeCents({
        fulfillment,
        deliveryMethodId: dm.id,
        subtotalCents: subtotal,
      });
      const feeLabel = dmFee.waived ? "Free" : `+${formatPrice(dmFee.feeCents)}`;
      return {
        id: dm.id,
        label:
          deliveryMethods.length === 1 && !pickupEnabled
            ? `${dm.name} (${feeLabel})`
            : dm.name === "Delivery"
              ? `Delivery (${feeLabel})`
              : `${dm.name} (${feeLabel})`,
        selected:
          effectiveMethod === "delivery" && deliveryMethodId === dm.id,
        onSelect: () => {
          setMethod("delivery");
          setDeliveryMethodId(dm.id);
        },
      };
    }),
  ];

  return (
    <div className="flex flex-col gap-8">
      {campaignLocked && pickupEnabled !== deliveryEnabled ? (
        <p
          className={cn(
            "metal-panel rust-edge rounded-[var(--vibe-radius)] px-4 py-3 text-sm font-medium",
          )}
        >
          {deliveryEnabled
            ? `${selectedDelivery?.name ?? "Delivery"} (${
                feeResolved.waived
                  ? "Free"
                  : `+${formatPrice(feeResolved.feeCents)}`
              })`
            : "Pickup"}
        </p>
      ) : showMethodUi ? (
        <section className="flex flex-col gap-3">
          <h2 className={checkoutSectionLabelClass(flags)}>
            How you&apos;ll get it
          </h2>
          <StorefrontSegmentedChoice options={segmentOptions} />
        </section>
      ) : null}

      {needsDate ? (
        <section className="flex flex-col gap-3">
          <h2 className={checkoutSectionLabelClass(flags)}>When</h2>
          {dateUnavailable ? (
            <p
              className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm"
              role="alert"
            >
              {liveEmptyMessage ?? "No available dates right now."}
            </p>
          ) : singleDateLock ? (
            <p
              className={cn(
                "metal-panel rust-edge rounded-[var(--vibe-radius)] px-4 py-3 text-sm font-medium text-vibe-text",
              )}
            >
              {formatFulfilmentDateLabel(selectedDate)}
            </p>
          ) : (
            <FulfilmentDatePicker
              dates={allowedDates}
              value={selectedDate}
              onChange={setFulfillmentDate}
            />
          )}
        </section>
      ) : null}

      {needsDate && !dateUnavailable && windowUnavailable ? (
        <p
          className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm"
          role="alert"
        >
          All windows for this date are full.
        </p>
      ) : null}

      {needsDate && !dateUnavailable && !windowUnavailable && needsWindow ? (
        <FulfilmentWindowChips
          windows={openWindows}
          value={selectedWindowId}
          onChange={setFulfillmentWindowId}
        />
      ) : null}

      <CartTotals
        flags={flags}
        subtotal={subtotal}
        deliveryFee={
          effectiveMethod === "delivery" ? feeResolved.feeCents : undefined
        }
        deliveryWaived={effectiveMethod === "delivery" ? feeResolved.waived : undefined}
        total={totalDue}
        untilFree={untilFree}
      />

      {canContinue ? (
        <Link href="/checkout" className={cartCtaClass(flags)}>
          Continue
        </Link>
      ) : (
        <button type="button" disabled className={cn(cartCtaClass(flags), "opacity-60")}>
          Continue
        </button>
      )}
    </div>
  );
}
