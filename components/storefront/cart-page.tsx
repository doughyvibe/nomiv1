"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartPageContent() {
  const { cart, setQuantity, removeItem } = useCart();
  const { products, store } = useStorefront();
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

  if (lines.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center px-5 py-16 text-center sm:px-6",
          atelier && "cart-atelier-empty",
          expedition && "cart-expedition-empty",
          cyberpunk && "cart-cyberpunk-empty",
          candyland && "cart-candyland-empty",
          market && "cart-market-empty",
          gallery && "cart-gallery-empty",
          studio && "cart-studio-empty",
          laura && "cart-laura-empty",
          atlantic && "cart-atlantic-empty",
          strada && "cart-strada-empty",
        )}
      >
        <p
          className={cn(
            "vibe-display font-display text-lg font-bold uppercase",
            atelier && "cart-atelier-empty-title",
            expedition && "cart-expedition-title",
            cyberpunk && "cart-cyberpunk-title",
            candyland && "cart-candyland-title",
          market && "cart-market-title",
          gallery && "cart-gallery-title",
          studio && "cart-studio-title",
          laura && "cart-laura-title",
          atlantic && "cart-atlantic-title",
          strada && "cart-strada-title",
          )}
        >
          Your cart is empty
        </p>
        <p className="mt-2 max-w-xs text-sm text-vibe-text-muted">
          Browse the catalog and add something you like.
        </p>
        <Link
          href="/"
          className={cn(
            "vibe-display mt-8 inline-flex rounded-[var(--vibe-radius)] bg-vibe-primary px-6 py-3.5 text-sm font-semibold text-vibe-primary-fg uppercase",
            atelier && "cart-atelier-cta",
            expedition && "cart-expedition-cta",
            cyberpunk && "cart-cyberpunk-cta",
            candyland && "cart-candyland-cta",
          market && "cart-market-cta",
          gallery && "cart-gallery-cta",
          studio && "cart-studio-cta",
          laura && "cart-laura-cta",
          atlantic && "cart-atlantic-cta",
          strada && "cart-strada-cta",
          )}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 px-5 py-6 sm:px-6",
        atelier && "cart-atelier",
        expedition && "cart-expedition",
        cyberpunk && "cart-cyberpunk",
        candyland && "cart-candyland",
          market && "cart-market",
          gallery && "cart-gallery",
          studio && "cart-studio",
          laura && "cart-laura",
          atlantic && "cart-atlantic",
          strada && "cart-strada",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h1
          className={cn(
            "vibe-display font-display text-xl font-bold uppercase",
            atelier && "cart-atelier-title",
            expedition && "cart-expedition-title",
            cyberpunk && "cart-cyberpunk-title",
            candyland && "cart-candyland-title",
          market && "cart-market-title",
          gallery && "cart-gallery-title",
          studio && "cart-studio-title",
          laura && "cart-laura-title",
          atlantic && "cart-atlantic-title",
          strada && "cart-strada-title",
          )}
        >
          Cart
        </h1>
        {atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada ? (
          <Link
            href="/"
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 text-sm text-vibe-text-muted",
              atelier && "cart-atelier-back",
              expedition && "cart-expedition-back",
              cyberpunk && "cart-cyberpunk-back",
              candyland && "cart-candyland-back",
          market && "cart-market-back",
          gallery && "cart-gallery-back",
          studio && "cart-studio-back",
          laura && "cart-laura-back",
          atlantic && "cart-atlantic-back",
          strada && "cart-strada-back",
            )}
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Keep shopping
          </Link>
        ) : null}
      </div>

      <ul className="flex flex-col gap-3">
        {lines.map(({ item, product }) => (
          <li
            key={product.id}
            className={cn(
              "metal-panel rust-edge flex gap-3 rounded-[var(--vibe-radius)] p-3",
              atelier && "cart-atelier-line",
              expedition && "cart-expedition-line",
              cyberpunk && "cart-cyberpunk-line",
              candyland && "cart-candyland-line",
          market && "cart-market-line",
          gallery && "cart-gallery-line",
          studio && "cart-studio-line",
          laura && "cart-laura-line",
          atlantic && "cart-atlantic-line",
          strada && "cart-strada-line",
            )}
          >
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt=""
                loading="lazy"
                decoding="async"
                className={cn(
                  "size-16 shrink-0 rounded object-cover",
                  atelier && "cart-atelier-thumb",
                )}
              />
            ) : (
              <div
                className={cn(
                  "size-16 shrink-0 rounded bg-vibe-border/20",
                  atelier && "cart-atelier-thumb",
                )}
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/product/${product.id}`}
                  className={cn(
                    "vibe-display truncate text-sm font-semibold uppercase",
                    atelier && "cart-atelier-name",
                  )}
                >
                  {product.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className={cn(
                    "min-h-11 shrink-0 px-1 text-xs text-vibe-text-muted underline",
                    atelier && "cart-atelier-remove",
                  )}
                >
                  Remove
                </button>
              </div>
              <p
                className={cn(
                  "text-sm text-vibe-primary",
                  atelier && "cart-atelier-price",
                )}
              >
                {formatPrice(product.price_cents)}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(product.id, item.quantity - 1)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded border border-vibe-border/40 text-sm",
                    atelier && "cart-atelier-qty-btn",
                  )}
                >
                  {atelier ? <Minus className="size-3.5" /> : "−"}
                </button>
                <span className="min-w-[2.5rem] text-center text-sm tabular-nums">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(product.id, item.quantity + 1)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded border border-vibe-border/40 text-sm",
                    atelier && "cart-atelier-qty-btn",
                  )}
                >
                  {atelier ? <Plus className="size-3.5" /> : "+"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "metal-panel rust-edge flex items-center justify-between rounded-[var(--vibe-radius)] p-4",
          atelier && "cart-atelier-subtotal",
        )}
      >
        <span
          className={cn(
            "vibe-display text-sm font-semibold uppercase",
            atelier && "cart-atelier-subtotal-label",
          )}
        >
          Subtotal
        </span>
        <span
          className={cn(
            "text-lg font-semibold text-vibe-primary",
            atelier && "cart-atelier-subtotal-value",
          )}
        >
          {formatPrice(subtotal)}
        </span>
      </div>

      <Link
        href="/checkout"
        className={cn(
          "vibe-display flex w-full items-center justify-center rounded-[var(--vibe-radius)] bg-vibe-primary py-3.5 text-sm font-semibold text-vibe-primary-fg uppercase transition-transform active:scale-[0.98]",
          atelier && "cart-atelier-cta",
          expedition && "cart-expedition-cta",
            cyberpunk && "cart-cyberpunk-cta",
            candyland && "cart-candyland-cta",
          market && "cart-market-cta",
          gallery && "cart-gallery-cta",
          studio && "cart-studio-cta",
          laura && "cart-laura-cta",
          atlantic && "cart-atlantic-cta",
          strada && "cart-strada-cta",
        )}
      >
        Checkout
      </Link>
    </div>
  );
}
