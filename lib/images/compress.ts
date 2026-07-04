/**
 * Client-side image downscale + compress before upload.
 * ponytail: canvas-based, no dependency; good enough for storefront photos.
 */

const MAX_DIMENSION = 1600;
const QUALITY = 0.82;

export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );
  if (!blob) throw new Error("Image compression failed");
  return blob;
}

/** Upload a compressed image to the store-images bucket. Returns public URL. */
export async function uploadStoreImage(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  userId: string,
  file: File,
  kind: "hero" | "product",
): Promise<string> {
  const blob = await compressImage(file);
  const path = `${userId}/${kind}-${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from("store-images")
    .upload(path, blob, { contentType: "image/webp", upsert: false });

  if (error) throw new Error("Upload failed. Try a smaller image.");

  const { data } = supabase.storage.from("store-images").getPublicUrl(path);
  return data.publicUrl;
}
