import { cn } from "@/lib/utils";
import type { HeroLogoSize, HeroLogoStyle } from "@/lib/stores/types";

export function resolveLogoSize(
  size: HeroLogoSize | undefined,
): HeroLogoSize {
  return size === "s" || size === "l" ? size : "m";
}

export function resolveLogoStyle(
  style: HeroLogoStyle | undefined,
): HeroLogoStyle {
  return style === "rounded" || style === "circle" ? style : "plain";
}

/** Shared storefront + preview classes — contain never crops the mark. */
export function heroLogoClassName(
  size: HeroLogoSize | undefined,
  style: HeroLogoStyle | undefined,
  opts?: { preview?: boolean },
): string {
  const s = resolveLogoSize(size);
  const st = resolveLogoStyle(style);
  const preview = opts?.preview;

  return cn(
    "hero-logo object-contain",
    preview ? "hero-logo-preview" : null,
    s === "s" && "hero-logo-s",
    s === "m" && "hero-logo-m",
    s === "l" && "hero-logo-l",
    st === "plain" && "hero-logo-plain",
    st === "rounded" && "hero-logo-rounded",
    st === "circle" && "hero-logo-circle",
  );
}
