const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Generate a unique order reference like ORD-8F3K2A */
export function generateOrderReference(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (const b of bytes) {
    suffix += REF_CHARS[b % REF_CHARS.length];
  }
  return `ORD-${suffix}`;
}
