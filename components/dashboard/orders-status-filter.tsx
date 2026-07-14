import Link from "next/link";

import { cn } from "@/lib/utils";
import { ORDER_FILTER_OPTIONS } from "@/lib/orders/status";

export function OrdersStatusFilter({
  current,
}: {
  current: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-muted-foreground text-xs sm:hidden">
        Swipe for more status filters →
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ORDER_FILTER_OPTIONS.map((opt) => {
          const active = current === opt.value;
          return (
            <Link
              key={opt.value}
              href={opt.value === "all" ? "/orders" : `/orders?status=${opt.value}`}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                active
                  ? "border-transparent bg-foreground text-white shadow-[0_2px_8px_rgba(22,19,14,0.12)]"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
