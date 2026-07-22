import type { ProductStatus } from "@/lib/products/contracts";
import { cn } from "@/lib/utils";

const LABELS: Record<ProductStatus, string> = {
  live: "Live",
  archived: "Archived",
};

const TONES: Record<ProductStatus, string> = {
  live: "bg-[var(--brand-mint-soft)] text-[var(--brand-mint)]",
  archived: "bg-[var(--brand-bg-soft)] text-[var(--brand-ink-mute)]",
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
