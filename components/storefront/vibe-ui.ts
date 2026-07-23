import type { Vibe } from "@/lib/stores/types";
import { cn } from "@/lib/utils";

export type VibeFlags = {
  atelier: boolean;
  expedition: boolean;
  cyberpunk: boolean;
  candyland: boolean;
  market: boolean;
  gallery: boolean;
  studio: boolean;
  laura: boolean;
  atlantic: boolean;
  vows: boolean;
  strada: boolean;
  epicurean: boolean;
};

export function vibeFlags(vibe: Vibe | null | undefined): VibeFlags {
  const v = vibe ?? "strada";
  return {
    atelier: v === "atelier",
    expedition: v === "expedition",
    cyberpunk: v === "cyberpunk",
    candyland: v === "candyland",
    market: v === "market",
    gallery: v === "gallery",
    studio: v === "studio",
    laura: v === "laura",
    atlantic: v === "atlantic",
    vows: v === "vows",
    strada: v === "strada",
    epicurean: v === "epicurean",
  };
}

function vibePrefixed(f: VibeFlags, prefix: string, suffix: string): string {
  return cn(
    f.atelier && `${prefix}-atelier-${suffix}`,
    f.expedition && `${prefix}-expedition-${suffix}`,
    f.cyberpunk && `${prefix}-cyberpunk-${suffix}`,
    f.candyland && `${prefix}-candyland-${suffix}`,
    f.market && `${prefix}-market-${suffix}`,
    f.gallery && `${prefix}-gallery-${suffix}`,
    f.studio && `${prefix}-studio-${suffix}`,
    f.laura && `${prefix}-laura-${suffix}`,
    f.atlantic && `${prefix}-atlantic-${suffix}`,
    f.vows && `${prefix}-vows-${suffix}`,
    f.strada && `${prefix}-strada-${suffix}`,
    f.epicurean && `${prefix}-epicurean-${suffix}`,
  );
}

export function cartTitleClass(f: VibeFlags) {
  return cn("font-display text-vibe-text", vibePrefixed(f, "cart", "title"));
}

export function cartBackClass(f: VibeFlags) {
  return cn(
    "inline-flex min-h-11 items-center gap-1.5 text-sm text-vibe-text-muted",
    vibePrefixed(f, "cart", "back"),
  );
}

export function cartCtaClass(f: VibeFlags) {
  return cn(
    "flex w-full items-center justify-center rounded-[var(--vibe-radius)] bg-vibe-primary py-3.5 text-base font-semibold text-vibe-primary-fg transition-transform active:scale-[0.98]",
    vibePrefixed(f, "cart", "cta"),
  );
}

export function cartLineClass(f: VibeFlags) {
  return cn("metal-panel rust-edge", vibePrefixed(f, "cart", "line"));
}

export function cartThumbClass(f: VibeFlags) {
  return cn("size-14 shrink-0 rounded object-cover", vibePrefixed(f, "cart", "thumb"));
}

export function cartNameClass(f: VibeFlags) {
  return cn("truncate font-display text-vibe-text", vibePrefixed(f, "cart", "name"));
}

export function cartPriceClass(f: VibeFlags) {
  return cn("shrink-0 tabular-nums text-vibe-text", vibePrefixed(f, "cart", "price"));
}

export function cartQtyBtnClass(f: VibeFlags) {
  return cn(
    "flex size-9 items-center justify-center rounded-[var(--vibe-radius)] ring-1 ring-vibe-border/35",
    vibePrefixed(f, "cart", "qty-btn"),
  );
}

export function cartRemoveClass(f: VibeFlags) {
  return cn(
    "text-xs text-vibe-text-muted underline underline-offset-2",
    vibePrefixed(f, "cart", "remove"),
  );
}

export function cartSubtotalClass(f: VibeFlags) {
  return cn("metal-panel rust-edge", vibePrefixed(f, "cart", "subtotal"));
}

export function cartSubtotalLabelClass(f: VibeFlags) {
  return cn("text-sm text-vibe-text-muted", vibePrefixed(f, "cart", "subtotal-label"));
}

export function cartSubtotalValueClass(f: VibeFlags) {
  return cn(
    "font-display text-lg font-semibold tabular-nums text-vibe-text",
    vibePrefixed(f, "cart", "subtotal-value"),
  );
}

export function checkoutSectionLabelClass(f: VibeFlags) {
  return cn(
    "text-xs font-semibold tracking-wide text-vibe-text-muted uppercase",
    vibePrefixed(f, "checkout", "section-label"),
  );
}

export function cartEmptyTitleClass(f: VibeFlags) {
  return cn("font-display text-vibe-text", vibePrefixed(f, "cart", "empty-title"));
}
