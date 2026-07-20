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
}: {
  isPublished: boolean;
  issues: PublishIssue[];
  billingEnabled: boolean;
  hasActivePlan: boolean;
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
        {ready ? "Ready to launch" : "Publish your store"}
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-foreground">
        {ready
          ? "Your store is ready to go live"
          : "Finish setup before you publish"}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {ready
          ? needsCheckout
            ? "Pick a plan to publish — free to build, pay when you go live."
            : "Publishing makes your link open for customers and lets them place orders."
          : "Complete the items below, then you can publish."}
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

      <div className="mt-4">
        {needsCheckout && ready ? (
          <Button
            render={<Link href="/billing/publish" />}
            className="w-full sm:w-auto"
          >
            Choose plan & publish
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!ready || pending}
            onClick={publish}
            className="w-full sm:w-auto"
          >
            {pending ? "Publishing…" : "Publish your store"}
          </Button>
        )}
      </div>

      {error ? (
        <p className="text-destructive mt-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
