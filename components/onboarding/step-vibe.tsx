"use client";

import { useState, useTransition } from "react";

import { saveVibe } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { MiniPreview } from "@/components/storefront/mini-preview";
import { Button } from "@/components/ui/button";
import type { Store, Vibe } from "@/lib/stores/types";
import { VIBES } from "@/lib/vibes";
import { cn } from "@/lib/utils";

const SAMPLE_HERO = {
  eyebrow: "Since the Deep",
  title: "JigWave",
  subheading: "Realistic metal jigs & premium assist hooks.",
  cta: "Shop now",
  order: ["eyebrow", "image", "title", "subheading", "cta"] as const,
};

const SAMPLE_PRODUCTS = [
  { name: "Black Gold Slayer", price_cents: 950, image_url: null, category: "Metal Jigs" },
  { name: "Deep Assist Hook", price_cents: 1250, image_url: null, category: "Assist Hooks" },
  { name: "Tide Runner", price_cents: 1450, image_url: null, category: "Metal Jigs" },
  { name: "Reef King", price_cents: 890, image_url: null, category: "Assist Hooks" },
];

export function StepVibe({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  const [selected, setSelected] = useState<Vibe | null>(store.vibe);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleUseVibe(vibe: Vibe) {
    setSelected(vibe);
    setError(null);
    startTransition(async () => {
      const result = await saveVibe(vibe);
      if (result.ok) onDone();
      else setError(result.error);
    });
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Choose your storefront vibe</h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          Swipe through styles and pick the one that matches your brand. This
          only affects your public storefront — your dashboard stays the same.
        </p>
      </div>

      {/* Horizontal snap carousel of phone-frame previews */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8">
        {VIBES.map((vibe) => (
          <div
            key={vibe.id}
            className={cn(
              "flex w-[260px] shrink-0 snap-center flex-col gap-3 rounded-xl border p-4",
              selected === vibe.id
                ? "border-dashboard-primary"
                : "border-dashboard-border",
            )}
          >
            <MiniPreview
              vibe={vibe.id}
              storeName={store.name}
              hero={{ ...SAMPLE_HERO, order: [...SAMPLE_HERO.order] }}
              products={SAMPLE_PRODUCTS}
            />
            <div>
              <p className="font-semibold">{vibe.name}</p>
              <p className="text-xs text-dashboard-muted">{vibe.tagline}</p>
              <p className="mt-1 text-xs text-dashboard-muted">
                Good for: {vibe.suitableFor}
              </p>
            </div>
            <Button
              onClick={() => handleUseVibe(vibe.id)}
              disabled={pending}
              variant={selected === vibe.id ? "default" : "outline"}
            >
              {pending && selected === vibe.id ? "Saving…" : "Use this vibe"}
            </Button>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </section>
  );
}
