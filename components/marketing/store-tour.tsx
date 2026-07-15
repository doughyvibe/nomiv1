"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  DEMO_CONCEPTS,
  getDemoConceptUrl,
} from "@/lib/marketing/demo-stores";
import { cn } from "@/lib/utils";

type Phase = "idle" | "exit" | "enter";

export function StoreTour() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [dir, setDir] = useState<1 | -1>(1);
  const busy = useRef(false);
  const count = DEMO_CONCEPTS.length;
  const concept = DEMO_CONCEPTS[index]!;
  const demoUrl = getDemoConceptUrl(concept.slug);

  const go = useCallback(
    (next: number, direction: 1 | -1) => {
      const wrapped = ((next % count) + count) % count;
      if (wrapped === index || busy.current) return;
      busy.current = true;
      setDir(direction);
      setPhase("exit");
      window.setTimeout(() => {
        setIndex(wrapped);
        setPhase("enter");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase("idle");
            busy.current = false;
          });
        });
      }, 280);
    },
    [count, index],
  );

  const prev = useCallback(() => go(index - 1, -1), [go, index]);
  const next = useCallback(() => go(index + 1, 1), [go, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const [touchX, setTouchX] = useState<number | null>(null);

  // next (+1): exit left, enter from right · prev (-1): exit right, enter from left
  const slideClass =
    phase === "idle"
      ? "translate-x-0 scale-100 opacity-100"
      : phase === "exit"
        ? dir === 1
          ? "-translate-x-[18%] scale-[0.96] opacity-0"
          : "translate-x-[18%] scale-[0.96] opacity-0"
        : dir === 1
          ? "translate-x-[18%] scale-[0.96] opacity-0"
          : "-translate-x-[18%] scale-[0.96] opacity-0";

  return (
    <div
      className="relative mx-auto w-full max-w-4xl px-2 sm:px-6"
      role="region"
      aria-roledescription="carousel"
      aria-label="Demo storefronts"
    >
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous store"
          className="absolute left-0 z-20 flex size-10 items-center justify-center rounded-full border-[1.5px] border-foreground/25 bg-card text-foreground shadow-sm transition-colors hover:border-foreground/45 hover:bg-foreground hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:left-2 sm:size-11"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <div
          className="relative w-full max-w-[260px] overflow-hidden sm:max-w-[300px]"
          onTouchStart={(e) => setTouchX(e.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            if (touchX == null) return;
            const x = e.changedTouches[0]?.clientX;
            if (x == null) return;
            const dx = x - touchX;
            if (Math.abs(dx) > 48) {
              if (dx > 0) prev();
              else next();
            }
            setTouchX(null);
          }}
        >
          <div
            className={cn(
              "relative w-full will-change-transform",
              phase === "exit"
                ? "transition-[transform,opacity] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                : phase === "enter"
                  ? "transition-none"
                  : "transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              slideClass,
            )}
          >
            <Image
              src={concept.image}
              alt={concept.alt}
              width={1160}
              height={2276}
              priority={index === 0}
              className="h-auto w-full drop-shadow-[0_28px_50px_rgba(22,19,14,0.22)]"
              sizes="(max-width: 640px) 260px, 300px"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next store"
          className="absolute right-0 z-20 flex size-10 items-center justify-center rounded-full border-[1.5px] border-foreground/25 bg-card text-foreground shadow-sm transition-colors hover:border-foreground/45 hover:bg-foreground hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:right-2 sm:size-11"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div className="mt-4 flex justify-center sm:mt-5">
        <a
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-[#eab408]/55 bg-[#f7c518]/14 px-5 text-sm font-semibold text-[#9a7b00] backdrop-blur-sm transition-colors hover:border-[#eab408]/85 hover:bg-[#f7c518]/24 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f7c518]/40 active:scale-[0.97]"
        >
          View Demo Store
        </a>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {concept.label}, {index + 1} of {count}
      </p>
    </div>
  );
}
