"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  DashboardPanel,
  DashboardPanelBody,
} from "@/components/dashboard/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  countDone,
  deriveReadiness,
  isItemDone,
  loadReadinessStorage,
  READINESS_ITEM_IDS,
  READINESS_ITEMS,
  saveReadinessStorage,
  type ReadinessItemDef,
  type ReadinessItemId,
  type ReadinessStorage,
} from "@/lib/stores/readiness";
import type { Store } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function StoreReadinessChecklist({
  store,
  productCount,
  storeUrl,
}: {
  store: Store;
  productCount: number;
  storeUrl?: string;
}) {
  const derived = useMemo(
    () => deriveReadiness(store, productCount),
    [store, productCount],
  );

  const [storage, setStorage] = useState<ReadinessStorage>({ overrides: {} });
  const [hydrated, setHydrated] = useState(false);
  const [focusedId, setFocusedId] = useState<ReadinessItemId | null>(null);

  useEffect(() => {
    setStorage(loadReadinessStorage(store.id));
    setHydrated(true);
  }, [store.id]);

  const doneCount = countDone(derived, storage.overrides);
  const total = READINESS_ITEM_IDS.length;
  const allDone = doneCount === total;
  const percent = Math.round((doneCount / total) * 100);

  const open = storage.open ?? (hydrated ? !allDone : true);

  const nextId = READINESS_ITEM_IDS.find(
    (id) => !isItemDone(id, derived, storage.overrides),
  );

  const featuredId =
    focusedId && !isItemDone(focusedId, derived, storage.overrides)
      ? focusedId
      : (nextId ?? null);

  const featured = featuredId
    ? READINESS_ITEMS.find((item) => item.id === featuredId)
    : undefined;

  function persist(next: ReadinessStorage) {
    setStorage(next);
    saveReadinessStorage(store.id, next);
  }

  function setOpen(nextOpen: boolean) {
    persist({ ...storage, open: nextOpen });
  }

  function setItemDone(id: ReadinessItemId, next: boolean) {
    if (id === "store_created") return;
    const nextOverrides = { ...storage.overrides, [id]: next };
    if (nextOverrides[id] === derived[id]) {
      delete nextOverrides[id];
    }
    persist({ ...storage, overrides: nextOverrides });
    if (next && focusedId === id) {
      setFocusedId(null);
    }
  }

  function toggleItem(id: ReadinessItemId) {
    if (id === "store_created") return;
    setItemDone(id, !isItemDone(id, derived, storage.overrides));
  }

  return (
    <DashboardPanel>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5 sm:px-7">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold">
              Store Readiness Checklist
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Store readiness"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                {percent}% Ready
              </p>
            </div>
            {allDone ? (
              <p className="mt-2 text-sm text-muted-foreground">
                You’re ready — your store checklist is complete.
              </p>
            ) : null}
          </div>
          <CollapsibleTrigger
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            )}
            aria-label={open ? "Collapse checklist" : "Expand checklist"}
          >
            <ChevronDown
              className={cn(
                "size-5 transition-transform duration-200",
                open && "rotate-180",
              )}
              strokeWidth={2}
            />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <DashboardPanelBody className="p-0 sm:p-0">
            {featured ? (
              <FeaturedStep
                item={featured}
                isRecommended={featured.id === nextId}
                storeUrl={storeUrl}
                onMarkDone={() => setItemDone(featured.id, true)}
              />
            ) : null}

            <ul className="divide-y divide-border">
              {READINESS_ITEMS.map((item) => {
                const done = isItemDone(
                  item.id,
                  derived,
                  storage.overrides,
                );
                const locked = Boolean(item.locked);
                const isFocused = item.id === featuredId && !done;

                return (
                  <li key={item.id}>
                    <div
                      className={cn(
                        "flex w-full items-center gap-3 px-6 py-3.5 sm:px-7",
                        isFocused && "bg-primary/5",
                      )}
                    >
                      {locked ? (
                        <Checkbox
                          checked
                          disabled
                          className="pointer-events-none size-5 shrink-0 rounded-md opacity-100"
                          tabIndex={-1}
                          aria-hidden
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-pressed={done}
                          aria-label={`${done ? "Unmark" : "Mark"} ${item.title} as done`}
                          className="inline-flex shrink-0 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <Checkbox
                            checked={done}
                            className="pointer-events-none size-5 rounded-md"
                            tabIndex={-1}
                            aria-hidden
                          />
                        </button>
                      )}

                      {done || locked ? (
                        <CompactTitle
                          title={item.title}
                          done
                          animate={hydrated && !locked}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFocusedId(item.id)}
                          className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
                          aria-label={`Show guidance for ${item.title}`}
                        >
                          <CompactTitle
                            title={item.title}
                            done={false}
                            animate={hydrated}
                          />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </DashboardPanelBody>
        </CollapsibleContent>
      </Collapsible>
    </DashboardPanel>
  );
}

function FeaturedStep({
  item,
  isRecommended,
  storeUrl,
  onMarkDone,
}: {
  item: ReadinessItemDef;
  isRecommended: boolean;
  storeUrl?: string;
  onMarkDone: () => void;
}) {
  const href = resolveHref(item.href, storeUrl);
  const description = item.description
    ? firstSentence(item.description)
    : undefined;
  const external = item.href === "storefront";

  return (
    <section className="border-b border-border bg-primary/5 px-6 py-5 sm:px-7">
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">
        {isRecommended ? "Next recommended step" : "Selected step"}
      </p>
      <h3 className="mt-2 font-display text-lg font-bold text-foreground">
        {item.title}
      </h3>
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {href && item.ctaLabel ? (
          external ? (
            <Button
              render={<a href={href} target="_blank" rel="noopener noreferrer" />}
              className="min-w-0 flex-1 sm:flex-none"
            >
              {item.ctaLabel}
            </Button>
          ) : (
            <Button
              render={<Link href={href} />}
              className="min-w-0 flex-1 sm:flex-none"
            >
              {item.ctaLabel}
            </Button>
          )
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={onMarkDone}
          className="min-w-0 flex-1 sm:flex-none"
        >
          Mark done
        </Button>
      </div>
    </section>
  );
}

function CompactTitle({
  title,
  done,
  animate,
}: {
  title: string;
  done: boolean;
  animate: boolean;
}) {
  return (
    <p
      className={cn(
        "min-w-0 flex-1 text-base font-semibold",
        animate && "transition-colors duration-200",
        done ? "text-muted-foreground" : "text-foreground",
      )}
    >
      <span className="relative inline">
        {title}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-[0.65em] left-0 h-[1.5px] w-full origin-left rounded-full bg-muted-foreground/70",
            animate && "transition-transform duration-300 ease-out",
            done ? "scale-x-100" : "scale-x-0",
          )}
        />
      </span>
    </p>
  );
}

function resolveHref(
  href: string | "storefront",
  storeUrl?: string,
): string | null {
  if (href === "storefront") return storeUrl?.trim() || null;
  return href;
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  return (match?.[0] ?? text).trim();
}
