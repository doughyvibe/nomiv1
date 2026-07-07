import { cn } from "@/lib/utils";
import type { DisplayStatus } from "@/lib/orders/status";

const toneClasses: Record<DisplayStatus["tone"], string> = {
  default: "bg-muted text-muted-foreground",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/15 text-destructive",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: DisplayStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[status.tone],
        className,
      )}
    >
      {status.label}
    </span>
  );
}
