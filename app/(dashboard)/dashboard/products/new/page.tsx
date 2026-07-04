import Link from "next/link";

import { NewProductForm } from "@/components/dashboard/new-product-form";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function NewProductPage() {
  await requireSellerStore();

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <div>
        <Link
          href="/products"
          className="text-primary text-sm font-medium hover:underline"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 text-xl font-semibold">Add product</h1>
      </div>

      <NewProductForm />
    </main>
  );
}
