import Link from "next/link";

import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/stores/types";

function ProductThumbnail({ product }: { product: Product }) {
  if (product.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image_url}
        alt=""
        className="size-14 shrink-0 rounded-md border object-cover"
      />
    );
  }
  return (
    <div className="bg-muted size-14 shrink-0 rounded-md border" aria-hidden />
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
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">
            {showArchived ? "No archived products" : "No products yet"}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {showArchived
              ? "Archived products are hidden from your storefront."
              : "Add your first product to start selling."}
          </p>
          {!showArchived && (
            <Link
              href="/products/new"
              className="text-primary mt-4 inline-flex min-h-11 items-center text-sm font-medium hover:underline"
            >
              Add product
            </Link>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}/edit`}
                className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
              >
                <ProductThumbnail product={product} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatPrice(product.price_cents)}
                    {product.category ? ` · ${product.category}` : ""}
                  </p>
                  {product.archived && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Archived
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {archivedCount > 0 && (
        <p className="text-center text-sm">
          {showArchived ? (
            <Link href="/products" className="text-primary hover:underline">
              ← Back to active products
            </Link>
          ) : (
            <Link
              href="/products?archived=1"
              className="text-primary hover:underline"
            >
              View archived ({archivedCount})
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
