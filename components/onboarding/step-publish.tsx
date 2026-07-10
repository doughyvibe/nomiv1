"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { publishStore } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { MiniPreview } from "@/components/storefront/mini-preview";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard/copy-text";
import { getStorefrontUrl } from "@/lib/host";
import {
  fulfillmentIsComplete,
  heroIsComplete,
  paynowIsComplete,
  type Product,
  type Store,
} from "@/lib/stores/types";

export function StepPublish({
  store,
  products,
}: {
  store: Store;
  products: Product[];
}) {
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const storeUrl = getStorefrontUrl(store.slug);
  const displayUrl = storeUrl.replace(/^https?:\/\//, "");

  const checklist = [
    { label: "Store name added", done: Boolean(store.name) },
    { label: "Subdomain claimed", done: Boolean(store.slug) },
    { label: "Vibe selected", done: Boolean(store.vibe) },
    { label: "Shop intro set up", done: heroIsComplete(store.hero) },
    { label: "First product added", done: products.length > 0 },
    { label: "Fulfillment configured", done: fulfillmentIsComplete(store.fulfillment) },
    { label: "PayNow payment configured", done: paynowIsComplete(store.paynow) },
  ];
  const allDone = checklist.every((c) => c.done);

  function handlePublish() {
    setError(null);
    startTransition(async () => {
      const result = await publishStore();
      if (result.ok) setPublished(true);
      else setError(result.error);
    });
  }

  async function handleCopy() {
    const ok = await copyText(storeUrl);
    if (!ok) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2500);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (published) {
    return (
      <section className="flex flex-col items-center gap-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em]">Your store is live 🎉</h1>
          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-lg font-medium text-foreground underline"
          >
            {displayUrl}
          </a>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-2">
          <Button onClick={handleCopy} variant="outline">
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          {copyError && (
            <p className="text-destructive text-xs">Copy failed — select and copy manually.</p>
          )}
          <Button
            variant="outline"
            render={<a href={storeUrl} target="_blank" rel="noreferrer" />}
          >
            Open Store
          </Button>
          <Button
            variant="outline"
            render={
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out my store: ${storeUrl}`,
                )}`}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Share on WhatsApp
          </Button>
          <Button render={<Link href="/" />}>Go to Dashboard</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">Preview &amp; publish</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your store link:{" "}
          <span className="font-medium text-foreground">{displayUrl}</span>
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-1">
          <ul className="flex flex-col gap-2">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  className={item.done ? "text-green-600" : "text-muted-foreground"}
                >
                  {item.done ? "✓" : "○"}
                </span>
                {item.label}
              </li>
            ))}
          </ul>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <Button
            onClick={handlePublish}
            disabled={!allDone || pending}
            className="mt-5 w-full"
          >
            {pending ? "Publishing…" : "Publish Store"}
          </Button>
        </div>

        <div className="sm:w-[240px]">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Storefront preview
          </p>
          {store.vibe && (
            <MiniPreview
              vibe={store.vibe}
              storeName={store.name}
              hero={store.hero}
              products={products}
            />
          )}
        </div>
      </div>
    </section>
  );
}
