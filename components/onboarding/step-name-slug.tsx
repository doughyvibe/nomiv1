"use client";

import { useEffect, useState, useTransition } from "react";

import {
  checkSlugAvailability,
  saveStoreNameSlug,
  type SlugCheckResult,
} from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRootDomain } from "@/lib/host";
import { slugify, validateSlugFormat } from "@/lib/slug";
import type { Store } from "@/lib/stores/types";

export function StepNameSlug({
  store,
  onDone,
}: {
  store: Store | null;
  onDone: () => void;
}) {
  const [name, setName] = useState(store?.name ?? "");
  const [slug, setSlug] = useState(store?.slug ?? "");
  // Existing claim: don't auto-overwrite slug when editing the display name
  const [slugEdited, setSlugEdited] = useState(Boolean(store?.slug));
  const [serverCheck, setServerCheck] = useState<{
    slug: string;
    result: SlugCheckResult;
  } | null>(() =>
    store?.slug
      ? { slug: store.slug, result: { available: true } }
      : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const rootDomain = getRootDomain();
  const unchanged =
    Boolean(store) &&
    name.trim() === store!.name &&
    slug === store!.slug;

  // Format errors are derived at render time; only availability needs the server
  const formatError = slug ? validateSlugFormat(slug) : null;
  const check: SlugCheckResult | null = formatError
    ? { available: false, error: formatError }
    : serverCheck?.slug === slug
      ? serverCheck.result
      : null;
  const checking = Boolean(slug) && !formatError && !check;

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  // Debounced server availability check
  useEffect(() => {
    if (!slug || validateSlugFormat(slug)) return;
    if (store?.slug === slug) {
      setServerCheck({ slug, result: { available: true } });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await checkSlugAvailability(slug);
        setServerCheck({ slug, result });
      } catch {
        setServerCheck({
          slug,
          result: {
            available: false,
            error: "Couldn't check availability. Try again.",
          },
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slug, store?.slug]);

  function handleContinue() {
    setError(null);
    if (unchanged) {
      onDone();
      return;
    }
    startTransition(async () => {
      const result = await saveStoreNameSlug(name, slug);
      if (result.ok) onDone();
      else setError(result.error);
    });
  }

  const canContinue =
    name.trim().length > 0 &&
    (unchanged || check?.available === true) &&
    !pending;

  return (
    <section className="flex flex-col gap-5">
      <h1
        id="store-name-heading"
        className="font-display text-[2rem] sm:text-[2.25rem] font-extrabold tracking-[-0.02em]"
      >
        What is the name of your store?
      </h1>

      <Input
        id="store-name"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Sarah Bakes"
        maxLength={60}
        autoFocus
        aria-labelledby="store-name-heading"
        aria-invalid={Boolean(error && !name.trim()) || undefined}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="store-slug">Your store link</Label>
        <div className="flex items-center gap-2">
          <Input
            id="store-slug"
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value.toLowerCase());
            }}
            placeholder="sarahbakes"
            className="flex-1"
            aria-invalid={check && !check.available ? true : undefined}
            aria-describedby="store-slug-status"
          />
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            .{rootDomain}
          </span>
        </div>

        {slug && (
          <p id="store-slug-status" className="text-sm" aria-live="polite">
            {checking ? (
              <span className="text-muted-foreground">Checking…</span>
            ) : check?.available ? (
              <span className="text-green-600">
                ✓{" "}
                {store?.slug === slug
                  ? `${slug}.${rootDomain} is yours`
                  : `${slug}.${rootDomain} is available`}
              </span>
            ) : check?.error ? (
              <span className="text-destructive">✗ {check.error}</span>
            ) : null}
          </p>
        )}

        {check?.suggestions && (
          <div className="flex flex-wrap gap-2">
            {check.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSlugEdited(true);
                  setSlug(s);
                }}
                className="rounded-full border border-border px-3 py-1 text-xs hover:border-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        onClick={handleContinue}
        disabled={!canContinue}
        className="rounded-full"
      >
        {pending ? (store ? "Saving…" : "Claiming…") : "Continue"}
      </Button>
    </section>
  );
}
