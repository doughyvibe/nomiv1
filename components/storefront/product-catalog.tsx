"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { formatPrice } from "@/lib/money";
import { normalizeCategory } from "@/lib/products/category";
import type { Product, Vibe } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

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

function ProductCard({
  product,
  index,
  atelier,
  expedition,
  cyberpunk,
  candyland,
  market,
  gallery,
  studio,
  laura,
}: {
  product: Product;
  index: number;
  atelier: boolean;
  expedition: boolean;
  cyberpunk: boolean;
  candyland: boolean;
  market: boolean;
  gallery: boolean;
  studio: boolean;
  laura: boolean;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const category = normalizeCategory(product.category);
  const blurb =
    atelier || expedition || cyberpunk || candyland || market || gallery || laura
      ? product.description?.trim()
      : null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const addButton = (
    <button
      type="button"
      onClick={handleQuickAdd}
      aria-label={`Add ${product.name} to cart`}
      className={cn(
        "catalog-card-add inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-vibe-border/40 bg-vibe-bg/50 p-0 leading-none transition-colors [&_svg]:block [&_svg]:shrink-0",
        studio && "catalog-studio-add",
        laura && "catalog-laura-add",
        added && "bg-vibe-primary text-vibe-primary-fg",
      )}
    >
      {added ? (
        <span className="text-[10px] leading-none font-bold">✓</span>
      ) : cyberpunk ? (
        <ShoppingCart className="size-4" aria-hidden />
      ) : (
        <Plus className="size-4" aria-hidden />
      )}
    </button>
  );

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "vibe-card group flex h-full flex-col overflow-hidden rounded-[var(--vibe-radius)] transition-transform active:scale-[0.98]",
        "animate-fade-up opacity-0",
        atelier && "catalog-atelier-card",
        expedition && "catalog-expedition-card",
        cyberpunk && "catalog-cyberpunk-card",
        candyland && "catalog-candyland-card",
        market && "catalog-market-card",
        gallery && "catalog-gallery-card",
        studio && "catalog-studio-card",
        laura && "catalog-laura-card",
      )}
      style={{
        animationDelay: `${80 + index * 50}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          !gallery && "aspect-square",
          atelier && "catalog-atelier-image",
          expedition && "catalog-expedition-image",
          cyberpunk && "catalog-cyberpunk-image",
          candyland && "catalog-candyland-image",
          market && "catalog-market-image",
          gallery && "catalog-gallery-pedestal catalog-gallery-image",
          studio && "catalog-studio-image",
          laura && "catalog-laura-image",
        )}
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="size-full bg-vibe-border/20" />
        )}
        {expedition ? (
          <span className="catalog-expedition-price-stamp">
            {formatPrice(product.price_cents)}
          </span>
        ) : null}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-vibe-surface/80 to-transparent",
            atelier && "catalog-atelier-image-fade",
            expedition && "catalog-expedition-image-fade",
            cyberpunk && "catalog-cyberpunk-image-fade",
            candyland && "catalog-candyland-image-fade",
            market && "catalog-market-image-fade",
            gallery && "catalog-gallery-image-fade",
            studio && "catalog-studio-image-fade",
            laura && "catalog-laura-image-fade",
          )}
        />
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-2 p-3 md:p-4",
          atelier && "catalog-atelier-body",
          expedition && "catalog-expedition-body",
          cyberpunk && "catalog-cyberpunk-body",
          candyland && "catalog-candyland-body",
          market && "catalog-market-body",
          gallery && "catalog-gallery-body",
          studio && "catalog-studio-body",
          laura && "catalog-laura-body",
        )}
      >
        {gallery ? (
          <>
            <div className="catalog-gallery-title-row">
              <h3 className="catalog-card-title line-clamp-2 text-sm font-medium leading-snug text-vibe-text md:text-base">
                {product.name}
              </h3>
              {addButton}
            </div>
            {blurb ? (
              <p className="catalog-card-desc line-clamp-2">{blurb}</p>
            ) : null}
            <p className="catalog-card-price text-sm font-semibold text-vibe-primary md:text-base">
              {formatPrice(product.price_cents)}
            </p>
          </>
        ) : studio ? (
          <>
            {category ? (
              <span className="catalog-studio-category">{category}</span>
            ) : null}
            <h3 className="catalog-card-title line-clamp-3 text-sm font-medium leading-snug text-vibe-text md:text-base">
              {product.name}
            </h3>
            <div className="catalog-studio-price-row mt-auto flex items-center justify-between gap-2 pt-2">
              <p className="catalog-card-price text-sm font-semibold text-vibe-primary md:text-base">
                {formatPrice(product.price_cents)}
              </p>
              {addButton}
            </div>
          </>
        ) : (
          <>
            <h3 className="catalog-card-title line-clamp-2 text-sm font-medium leading-snug text-vibe-text md:text-base">
              {product.name}
            </h3>
            {blurb ? (
              <p className="catalog-card-desc line-clamp-1">{blurb}</p>
            ) : null}
            <div
              className={cn(
                "mt-auto flex items-center justify-between gap-2",
                atelier && "catalog-atelier-price-row",
                candyland && "catalog-candyland-price-row",
                market && "catalog-market-price-row",
                laura && "catalog-laura-price-row",
              )}
            >
              <p className="catalog-card-price text-sm font-semibold text-vibe-primary md:text-base">
                {formatPrice(product.price_cents)}
              </p>
              {addButton}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

type ProductCatalogProps = {
  products: Product[];
  vibe?: Vibe | "industrial" | "unicorn" | "outback" | "futuristic";
};

export function ProductCatalog({
  products,
  vibe,
}: ProductCatalogProps) {
  const atelier = isAtelierVibe(vibe);
  const expedition = isExpeditionVibe(vibe);
  const cyberpunk = isCyberpunkVibe(vibe);
  const candyland = isCandylandVibe(vibe);
  const market = isMarketVibe(vibe);
  const gallery = isGalleryVibe(vibe);
  const studio = isStudioVibe(vibe);
  const laura = isLauraVibe(vibe);
  const pillsOnDesktop = atelier || expedition || cyberpunk || candyland || market || laura;
  const textFilters = gallery || studio;
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const c = normalizeCategory(p.category);
      if (c) set.add(c);
    }
    return [...set].sort();
  }, [products]);

  const showFilters = categories.length >= 2;
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    if (!showFilters || active === "All") return products;
    return products.filter((p) => normalizeCategory(p.category) === active);
  }, [products, active, showFilters]);

  if (products.length === 0) return null;

  const pillButtons = (
    <>
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => setActive(cat)}
          className={cn(
            "catalog-pill shrink-0 rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-wider transition-colors min-h-11",
            active === cat
              ? "catalog-pill-active border border-vibe-primary bg-vibe-surface text-vibe-primary"
              : "catalog-pill-inactive bg-vibe-surface text-vibe-text-muted",
          )}
        >
          {cat}
        </button>
      ))}
    </>
  );

  return (
    <section id="catalog" className="catalog-section px-5 pb-8 pt-6 sm:px-6 md:pb-12 md:pt-10">
      {showFilters ? (
        <>
          {/* Mobile pills; some vibes keep pills on desktop too. Gallery uses text links. */}
          {!textFilters ? (
            <div
              className={cn(
                "mb-6 flex gap-3 overflow-x-auto pb-1",
                pillsOnDesktop ? "md:mb-8" : "md:hidden",
              )}
            >
              {pillButtons}
            </div>
          ) : null}

          {/* Underline tabs — Gallery always; others on desktop when not pill vibes */}
          {textFilters || !pillsOnDesktop ? (
            <div
              className={cn(
                "catalog-tabs mb-8 gap-6 overflow-x-auto",
                textFilters
                  ? cn(
                      "flex",
                      gallery && "catalog-gallery-filters",
                      studio && "catalog-studio-filters",
                    )
                  : "hidden border-b border-vibe-border/30 md:flex",
              )}
            >
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={cn(
                    "catalog-tab shrink-0 min-h-11 border-b-2 border-transparent pb-3 text-sm font-medium transition-colors",
                    active === cat
                      ? "catalog-tab-active border-vibe-primary text-vibe-primary"
                      : "catalog-tab-inactive text-vibe-text-muted hover:text-vibe-text",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      <div
        className={
          gallery
            ? "catalog-gallery-grid grid"
            : "grid grid-cols-2 gap-4 gap-y-10 md:grid-cols-4 md:gap-6 md:gap-y-12"
        }
      >
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-vibe-text-muted">
            No products in this category.
          </p>
        ) : (
          filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              atelier={atelier}
              expedition={expedition}
              cyberpunk={cyberpunk}
              candyland={candyland}
              market={market}
              gallery={gallery}
              studio={studio}
              laura={laura}
            />
          ))
        )}
      </div>
    </section>
  );
}
