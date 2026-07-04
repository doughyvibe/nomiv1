"use client";

import Link from "next/link";

import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { formatPrice } from "@/lib/money";

export function CartPageContent() {
  const { cart, setQuantity, removeItem } = useCart();
  const { products } = useStorefront();

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
      <div className="flex flex-col items-center px-4 py-16 text-center">
        <p className="vibe-display font-display text-lg font-bold uppercase">
          Your cart is empty
        </p>
        <p className="mt-2 text-sm text-vibe-text-muted">
          Browse the catalog and add something you like.
        </p>
        <Link
          href="/"
          className="vibe-display mt-8 inline-flex rounded-[var(--vibe-radius)] bg-vibe-primary px-6 py-3 text-sm font-semibold text-vibe-primary-fg uppercase"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <h1 className="vibe-display font-display text-xl font-bold uppercase">
        Cart
      </h1>

      <ul className="flex flex-col gap-3">
        {lines.map(({ item, product }) => (
          <li
            key={product.id}
            className="metal-panel rust-edge flex gap-3 rounded-[var(--vibe-radius)] p-3"
          >
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-16 shrink-0 rounded object-cover"
              />
            ) : (
              <div className="size-16 shrink-0 rounded bg-vibe-border/20" />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Link
                href={`/product/${product.id}`}
                className="vibe-display truncate text-sm font-semibold uppercase"
              >
                {product.name}
              </Link>
              <p className="text-sm text-vibe-primary">
                {formatPrice(product.price_cents)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity(product.id, item.quantity - 1)
                    }
                    className="flex size-11 items-center justify-center rounded border border-vibe-border/40 text-sm"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity(product.id, item.quantity + 1)
                    }
                    className="flex size-11 items-center justify-center rounded border border-vibe-border/40 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="min-h-11 px-2 text-xs text-vibe-text-muted underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="metal-panel rust-edge flex items-center justify-between rounded-[var(--vibe-radius)] p-4">
        <span className="vibe-display text-sm font-semibold uppercase">
          Subtotal
        </span>
        <span className="text-lg font-semibold text-vibe-primary">
          {formatPrice(subtotal)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="vibe-display flex w-full items-center justify-center rounded-[var(--vibe-radius)] bg-vibe-primary py-3.5 text-sm font-semibold text-vibe-primary-fg uppercase transition-transform active:scale-[0.98]"
      >
        Checkout
      </Link>
    </div>
  );
}
