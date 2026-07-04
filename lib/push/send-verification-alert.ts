import webpush from "web-push";

import { getDashboardUrl } from "@/lib/host";
import { formatPrice } from "@/lib/money";
import { createAdminClient } from "@/lib/supabase/admin";

import { listPushSubscriptionsForUser } from "./subscriptions";
import {
  getVapidPrivateKey,
  getVapidPublicKey,
  getVapidSubject,
} from "./vapid";

const GONE_STATUS = new Set([404, 410]);

export type VerificationPushInput = {
  ownerId: string;
  reference: string;
  totalCents: number;
};

/** Best-effort seller alert; never throws (Task 5.4). */
export async function sendVerificationRequestPush(
  input: VerificationPushInput,
): Promise<void> {
  try {
    const publicKey = getVapidPublicKey();
    const privateKey = getVapidPrivateKey();
    if (!publicKey || !privateKey) return;

    webpush.setVapidDetails(getVapidSubject(), publicKey, privateKey);

    const admin = createAdminClient();
    const subs = await listPushSubscriptionsForUser(admin, input.ownerId);
    if (subs.length === 0) return;

    const payload = JSON.stringify({
      title: "New order awaiting verification",
      body: `${input.reference} · ${formatPrice(input.totalCents)}`,
      url: getDashboardUrl(`/orders/${input.reference}`),
    });

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth_key },
          },
          payload,
        );
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status && GONE_STATUS.has(status)) {
          await admin.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    }
  } catch {
    // ponytail: push is optional; never block buyer notify on send failure
  }
}
