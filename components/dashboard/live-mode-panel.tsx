"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  isCampaignStaleActive,
  resolveActiveCampaign,
} from "@/lib/fulfilment/campaigns";
import type { Store } from "@/lib/stores/types";

type LiveModePanelProps = {
  store: Store;
  onStart: (opts: {
    force: boolean;
  }) => Promise<
    { error: string } | { success: true } | { warning: string }
  >;
  onStop: () => Promise<{ error: string } | { success: true }>;
};

export function LiveModePanel({ store, onStart, onStop }: LiveModePanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const active = resolveActiveCampaign(store.fulfillment);
  const stale = isCampaignStaleActive(store.fulfillment);
  const deliveryOn = Boolean(store.fulfillment.delivery?.enabled);

  function runStart(force: boolean) {
    setError(null);
    if (!force) setWarning(null);
    startTransition(async () => {
      const result = await onStart({ force });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      if ("warning" in result) {
        setWarning(result.warning);
        return;
      }
      setWarning(null);
      router.refresh();
    });
  }

  function runStop() {
    setError(null);
    setWarning(null);
    startTransition(async () => {
      const result = await onStop();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {active ? (
        <div
          className="rounded-md border border-emerald-600/40 bg-emerald-500/10 px-3 py-3 text-sm"
          role="status"
        >
          <p className="font-medium text-emerald-900 dark:text-emerald-100">
            Live on
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            disabled={pending}
            onClick={runStop}
          >
            {pending ? "Ending…" : "End Live"}
          </Button>
        </div>
      ) : stale ? (
        <div
          className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-sm"
          role="status"
        >
          <p className="font-medium">Live ended</p>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            disabled={pending}
            onClick={runStop}
          >
            {pending ? "Clearing…" : "Clear"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {!deliveryOn ? (
            <p className="text-sm text-destructive" role="alert">
              Turn on delivery first.
            </p>
          ) : null}
          {warning ? (
            <div
              className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm"
              role="alert"
            >
              <p>{warning}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  disabled={pending || !deliveryOn}
                  onClick={() => runStart(true)}
                >
                  {pending ? "Starting…" : "Go Live anyway"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setWarning(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              disabled={pending || !deliveryOn}
              onClick={() => runStart(false)}
            >
              {pending ? "Starting…" : "Go Live — tomorrow 1–5pm delivery"}
            </Button>
          )}
        </div>
      )}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
