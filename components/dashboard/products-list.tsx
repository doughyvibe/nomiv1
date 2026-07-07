import Link from "next/link";
import { Package } from "lucide-react";

import {
  DashboardEmptyState,
  DashboardPanel,
} from "@/components/dashboard/dashboard-ui";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/stores/types";

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

export function ProductsListView({
  products,
  showArchived,
  archivedCount,
}: {
  products: Product[];
  showArchived: boolean;
  archivedCount: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      {products.length === 0 ? (
        <DashboardPanel>
          <DashboardEmptyState
            title={showArchived ? "No archived products" : "No products yet"}
            description={
              showArchived
                ? "Archived products are hidden from your storefront."
                : "Add your first product to start selling."
            }
          >
            {!showArchived ? (
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
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}/edit`}
                className="dashboard-stat flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition-all hover:border-foreground/15 hover:shadow-[0_4px_20px_rgba(22,19,14,0.06)] sm:p-4"
              >
                <ProductThumbnail product={product} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatPrice(product.price_cents)}
                    {product.category ? ` · ${product.category}` : ""}
                  </p>
                  {product.archived ? (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Archived
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {archivedCount > 0 ? (
        <p className="text-center text-sm">
          {showArchived ? (
            <Link
              href="/products"
              className="font-semibold text-foreground underline-offset-2 hover:underline"
            >
              ← Back to active products
            </Link>
          ) : (
            <Link
              href="/products?archived=1"
              className="font-semibold text-foreground underline-offset-2 hover:underline"
            >
              View archived ({archivedCount})
            </Link>
          )}
        </p>
      ) : null}
    </div>
  );
}
