"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/storefront/product-card";
import type { Product } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type ProductCatalogProps = {
  products: Product[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.category?.trim()) set.add(p.category.trim());
    }
    return [...set].sort();
  }, [products]);

  const showPills = categories.length >= 2;
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    if (!showPills || active === "All") return products;
    return products.filter((p) => p.category?.trim() === active);
  }, [products, active, showPills]);

  if (products.length === 0) {
    return (
      <section id="catalog" className="px-4 py-12 sm:px-6">
        <div className="metal-panel rust-edge flex flex-col items-center rounded-[var(--vibe-radius)] px-6 py-12 text-center">
          <p className="vibe-display font-display text-lg font-bold uppercase">
            No products yet
          </p>
          <p className="mt-2 text-sm text-vibe-text-muted">
            Check back soon — the seller is still setting up.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="catalog" className="px-4 pb-8 sm:px-6">
      {showPills && (
        <div className="metal-panel rust-edge mb-6 flex gap-2 overflow-x-auto rounded-[var(--vibe-radius)] bg-vibe-surface/80 p-2 backdrop-blur-sm">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "vibe-display shrink-0 rounded-[var(--vibe-radius)] px-4 py-2.5 text-xs font-semibold uppercase transition-transform min-h-11 active:scale-[0.98]",
                active === cat
                  ? "bg-vibe-primary text-vibe-primary-fg"
                  : "text-vibe-text-muted",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {filtered.length === 0 ? (
          <p className="text-vibe-text-muted col-span-2 py-8 text-center text-sm">
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
