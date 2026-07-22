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
        className="size-14 shrink-0 rounded-xl border border-border object-cover"
      />
    );
  }
  return (
    <div
      className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-[var(--brand-bg-soft)]"
      aria-hidden
    >
      <Package className="size-5 text-muted-foreground/50" />
    </div>
  );
}

export type ProductsListFilter = "active" | "archived";

const FILTER_LINKS: { id: ProductsListFilter; label: string; href: string }[] =
  [
    { id: "active", label: "Shop", href: "/products" },
    { id: "archived", label: "Removed", href: "/products?status=archived" },
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
    filter === "archived" ? "No removed products" : "No products yet";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_LINKS.map((item) => {
          const count = counts[item.id];
          const selected = filter === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "tabular-nums",
                  selected ? "opacity-80" : "opacity-60",
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
                className="btn-brand-dark inline-flex h-11 items-center px-5"
              >
                Add product
              </Link>
            ) : null}
          </DashboardEmptyState>
        </DashboardPanel>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {products.map((product) => {
            const status: ProductStatus =
              product.status ?? (product.archived ? "archived" : "live");
            const canFeature = status === "live";
            return (
              <li key={product.id}>
                <div className="dashboard-stat flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 sm:p-4">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <ProductThumbnail product={product} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{product.name}</p>
                        {status === "archived" ? (
                          <ProductStatusBadge status={status} />
                        ) : null}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {formatPrice(product.price_cents)}
                        {product.category
                          ? ` · ${normalizeCategory(product.category)}`
                          : ""}
                      </p>
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
