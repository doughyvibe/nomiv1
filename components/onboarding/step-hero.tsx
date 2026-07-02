"use client";

import { useState, useTransition } from "react";

import { saveHero } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { MiniPreview } from "@/components/storefront/mini-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStoreImage } from "@/lib/images/compress";
import { HERO_BLOCKS, type HeroBlock, type Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/client";

const BLOCK_LABELS: Record<HeroBlock, string> = {
  eyebrow: "Eyebrow",
  image: "Image",
  title: "Title",
  subheading: "Subheading",
  cta: "CTA button",
};

export function StepHero({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  const [eyebrow, setEyebrow] = useState(store.hero.eyebrow ?? "");
  const [title, setTitle] = useState(store.hero.title ?? store.name);
  const [subheading, setSubheading] = useState(store.hero.subheading ?? "");
  const [cta, setCta] = useState(store.hero.cta ?? "Shop now");
  const [imageUrl, setImageUrl] = useState(store.hero.image_url ?? "");
  const [order, setOrder] = useState<HeroBlock[]>(
    store.hero.order?.length ? store.hero.order : [...HERO_BLOCKS],
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function move(block: HeroBlock, dir: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(block);
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  }

  async function handleImage(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const url = await uploadStoreImage(supabase, user.id, file, "hero");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleContinue() {
    setError(null);
    startTransition(async () => {
      const result = await saveHero({
        eyebrow: eyebrow || undefined,
        title,
        subheading: subheading || undefined,
        cta: cta || undefined,
        image_url: imageUrl || undefined,
        order,
      });
      if (result.ok) onDone();
      else setError(result.error);
    });
  }

  const hero = {
    eyebrow: eyebrow || undefined,
    title,
    subheading: subheading || undefined,
    cta: cta || undefined,
    image_url: imageUrl || undefined,
    order,
  };

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Design your storefront hero</h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          The top section of your store. Your vibe controls the design — you
          control the words and image.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-eyebrow">Eyebrow (optional)</Label>
            <Input
              id="hero-eyebrow"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="Since the Deep"
              maxLength={40}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-title">Hero title</Label>
            <Input
              id="hero-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={store.name}
              maxLength={80}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-subheading">Subheading</Label>
            <Input
              id="hero-subheading"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Realistic metal jigs, forged for the deep bite."
              maxLength={140}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-cta">CTA button text</Label>
            <Input
              id="hero-cta"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="Shop now"
              maxLength={30}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-image">Hero image</Label>
            <Input
              id="hero-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e.target.files?.[0])}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-xs text-dashboard-muted">Uploading…</p>
            )}
          </div>

          {/* Block ordering: move up/down (drag-and-drop parked per PRD) */}
          <div className="flex flex-col gap-2">
            <Label>Element order</Label>
            <ul className="flex flex-col gap-1">
              {order.map((block, i) => (
                <li
                  key={block}
                  className="flex items-center justify-between rounded-md border border-dashboard-border px-3 py-1.5 text-sm"
                >
                  <span>{BLOCK_LABELS[block]}</span>
                  <span className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(block, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${BLOCK_LABELS[block]} up`}
                      className="rounded px-2 py-0.5 text-dashboard-muted hover:bg-dashboard-bg disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(block, 1)}
                      disabled={i === order.length - 1}
                      aria-label={`Move ${BLOCK_LABELS[block]} down`}
                      className="rounded px-2 py-0.5 text-dashboard-muted hover:bg-dashboard-bg disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live vibe-styled preview */}
        <div className="sm:w-[240px]">
          <p className="mb-2 text-xs font-medium text-dashboard-muted">
            Live preview
          </p>
          {store.vibe && (
            <MiniPreview vibe={store.vibe} storeName={store.name} hero={hero} />
          )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleContinue} disabled={pending || !title.trim()}>
        {pending ? "Saving…" : "Continue"}
      </Button>
    </section>
  );
}
