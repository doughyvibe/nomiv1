import Link from "next/link";

import { cn } from "@/lib/utils";
import { ORDER_FILTER_OPTIONS } from "@/lib/orders/status";

export function OrdersStatusFilter({
  current,
}: {
  current: string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {ORDER_FILTER_OPTIONS.map((opt) => (
        <Link
          key={opt.value}
          href={opt.value === "all" ? "/orders" : `/orders?status=${opt.value}`}
          className={cn(
            "shrink-0 rounded-md border px-3 py-2.5 text-xs font-medium transition-colors min-h-11 inline-flex items-center",
            current === opt.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
