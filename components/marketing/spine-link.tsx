"use client";

import { useCallback } from "react";

import { cn } from "@/lib/utils";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Carrd-like slow scroll with easing to an in-page anchor. */
function scrollToHash(hash: string, durationMs = 1100) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const marginTop = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const top = el.getBoundingClientRect().top + window.scrollY - marginTop;
  if (reduce || durationMs <= 0) {
    window.scrollTo(0, top);
    return;
  }

  const start = window.scrollY;
  const delta = top - start;
  const t0 = performance.now();

  function frame(now: number) {
    const t = Math.min(1, (now - t0) / durationMs);
    window.scrollTo(0, start + delta * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

export function SpineLink({
  label,
  href,
  accent = false,
}: {
  label: string;
  href: `#${string}`;
  /** Purple treatment for the primary curiosity CTA */
  accent?: boolean;
}) {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollToHash(href);
      history.pushState(null, "", href);
    },
    [href],
  );

  return (
    <div className="flex flex-col items-center pt-16 pb-4 sm:pt-20">
      <a
        href={href}
        onClick={onClick}
        className={cn(
          "inline-flex min-h-11 items-center rounded-full border-[1.5px] px-5 text-sm font-semibold backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-3",
          accent
            ? "border-[#7c36e0]/45 bg-[#7c36e0]/8 text-[#7c36e0] hover:border-[#7c36e0]/70 hover:bg-[#7c36e0]/14 focus-visible:ring-[#7c36e0]/35"
            : "border-foreground/25 bg-card/70 text-foreground hover:border-foreground/40 focus-visible:ring-ring/50",
        )}
      >
        {label}
      </a>
      <div
        className={cn(
          "mt-3 h-16 w-px bg-gradient-to-b to-transparent sm:h-24",
          accent ? "from-[#7c36e0]/45" : "from-foreground/40",
        )}
        aria-hidden
      />
    </div>
  );
}
