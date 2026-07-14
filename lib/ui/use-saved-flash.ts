"use client";

import { useCallback, useRef, useState } from "react";

/** Button-label success flash — preferred over ad-hoc toasts (Sprint 3 D2). */
export function useSavedFlash(ms = 2000) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashSaved = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setSaved(true);
    timer.current = setTimeout(() => setSaved(false), ms);
  }, [ms]);

  function saveLabel(pending: boolean, idle: string): string {
    if (pending) return "Saving…";
    if (saved) return "Saved";
    return idle;
  }

  return { saved, flashSaved, saveLabel };
}
