"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { MiniPreview } from "@/components/storefront/mini-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStoreImage } from "@/lib/images/compress";
import { heroLogoClassName } from "@/lib/stores/hero-logo";
import {
  HERO_LOGO_SIZES,
  HERO_LOGO_STYLES,
  type HeroConfig,
  type HeroLogoSize,
  type HeroLogoStyle,
  type Store,
} from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type HeroEditorProps = {
  store: Store;
  submitLabel?: string;
  onSaveHero: (hero: HeroConfig) => Promise<{ error: string } | { success: true }>;
  onSuccess?: () => void;
};

const SIZE_LABELS: Record<HeroLogoSize, string> = {
  s: "S",
  m: "M",
  l: "L",
};

const STYLE_LABELS: Record<HeroLogoStyle, string> = {
  plain: "Plain",
  rounded: "Rounded",
  circle: "Circle",
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
  const [logoUrl, setLogoUrl] = useState(store.hero.logo_url ?? "");
  const [logoSize, setLogoSize] = useState<HeroLogoSize>(
    store.hero.logo_size === "s" || store.hero.logo_size === "l"
      ? store.hero.logo_size
      : "m",
  );
  const [logoStyle, setLogoStyle] = useState<HeroLogoStyle>(
    store.hero.logo_style === "rounded" || store.hero.logo_style === "circle"
      ? store.hero.logo_style
      : "plain",
  );
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleLogo(file: File | undefined) {
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
      setLogoUrl(url);
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
        logo_url: logoUrl || undefined,
        logo_size: logoUrl ? logoSize : undefined,
        logo_style: logoUrl ? logoStyle : undefined,
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

  const hero: Partial<HeroConfig> = {
    eyebrow: eyebrow || undefined,
    title,
    subheading: subheading || undefined,
    logo_url: logoUrl || undefined,
    logo_size: logoUrl ? logoSize : undefined,
    logo_style: logoUrl ? logoStyle : undefined,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-logo">Logo (optional)</Label>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Your brand mark above the store name. PNG with a transparent
              background works best — we won&apos;t crop your logo.
            </p>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={title || store.name}
                className={cn(
                  "border border-border bg-muted/30",
                  heroLogoClassName(logoSize, logoStyle),
                )}
              />
            ) : null}
            <Input
              id="hero-logo"
              type="file"
              accept="image/*"
              onChange={(e) => handleLogo(e.target.files?.[0])}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-muted-foreground text-xs">Uploading…</p>
            )}
            {logoUrl ? (
              <button
                type="button"
                className="text-muted-foreground w-fit text-xs underline"
                onClick={() => setLogoUrl("")}
              >
                Remove logo
              </button>
            ) : null}
          </div>

          {logoUrl ? (
            <>
              <div className="flex flex-col gap-2">
                <Label>Logo size</Label>
                <div className="flex gap-2">
                  {HERO_LOGO_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setLogoSize(size)}
                      className={cn(
                        "min-h-11 min-w-11 rounded-md border px-3 text-sm font-medium transition-colors",
                        logoSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {SIZE_LABELS[size]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Logo style</Label>
                <div className="flex flex-wrap gap-2">
                  {HERO_LOGO_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLogoStyle(style)}
                      className={cn(
                        "min-h-11 rounded-md border px-3 text-sm font-medium transition-colors",
                        logoStyle === style
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {STYLE_LABELS[style]}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">
                  Circle frames the mark without cropping it.
                </p>
              </div>
            </>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-eyebrow">Eyebrow (optional)</Label>
            <Input
              id="hero-eyebrow"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="Est. 2024"
              maxLength={40}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-title">Store name on storefront</Label>
            <Input
              id="hero-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={store.name}
              maxLength={80}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hero-subheading">Tagline</Label>
            <Input
              id="hero-subheading"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="What you sell in one line"
              maxLength={140}
            />
          </div>
        </div>

        <div className="sm:w-[240px]">
          <p className="text-muted-foreground mb-2 text-xs font-medium">
            Live preview
          </p>
          {store.vibe ? (
            <MiniPreview
              vibe={store.vibe}
              storeName={store.name}
              hero={hero}
              store={store}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              Choose a vibe first to preview styling.
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
