import type { ProductStatus } from "@/lib/products/contracts";

/** Dual-write helpers: status is source of truth; archived mirrors archived status. */
export function statusWriteFields(status: ProductStatus): {
  status: ProductStatus;
  archived: boolean;
} {
  return { status, archived: status === "archived" };
}

export function isEditableStatus(
  status: ProductStatus,
): status is "live" {
  return status === "live";
}

export function parseEditableStatus(value: unknown): "live" | null {
  if (value === "live") return value;
  return null;
}
