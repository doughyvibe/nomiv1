"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { saveTradeHint, saveVibe } from "@/app/(dashboard)/dashboard/onboarding/actions";
import { BrandCta } from "@/components/dashboard/dashboard-ui";
import { VibePicker } from "@/components/dashboard/vibe-picker";
import { TRADE_HINTS } from "@/lib/trade-hint";
import type { Store, TradeHint, Vibe } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export function StepVibe({
  store,
  onDone,
}: {
  store: Store;
  onDone: () => void;
}) {
  const router = useRouter();
  const [vibeReady, setVibeReady] = useState(Boolean(store.vibe));

  async function handleSave(vibe: Vibe) {
    const result = await saveVibe(vibe);
    if (!result.ok) return { error: result.error };
    setVibeReady(true);
    return { success: true as const };
  }

  async function handleTradeHint(hint: TradeHint) {
    await saveTradeHint(hint);
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-[-0.02em]">
          Choose your storefront vibe
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Swipe through styles and pick the one that matches your brand. This
          only affects your public storefront — your dashboard stays the same.
        </p>
      </div>

      {/* Save vibe without auto-advancing — seller can compare + set trade hint first */}
      <VibePicker store={store} onSaveVibe={handleSave} />

      <div className="flex flex-col gap-2 border-t border-border pt-5">
        <p className="text-sm font-medium" id="onboarding-trade-hint">
          What do you sell?
        </p>
        <p className="text-muted-foreground text-xs">
          Optional — helps suggest product categories later.
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="onboarding-trade-hint"
        >
          {TRADE_HINTS.map((hint) => (
            <button
              key={hint.id}
              type="button"
              aria-pressed={store.trade_hint === hint.id}
              onClick={() => handleTradeHint(hint.id)}
              className={cn(
                "min-h-10 rounded-full border px-3 py-2 text-left text-xs transition-colors",
                store.trade_hint === hint.id
                  ? "border-foreground bg-primary text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30",
              )}
            >
              <span className="font-semibold">{hint.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BrandCta
        type="button"
        disabled={!vibeReady}
        onClick={onDone}
        className="w-full disabled:opacity-50"
      >
        Continue setup
      </BrandCta>
    </section>
  );
}
