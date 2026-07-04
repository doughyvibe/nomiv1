"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { addProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { ProductForm } from "@/components/dashboard/product-form";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/stores/types";

export function StepProduct({
  products,
  onDone,
}: {
  products: Product[];
  onDone: () => void;
}) {
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);
  const hasProducts = products.length > 0;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">
          {hasProducts ? "Add another product" : "Add your first product"}
        </h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          You can publish with one product and add more anytime.
        </p>
      </div>

      {hasProducts && (
        <div className="rounded-md border border-dashboard-border p-3">
          <p className="text-sm font-medium">
            {justAdded
              ? "Product added."
              : `${products.length} product${products.length > 1 ? "s" : ""} so far`}
          </p>
          <ul className="mt-1 text-sm text-dashboard-muted">
            {products.map((p) => (
              <li key={p.id}>
                {p.name} — S${(p.price_cents / 100).toFixed(2)}
                {p.category ? ` · ${p.category}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ProductForm
        submitLabel={hasProducts ? "Add another product" : "Save product"}
        onSubmit={addProductAction}
        onSuccess={() => {
          setJustAdded(true);
          router.refresh();
        }}
      />

      {hasProducts && <Button onClick={onDone}>Continue setup</Button>}
    </section>
  );
}
