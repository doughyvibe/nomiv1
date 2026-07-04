import { revalidatePath } from "next/cache";

import type { Store } from "@/lib/stores/types";

export function revalidateStorefront(slug: string) {
  revalidatePath(`/s/${slug}`);
  revalidatePath(`/s/${slug}/cart`);
  revalidatePath(`/s/${slug}/checkout`);
}

export function revalidateDashboardStore(store: Store) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/storefront");
  revalidatePath("/dashboard/settings");
  revalidateStorefront(store.slug);
}
