"use client";

import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/storefront/cart-context";
import { useStorefront } from "@/components/storefront/storefront-context";
import { pruneCartToProductIds } from "@/lib/cart/storage";

/** Drop archived/deleted products from localStorage cart; surface a one-shot notice. */
export function StaleCartPruner({ slug }: { slug: string }) {
  const { products } = useStorefront();
  const { refresh } = useCart();
  const [notice, setNotice] = useState<string | null>(null);
  const productKey = products.map((p) => p.id).join(",");
  const ranForKey = useRef<string | null>(null);

  useEffect(() => {
    // Empty products array can mean order-only chrome (unpublished), not "delete all"
    if (products.length === 0) return;
    if (ranForKey.current === productKey) return;
    ranForKey.current = productKey;
    const ids = new Set(products.map((p) => p.id));
    const { removedLines } = pruneCartToProductIds(slug, ids);
    if (removedLines > 0) {
      refresh();
      setNotice(
        removedLines === 1
          ? "Removed 1 unavailable item from your cart."
          : `Removed ${removedLines} unavailable items from your cart.`,
      );
    }
  }, [slug, productKey, products, refresh]);

  if (!notice) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))]"
      role="status"
    >
      <p className="pointer-events-auto max-w-md rounded-xl border border-vibe-border/40 bg-vibe-surface/95 px-4 py-2.5 text-center text-sm text-vibe-text shadow-lg backdrop-blur-md">
        {notice}{" "}
        <button
          type="button"
          className="font-medium text-vibe-primary underline underline-offset-2"
          onClick={() => setNotice(null)}
        >
          Dismiss
        </button>
      </p>
    </div>
  );
}
