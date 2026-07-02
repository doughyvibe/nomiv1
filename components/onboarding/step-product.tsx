"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { addProduct } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStoreImage } from "@/lib/images/compress";
import type { Product } from "@/lib/stores/types";
import { createClient } from "@/lib/supabase/client";

export function StepProduct({
  products,
  onDone,
}: {
  products: Product[];
  onDone: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
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

  function resetForm() {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImageUrl("");
  }

  function handleSave() {
    setError(null);
    const priceValue = Number.parseFloat(price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setError("Enter a valid price, e.g. 9.50");
      return;
    }

    startTransition(async () => {
      const result = await addProduct({
        name,
        price_cents: Math.round(priceValue * 100),
        description,
        image_url: imageUrl || undefined,
        category: category || undefined,
      });
      if (result.ok) {
        setJustAdded(true);
        resetForm();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  const hasProducts = products.length > 0;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">
          {hasProducts ? "Add another product" : "Add your first product"}
        </h1>
        <p className="mt-1 text-sm text-dashboard-muted">
          You can publish with one product and add more anytime.
        </p>
      </div>

      {hasProducts && (
        <div className="rounded-md border border-dashboard-border p-3">
          <p className="text-sm font-medium">
            {justAdded ? "Product added." : `${products.length} product${products.length > 1 ? "s" : ""} so far`}
          </p>
          <ul className="mt-1 text-sm text-dashboard-muted">
            {products.map((p) => (
              <li key={p.id}>
                {p.name} — S${(p.price_cents / 100).toFixed(2)}
                {p.category ? ` · ${p.category}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="product-name">Product name</Label>
          <Input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Black Gold Slayer"
            maxLength={80}
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
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product-image">Product image</Label>
          <Input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files?.[0])}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-xs text-dashboard-muted">Uploading…</p>
          )}
          {imageUrl && !uploading && (
            <p className="text-xs text-green-600">✓ Image uploaded</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product-description">Description</Label>
          <Input
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Matte black/gold jig for a wide erratic fall."
            maxLength={300}
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
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSave}
          disabled={pending || uploading || !name.trim() || !price.trim()}
          variant={hasProducts ? "outline" : "default"}
        >
          {pending
            ? "Saving…"
            : hasProducts
              ? "Add another product"
              : "Save product"}
        </Button>
        {hasProducts && (
          <Button onClick={onDone}>Continue setup</Button>
        )}
      </div>
    </section>
  );
}
