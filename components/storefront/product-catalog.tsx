"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { useCart } from "@/components/storefront/cart-context";
import { formatPrice } from "@/lib/money";
import { normalizeCategory } from "@/lib/products/category";
import { allowsQuickAdd } from "@/lib/products/quick-add";
import type { Product } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const quickAdd = allowsQuickAdd(product);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "vibe-card group flex flex-col overflow-hidden rounded-[var(--vibe-radius)] transition-transform active:scale-[0.98]",
        "animate-fade-up opacity-0",
      )}
      style={{
        animationDelay: `${80 + index * 50}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div className="relative aspect-square overflow-hidden">
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-vibe-surface/80 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <h3 className="catalog-card-title line-clamp-2 text-sm font-medium leading-snug text-vibe-text md:text-base">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="catalog-card-price text-sm font-semibold text-vibe-primary md:text-base">
            {formatPrice(product.price_cents)}
          </p>
          {quickAdd ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                "catalog-card-add flex size-9 shrink-0 items-center justify-center rounded-full border border-vibe-border/40 bg-vibe-bg/50 transition-colors",
                added && "bg-vibe-primary text-vibe-primary-fg",
              )}
            >
              {added ? (
                <span className="text-[10px] font-bold">✓</span>
              ) : (
                <Plus className="size-4" />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

type ProductCatalogProps = {
  products: Product[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
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

  return (
    <section id="catalog" className="catalog-section px-5 pb-8 pt-6 sm:px-6 md:pb-12 md:pt-10">
      {showFilters ? (
        <>
          {/* Mobile: scrollable pills */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-1 md:hidden">
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
          </div>

          {/* Desktop: underline tabs */}
          <div className="catalog-tabs mb-8 hidden gap-6 border-b border-vibe-border/30 md:flex">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  "catalog-tab min-h-11 border-b-2 border-transparent pb-3 text-sm font-medium transition-colors",
                  active === cat
                    ? "catalog-tab-active border-vibe-primary text-vibe-primary"
                    : "catalog-tab-inactive text-vibe-text-muted hover:text-vibe-text",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-vibe-text-muted">
            No products in this category.
          </p>
        ) : (
          filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))
        )}
      </div>
    </section>
  );
}
