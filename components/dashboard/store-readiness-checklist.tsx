"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  DashboardPanel,
  DashboardPanelBody,
} from "@/components/dashboard/dashboard-ui";
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
  type ReadinessItemId,
  type ReadinessStorage,
} from "@/lib/stores/readiness";
import type { Store } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function StoreReadinessChecklist({
  store,
  productCount,
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

  useEffect(() => {
    setStorage(loadReadinessStorage(store.id));
    setHydrated(true);
  }, [store.id]);

  const doneCount = countDone(derived, storage.overrides);
  const total = READINESS_ITEM_IDS.length;
  const allDone = doneCount === total;
  const percent = Math.round((doneCount / total) * 100);

  const open = storage.open ?? (hydrated ? !allDone : true);

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
  }

  function toggleItem(id: ReadinessItemId) {
    if (id === "store_created") return;
    setItemDone(id, !isItemDone(id, derived, storage.overrides));
  }

  const nextId = READINESS_ITEM_IDS.find(
    (id) => !isItemDone(id, derived, storage.overrides),
  );

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
            <ul className="divide-y divide-border">
              {READINESS_ITEMS.map((item) => {
                const done = isItemDone(
                  item.id,
                  derived,
                  storage.overrides,
                );
                const isNext = item.id === nextId;
                const locked = Boolean(item.locked);

                if (locked) {
                  return (
                    <li key={item.id}>
                      <div className="flex w-full items-start gap-3 px-6 py-4 sm:px-7">
                        <Checkbox
                          checked
                          disabled
                          className="pointer-events-none mt-1 size-5 rounded-md opacity-100"
                          tabIndex={-1}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <ItemCopy
                            title={item.title}
                            description={item.description}
                            done
                            isNext={false}
                          />
                        </span>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-pressed={done}
                      aria-label={`${done ? "Unmark" : "Mark"} ${item.title} as done`}
                      className={cn(
                        "flex w-full items-start gap-3 px-6 py-4 text-left transition-colors sm:px-7",
                        "hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        isNext && !done && "bg-primary/5",
                      )}
                    >
                      <Checkbox
                        checked={done}
                        className="pointer-events-none mt-1 size-5 rounded-md"
                        tabIndex={-1}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <ItemCopy
                          title={item.title}
                          description={item.description}
                          done={done}
                          isNext={isNext}
                        />
                      </span>
                    </button>
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

function ItemCopy({
  title,
  description,
  done,
  isNext,
}: {
  title: string;
  description?: string;
  done: boolean;
  isNext: boolean;
}) {
  return (
    <>
      <p
        className={cn(
          "text-base font-semibold transition-colors",
          done ? "text-muted-foreground line-through" : "text-foreground",
        )}
      >
        {isNext && !done ? (
          <span className="mr-1.5 text-primary" aria-hidden>
            →
          </span>
        ) : null}
        {title}
      </p>
      {description ? (
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </>
  );
}
