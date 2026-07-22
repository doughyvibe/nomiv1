"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UnsavedChangesContextValue = {
  setBlocked: (blocked: boolean) => void;
};

const UnsavedChangesContext =
  createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [blocked, setBlockedState] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const setBlocked = useCallback((next: boolean) => {
    setBlockedState(next);
  }, []);

  useEffect(() => {
    if (!blocked) return;

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest?.("a[href]");
      if (!(el instanceof HTMLAnchorElement)) return;
      if (el.target === "_blank" || el.hasAttribute("download")) return;
      const url = new URL(el.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const next = `${url.pathname}${url.search}${url.hash}`;
      const here = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next === here) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(next);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [blocked]);

  const value = useMemo(() => ({ setBlocked }), [setBlocked]);

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <Dialog
        open={pendingHref != null}
        onOpenChange={(open) => {
          if (!open) setPendingHref(null);
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              You have unsaved edits on this product.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => setPendingHref(null)}
            >
              Keep editing
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => {
                const href = pendingHref;
                setPendingHref(null);
                setBlocked(false);
                if (href) router.push(href);
              }}
            >
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UnsavedChangesContext.Provider>
  );
}

/** Registers leave-blocking while `blocked` is true. No-op outside provider. */
export function useUnsavedChangesBlocker(blocked: boolean) {
  const ctx = useContext(UnsavedChangesContext);

  useEffect(() => {
    if (!ctx) return;
    ctx.setBlocked(blocked);
    return () => ctx.setBlocked(false);
  }, [blocked, ctx]);
}
