"use client";

import { useEffect, useState, useTransition } from "react";

import {
  removeAllPushSubscriptionsAction,
  removePushSubscriptionAction,
  savePushSubscriptionAction,
} from "@/app/(dashboard)/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import {
  getBrowserPushSubscription,
  getPushAvailability,
  subscribeBrowserPush,
  unsubscribeBrowserPush,
} from "@/lib/push/client";

type PushAlertsSettingsProps = {
  vapidPublicKey: string | null;
  serverSubscriptionCount: number;
};

export function PushAlertsSettings({
  vapidPublicKey,
  serverSubscriptionCount,
}: PushAlertsSettingsProps) {
  const [availability, setAvailability] = useState<
    ReturnType<typeof getPushAvailability> | null
  >(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [browserSubscribed, setBrowserSubscribed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"success" | "error" | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setAvailability(getPushAvailability());
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    void getBrowserPushSubscription().then((sub) => {
      setBrowserSubscribed(Boolean(sub));
    });
  }, []);

  const enabled = serverSubscriptionCount > 0 && browserSubscribed;

  function handleEnable() {
    if (!vapidPublicKey) return;
    setMessage(null);
    setMessageKind(null);
    startTransition(async () => {
      try {
        const sub = await subscribeBrowserPush(vapidPublicKey);
        const result = await savePushSubscriptionAction(sub);
        if ("error" in result) {
          setMessage(result.error);
          setMessageKind("error");
          return;
        }
        setPermission(Notification.permission);
        setBrowserSubscribed(true);
        setMessage("Order alerts enabled on this device.");
        setMessageKind("success");
      } catch {
        setMessage("Could not enable alerts. Check browser permissions.");
        setMessageKind("error");
      }
    });
  }

  function handleDisable() {
    setMessage(null);
    setMessageKind(null);
    startTransition(async () => {
      try {
        const endpoint = await unsubscribeBrowserPush();
        if (endpoint) {
          await removePushSubscriptionAction(endpoint);
        } else {
          await removeAllPushSubscriptionsAction();
        }
        setBrowserSubscribed(false);
        setMessage("Order alerts disabled.");
        setMessageKind("success");
      } catch {
        setMessage("Could not disable alerts. Try again.");
        setMessageKind("error");
      }
    });
  }

  if (!vapidPublicKey) {
    return (
      <p className="text-muted-foreground text-sm">
        Push alerts are not configured on this server. Add{" "}
        <code className="text-xs">NEXT_PUBLIC_VAPID_PUBLIC_KEY</code> to enable
        (see docs/whiteboard.md).
      </p>
    );
  }

  if (!availability) {
    return (
      <p className="text-muted-foreground text-sm">Checking notification support…</p>
    );
  }

  if (!availability.ok) {
    if (availability.reason === "insecure") {
      return (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground">
            Push alerts need a <strong>secure context</strong> (HTTPS).{" "}
            <code className="text-xs">http://app.lvh.me</code> is not secure,
            so Chrome hides push APIs — this is not a browser compatibility
            issue.
          </p>
          <p className="text-muted-foreground">
            <strong>Local dev workaround:</strong> open{" "}
            <a
              href="http://app.localhost:3000/settings"
              className="text-primary font-medium underline"
            >
              app.localhost:3000/settings
            </a>{" "}
            instead. Browsers treat <code className="text-xs">*.localhost</code>{" "}
            as secure over HTTP.
          </p>
          <p className="text-muted-foreground text-xs">
            Production on HTTPS works normally. The orders dashboard badge still
            works without push.
          </p>
        </div>
      );
    }

    return (
      <p className="text-muted-foreground text-sm">
        Your browser does not support push notifications.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">Order alerts</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {enabled
              ? "Alerts enabled on this device"
              : permission === "denied"
                ? "Notifications blocked in browser settings"
                : "Get notified when a buyer requests payment verification"}
          </p>
        </div>
        <span
          className={
            enabled
              ? "rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              : "bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-medium"
          }
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {permission === "denied" ? (
        <p className="text-muted-foreground text-xs">
          Unblock notifications for this site in your browser, then reload this
          page.
        </p>
      ) : enabled ? (
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={handleDisable}
        >
          {pending ? "Updating…" : "Disable order alerts"}
        </Button>
      ) : (
        <Button type="button" disabled={pending} onClick={handleEnable}>
          {pending ? "Enabling…" : "Enable order alerts"}
        </Button>
      )}

      {serverSubscriptionCount > 1 && (
        <p className="text-muted-foreground text-xs">
          {serverSubscriptionCount} devices registered for your account.
        </p>
      )}

      {message && (
        <p
          className={
            messageKind === "error"
              ? "text-destructive text-sm"
              : "text-sm text-emerald-700 dark:text-emerald-400"
          }
          role="status"
        >
          {message}
        </p>
      )}

      <p className="text-muted-foreground text-xs">
        Optional — the orders dashboard always shows pending verification even
        without push alerts.
      </p>
    </div>
  );
}
