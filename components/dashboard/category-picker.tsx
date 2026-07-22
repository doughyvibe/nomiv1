"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { clearStoreCategoryAction } from "@/app/(dashboard)/dashboard/products/actions";
import { fieldLabelClass } from "@/components/dashboard/field-label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { normalizeCategory } from "@/lib/products/category";
import { cn } from "@/lib/utils";

type CategoryPickerProps = {
  value: string;
  onChange: (value: string) => void;
  storeCategories?: string[];
  disabled?: boolean;
};

/**
 * Single-select category pills on the form.
 * Add / delete live in one Categories dialog — pills are selection only.
 */
export function CategoryPicker({
  value,
  onChange,
  storeCategories = [],
  disabled,
}: CategoryPickerProps) {
  const router = useRouter();
  const selected = normalizeCategory(value);
  const [extras, setExtras] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const storeSet = useMemo(() => {
    const set = new Set<string>();
    for (const c of storeCategories) {
      const n = normalizeCategory(c);
      if (n) set.add(n);
    }
    return set;
  }, [storeCategories]);

  const pills = useMemo(() => {
    const set = new Set<string>();
    for (const c of storeSet) {
      if (!removed.includes(c)) set.add(c);
    }
    for (const c of extras) {
      const n = normalizeCategory(c);
      if (n && !removed.includes(n)) set.add(n);
    }
    if (selected && !removed.includes(selected)) set.add(selected);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [storeSet, extras, selected, removed]);

  function toggle(cat: string) {
    if (disabled) return;
    if (selected === cat) {
      onChange("");
    } else {
      onChange(cat);
    }
  }

  function handleAdd() {
    const next = normalizeCategory(draft);
    if (!next) return;
    const already = pills.some((p) => p.toLowerCase() === next.toLowerCase());
    if (!already) {
      setExtras((prev) => [...prev, next]);
    }
    setRemoved((prev) => prev.filter((c) => c !== next));
    onChange(next);
    setDraft("");
    setManageOpen(false);
  }

  function confirmRemove() {
    if (!removeTarget) return;
    const target = removeTarget;
    const isExtraOnly = extras.includes(target) && !storeSet.has(target);

    if (isExtraOnly) {
      setExtras((prev) => prev.filter((c) => c !== target));
      if (selected === target) onChange("");
      setRemoveTarget(null);
      return;
    }

    startTransition(async () => {
      const result = await clearStoreCategoryAction(target);
      if ("error" in result) {
        setRemoveError(result.error);
        return;
      }
      setRemoved((prev) =>
        prev.includes(target) ? prev : [...prev, target],
      );
      setExtras((prev) => prev.filter((c) => c !== target));
      if (selected === target) onChange("");
      setRemoveTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {pills.map((cat) => {
          const active = selected === cat;
          return (
            <button
              key={cat}
              type="button"
              disabled={disabled}
              onClick={() => toggle(cat)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-card text-foreground hover:bg-muted/40",
              )}
            >
              {cat}
            </button>
          );
        })}

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setDraft("");
            setRemoveError(null);
            setManageOpen(true);
          }}
          aria-label="Manage categories"
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-foreground transition-colors",
            "hover:border-foreground/25 hover:bg-muted/40",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <Plus className="size-5" strokeWidth={2.25} aria-hidden />
        </button>
      </div>

      <Dialog
        open={manageOpen}
        onOpenChange={(open) => {
          setManageOpen(open);
          if (!open) {
            setDraft("");
            setRemoveError(null);
          }
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Categories</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label htmlFor="new-category-name" className={fieldLabelClass}>
              Name
            </label>
            <Input
              id="new-category-name"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="e.g. Cookies"
              maxLength={40}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={!normalizeCategory(draft)}
            onClick={handleAdd}
          >
            Add
          </Button>

          {pills.length > 0 ? (
            <div className="flex flex-col gap-2 border-t border-border/50 pt-4">
              <p className={fieldLabelClass}>Your categories</p>
              <ul className="flex flex-col">
                {pills.map((cat) => (
                  <li
                    key={cat}
                    className="flex min-h-12 items-center justify-between gap-3 border-b border-border/40 last:border-b-0"
                  >
                    <span className="min-w-0 truncate text-[15px] font-medium">
                      {cat}
                    </span>
                    <button
                      type="button"
                      disabled={disabled || pending}
                      onClick={() => {
                        setRemoveError(null);
                        setRemoveTarget(cat);
                      }}
                      aria-label={`Delete category ${cat}`}
                      className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
                        "hover:bg-destructive/8 hover:text-destructive",
                        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        "disabled:pointer-events-none disabled:opacity-50",
                      )}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={removeTarget != null}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveTarget(null);
            setRemoveError(null);
          }
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>
              {removeTarget
                ? `Remove “${removeTarget}”?`
                : "Remove category?"}
            </DialogTitle>
            <DialogDescription>
              {removeTarget &&
              extras.includes(removeTarget) &&
              !storeSet.has(removeTarget)
                ? "This category hasn’t been saved on a product yet."
                : "Clears this category from every product in your shop."}
            </DialogDescription>
          </DialogHeader>
          {removeError ? (
            <p className="text-destructive text-sm" role="alert">
              {removeError}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={pending}
              onClick={confirmRemove}
            >
              {pending ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
