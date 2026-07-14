"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { MiniPreview } from "@/components/storefront/mini-preview";
import { Button } from "@/components/ui/button";
import type { Product, Store, Vibe } from "@/lib/stores/types";
import { VIBES } from "@/lib/vibes";
import { cn } from "@/lib/utils";

const SAMPLE_HERO = {
  eyebrow: "Est. 2024",
  title: "Your Store",
  subheading: "Quality products, made with care.",
  order: ["eyebrow", "title", "subheading"] as const,
};

/** Neutral samples — avoid trade-specific fishing names during empty onboarding. */
const FALLBACK_PRODUCTS = [
  { name: "Signature item", price_cents: 1800, image_url: null, category: "Bestsellers" },
  { name: "Everyday pick", price_cents: 1200, image_url: null, category: "Shop" },
  { name: "Gift set", price_cents: 3200, image_url: null, category: "Gifts" },
  { name: "Add-on", price_cents: 600, image_url: null, category: "Extras" },
];

type VibePickerProps = {
  store: Store;
  products?: Pick<Product, "name" | "price_cents" | "image_url" | "category">[];
  onSaveVibe: (vibe: Vibe) => Promise<{ error: string } | { success: true }>;
  onSuccess?: () => void;
};

export function VibePicker({
  store,
  products = FALLBACK_PRODUCTS,
  onSaveVibe,
  onSuccess,
}: VibePickerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Vibe | null>(store.vibe);
  const [saved, setSaved] = useState<Vibe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleUseVibe(vibe: Vibe) {
    setSelected(vibe);
    setError(null);
    startTransition(async () => {
      const result = await onSaveVibe(vibe);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSaved(vibe);
      setTimeout(() => setSaved(null), 2000);
      onSuccess?.();
      router.refresh();
    });
  }

  const previewProducts =
    products.length > 0 ? products.slice(0, 4) : FALLBACK_PRODUCTS;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-xs sm:hidden">
        Swipe sideways to browse vibes →
      </p>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {VIBES.map((vibe) => (
          <div
            key={vibe.id}
            className={cn(
              "flex w-[260px] shrink-0 snap-center flex-col gap-3 rounded-xl border p-4",
              selected === vibe.id ? "border-primary" : "border-border",
            )}
          >
            <MiniPreview
              vibe={vibe.id}
              storeName={store.name}
              hero={{
                ...SAMPLE_HERO,
                title: store.name,
                order: [...SAMPLE_HERO.order],
              }}
              products={previewProducts}
              store={store}
            />
            <div>
              <p className="font-semibold">{vibe.name}</p>
              <p className="text-muted-foreground text-xs">{vibe.tagline}</p>
              <p className="text-muted-foreground mt-1 text-[11px] leading-snug">
                Best for: {vibe.suitableFor}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => handleUseVibe(vibe.id)}
              disabled={pending}
              variant={selected === vibe.id ? "default" : "outline"}
              className="rounded-full"
            >
              {pending && selected === vibe.id
                ? "Saving…"
                : saved === vibe.id
                  ? "Saved"
                  : selected === vibe.id
                    ? "Current vibe"
                    : "Use this vibe"}
            </Button>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
