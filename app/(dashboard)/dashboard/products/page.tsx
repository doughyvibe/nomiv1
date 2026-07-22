import Link from "next/link";

import {
  ProductsListView,
  type ProductsListFilter,
} from "@/components/dashboard/products-list";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import type { ProductStatus } from "@/lib/products/contracts";
import type { Product } from "@/lib/stores/types";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products — Nomi" };

function parseFilter(
  status: string | undefined,
  archived: string | undefined,
): ProductsListFilter {
  if (archived === "1" || status === "archived") return "archived";
  return "active";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; archived?: string }>;
}) {
  const params = await searchParams;
  const filter = parseFilter(params.status, params.archived);
  const { supabase, store } = await requireSellerStore();

  let query = supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: true });

  if (filter === "active") {
    query = query.neq("status", "archived");
  } else {
    query = query.eq("status", "archived");
  }

  const { data: products } = await query;

  const { data: statusRows } = await supabase
    .from("products")
    .select("status")
    .eq("store_id", store.id);

  const counts = { active: 0, archived: 0 };
  for (const row of statusRows ?? []) {
    const s = (row as { status: ProductStatus }).status;
    if (s === "archived") {
      counts.archived += 1;
    } else {
      counts.active += 1;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Products"
        action={
          filter !== "archived" ? (
            <Link
              href="/products/new"
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-base font-semibold text-foreground shadow-[0_4px_16px_rgba(247,197,24,0.35)] transition-transform active:scale-[0.99]"
            >
              Add product
            </Link>
          ) : undefined
        }
      />
      <ProductsListView
        products={(products as Product[]) ?? []}
        store={store}
        filter={filter}
        counts={counts}
      />
    </div>
  );
}
