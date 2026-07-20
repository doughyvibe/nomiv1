"use client";

import Link from "next/link";
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
import type { PublishIssue } from "@/lib/stores/publish-readiness";
import type { Store } from "@/lib/stores/types";

export function StoreStatusSettings({
  store,
  publishIssues,
  billingEnabled = false,
  hasActivePlan = false,
}: {
  store: Store;
  publishIssues: PublishIssue[];
  billingEnabled?: boolean;
  hasActivePlan?: boolean;
}) {
  const router = useRouter();
  const [publishOpen, setPublishOpen] = useState(false);
  const [unpublishOpen, setUnpublishOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isPublished = store.status === "published";
  const canPublish = publishIssues.length === 0;
  const needsCheckout = billingEnabled && !hasActivePlan;

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
                <li key={issue.message}>
                  <Link
                    href={issue.href}
                    className="text-foreground underline underline-offset-2 hover:opacity-80"
                  >
                    {issue.message}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {needsCheckout ? (
            <Button
              render={<Link href="/billing/publish" />}
              disabled={!canPublish}
            >
              Choose plan & publish
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canPublish}
              onClick={() => setPublishOpen(true)}
            >
              Publish store
            </Button>
          )}
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
              Your storefront will be hidden. Existing order links still work.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUnpublishOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={pending}
              onClick={() => run(unpublishStoreAction)}
            >
              {pending ? "Unpublishing…" : "Unpublish store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
