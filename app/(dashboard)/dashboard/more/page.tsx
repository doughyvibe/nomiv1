import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui";
import { MORE_DESTINATIONS } from "@/lib/dashboard/more-destinations";
import { requireSellerStore } from "@/lib/stores/require-seller";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "More — Nomi" };

export default async function MorePage() {
  await requireSellerStore();

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader title="More" />

      <ul className="flex flex-col gap-3">
        {MORE_DESTINATIONS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center gap-3.5 rounded-[20px] border border-border/60 bg-card p-4 shadow-[0_4px_18px_rgba(22,19,14,0.05)] transition-colors hover:border-foreground/15 hover:bg-primary/5"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-foreground shadow-[0_2px_10px_rgba(247,197,24,0.35)]"
                aria-hidden
              >
                <item.Icon className="size-5" strokeWidth={2.25} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold tracking-tight">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-sm text-[var(--brand-ink-soft)]">
                  {item.description}
                </span>
              </span>
              <ChevronRight
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden
                strokeWidth={2}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
