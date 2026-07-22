"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Star } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { resolveFeaturedSectionTitle } from "@/lib/featured-section";
import { formatOfferPrice } from "@/lib/products/offer-price";
import { productRequiresConfig } from "@/lib/products/customisations";
import { isProductSoldOut } from "@/lib/products/inventory";
import type { Product, Vibe } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type FeaturedProductProps = {
  product: Product;
  sectionTitle?: string | null;
  vibe?: Vibe | "industrial" | "unicorn" | "outback" | "futuristic";
};

function isNoirVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "epicurean" || vibe === "industrial";
}

function isAtelierVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "atelier" || vibe === "unicorn";
}

function isExpeditionVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "expedition" || vibe === "outback";
}

function isCyberpunkVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "cyberpunk" || vibe === "futuristic";
}

function isCandylandVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "candyland";
}

function isMarketVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "market";
}

function isGalleryVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "gallery";
}

function isStudioVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "studio";
}

function isLauraVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "laura";
}

function isAtlanticVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "atlantic";
}

function isVowsVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "vows";
}

function isStradaVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "strada";
}

export function FeaturedProduct({
  product,
  sectionTitle,
  vibe = "strada",
}: FeaturedProductProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const needsChoices = productRequiresConfig(product);
  const soldOut = isProductSoldOut(product);
  const priceLabel = formatOfferPrice(product);
  const priceDisplay = priceLabel;
  const noir = isNoirVibe(vibe);
  const atelier = isAtelierVibe(vibe);
  const expedition = isExpeditionVibe(vibe);
  const cyberpunk = isCyberpunkVibe(vibe);
  const candyland = isCandylandVibe(vibe);
  const market = isMarketVibe(vibe);
  const gallery = isGalleryVibe(vibe);
  const studio = isStudioVibe(vibe);
  const laura = isLauraVibe(vibe);
  const atlantic = isAtlanticVibe(vibe);
  const vows = isVowsVibe(vibe);
  const strada = isStradaVibe(vibe);
  const heading = resolveFeaturedSectionTitle(sectionTitle);
  const fullWidthCta = atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || vows || strada;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    if (needsChoices) {
      router.push(`/product/${product.id}`);
      return;
    }
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const ctaLabel = soldOut
    ? "Sold out"
    : needsChoices
      ? "Choose options"
      : expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || vows || strada
        ? "Add to cart"
        : "Add to Cart";

  return (
    <section
      className={cn(
        "px-5 sm:px-6",
        noir && "featured-noir-section",
        atelier && "featured-atelier-section",
        expedition && "featured-expedition-section",
        cyberpunk && "featured-cyberpunk-section",
        candyland && "featured-candyland-section",
        market && "featured-market-section",
        gallery && "featured-gallery-section",
        studio && "featured-studio-section",
        laura && "featured-laura-section",
        atlantic && "featured-atlantic-section",
        vows && "featured-vows-section",
        strada && "featured-strada-section",
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center justify-between",
          noir && "featured-noir-header",
          atelier && "featured-atelier-header",
          expedition && "featured-expedition-header",
          cyberpunk && "featured-cyberpunk-header",
          candyland && "featured-candyland-header",
          market && "featured-market-header",
          gallery && "featured-gallery-header",
          studio && "featured-studio-header",
          laura && "featured-laura-header",
          atlantic && "featured-atlantic-header",
          vows && "featured-vows-header",
          strada && "featured-strada-header",
        )}
      >
        <h2
          className={cn(
            "font-display text-lg font-semibold text-vibe-text md:text-xl",
            noir && "featured-noir-header-title",
            atelier && "featured-atelier-header-title",
            expedition && "featured-expedition-header-title",
            cyberpunk && "featured-cyberpunk-header-title",
            candyland && "featured-candyland-header-title",
            market && "featured-market-header-title",
            gallery && "featured-gallery-header-title",
            studio && "featured-studio-header-title",
            laura && "featured-laura-header-title",
            atlantic && "featured-atlantic-header-title",
            vows && "featured-vows-header-title",
            strada && "featured-strada-header-title",
          )}
        >
          {heading}
        </h2>
        {noir ? (
          <Star className="featured-noir-header-star size-5 shrink-0" aria-hidden />
        ) : null}
        {expedition ? (
          <span className="featured-expedition-header-mark" aria-hidden>
            ◆
          </span>
        ) : null}
      </div>

      <Link
        href={`/product/${product.id}`}
        className={cn(
          "vibe-card group block overflow-hidden rounded-[var(--vibe-radius)] transition-transform active:scale-[0.99] md:grid md:grid-cols-2 md:gap-0",
          noir && "featured-noir-card",
          atelier && "featured-atelier-card",
          expedition && "featured-expedition-card",
          cyberpunk && "featured-cyberpunk-card",
          candyland && "featured-candyland-card",
          market && "featured-market-card",
          gallery && "featured-gallery-card",
          studio && "featured-studio-card",
          laura && "featured-laura-card",
          atlantic && "featured-atlantic-card",
          vows && "featured-vows-card",
          strada && "featured-strada-card",
        )}
      >
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[280px]",
            noir && "featured-noir-image-wrap",
            atelier && "featured-atelier-image-wrap",
            expedition && "featured-expedition-image-wrap",
            cyberpunk && "featured-cyberpunk-image-wrap",
            candyland && "featured-candyland-image-wrap",
            market && "featured-market-image-wrap",
            gallery && "featured-gallery-image-wrap",
            studio && "featured-studio-image-wrap",
            laura && "featured-laura-image-wrap",
            atlantic && "featured-atlantic-image-wrap",
            vows && "featured-vows-image-wrap",
            strada && "featured-strada-image-wrap",
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
                    : atelier
                      ? "featured-atelier-image-fade"
                      : expedition
                        ? "featured-expedition-image-fade"
                        : cyberpunk
                          ? "featured-cyberpunk-image-fade"
                          : candyland
                            ? "featured-candyland-image-fade"
                            : market
                              ? "featured-market-image-fade"
                              : gallery
                                ? "featured-gallery-image-fade"
                                : studio
                                  ? "featured-studio-image-fade"
                                  : laura
                                    ? "featured-laura-image-fade"
                                    : atlantic
                                      ? "featured-atlantic-image-fade"
                                      : vows
                                        ? "featured-vows-image-fade"
                                      : strada
                                        ? "featured-strada-image-fade"
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
            atelier && "featured-atelier-body",
            expedition && "featured-expedition-body",
            cyberpunk && "featured-cyberpunk-body",
            candyland && "featured-candyland-body",
            market && "featured-market-body",
            gallery && "featured-gallery-body",
            studio && "featured-studio-body",
            laura && "featured-laura-body",
            atlantic && "featured-atlantic-body",
            vows && "featured-vows-body",
            strada && "featured-strada-body",
          )}
        >
          {atelier ? (
            <span className="featured-atelier-eyebrow">Featured</span>
          ) : null}
          {cyberpunk ? (
            <span className="featured-cyberpunk-eyebrow">Featured</span>
          ) : null}

          {expedition ? (
            <div className="featured-expedition-name-row">
              <p className="featured-expedition-name">{product.name}</p>
              <p className="featured-expedition-price">
                {priceDisplay}
              </p>
            </div>
          ) : (
            <p
              className={cn(
                "font-display text-xl font-semibold text-vibe-text md:text-2xl",
                noir && "featured-noir-name",
                atelier && "featured-atelier-name",
                cyberpunk && "featured-cyberpunk-name",
                candyland && "featured-candyland-name",
                market && "featured-market-name",
                gallery && "featured-gallery-name",
                studio && "featured-studio-name",
                laura && "featured-laura-name",
                atlantic && "featured-atlantic-name",
                vows && "featured-vows-name",
                strada && "featured-strada-name",
              )}
            >
              {product.name}
            </p>
          )}

          {product.description?.trim() ? (
            <p
              className={cn(
                "line-clamp-3 text-sm leading-relaxed text-vibe-text-muted",
                noir && "featured-noir-desc",
                atelier && "featured-atelier-desc",
                expedition && "featured-expedition-desc",
                cyberpunk && "featured-cyberpunk-desc",
                candyland && "featured-candyland-desc",
                market && "featured-market-desc",
                gallery && "featured-gallery-desc",
                studio && "featured-studio-desc",
                laura && "featured-laura-desc",
                atlantic && "featured-atlantic-desc",
                vows && "featured-vows-desc",
                strada && "featured-strada-desc",
              )}
            >
              {product.description}
            </p>
          ) : null}

          <div
            className={cn(
              "mt-auto flex items-center justify-between gap-3 pt-2",
              noir && "featured-noir-price-row",
              atelier && "featured-atelier-price-row flex-col items-stretch gap-6",
              expedition && "featured-expedition-price-row",
              cyberpunk && "featured-cyberpunk-price-row",
              candyland && "featured-candyland-price-row",
              market && "featured-market-price-row",
              gallery && "featured-gallery-price-row",
              studio && "featured-studio-price-row",
              laura && "featured-laura-price-row",
              atlantic && "featured-atlantic-price-row",
              vows && "featured-vows-price-row",
              strada && "featured-strada-price-row",
            )}
          >
            {!expedition ? (
              <p
                className={cn(
                  "text-xl font-semibold text-vibe-primary md:text-2xl",
                  noir && "featured-noir-price",
                  atelier && "featured-atelier-price",
                  cyberpunk && "featured-cyberpunk-price",
                  candyland && "featured-candyland-price",
                  market && "featured-market-price",
                  gallery && "featured-gallery-price",
                  studio && "featured-studio-price",
                  laura && "featured-laura-price",
                  atlantic && "featured-atlantic-price",
                  vows && "featured-vows-price",
                  strada && "featured-strada-price",
                )}
              >
                {priceDisplay}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={soldOut}
              aria-label={
                soldOut
                  ? `${product.name} sold out`
                  : needsChoices
                    ? `Choose options for ${product.name}`
                    : `Add ${product.name} to cart`
              }
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full border border-vibe-border/40 bg-vibe-surface transition-colors",
                noir && "featured-noir-add",
                atelier && "featured-atelier-add",
                expedition && "featured-expedition-add",
                cyberpunk && "featured-cyberpunk-add",
                candyland && "featured-candyland-add",
                market && "featured-market-add",
                  gallery && "featured-gallery-add",
                  studio && "featured-studio-add",
                  laura && "featured-laura-add",
                  atlantic && "featured-atlantic-add",
                  vows && "featured-vows-add",
                  strada && "featured-strada-add",
                soldOut && "cursor-not-allowed opacity-60",
                added && "bg-vibe-primary text-vibe-primary-fg",
              )}
            >
              {fullWidthCta ? (
                added ? (
                  <span>Added</span>
                ) : (
                  <span>{ctaLabel}</span>
                )
              ) : added ? (
                <span className="text-xs font-semibold">✓</span>
              ) : (
                <Plus className="size-5" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </section>
  );
}
