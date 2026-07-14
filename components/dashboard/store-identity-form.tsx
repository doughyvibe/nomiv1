"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStorefrontUrl } from "@/lib/host";
import { TRADE_HINTS } from "@/lib/trade-hint";
import type { Store, TradeHint } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

type StoreIdentityFormProps = {
  store: Store;
  onSave: (input: {
    name: string;
    tradeHint: TradeHint | null;
  }) => Promise<{ error: string } | { success: true }>;
};

export function StoreIdentityForm({ store, onSave }: StoreIdentityFormProps) {
  const router = useRouter();
  const [name, setName] = useState(store.name);
  const [tradeHint, setTradeHint] = useState<TradeHint | null>(
    store.trade_hint ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const storeUrl = getStorefrontUrl(store.slug);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await onSave({ name, tradeHint });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="store-name">Store name</Label>
        <Input
          id="store-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
          autoComplete="organization"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? "store-identity-error" : undefined}
        />
        <p className="text-muted-foreground text-xs">
          Shown in your dashboard and as the default shop title.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="store-slug">Store link</Label>
        <Input
          id="store-slug"
          value={store.slug}
          readOnly
          className="bg-muted/40 text-muted-foreground"
        />
        <p className="text-muted-foreground text-xs break-all">
          {storeUrl}
          <span className="mt-1 block">
            Your link is set at signup and can&apos;t be changed here.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium" id="trade-hint-label">
          What do you sell?
        </p>
        <p className="text-muted-foreground text-xs">
          Optional — helps suggest product categories.
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="trade-hint-label"
        >
          {TRADE_HINTS.map((hint) => (
            <button
              key={hint.id}
              type="button"
              aria-pressed={tradeHint === hint.id}
              onClick={() =>
                setTradeHint((prev) => (prev === hint.id ? null : hint.id))
              }
              className={cn(
                "min-h-10 rounded-full border px-3 py-2 text-left text-xs transition-colors",
                tradeHint === hint.id
                  ? "border-foreground bg-primary text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30",
              )}
            >
              <span className="font-semibold">{hint.label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Vibe and hero live under{" "}
        <Link
          href="/storefront"
          className="text-foreground underline underline-offset-2"
        >
          Storefront
        </Link>
        .
      </p>

      {error ? (
        <p id="store-identity-error" className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || !name.trim()} className="rounded-full">
        {pending ? "Saving…" : saved ? "Saved" : "Save identity"}
      </Button>
    </form>
  );
}
