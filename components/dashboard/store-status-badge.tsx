import type { StoreStatus } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  StoreStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Live",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  unpublished: {
    label: "Unpublished",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  suspended: {
    label: "Suspended",
    className: "bg-destructive/15 text-destructive",
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
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
