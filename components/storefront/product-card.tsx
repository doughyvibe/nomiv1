"use client";

import Link from "next/link";

import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "metal-panel rust-edge group flex flex-col overflow-hidden rounded-[var(--vibe-radius)] bg-vibe-surface transition-transform active:scale-[0.98]",
        "animate-fade-up opacity-0",
      )}
      style={{
        animationDelay: `${120 + index * 60}ms`,
        animationFillMode: "forwards",
      }}
    >
      {product.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="aspect-square w-full bg-vibe-border/20" />
      )}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="vibe-display line-clamp-2 font-display text-xs font-semibold uppercase sm:text-sm">
          {product.name}
        </h3>
        <p className="text-sm font-medium text-vibe-primary">
          {formatPrice(product.price_cents)}
        </p>
      </div>
    </Link>
  );
}
