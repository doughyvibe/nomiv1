/** Client-safe VAPID public key (server sends pushes in Task 5.4). */
export function getVapidPublicKey(): string | null {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  return key || null;
}

/** Server-only VAPID private key. Never import in client components. */
export function getVapidPrivateKey(): string | null {
  const key = process.env.VAPID_PRIVATE_KEY?.trim();
  return key || null;
}

export function getVapidSubject(): string {
  return (
    process.env.VAPID_SUBJECT?.trim() ?? "mailto:notifications@nomi.local"
  );
}

export function isPushConfigured(): boolean {
  return Boolean(getVapidPublicKey());
}

export function isPushSendConfigured(): boolean {
  return Boolean(getVapidPublicKey() && getVapidPrivateKey());
}
