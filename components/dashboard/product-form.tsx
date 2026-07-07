"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStoreImage } from "@/lib/images/compress";
import { parsePriceToCents, type ProductInput } from "@/lib/products/validate";
import { createClient } from "@/lib/supabase/client";

type ProductFormProps = {
  initial?: Partial<ProductInput>;
  submitLabel: string;
  disabled?: boolean;
  onSubmit: (product: ProductInput) => Promise<{ error: string } | { success: true }>;
  onSuccess?: () => void;
};

export function ProductForm({
  initial,
  submitLabel,
  disabled = false,
  onSubmit,
  onSuccess,
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(
    initial?.price_cents != null
      ? (initial.price_cents / 100).toFixed(2)
      : "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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
      const url = await uploadStoreImage(supabase, user.id, file, "product");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    setError(null);
    const priceCents = parsePriceToCents(price);
    if (priceCents == null) {
      setError("Enter a valid price, e.g. 9.50");
      return;
    }

    startTransition(async () => {
      const result = await onSubmit({
        name,
        price_cents: priceCents,
        description,
        image_url: imageUrl || undefined,
        category: category || undefined,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onSuccess?.();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-name">Product name</Label>
        <Input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Black Gold Slayer"
          maxLength={80}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-price">Price (S$)</Label>
        <Input
          id="product-price"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="9.50"
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-image">Product image</Label>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="aspect-square w-24 rounded-md border object-cover"
          />
        ) : null}
        <Input
          id="product-image"
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files?.[0])}
          disabled={disabled || uploading}
        />
        {uploading && (
          <p className="text-muted-foreground text-xs">Uploading…</p>
        )}
        {imageUrl && !uploading && (
          <p className="text-xs text-emerald-600">Image ready</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-description">Description</Label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Matte black/gold jig for a wide erratic fall."
          maxLength={300}
          disabled={disabled}
          rows={3}
          className="w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm resize-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-category">Category (optional)</Label>
        <Input
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Metal Jigs"
          maxLength={40}
          disabled={disabled}
        />
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={handleSave}
        disabled={
          disabled || pending || uploading || !name.trim() || !price.trim()
        }
      >
        {pending ? "Saving…" : submitLabel}
      </Button>
    </div>
  );
}
