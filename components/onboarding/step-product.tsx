"use client";

import { useState, useTransition } from "react";

import {
  addProductAction,
  updateProductAction,
} from "@/app/(dashboard)/dashboard/products/actions";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStoreImage } from "@/lib/images/compress";
import { parsePriceToCents } from "@/lib/products/validate";
import type { Product, Store } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/client";

function pickFeatureProduct(
  products: Product[],
  store: Store,
): Product | null {
  if (products.length === 0) return null;
  const featured = store.featured_product_id
    ? products.find((p) => p.id === store.featured_product_id)
    : undefined;
  return featured ?? products[0] ?? null;
}

export function StepProduct({
  store,
  products,
  onDone,
}: {
  store: Store;
  products: Product[];
  onDone: () => void;
}) {
  const existing = pickFeatureProduct(products, store);

  const [name, setName] = useState(existing?.name ?? "");
  const [price, setPrice] = useState(
    existing ? (existing.price_cents / 100).toFixed(2) : "",
  );
  const [description, setDescription] = useState(existing?.description ?? "");
  const [imageUrl, setImageUrl] = useState(existing?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<"name" | "price" | null>(null);
  const [pending, startTransition] = useTransition();

  const existingPrice = existing
    ? (existing.price_cents / 100).toFixed(2)
    : "";
  const unchanged =
    Boolean(existing) &&
    name.trim() === existing!.name &&
    price === existingPrice &&
    description === (existing!.description ?? "") &&
    (imageUrl || "") === (existing!.image_url ?? "");

  async function handleImage(file: File) {
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const url = await uploadStoreImage(supabase, user.id, file, "product");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleContinue() {
    if (unchanged) {
      onDone();
      return;
    }

    setError(null);
    setFieldError(null);

    if (!name.trim()) {
      setFieldError("name");
      setError("Product name is required");
      return;
    }

    const priceCents = parsePriceToCents(price);
    if (priceCents == null) {
      setFieldError("price");
      setError("Enter a valid price, e.g. 9.50");
      return;
    }

    const payload = {
      name,
      price_cents: priceCents,
      description,
      image_url: imageUrl || undefined,
    };

    startTransition(async () => {
      const result = existing
        ? await updateProductAction(existing.id, payload)
        : await addProductAction(payload);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onDone();
    });
  }

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-display text-[2rem] sm:text-[2.25rem] font-extrabold tracking-[-0.02em]">
        Add a Feature Product
      </h1>

      <ImageUploadField
        id="onboarding-product-image"
        label="Image (optional)"
        valueUrl={imageUrl}
        onFile={handleImage}
        onClear={() => setImageUrl("")}
        uploading={uploading}
        disabled={pending}
        emptyTitleMobile="Tap to add a photo"
        emptyTitleDesktop="Drop a photo or click to browse"
        hint="Recommended 1200×1200 or larger"
        objectFit="cover"
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="onboarding-product-name">Name</Label>
        <Input
          id="onboarding-product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Signature item"
          maxLength={80}
          disabled={pending}
          aria-invalid={fieldError === "name" || undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="onboarding-product-price">Price</Label>
        <Input
          id="onboarding-product-price"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="9.50"
          disabled={pending}
          aria-invalid={fieldError === "price" || undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="onboarding-product-description">Description</Label>
        <textarea
          id="onboarding-product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Materials, sizing, what is included…"
          maxLength={300}
          disabled={pending}
          rows={3}
          className="w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-3.5 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
        />
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={handleContinue}
        disabled={pending || uploading || !name.trim() || !price.trim()}
        className="rounded-full"
      >
        {pending ? "Saving…" : "Continue"}
      </Button>
    </section>
  );
}
