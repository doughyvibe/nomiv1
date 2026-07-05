"use client";

import { useEffect, useState, useTransition } from "react";

import {
  checkSlugAvailability,
  createStore,
  type SlugCheckResult,
} from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRootDomain } from "@/lib/host";
import { slugify, validateSlugFormat } from "@/lib/slug";

export function StepNameSlug({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [serverCheck, setServerCheck] = useState<{
    slug: string;
    result: SlugCheckResult;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const rootDomain = getRootDomain();

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
  }, [slug]);

  function handleContinue() {
    setError(null);
    startTransition(async () => {
      const result = await createStore(name, slug);
      if (result.ok) onDone();
      else setError(result.error);
    });
  }

  const canContinue =
    name.trim().length > 0 && check?.available === true && !pending;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">What is your store called?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your store name and link. You can change the name later — the link is
          yours once claimed.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="store-name">Store name</Label>
        <Input
          id="store-name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Sarah Bakes"
          maxLength={60}
          autoFocus
        />
      </div>

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
          />
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            .{rootDomain}
          </span>
        </div>

        {slug && (
          <p className="text-sm" aria-live="polite">
            {checking ? (
              <span className="text-muted-foreground">Checking…</span>
            ) : check?.available ? (
              <span className="text-green-600">
                ✓ {slug}.{rootDomain} is available
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

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleContinue} disabled={!canContinue}>
        {pending ? "Claiming…" : "Continue"}
      </Button>
    </section>
  );
}
