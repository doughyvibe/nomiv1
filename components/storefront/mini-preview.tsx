import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/money";
import { normalizeCategory } from "@/lib/products/category";
import {
  catalogProducts,
  resolveFeaturedProduct,
} from "@/lib/products/featured";
import { resolveFeaturedSectionTitle } from "@/lib/featured-section";
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
            noir
              ? "storefront-hero -mx-3 -mt-3 mb-1 flex flex-col items-center px-3 pb-2 pt-3 text-center"
              : "flex flex-col items-center gap-1 text-center"
          }
        >
          {hero?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.logo_url}
              alt=""
              className={
                noir
                  ? "mb-1 size-8 rounded-full object-cover"
                  : "size-8 rounded-full object-cover"
              }
            />
          ) : noir ? null : (
            <Monogram name={title} />
          )}
          {eyebrow ? (
            <p
              className={
                noir
                  ? "mb-0.5 text-[11px] leading-[14px] font-semibold"
                  : "text-[8px] uppercase tracking-widest"
              }
              style={{
                color: noir
                  ? "rgb(var(--vibe-text-bright))"
                  : "rgb(var(--vibe-text-muted))",
                fontFamily: noir ? "var(--font-display)" : undefined,
              }}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={
              noir
                ? "text-[14px] leading-[17px] font-bold tracking-tight"
                : "font-display text-sm leading-tight font-bold"
            }
            style={{
              color: noir
                ? "rgb(var(--vibe-primary-container))"
                : "rgb(var(--vibe-primary))",
              fontFamily: noir ? "var(--font-display)" : undefined,
            }}
          >
            {title}
          </h2>
          {tagline ? (
            <p
              className={
                noir
                  ? "mt-0.5 max-w-[9rem] text-[8px] leading-[12px]"
                  : "text-[9px] leading-snug"
              }
              style={{
                color: noir
                  ? "rgb(var(--vibe-text-variant))"
                  : "rgb(var(--vibe-text-muted))",
              }}
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
            )}
            style={{ backgroundColor: "rgb(var(--vibe-surface))" }}
          >
            <div
              className={cn(
                "mb-1 flex items-center justify-between",
                noir && "featured-noir-header",
              )}
            >
              <p
                className={cn(
                  "text-[8px] font-semibold",
                  noir && "featured-noir-header-title",
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
            </div>
            <p
              className={cn(
                "truncate text-[10px] font-medium",
                noir && "featured-noir-name",
              )}
            >
              {featured.name}
            </p>
            <p
              className={cn(
                "text-[9px] font-semibold",
                noir && "featured-noir-price",
              )}
              style={
                noir
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
                  noir
                    ? i === 0
                      ? "catalog-pill-active"
                      : "catalog-pill-inactive"
                    : undefined,
                )}
                style={
                  noir
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
              className="vibe-card flex flex-col gap-0.5 rounded p-1.5"
              style={{ backgroundColor: "rgb(var(--vibe-surface))" }}
            >
              <p
                className={cn(
                  "catalog-card-title line-clamp-2 text-[9px] leading-tight",
                  noir ? "font-semibold" : "font-medium",
                )}
              >
                {p.name}
              </p>
              <p
                className={cn(
                  "catalog-card-price text-[8px] font-semibold",
                  !noir && "text-vibe-primary",
                )}
                style={
                  noir ? undefined : { color: "rgb(var(--vibe-primary))" }
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
