import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

/** Shared dashboard back control — large enough to notice and tap on mobile. */
export function DashboardBackLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border border-primary/40 bg-primary/20 py-0 pr-4 pl-2.5 text-base font-semibold text-foreground shadow-[0_2px_8px_rgba(247,197,24,0.18)] transition-colors",
        "hover:border-primary/55 hover:bg-primary/30",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-foreground"
        aria-hidden
      >
        <ChevronLeft className="size-4" strokeWidth={2.5} />
      </span>
      {label}
    </Link>
  );
}
