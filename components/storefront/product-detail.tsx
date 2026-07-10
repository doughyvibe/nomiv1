"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";

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
  const atelier = store.vibe === "atelier";
  const expedition = store.vibe === "expedition";
  const cyberpunk = store.vibe === "cyberpunk";

  function handleAdd() {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div
      className={cn(
        "flex flex-col",
        atelier && "pdp-atelier",
        expedition && "pdp-expedition",
        cyberpunk && "pdp-cyberpunk",
      )}
    >
      <div className="px-5 pt-4 sm:px-6">
        <Link
          href="/"
          className={cn(
            "pdp-back inline-flex min-h-11 items-center gap-2 text-sm font-medium text-vibe-text-muted transition-colors hover:text-vibe-text",
            atelier && "pdp-atelier-back",
            expedition && "pdp-expedition-back",
            cyberpunk && "pdp-cyberpunk-back",
          )}
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Back to shop
        </Link>
      </div>

      {product.image_url ? (
        <div
          className={cn(
            "mt-3 overflow-hidden",
            atelier && "pdp-atelier-image mx-5 rounded-xl sm:mx-6",
          )}
        >
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
        <div
          className={cn(
            "mt-3 aspect-square w-full bg-vibe-border/20",
            atelier && "mx-5 rounded-xl sm:mx-6",
          )}
        />
      )}

      <div className="flex flex-col gap-5 px-5 py-6 sm:px-6">
        {product.category?.trim() ? (
          <span
            className={cn(
              "inline-flex w-fit rounded-full border border-vibe-border/40 px-3 py-1 text-[10px] font-semibold tracking-wider text-vibe-text-muted uppercase",
              atelier && "pdp-atelier-category",
            )}
          >
            {product.category}
          </span>
        ) : null}

        <div className="flex flex-col gap-2">
          <h1
            className={cn(
              "font-display text-2xl font-bold text-vibe-text md:text-3xl",
              atelier && "pdp-atelier-title",
              expedition && "pdp-expedition-title",
              cyberpunk && "pdp-cyberpunk-title",
            )}
          >
            {product.name}
          </h1>

          <p
            className={cn(
              "text-xl font-semibold text-vibe-primary",
              atelier && "pdp-atelier-price",
              expedition && "pdp-expedition-price",
              cyberpunk && "pdp-cyberpunk-price",
            )}
          >
            {formatPrice(product.price_cents)}
          </p>

          {product.description?.trim() ? (
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed text-vibe-text-muted",
                atelier && "pdp-atelier-desc",
              )}
            >
              {product.description}
            </p>
          ) : null}
        </div>

        {/* Quantity is a secondary control — keep it quiet so Add to cart owns the page */}
        <div
          className={cn(
            "pdp-qty flex items-center justify-between gap-4",
            atelier && "pdp-atelier-qty",
          )}
        >
          <span className="text-xs font-medium tracking-wider text-vibe-text-muted uppercase">
            Quantity
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-10 items-center justify-center rounded-full text-vibe-text-muted transition-colors hover:bg-vibe-border/20 hover:text-vibe-text active:scale-95"
            >
              <Minus className="size-4" />
            </button>
            <span
              className="min-w-[2.5rem] text-center text-base font-medium tabular-nums text-vibe-text"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-10 items-center justify-center rounded-full text-vibe-text-muted transition-colors hover:bg-vibe-border/20 hover:text-vibe-text active:scale-95"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "pdp-add w-full rounded-full py-4 text-sm font-semibold uppercase tracking-wider transition-transform active:scale-[0.98]",
            atelier && "pdp-atelier-add",
            expedition && "pdp-expedition-add",
            cyberpunk && "pdp-cyberpunk-add",
            added
              ? "bg-vibe-secondary text-vibe-bg"
              : "bg-vibe-primary text-vibe-primary-fg",
          )}
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
