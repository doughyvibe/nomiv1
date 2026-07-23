"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CartFulfilmentSection } from "@/components/storefront/cart-fulfillment";
import { CartOrderSummary } from "@/components/storefront/cart-order-summary";
import { CartTotals } from "@/components/storefront/cart-totals";
import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import {
  cartBackClass,
  cartCtaClass,
  cartEmptyTitleClass,
  cartTitleClass,
  vibeFlags,
} from "@/components/storefront/vibe-ui";
import {
  cartLineCustomisationLines,
  cartLineVariantLabel,
  resolveCartLineUnitPrice,
} from "@/lib/cart/line-price";
import { buyerNeedsCartFulfilmentStep } from "@/lib/fulfilment/buyer-cart-step";
import type { CapacityUsage } from "@/lib/fulfilment/dates";
import { EMPTY_CAPACITY_USAGE } from "@/lib/fulfilment/dates";
import type { FulfillmentConfig } from "@/lib/stores/types";

export function CartPageContent({
  capacityUsage = EMPTY_CAPACITY_USAGE,
}: {
  capacityUsage?: CapacityUsage;
}) {
  const { cart, setQuantity, removeItem } = useCart();
  const { products, store } = useStorefront();
  const flags = vibeFlags(store.vibe);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const fulfillment = store.fulfillment as FulfillmentConfig;

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

  const cartLeadLines = lines.map(({ product }) => ({
    name: product.name,
    lead_time_days: product.lead_time_days ?? 0,
  }));
  const needsFulfilmentStep = buyerNeedsCartFulfilmentStep(
    fulfillment,
    cartLeadLines,
  );

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center px-5 py-16 text-center sm:px-6">
        <p className={cartEmptyTitleClass(flags)}>Your cart is empty</p>
        <p className="mt-2 max-w-xs text-sm text-vibe-text-muted">
          Browse the catalog and add something you like.
        </p>
        <Link href="/" className={cartCtaClass(flags)}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70dvh] flex-col gap-8 px-5 py-6 pb-12 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className={cartTitleClass(flags)}>Cart</h1>
        <Link href="/" className={cartBackClass(flags)}>
          <ArrowLeft className="size-3.5" aria-hidden />
          Keep shopping
        </Link>
      </header>

      <CartOrderSummary
        lines={lines}
        onSetQuantity={setQuantity}
        onRemove={removeItem}
      />

      {needsFulfilmentStep ? (
        <CartFulfilmentSection
          slug={store.slug}
          fulfillment={fulfillment}
          subtotal={subtotal}
          cartLeadLines={cartLeadLines}
          capacityUsage={capacityUsage}
        />
      ) : (
        <div className="mt-auto flex flex-col gap-6">
          <CartTotals flags={flags} subtotal={subtotal} total={subtotal} />
          <Link href="/checkout" className={cartCtaClass(flags)}>
            Continue
          </Link>
        </div>
      )}
    </div>
  );
}
