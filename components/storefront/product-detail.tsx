"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { store } = useStorefront();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4">
        <Link
          href="/"
          className="vibe-display inline-flex min-h-11 items-center text-xs font-semibold text-vibe-primary uppercase"
        >
          ← Back to shop
        </Link>
      </div>

      {product.image_url ? (
        <div className="mt-4 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url}
            alt={product.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="aspect-square w-full object-cover"
          />
        </div>
      ) : (
        <div className="mt-4 aspect-square w-full bg-vibe-border/20" />
      )}

      <div className="flex flex-col gap-4 px-4 py-6">
        {product.category?.trim() && (
          <span className="vibe-display inline-flex w-fit rounded-[var(--vibe-radius)] border border-vibe-border/40 px-2 py-1 text-[10px] font-semibold text-vibe-text-muted uppercase">
            {product.category}
          </span>
        )}

        <h1 className="vibe-display font-display text-2xl font-bold uppercase">
          {product.name}
        </h1>

        <p className="text-xl font-semibold text-vibe-primary">
          {formatPrice(product.price_cents)}
        </p>

        {product.description?.trim() && (
          <p className="text-sm leading-relaxed text-vibe-text-muted">
            {product.description}
          </p>
        )}

        <div className="metal-panel rust-edge flex items-center justify-between rounded-[var(--vibe-radius)] p-3">
          <span className="vibe-display text-xs font-semibold uppercase">
            Quantity
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-11 items-center justify-center rounded-[var(--vibe-radius)] border border-vibe-border/40 text-lg font-medium transition-transform active:scale-95"
            >
              −
            </button>
            <span className="min-w-[2ch] text-center font-medium">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-11 items-center justify-center rounded-[var(--vibe-radius)] border border-vibe-border/40 text-lg font-medium transition-transform active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "vibe-display w-full rounded-[var(--vibe-radius)] py-3.5 text-sm font-semibold uppercase transition-transform active:scale-[0.98]",
            added
              ? "bg-vibe-secondary text-vibe-bg"
              : "bg-vibe-primary text-vibe-primary-fg",
          )}
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>

        <p className="text-center text-xs text-vibe-text-muted">
          {store.name}
        </p>
      </div>
    </div>
  );
}
