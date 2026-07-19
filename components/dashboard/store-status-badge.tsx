import type { StoreStatus } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  StoreStatus,
  { label: string; className: string; pulse?: boolean }
> = {
  published: {
    label: "Live",
    className:
      "bg-[var(--brand-mint-soft)] text-[var(--brand-mint)] ring-1 ring-[var(--brand-mint)]/20",
    pulse: true,
  },
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  unpublished: {
    label: "Unpublished",
    className: "bg-primary/20 text-foreground",
  },
  suspended: {
    label: "Suspended",
    className: "bg-destructive/10 text-destructive",
  },
  deleted: {
    label: "Deleted",
    className: "bg-muted text-muted-foreground",
  },
};

export function StoreStatusBadge({ status }: { status: StoreStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
        config.className,
      )}
    >
      {config.pulse ? (
        <span
          className="size-1.5 shrink-0 rounded-full bg-[var(--brand-mint)] animate-brand-pulse"
          aria-hidden
        />
      ) : null}
      {config.label}
    </span>
  );
}
