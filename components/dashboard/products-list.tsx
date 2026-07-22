import Link from "next/link";
import { Package } from "lucide-react";

import { FeaturedProductButton } from "@/components/dashboard/featured-product-button";
import { ProductStatusBadge } from "@/components/dashboard/product-status-badge";
import {
  DashboardEmptyState,
  DashboardPanel,
} from "@/components/dashboard/dashboard-ui";
import { formatPrice } from "@/lib/money";
import { normalizeCategory } from "@/lib/products/category";
import type { ProductStatus } from "@/lib/products/contracts";
import type { Product, Store } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

function ProductThumbnail({ product }: { product: Product }) {
  if (product.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image_url}
        alt=""
        className="size-14 shrink-0 rounded-2xl object-cover shadow-[0_2px_8px_rgba(22,19,14,0.06)]"
      />
    );
  }
  return (
    <div
      className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-bg-soft)]"
      aria-hidden
    >
      <Package className="size-5 text-[var(--brand-ink-mute)]/70" />
    </div>
  );
}

export type ProductsListFilter = "active" | "archived";

const FILTER_LINKS: { id: ProductsListFilter; label: string; href: string }[] =
  [
    { id: "active", label: "Live", href: "/products" },
    { id: "archived", label: "Archived", href: "/products?status=archived" },
  ];

export function ProductsListView({
  products,
  store,
  filter,
  counts,
}: {
  products: Product[];
  store: Pick<Store, "featured_product_id">;
  filter: ProductsListFilter;
  counts: { active: number; archived: number };
}) {
  const emptyTitle =
    filter === "archived" ? "No archived products" : "No products yet";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {FILTER_LINKS.map((item) => {
          const count = counts[item.id];
          const selected = filter === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary bg-primary text-foreground shadow-[0_2px_10px_rgba(247,197,24,0.35)]"
                  : "border-border/70 bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums",
                  selected
                    ? "bg-foreground/10 text-foreground"
                    : "bg-[var(--brand-bg-soft)] text-[var(--brand-ink-mute)]",
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <DashboardPanel>
          <DashboardEmptyState title={emptyTitle}>
            {filter === "active" ? (
              <Link
                href="/products/new"
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-base font-semibold text-foreground shadow-[0_4px_16px_rgba(247,197,24,0.35)] transition-transform active:scale-[0.99]"
              >
                Add product
              </Link>
            ) : null}
          </DashboardEmptyState>
        </DashboardPanel>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => {
            const status: ProductStatus =
              product.status ?? (product.archived ? "archived" : "live");
            const canFeature = status === "live";
            const category = normalizeCategory(product.category);
            return (
              <li key={product.id}>
                <div className="flex items-center gap-3 rounded-[20px] border border-border/60 bg-card p-3.5 shadow-[0_4px_18px_rgba(22,19,14,0.05)] sm:gap-4 sm:p-4">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex min-w-0 flex-1 items-center gap-3 sm:gap-3.5"
                  >
                    <ProductThumbnail product={product} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold tracking-tight">
                          {product.name}
                        </p>
                        {status === "archived" ? (
                          <ProductStatusBadge status={status} />
                        ) : null}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[var(--brand-ink-soft)]">
                          {formatPrice(product.price_cents)}
                        </p>
                        {category ? (
                          <span className="inline-flex max-w-full truncate rounded-full bg-[var(--brand-bg-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-ink-mute)]">
                            {category}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                  {canFeature ? (
                    <FeaturedProductButton
                      productId={product.id}
                      isFeatured={store.featured_product_id === product.id}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
