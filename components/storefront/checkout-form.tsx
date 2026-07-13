"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { ArrowLeft } from "lucide-react";

import { createOrderAction } from "@/app/(storefront)/s/[slug]/actions";
import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { clearCart } from "@/lib/cart/storage";
import { formatPrice } from "@/lib/money";
import type { FulfillmentConfig } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function CheckoutForm({ slug }: { slug: string }) {
  const router = useRouter();
  const { cart } = useCart();
  const { store, products } = useStorefront();
  const fulfillment = store.fulfillment as FulfillmentConfig;
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
      <div className="px-5 py-16 text-center sm:px-6">
        <p className="text-vibe-text-muted">Your cart is empty.</p>
        <Link
          href="/cart"
          className={cn(
            "mt-4 inline-flex min-h-11 items-center gap-1.5 text-vibe-primary",
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

  const defaultMethod = pickupEnabled
    ? "pickup"
    : deliveryEnabled
      ? "delivery"
      : "pickup";

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
                defaultChecked={defaultMethod === "pickup"}
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
          {deliveryEnabled && (
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
                value="delivery"
                defaultChecked={defaultMethod === "delivery"}
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
        </label>
        {deliveryEnabled && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-vibe-text-muted">
              Delivery address
            </span>
            <textarea
              name="delivery_address"
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

      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
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
