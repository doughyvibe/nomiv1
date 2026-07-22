import type { ProductStatus } from "@/lib/products/contracts";
import { cn } from "@/lib/utils";

const LABELS: Record<ProductStatus, string> = {
  live: "Live",
  archived: "Removed",
};

const TONES: Record<ProductStatus, string> = {
  live: "bg-emerald-500/15 text-emerald-800",
  archived: "bg-muted text-muted-foreground",
};

export function ProductStatusBadge({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}
