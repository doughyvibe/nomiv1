"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { saveFeaturedSectionTitleAction } from "@/app/(dashboard)/dashboard/storefront/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FEATURED_SECTION_TITLE_SUGGESTIONS } from "@/lib/featured-section";
import type { Store } from "@/lib/stores/types";

export function FeaturedSectionEditor({ store }: { store: Store }) {
  const router = useRouter();
  const [title, setTitle] = useState(store.featured_section_title ?? "");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex(
        (i) => (i + 1) % FEATURED_SECTION_TITLE_SUGGESTIONS.length,
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveFeaturedSectionTitleAction(title);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  const rotatingPlaceholder =
    FEATURED_SECTION_TITLE_SUGGESTIONS[placeholderIndex];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="featured-section-title">Featured section title</Label>
        <Input
          id="featured-section-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={rotatingPlaceholder}
          maxLength={60}
          className="placeholder:text-muted-foreground/60"
        />
        <p className="text-muted-foreground text-xs">
          Shown above your featured product. Leave blank to use &ldquo;Feature
          Product&rdquo;. Set your featured product from the Products page (star
          icon).
        </p>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="button" onClick={handleSave} disabled={pending}>
        {pending ? "Saving…" : saved ? "Saved" : "Save section title"}
      </Button>
    </div>
  );
}
