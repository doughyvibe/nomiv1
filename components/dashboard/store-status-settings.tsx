"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  publishStoreAction,
  unpublishStoreAction,
} from "@/app/(dashboard)/dashboard/settings/actions";
import { StoreStatusBadge } from "@/components/dashboard/store-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Store } from "@/lib/stores/types";

export function StoreStatusSettings({
  store,
  publishIssues,
}: {
  store: Store;
  publishIssues: string[];
}) {
  const router = useRouter();
  const [publishOpen, setPublishOpen] = useState(false);
  const [unpublishOpen, setUnpublishOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isPublished = store.status === "published";
  const canPublish = publishIssues.length === 0;

  function run(action: () => Promise<{ error: string } | { success: true }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setPublishOpen(false);
      setUnpublishOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Current status</span>
        <StoreStatusBadge status={store.status} />
      </div>

      <p className="text-muted-foreground text-sm">
        {isPublished
          ? "Your storefront is live and accepting orders."
          : "Your storefront is hidden from buyers."}
      </p>

      {isPublished ? (
        <Button type="button" variant="outline" onClick={() => setUnpublishOpen(true)}>
          Unpublish store
        </Button>
      ) : (
        <>
          {!canPublish && (
            <ul className="text-muted-foreground list-inside list-disc text-sm">
              {publishIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}
          <Button
            type="button"
            disabled={!canPublish}
            onClick={() => setPublishOpen(true)}
          >
            Publish store
          </Button>
        </>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Publish your store?</DialogTitle>
            <DialogDescription>
              Buyers will be able to visit your storefront and place orders.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setPublishOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={pending}
              onClick={() => run(publishStoreAction)}
            >
              {pending ? "Publishing…" : "Publish store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={unpublishOpen} onOpenChange={setUnpublishOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Unpublish your store?</DialogTitle>
            <DialogDescription>
              Your public storefront will immediately show as unavailable. Existing
              order links still work for buyers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setUnpublishOpen(false)}>
              Keep live
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={() => run(unpublishStoreAction)}
            >
              {pending ? "Updating…" : "Unpublish store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
