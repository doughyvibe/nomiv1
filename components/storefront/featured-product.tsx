"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus, Star } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { resolveFeaturedSectionTitle } from "@/lib/featured-section";
import { formatPrice } from "@/lib/money";
import { allowsQuickAdd } from "@/lib/products/quick-add";
import type { Product, Vibe } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type FeaturedProductProps = {
  product: Product;
  sectionTitle?: string | null;
  vibe?: Vibe | "industrial";
};

function isNoirVibe(vibe: Vibe | "industrial" | undefined): boolean {
  return vibe === "epicurean" || vibe === "industrial";
}

export function FeaturedProduct({
  product,
  sectionTitle,
  vibe = "epicurean",
}: FeaturedProductProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const quickAdd = allowsQuickAdd(product);
  const noir = isNoirVibe(vibe);
  const heading = resolveFeaturedSectionTitle(sectionTitle);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section className={cn("px-5 sm:px-6", noir && "featured-noir-section")}>
      <div
        className={cn(
          "mb-4 flex items-center justify-between",
          noir && "featured-noir-header",
        )}
      >
        <h2
          className={cn(
            "font-display text-lg font-semibold text-vibe-text md:text-xl",
            noir && "featured-noir-header-title",
          )}
        >
          {heading}
        </h2>
        {noir ? (
          <Star className="featured-noir-header-star size-5 shrink-0" aria-hidden />
        ) : null}
      </div>

      <Link
        href={`/product/${product.id}`}
        className={cn(
          "vibe-card group block overflow-hidden rounded-[var(--vibe-radius)] transition-transform active:scale-[0.99] md:grid md:grid-cols-2 md:gap-0",
          noir && "featured-noir-card",
        )}
      >
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[280px]",
            noir && "featured-noir-image-wrap",
          )}
        >
          {product.image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={product.name}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 h-1/3",
                  noir
                    ? "featured-noir-image-fade"
                    : "bg-gradient-to-t from-vibe-surface to-transparent",
                )}
              />
            </>
          ) : (
            <div className="size-full bg-vibe-border/20" />
          )}
        </div>

        <div
          className={cn(
            "flex flex-col gap-3 p-5 md:relative md:justify-center md:p-8",
            noir && "featured-noir-body",
          )}
        >
          <p
            className={cn(
              "font-display text-xl font-semibold text-vibe-text md:text-2xl",
              noir && "featured-noir-name",
            )}
          >
            {product.name}
          </p>

          {product.description?.trim() ? (
            <p
              className={cn(
                "line-clamp-3 text-sm leading-relaxed text-vibe-text-muted",
                noir && "featured-noir-desc",
              )}
            >
              {product.description}
            </p>
          ) : null}

          <div
            className={cn(
              "mt-auto flex items-center justify-between gap-3 pt-2",
              noir && "featured-noir-price-row",
            )}
          >
            <p
              className={cn(
                "text-xl font-semibold text-vibe-primary md:text-2xl",
                noir && "featured-noir-price",
              )}
            >
              {formatPrice(product.price_cents)}
            </p>

            {quickAdd ? (
              <button
                type="button"
                onClick={handleQuickAdd}
                aria-label={`Add ${product.name} to cart`}
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full border border-vibe-border/40 bg-vibe-surface transition-colors",
                  noir && "featured-noir-add",
                  added && "bg-vibe-primary text-vibe-primary-fg",
                )}
              >
                {added ? (
                  <span className="text-xs font-semibold">✓</span>
                ) : (
                  <Plus className="size-5" />
                )}
              </button>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-vibe-text-muted">
                View details
                <ArrowRight className="size-3.5" />
              </span>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
