"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  DEMO_CONCEPTS,
  getDemoConceptUrl,
} from "@/lib/marketing/demo-stores";
import { cn } from "@/lib/utils";

/** DaisyUI-inspired phone shell — bezel + dynamic island (pointer-events none). */
function PhoneBezel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-[min(300px,78vw)] rounded-[2.35rem] bg-[#1c1916] p-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:w-[300px] md:w-[280px]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute top-[18px] left-1/2 z-20 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-black"
        aria-hidden
      />
      <div className="relative aspect-[472/1024] overflow-hidden rounded-[1.85rem] bg-black">
        {children}
      </div>
    </div>
  );
}

function PhoneScreen({
  src,
  alt,
  scrollable,
  priority,
}: {
  src: string;
  alt: string;
  scrollable: boolean;
  priority?: boolean;
}) {
  if (scrollable) {
    return (
      <div
        className="h-full overflow-y-auto overscroll-contain touch-pan-y [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={430}
          height={2062}
          priority={priority}
          quality={90}
          className="h-auto w-full"
          sizes="(max-width: 640px) 78vw, 300px"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={430}
      height={2062}
      priority={priority}
      quality={90}
      className="h-full w-full object-cover object-top"
      sizes="(max-width: 640px) 78vw, 300px"
    />
  );
}

export function StoreTour() {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const concept = DEMO_CONCEPTS[index]!;
  const demoUrl = getDemoConceptUrl(concept.slug);

  useEffect(() => {
    if (!api) return;
    setIndex(api.selectedScrollSnap());
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="relative mx-auto w-full max-w-5xl px-2 sm:px-6">
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true }}
        className="w-full"
        aria-label="Demo storefronts"
      >
        <CarouselContent className="-ml-3 sm:-ml-5">
          {DEMO_CONCEPTS.map((c, i) => {
            const active = i === index;
            return (
              <CarouselItem
                key={c.id}
                className="basis-[92%] pl-3 sm:basis-[58%] sm:pl-5 md:basis-[48%] lg:basis-[40%]"
              >
                <div
                  className={cn(
                    "flex justify-center py-2 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:py-6",
                    active
                      ? "scale-100 opacity-100"
                      : "scale-[0.86] opacity-40",
                  )}
                >
                  <PhoneBezel>
                    <PhoneScreen
                      src={c.image}
                      alt={c.alt}
                      scrollable={c.scrollable}
                      priority={i === 0}
                    />
                  </PhoneBezel>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious
          variant="outline"
          className="left-0 size-10 border-[1.5px] border-foreground/25 bg-card text-foreground shadow-sm hover:border-foreground/45 hover:bg-foreground hover:text-white disabled:opacity-40 sm:left-1 sm:size-11 md:left-2"
        />
        <CarouselNext
          variant="outline"
          className="right-0 size-10 border-[1.5px] border-foreground/25 bg-card text-foreground shadow-sm hover:border-foreground/45 hover:bg-foreground hover:text-white disabled:opacity-40 sm:right-1 sm:size-11 md:right-2"
        />
      </Carousel>

      <div className="mt-6 flex justify-center sm:mt-8">
        <a
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-[#eab408]/55 bg-[#f7c518]/14 px-5 text-sm font-semibold text-[#9a7b00] backdrop-blur-sm transition-colors hover:border-[#eab408]/85 hover:bg-[#f7c518]/24 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f7c518]/40 active:scale-[0.97]"
        >
          {concept.demoCta}
        </a>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {concept.label}, {index + 1} of {DEMO_CONCEPTS.length}
      </p>
    </div>
  );
}
