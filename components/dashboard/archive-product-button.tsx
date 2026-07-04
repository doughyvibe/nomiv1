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
        variant="destructive"
        onClick={() => setOpen(true)}
      >
        Archive product
      </Button>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Archive this product?</DialogTitle>
            <DialogDescription>
              It will be hidden from your storefront. Existing orders are not
              affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Keep product
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={handleArchive}
            >
              {pending ? "Archiving…" : "Archive product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
