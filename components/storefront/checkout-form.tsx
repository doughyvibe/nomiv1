"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

import { createOrderAction } from "@/app/(storefront)/s/[slug]/actions";
import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { clearCart } from "@/lib/cart/storage";
import { formatPrice } from "@/lib/money";
import type { FulfillmentConfig } from "@/lib/stores/types";

export function CheckoutForm({ slug }: { slug: string }) {
  const router = useRouter();
  const { cart } = useCart();
  const { store, products } = useStorefront();
  const fulfillment = store.fulfillment as FulfillmentConfig;

  const productMap = new Map(products.map((p) => [p.id, p]));
  const lines = cart.items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter(Boolean) as {
    item: { productId: string; quantity: number };
    product: (typeof products)[number];
  }[];

  const subtotal = lines.reduce(
    (sum, { item, product }) => sum + product.price_cents * item.quantity,
    0,
  );

  const pickupEnabled = Boolean(fulfillment.pickup?.enabled);
  const deliveryEnabled = Boolean(fulfillment.delivery?.enabled);
  const deliveryFee = fulfillment.delivery?.fee_cents ?? 0;

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createOrderAction(slug, formData);
      if ("error" in result) return { error: result.error };
      clearCart(slug);
      router.push(result.redirectTo);
      return null;
    },
    null,
  );

  const staleCount = cart.items.length - lines.length;

  if (lines.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-vibe-text-muted">Your cart is empty.</p>
        <Link href="/cart" className="mt-4 inline-block text-vibe-primary">
          Back to cart
        </Link>
      </div>
    );
  }

  const defaultMethod = pickupEnabled
    ? "pickup"
    : deliveryEnabled
      ? "delivery"
      : "pickup";

  return (
    <form action={formAction} className="flex flex-col gap-6 px-4 py-6">
      <div>
        <Link
          href="/cart"
          className="vibe-display inline-flex min-h-11 items-center text-xs font-semibold text-vibe-primary uppercase"
        >
          ← Back to cart
        </Link>
        <h1 className="vibe-display mt-4 font-display text-xl font-bold uppercase">
          Checkout
        </h1>
      </div>

      <input type="hidden" name="cart" value={JSON.stringify(cart.items)} />

      {staleCount > 0 && (
        <p className="rounded-[var(--vibe-radius)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-vibe-text-muted">
          {staleCount === 1
            ? "One item was removed — it is no longer available."
            : `${staleCount} items were removed — they are no longer available.`}
        </p>
      )}

      <section className="metal-panel rust-edge rounded-[var(--vibe-radius)] p-4">
        <h2 className="vibe-display text-xs font-semibold text-vibe-text-muted uppercase">
          Order summary
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {lines.map(({ item, product }) => (
            <li
              key={product.id}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="min-w-0 break-words">
                {product.name} × {item.quantity}
              </span>
              <span>{formatPrice(product.price_cents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-vibe-border/30 pt-3 text-sm font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </section>

      {(pickupEnabled || deliveryEnabled) && (
        <fieldset className="flex flex-col gap-3">
          <legend className="vibe-display text-xs font-semibold text-vibe-text-muted uppercase">
            Fulfillment
          </legend>
          {pickupEnabled && (
            <label className="metal-panel rust-edge flex cursor-pointer items-start gap-3 rounded-[var(--vibe-radius)] p-3">
              <input
                type="radio"
                name="fulfillment_method"
                value="pickup"
                defaultChecked={defaultMethod === "pickup"}
                className="mt-1"
              />
              <span>
                <span className="vibe-display block text-sm font-semibold uppercase">
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
          {deliveryEnabled && (
            <label className="metal-panel rust-edge flex cursor-pointer items-start gap-3 rounded-[var(--vibe-radius)] p-3">
              <input
                type="radio"
                name="fulfillment_method"
                value="delivery"
                defaultChecked={defaultMethod === "delivery"}
                className="mt-1"
              />
              <span>
                <span className="vibe-display block text-sm font-semibold uppercase">
                  Delivery (+{formatPrice(deliveryFee)})
                </span>
                {fulfillment.delivery?.instructions && (
                  <span className="text-xs text-vibe-text-muted">
                    {fulfillment.delivery.instructions}
                  </span>
                )}
              </span>
            </label>
          )}
        </fieldset>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="vibe-display text-xs font-semibold text-vibe-text-muted uppercase">
          Your details
        </h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-vibe-text-muted">Name</span>
          <input
            name="customer_name"
            required
            autoComplete="name"
            className="rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary"
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
            className="rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-vibe-text-muted">Email</span>
          <input
            name="customer_email"
            required
            type="email"
            autoComplete="email"
            className="rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary"
          />
        </label>
        {deliveryEnabled && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-vibe-text-muted">
              Delivery address
            </span>
            <textarea
              name="delivery_address"
              rows={2}
              className="rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary"
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
            className="rounded-[var(--vibe-radius)] border border-vibe-border/40 bg-vibe-surface px-3 py-2.5 text-base outline-none focus:border-vibe-primary"
          />
        </label>
      </section>

      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="vibe-display w-full rounded-[var(--vibe-radius)] bg-vibe-primary py-3.5 text-sm font-semibold text-vibe-primary-fg uppercase transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Creating order…" : "Place order & pay"}
      </button>
    </form>
  );
}
