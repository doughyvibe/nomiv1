/** Decode URL-safe base64 VAPID key for PushManager.subscribe(). */
export function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Url = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Url);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export type PushSubscriptionPayload = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export function isPushSupported(): boolean {
  return getPushAvailability().ok;
}

export type PushAvailability =
  | { ok: true }
  | { ok: false; reason: "insecure" | "unsupported" };

/** Why push may be unavailable in this browser tab. */
export function getPushAvailability(): PushAvailability {
  if (typeof window === "undefined") {
    return { ok: false, reason: "unsupported" };
  }
  if (!window.isSecureContext) {
    return { ok: false, reason: "insecure" };
  }
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return { ok: false, reason: "unsupported" };
  }
  return { ok: true };
}

export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration> {
  const reg = await navigator.serviceWorker.register("/push-sw.js", {
    scope: "/",
  });
  await navigator.serviceWorker.ready;
  return reg;
}

export async function getBrowserPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

export async function subscribeBrowserPush(
  vapidPublicKey: string,
): Promise<PushSubscriptionPayload> {
  const reg = await registerPushServiceWorker();
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted");
  }

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    });
  }

  const json = sub.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Invalid push subscription from browser");
  }

  return {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  };
}

export async function unsubscribeBrowserPush(): Promise<string | null> {
  const sub = await getBrowserPushSubscription();
  if (!sub) return null;
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  return endpoint;
}
