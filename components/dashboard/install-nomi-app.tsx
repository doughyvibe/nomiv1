"use client";

import { useEffect, useState } from "react";
import { Check, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  detectInstallBrowser,
  isStandaloneDisplay,
  type InstallBrowserHint,
} from "@/lib/pwa/install";
import { registerPushServiceWorker } from "@/lib/push/client";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Install Nomi onto the home screen.
 * Layout leaves room for later notification status / device management sections.
 */
export function InstallNomiApp() {
  const [hydrated, setHydrated] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [browser, setBrowser] = useState<InstallBrowserHint>("unknown");

  useEffect(() => {
    setInstalled(isStandaloneDisplay());
    setBrowser(detectInstallBrowser());
    setHydrated(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Register SW so Chromium can offer the install prompt on this page.
    if (window.isSecureContext && "serviceWorker" in navigator) {
      void registerPushServiceWorker().catch(() => {
        /* ignore — instructions still available */
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!promptEvent) return;
    setInstalling(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
    } finally {
      setInstalling(false);
    }
  }

  const canInstall = hydrated && !installed && Boolean(promptEvent);

  return (
    <div className="flex flex-col gap-5">
      {/* Install status + primary CTA */}
      <section className="dashboard-panel">
        <div className="border-b border-border px-6 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <span className="bg-primary/20 text-foreground mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Smartphone className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold">
                Install Nomi on your phone
              </h2>
              <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                Manage your store anywhere and receive instant notifications
                whenever a new order comes in.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 sm:px-7 sm:py-6">
          {hydrated && installed ? (
            <div
              className="flex items-start gap-3 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300"
              role="status"
            >
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p className="font-medium">
                Nomi is already installed on this device.
              </p>
            </div>
          ) : canInstall ? (
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto"
              disabled={installing}
              onClick={() => void handleInstall()}
            >
              {installing ? "Installing…" : "Install Nomi"}
            </Button>
          ) : hydrated ? (
            <p className="text-muted-foreground text-sm">
              Installation isn&apos;t available from this browser. Use the steps
              below to add Nomi to your home screen.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Checking…</p>
          )}
        </div>
      </section>

      {/* Manual instructions — always available as fallback */}
      {!installed ? (
        <section className="dashboard-panel">
          <div className="border-b border-border px-6 py-5 sm:px-7">
            <h2 className="font-display text-xl font-bold">Need help?</h2>
            <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
              If installation isn&apos;t available, follow the instructions
              below.
            </p>
          </div>
          <div className="flex flex-col gap-6 px-6 py-5 sm:px-7 sm:py-6">
            <InstallSteps
              title="iPhone"
              steps={[
                "Tap the Share button.",
                'Select "Add to Home Screen".',
                "Tap Add.",
              ]}
              highlighted={browser === "ios"}
            />
            <InstallSteps
              title="Android"
              steps={[
                "Open the browser menu.",
                'Tap "Install app" or "Add to Home screen".',
                "Confirm installation.",
              ]}
              highlighted={browser === "android"}
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Once installed, open Nomi from your home screen for the best
              experience.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InstallSteps({
  title,
  steps,
  highlighted,
}: {
  title: string;
  steps: string[];
  highlighted: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-4",
        highlighted
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-transparent",
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
