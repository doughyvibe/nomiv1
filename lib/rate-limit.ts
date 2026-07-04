import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

// ponytail: in-memory per isolate — fine for MVP; upgrade to Cloudflare KV for prod scale
const buckets = new Map<string, Bucket>();

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Returns true if the request should be blocked. */
export async function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const ip = await getClientIp();
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(bucketKey);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > limit) return true;
  return false;
}

export const RATE_LIMIT_MESSAGE = "Too many requests. Please wait a moment and try again.";
