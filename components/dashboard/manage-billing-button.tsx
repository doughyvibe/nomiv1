"use client";

import { useState, useTransition } from "react";

import { openBillingPortalAction } from "@/app/(dashboard)/dashboard/billing/actions";
import { Button } from "@/components/ui/button";

export function ManageBillingButton() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await openBillingPortalAction();
            if ("error" in result) {
              setError(result.error);
              return;
            }
            window.location.href = result.url;
          });
        }}
      >
        {pending ? "Opening…" : "Manage billing"}
      </Button>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
