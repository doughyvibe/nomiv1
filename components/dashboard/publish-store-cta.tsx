"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { publishStoreAction } from "@/app/(dashboard)/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import type { PublishIssue } from "@/lib/stores/publish-readiness";
import { cn } from "@/lib/utils";

export function PublishStoreCta({
  isPublished,
  issues,
  billingEnabled,
  hasActivePlan,
  previewUrl,
}: {
  isPublished: boolean;
  issues: PublishIssue[];
  billingEnabled: boolean;
  hasActivePlan: boolean;
  previewUrl: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (isPublished) return null;

  const ready = issues.length === 0;
  const needsCheckout = billingEnabled && !hasActivePlan;

  function publish() {
    if (needsCheckout) {
      router.push("/billing/publish");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await publishStoreAction();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-border px-6 py-5 sm:px-7",
        ready ? "bg-primary/5" : "bg-card",
      )}
    >
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">
        Ready when you are
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-foreground">
        Publish when you’re happy with your store
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Complete the checklist to prepare your store, or publish anytime when
        you’re ready to start accepting orders.
      </p>

      {!ready ? (
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {issues.map((issue) => (
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
      ) : null}

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        {needsCheckout && ready ? (
          <Button
            render={<Link href="/billing/publish" />}
            className="w-full sm:w-auto"
          >
            Publish Store
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!ready || pending}
            onClick={publish}
            className="w-full sm:w-auto"
          >
            {pending ? "Publishing…" : "Publish Store"}
          </Button>
        )}
        <Button
          render={
            <a href={previewUrl} target="_blank" rel="noreferrer" />
          }
          variant="outline"
          className="w-full sm:w-auto"
        >
          Preview store
        </Button>
      </div>

      {error ? (
        <p className="text-destructive mt-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
