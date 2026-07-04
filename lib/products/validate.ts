export type ProductInput = {
  name: string;
  price_cents: number;
  description: string;
  image_url?: string;
  category?: string;
};

export function validateProductInput(product: ProductInput): string | null {
  const name = product.name.trim();
  if (!name) return "Product name is required";
  if (
    !Number.isInteger(product.price_cents) ||
    product.price_cents < 0 ||
    product.price_cents > 100_000_00
  ) {
    return "Enter a valid price";
  }
  return null;
}

export function parsePriceToCents(price: string): number | null {
  const value = Number.parseFloat(price);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}
