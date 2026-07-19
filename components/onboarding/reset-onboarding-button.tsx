"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { resetOnboarding } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Dev-only control to wipe the store and restart onboarding. */
export function ResetOnboardingButton({
  className,
  align = "end",
}: {
  className?: string;
  align?: "start" | "end";
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (process.env.NODE_ENV !== "development") return null;

  function handleClick() {
    const ok = window.confirm(
      "Deletes this store, products, and orders. Slug can be reused.",
    );
    if (!ok) return;

    setError(null);
    startTransition(async () => {
      const result = await resetOnboarding();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/onboarding");
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "end" ? "items-end" : "items-start",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={handleClick}
        className="rounded-full border-destructive/40 px-3 text-destructive hover:bg-destructive/10 sm:px-4"
      >
        <span className="sm:hidden">{pending ? "…" : "Reset"}</span>
        <span className="hidden sm:inline">
          {pending ? "Resetting…" : "Reset onboarding"}
        </span>
      </Button>
      {error ? (
        <p
          className={cn(
            "text-destructive max-w-sm text-xs",
            align === "end" && "text-right",
          )}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
