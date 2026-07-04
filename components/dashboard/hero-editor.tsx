"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { MiniPreview } from "@/components/storefront/mini-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStoreImage } from "@/lib/images/compress";
import { HERO_BLOCKS, type HeroBlock, type HeroConfig, type Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/client";

const BLOCK_LABELS: Record<HeroBlock, string> = {
  eyebrow: "Eyebrow",
  image: "Image",
  title: "Title",
  subheading: "Subheading",
  cta: "CTA button",
};

type HeroEditorProps = {
  store: Store;
  submitLabel?: string;
  onSaveHero: (hero: HeroConfig) => Promise<{ error: string } | { success: true }>;
  onSuccess?: () => void;
};

export function HeroEditor({
  store,
  submitLabel = "Save hero",
  onSaveHero,
  onSuccess,
}: HeroEditorProps) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(store.hero.eyebrow ?? "");
  const [title, setTitle] = useState(store.hero.title ?? store.name);
  const [subheading, setSubheading] = useState(store.hero.subheading ?? "");
  const [cta, setCta] = useState(store.hero.cta ?? "Shop now");
  const [imageUrl, setImageUrl] = useState(store.hero.image_url ?? "");
  const [order, setOrder] = useState<HeroBlock[]>(
    store.hero.order?.length ? store.hero.order : [...HERO_BLOCKS],
  );
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
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

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await onSaveHero({
        eyebrow: eyebrow || undefined,
        title,
        subheading: subheading || undefined,
        cta: cta || undefined,
        image_url: imageUrl || undefined,
        order,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSuccess?.();
      router.refresh();
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
    <div className="flex flex-col gap-5">
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
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="aspect-video w-full max-w-xs rounded-md border object-cover"
              />
            ) : null}
            <Input
              id="hero-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e.target.files?.[0])}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-muted-foreground text-xs">Uploading…</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Element order</Label>
            <ul className="flex flex-col gap-1">
              {order.map((block, i) => (
                <li
                  key={block}
                  className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                >
                  <span>{BLOCK_LABELS[block]}</span>
                  <span className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(block, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${BLOCK_LABELS[block]} up`}
                      className="text-muted-foreground hover:bg-muted rounded px-2 py-0.5 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(block, 1)}
                      disabled={i === order.length - 1}
                      aria-label={`Move ${BLOCK_LABELS[block]} down`}
                      className="text-muted-foreground hover:bg-muted rounded px-2 py-0.5 disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sm:w-[240px]">
          <p className="text-muted-foreground mb-2 text-xs font-medium">
            Live preview
          </p>
          {store.vibe ? (
            <MiniPreview vibe={store.vibe} storeName={store.name} hero={hero} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Choose a vibe first to preview hero styling.
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={handleSave}
        disabled={pending || uploading || !title.trim()}
      >
        {pending ? "Saving…" : saved ? "Saved" : submitLabel}
      </Button>
    </div>
  );
}
