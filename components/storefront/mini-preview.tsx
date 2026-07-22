import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/money";
import { normalizeCategory } from "@/lib/products/category";
import {
  catalogProducts,
  resolveFeaturedProduct,
} from "@/lib/products/featured";
import { resolveFeaturedSectionTitle } from "@/lib/featured-section";
import { heroLogoClassName } from "@/lib/stores/hero-logo";
import type { HeroConfig, Product, Store, Vibe } from "@/lib/stores/types";

type MiniPreviewProps = {
  vibe: Vibe;
  storeName: string;
  hero?: Partial<HeroConfig>;
  products?: Pick<Product, "name" | "price_cents" | "image_url" | "category">[];
  store?: Pick<Store, "featured_product_id" | "featured_section_title">;
  className?: string;
};

function isNoirVibe(vibe: Vibe): boolean {
  return vibe === "epicurean";
}

function isAtelierVibe(vibe: Vibe): boolean {
  return vibe === "atelier";
}

function isExpeditionVibe(vibe: Vibe): boolean {
  return vibe === "expedition";
}

function isCyberpunkVibe(vibe: Vibe): boolean {
  return vibe === "cyberpunk";
}

function isCandylandVibe(vibe: Vibe): boolean {
  return vibe === "candyland";
}

function isMarketVibe(vibe: Vibe): boolean {
  return vibe === "market";
}

function isGalleryVibe(vibe: Vibe): boolean {
  return vibe === "gallery";
}

function isStudioVibe(vibe: Vibe): boolean {
  return vibe === "studio";
}

function isLauraVibe(vibe: Vibe): boolean {
  return vibe === "laura";
}

function isAtlanticVibe(vibe: Vibe): boolean {
  return vibe === "atlantic";
}

function isStradaVibe(vibe: Vibe): boolean {
  return vibe === "strada";
}

function Monogram({ name }: { name: string }) {
  return (
    <div
      className="mx-auto flex size-8 items-center justify-center rounded-full border text-[10px] font-bold"
      style={{
        borderColor: "rgb(var(--vibe-border) / 0.4)",
        color: "rgb(var(--vibe-primary))",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/** Phone-frame storefront preview rendered with real vibe tokens. */
export function MiniPreview({
  vibe,
  storeName,
  hero,
  products = [],
  store,
  className,
}: MiniPreviewProps) {
  const title = hero?.title || storeName;
  const asProducts = products.map((p, i) => ({
    ...p,
    id: "id" in p && p.id ? p.id : `preview-${i}`,
    description: "description" in p ? (p.description ?? "") : "",
    store_id: "",
    status: "live",
    archived: false,
  })) as Product[];
  const featured = resolveFeaturedProduct(
    { featured_product_id: store?.featured_product_id ?? null },
    asProducts,
  );
  const catalog = catalogProducts(asProducts, featured);

  const categories = [
    ...new Set(
      products
        .map((p) => normalizeCategory(p.category))
        .filter(Boolean) as string[],
    ),
  ];
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
  const strada = isStradaVibe(vibe);
  const noMonogram = noir || atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic;
  const styledHero = noir || atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic;
  const eyebrow = hero?.eyebrow?.trim();
  const tagline = hero?.subheading?.trim();

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[240px] overflow-hidden rounded-[1.5rem] border-4 border-zinc-800 shadow-lg",
        className,
      )}
    >
      <div
        data-vibe={vibe}
        className="flex max-h-[420px] flex-col gap-2 overflow-y-auto p-3"
      >
        <div
          className={
            styledHero
              ? cn(
                  "storefront-hero -mx-3 -mt-3 mb-1 flex flex-col px-3 pb-2 pt-3",
                  expedition ? "items-start text-left" : "items-center text-center",
                  candyland && "hero-candyland-band",
                  market && "hero-market-band",
                  gallery && "hero-gallery-band",
                  studio && "hero-studio-band",
                  laura && "hero-laura-band",
                  atlantic && "hero-atlantic-band",
                  strada && "hero-strada-band",
                )
              : "flex flex-col items-center gap-1 text-center"
          }
        >
          {hero?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.logo_url}
              alt={title}
              className={cn(
                "mb-1",
                heroLogoClassName(hero.logo_size, hero.logo_style, {
                  preview: true,
                }),
                market && "hero-market-logo-wrap",
              )}
            />
          ) : noMonogram ? null : (
            <Monogram name={title} />
          )}
          {eyebrow ? (
            <p
              className={
                noir
                  ? "mb-0.5 text-[11px] leading-[14px] font-semibold"
                  : atelier
                    ? "hero-atelier-eyebrow mb-0.5 text-[7px]"
                    : expedition
                      ? "hero-expedition-eyebrow mb-1 text-[7px]"
                      : cyberpunk
                        ? "hero-cyberpunk-eyebrow mb-1 text-[7px]"
                        : candyland
                          ? "hero-candyland-eyebrow mb-1 text-[7px]"
                          : market
                            ? "hero-market-eyebrow mb-1 text-[7px]"
                            : gallery
                              ? "hero-gallery-eyebrow mb-1 text-[7px]"
                              : studio
                                ? "hero-studio-eyebrow mb-1 text-[7px]"
                                : laura
                                  ? "hero-laura-eyebrow mb-1 text-[7px]"
                                  : atlantic
                                    ? "hero-atlantic-eyebrow mb-1 text-[7px]"
                                    : strada
                                      ? "hero-strada-eyebrow mb-1 text-[7px]"
                                  : "text-[8px] uppercase tracking-widest"
              }
              style={
                noir
                  ? {
                      color: "rgb(var(--vibe-text-bright))",
                      fontFamily: "var(--font-display)",
                    }
                  : atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                    ? undefined
                    : { color: "rgb(var(--vibe-text-muted))" }
              }
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={
              noir
                ? "text-[14px] leading-[17px] font-bold tracking-tight"
                : atelier
                  ? "hero-atelier-title text-[13px] leading-tight"
                  : expedition
                    ? "hero-expedition-title text-[15px] leading-none"
                    : cyberpunk
                      ? "hero-cyberpunk-title text-[12px] leading-tight"
                      : candyland
                        ? "hero-candyland-title text-[13px] leading-tight"
                        : market
                          ? "hero-market-title text-[13px] leading-tight"
                          : gallery
                            ? "hero-gallery-title text-[12px] leading-tight"
                            : studio
                              ? "hero-studio-title text-[14px] leading-none"
                              : laura
                                ? "hero-laura-title text-[13px] leading-tight"
                                : atlantic
                                  ? "hero-atlantic-title text-[13px] leading-tight"
                                  : strada
                                    ? "hero-strada-title text-[13px] leading-tight"
                              : "font-display text-sm leading-tight font-bold"
            }
            style={
              noir
                ? {
                    color: "rgb(var(--vibe-primary-container))",
                    fontFamily: "var(--font-display)",
                  }
                : atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                  ? undefined
                  : { color: "rgb(var(--vibe-primary))" }
            }
          >
            {title}
          </h2>
          {tagline ? (
            <p
              className={
                noir
                  ? "mt-0.5 max-w-[9rem] text-[8px] leading-[12px]"
                  : atelier
                    ? "hero-atelier-tagline mt-1 max-w-[9rem] text-[8px]"
                    : expedition
                      ? "hero-expedition-tagline mt-1 max-w-[10rem] text-[7px]"
                      : cyberpunk
                        ? "hero-cyberpunk-tagline mt-1 max-w-[10rem] text-[8px]"
                        : candyland
                          ? "hero-candyland-tagline mt-1 max-w-[10rem] text-[8px]"
                          : market
                            ? "hero-market-tagline mt-1 max-w-[10rem] text-[8px]"
                            : gallery
                              ? "hero-gallery-tagline mt-1 max-w-[10rem] text-[8px]"
                              : studio
                                ? "hero-studio-tagline mt-1 max-w-[10rem] text-[8px]"
                                : laura
                                  ? "hero-laura-tagline mt-1 max-w-[10rem] text-[8px]"
                                  : atlantic
                                    ? "hero-atlantic-tagline mt-1 max-w-[10rem] text-[8px]"
                                    : strada
                                      ? "hero-strada-tagline mt-1 max-w-[10rem] text-[8px]"
                                : "text-[9px] leading-snug"
              }
              style={
                noir
                  ? { color: "rgb(var(--vibe-text-variant))" }
                  : atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                    ? undefined
                    : { color: "rgb(var(--vibe-text-muted))" }
              }
            >
              {tagline}
            </p>
          ) : null}
        </div>

        {featured ? (
          <div
            className={cn(
              "vibe-card rounded-lg p-2",
              noir && "featured-noir-card featured-noir-section",
              atelier && "featured-atelier-card featured-atelier-section",
              expedition && "featured-expedition-card featured-expedition-section",
              cyberpunk && "featured-cyberpunk-card featured-cyberpunk-section",
              candyland && "featured-candyland-card featured-candyland-section",
              market && "featured-market-card featured-market-section",
              gallery && "featured-gallery-card featured-gallery-section",
              studio && "featured-studio-card featured-studio-section",
              laura && "featured-laura-card featured-laura-section",
              atlantic && "featured-atlantic-card featured-atlantic-section",
              strada && "featured-strada-card featured-strada-section",
            )}
            style={
              atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                ? undefined
                : { backgroundColor: "rgb(var(--vibe-surface))" }
            }
          >
            <div
              className={cn(
                "mb-1 flex items-center justify-between",
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
                strada && "featured-strada-header",
              )}
            >
              <p
                className={cn(
                  "text-[8px] font-semibold",
                  noir && "featured-noir-header-title",
                  atelier && "featured-atelier-header-title text-[10px]",
                  expedition && "featured-expedition-header-title text-[9px]",
                  cyberpunk && "featured-cyberpunk-header-title text-[8px]",
                  candyland && "featured-candyland-header-title text-[8px]",
                  market && "featured-market-header-title text-[8px]",
                  gallery && "featured-gallery-header-title text-[8px]",
                  studio && "featured-studio-header-title text-[8px]",
                  laura && "featured-laura-header-title text-[8px]",
                  atlantic && "featured-atlantic-header-title text-[8px]",
                  strada && "featured-strada-header-title text-[8px]",
                )}
              >
                {resolveFeaturedSectionTitle(store?.featured_section_title)}
              </p>
              {noir ? (
                <Star
                  className="featured-noir-header-star size-2 shrink-0"
                  aria-hidden
                />
              ) : null}
              {expedition ? (
                <span className="featured-expedition-header-mark text-[8px]" aria-hidden>
                  ◆
                </span>
              ) : null}
            </div>
            <p
              className={cn(
                "truncate text-[10px] font-medium",
                noir && "featured-noir-name",
                atelier && "featured-atelier-name text-[11px]",
                expedition && "featured-expedition-name text-[10px]",
                cyberpunk && "featured-cyberpunk-name text-[10px]",
                candyland && "featured-candyland-name text-[10px]",
                market && "featured-market-name text-[10px]",
                gallery && "featured-gallery-name text-[10px]",
                studio && "featured-studio-name text-[10px]",
                laura && "featured-laura-name text-[10px]",
                atlantic && "featured-atlantic-name text-[10px]",
                strada && "featured-strada-name text-[10px]",
              )}
            >
              {featured.name}
            </p>
            <p
              className={cn(
                "text-[9px] font-semibold",
                noir && "featured-noir-price",
                atelier && "featured-atelier-price text-[10px]",
                expedition && "featured-expedition-price text-[8px]",
                cyberpunk && "featured-cyberpunk-price text-[8px]",
                candyland && "featured-candyland-price text-[8px]",
                market && "featured-market-price text-[8px]",
                gallery && "featured-gallery-price text-[8px]",
                studio && "featured-studio-price text-[8px]",
                laura && "featured-laura-price text-[8px]",
                atlantic && "featured-atlantic-price text-[8px]",
                strada && "featured-strada-price text-[8px]",
              )}
              style={
                noir || atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                  ? undefined
                  : { color: "rgb(var(--vibe-primary))" }
              }
            >
              {formatPrice(featured.price_cents)}
            </p>
          </div>
        ) : null}

        {categories.length >= 2 ? (
          <div className="flex gap-1 overflow-hidden">
            {["All", ...categories.slice(0, 2)].map((cat, i) => (
              <span
                key={cat}
                className={cn(
                  "catalog-pill shrink-0 rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide",
                  (noir || atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada) &&
                    (i === 0
                      ? "catalog-pill-active"
                      : "catalog-pill-inactive"),
                )}
                style={
                  noir || atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                    ? undefined
                    : {
                        backgroundColor:
                          i === 0
                            ? "rgb(var(--vibe-primary))"
                            : "rgb(var(--vibe-surface))",
                        color:
                          i === 0
                            ? "rgb(var(--vibe-primary-fg))"
                            : "rgb(var(--vibe-text-muted))",
                      }
                }
              >
                {cat}
              </span>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-1.5">
          {(catalog.length
            ? catalog.slice(0, 4)
            : [
                { name: "Product one", price_cents: 950 },
                { name: "Product two", price_cents: 1250 },
              ]
          ).map((p, i) => (
            <div
              key={i}
              className={cn(
                "vibe-card flex flex-col gap-0.5 rounded p-1.5",
                atelier && "catalog-atelier-card",
                expedition && "catalog-expedition-card",
                cyberpunk && "catalog-cyberpunk-card",
                candyland && "catalog-candyland-card",
                market && "catalog-market-card",
                gallery && "catalog-gallery-card",
                studio && "catalog-studio-card",
                laura && "catalog-laura-card",
                atlantic && "catalog-atlantic-card",
                strada && "catalog-strada-card",
              )}
              style={
                atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                  ? undefined
                  : { backgroundColor: "rgb(var(--vibe-surface))" }
              }
            >
              <p
                className={cn(
                  "catalog-card-title line-clamp-2 text-[9px] leading-tight",
                  noir || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic ? "font-semibold" : "font-medium",
                )}
              >
                {p.name}
              </p>
              <p
                className={cn(
                  "text-[8px] font-semibold",
                  !expedition && "catalog-card-price",
                  expedition && "featured-expedition-price text-[7px]",
                  !noir && !atelier && !expedition && !cyberpunk && !candyland && !market && !gallery && !studio && !laura && !atlantic && !strada && "text-vibe-primary",
                )}
                style={
                  noir || atelier || expedition || cyberpunk || candyland || market || gallery || studio || laura || atlantic || strada
                    ? undefined
                    : { color: "rgb(var(--vibe-primary))" }
                }
              >
                {formatPrice(p.price_cents)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
