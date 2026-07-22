"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { restoreProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { Button } from "@/components/ui/button";

export function RestoreProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleRestore() {
    setError(null);
    startTransition(async () => {
      const result = await restoreProductAction(productId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={handleRestore} disabled={pending}>
        {pending ? "Putting back…" : "Put back on shop"}
      </Button>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
