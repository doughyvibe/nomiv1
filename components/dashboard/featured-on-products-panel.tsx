"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FeaturedSectionEditor } from "@/components/dashboard/featured-section-editor";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function FeaturedOnProductsPanel({
  store,
  featuredProductName,
}: {
  store: { featured_section_title: string | null };
  featuredProductName: string | null;
}) {
  const [open, setOpen] = useState(!featuredProductName);
  const subtitle = featuredProductName
    ? featuredProductName
    : "None yet — tap the star on a product";

  return (
    <section className="overflow-hidden rounded-[24px] border border-primary/30 bg-primary/12 shadow-[0_8px_32px_rgb(22_19_14/0.06)]">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className={cn(
            "group flex min-h-16 w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors sm:px-5",
            "hover:bg-primary/10",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
          )}
        >
          <span className="min-w-0">
            <span className="block text-base font-bold tracking-tight">
              Featured product
            </span>
            <span className="mt-0.5 block truncate text-sm text-[var(--brand-ink-soft)]">
              {subtitle}
            </span>
          </span>
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/35 text-foreground transition-transform duration-200",
              "group-hover:bg-primary/45",
              open && "rotate-180",
            )}
          >
            <ChevronDown className="size-4" aria-hidden strokeWidth={2.25} />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-primary/25 bg-card/90 px-5 py-5 sm:px-6">
            <FeaturedSectionEditor store={store} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
