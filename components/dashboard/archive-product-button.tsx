"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { archiveProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ArchiveProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleArchive() {
    setError(null);
    startTransition(async () => {
      const result = await archiveProductAction(productId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.push("/products");
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="h-auto min-h-12 w-full justify-center rounded-xl px-3 text-sm font-semibold text-destructive/90 hover:bg-destructive/8 hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        Archive Product
      </Button>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Remove from shop?</DialogTitle>
            <DialogDescription>
              Hidden from buyers. Past orders stay intact.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={pending}
              onClick={handleArchive}
            >
              {pending ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
