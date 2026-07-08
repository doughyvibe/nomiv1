"use client";

import { useRouter } from "next/navigation";

import { saveTradeHint, saveVibe } from "@/app/(dashboard)/dashboard/onboarding/actions";
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

  async function handleSave(vibe: Vibe) {
    const result = await saveVibe(vibe);
    if (!result.ok) return { error: result.error };
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

      <VibePicker store={store} onSaveVibe={handleSave} onSuccess={onDone} />

      <div className="flex flex-col gap-2 border-t border-border pt-5">
        <p className="text-sm font-medium">What do you sell?</p>
        <p className="text-muted-foreground text-xs">
          Optional — helps suggest product categories later.
        </p>
        <div className="flex flex-wrap gap-2">
          {TRADE_HINTS.map((hint) => (
            <button
              key={hint.id}
              type="button"
              onClick={() => handleTradeHint(hint.id)}
              className={cn(
                "rounded-full border px-3 py-2 text-left text-xs transition-colors min-h-10",
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
    </section>
  );
}
