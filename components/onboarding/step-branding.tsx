"use client";

import { useState, useTransition } from "react";

import { saveHero } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStoreImage } from "@/lib/images/compress";
import type { Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/client";

export function StepBranding({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  const [logoUrl, setLogoUrl] = useState(store.hero.logo_url ?? "");
  const [tagline, setTagline] = useState(store.hero.subheading ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleLogo(file: File) {
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

  function handleContinue() {
    setError(null);
    startTransition(async () => {
      const result = await saveHero({
        title: store.hero.title?.trim() || store.name,
        subheading: tagline.trim() || undefined,
        logo_url: logoUrl || undefined,
        logo_size: logoUrl ? "m" : undefined,
        logo_style: logoUrl ? "plain" : undefined,
        onboarding_branding_done: true,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-display text-[2rem] sm:text-[2.25rem] font-extrabold tracking-[-0.02em]">
        Store Branding
      </h1>

      <ImageUploadField
        id="branding-logo"
        label="Logo"
        valueUrl={logoUrl}
        onFile={handleLogo}
        onClear={() => setLogoUrl("")}
        uploading={uploading}
        disabled={pending}
        emptyTitleMobile="Tap to add your logo"
        emptyTitleDesktop="Drop an image or click to browse"
        hint=""
        objectFit="contain"
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="branding-tagline">Tagline</Label>
        <Input
          id="branding-tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="A small description about your store"
          maxLength={140}
          disabled={pending}
        />
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          onClick={handleContinue}
          disabled={pending || uploading}
          className="rounded-full"
        >
          {pending ? "Saving…" : "Continue"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Optional — you can skip and add these later.
        </p>
      </div>
    </section>
  );
}
