"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  markOrderCancelledAction,
  markOrderCompletedAction,
  markPaymentVerifiedAction,
} from "@/app/(dashboard)/dashboard/orders/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  canMarkCancelled,
  canMarkCompleted,
  canMarkPaymentVerified,
} from "@/lib/orders/status-transitions";
import type { OrderStatus } from "@/lib/orders/types";

export function OrderStatusActions({
  reference,
  status,
}: {
  reference: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ error: string } | { success: true }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setVerifyOpen(false);
      setCancelOpen(false);
      router.refresh();
    });
  }

  const showVerify = canMarkPaymentVerified(status);
  const showComplete = canMarkCompleted(status);
  const showCancel = canMarkCancelled(status);

  if (!showVerify && !showComplete && !showCancel) return null;

  return (
    <section className="dashboard-panel px-6 py-5 sm:px-7 sm:py-6">
      <h2 className="font-display text-lg font-extrabold tracking-[-0.02em]">
        Order actions
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {showVerify && (
          <Button type="button" disabled={pending} onClick={() => setVerifyOpen(true)}>
            Mark payment verified
          </Button>
        )}
        {showComplete && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => run(() => markOrderCompletedAction(reference))}
          >
            {pending ? "Updating…" : "Mark as completed"}
          </Button>
        )}
        {showCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => setCancelOpen(true)}
          >
            Cancel order
          </Button>
        )}
      </div>

      {error && (
        <p className="text-destructive mt-3 text-sm" role="alert">
          {error}
        </p>
      )}

      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Mark payment verified?</DialogTitle>
            <DialogDescription>
              Only after you&apos;ve checked your bank or PayLah.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={pending}
              onClick={() => run(() => markPaymentVerifiedAction(reference))}
            >
              {pending ? "Updating…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Cancel this order?</DialogTitle>
            <DialogDescription>
              The buyer will see this order as cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={pending}
              onClick={() => run(() => markOrderCancelledAction(reference))}
            >
              {pending ? "Updating…" : "Cancel order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
