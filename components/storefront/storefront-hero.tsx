"use client";

import { HERO_BLOCKS, type HeroBlock, type HeroConfig } from "@/lib/stores/types";

type StorefrontHeroProps = {
  storeName: string;
  hero: Partial<HeroConfig>;
};

export function StorefrontHero({ storeName, hero }: StorefrontHeroProps) {
  const order: HeroBlock[] = hero.order?.length
    ? hero.order
    : [...HERO_BLOCKS];

  const blocks: Record<HeroBlock, React.ReactNode> = {
    eyebrow: hero.eyebrow ? (
      <p className="vibe-display text-xs tracking-[0.2em] text-vibe-primary uppercase">
        {hero.eyebrow}
      </p>
    ) : null,
    image: hero.image_url ? (
      <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.image_url}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-48 w-full object-cover sm:h-56"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vibe-bg/80 to-transparent" />
      </div>
    ) : null,
    title: (
      <h1 className="vibe-display font-display text-2xl font-bold tracking-wide uppercase sm:text-3xl lg:text-4xl">
        {hero.title || storeName}
      </h1>
    ),
    subheading: hero.subheading ? (
      <p className="max-w-md text-base leading-relaxed text-vibe-text-muted">
        {hero.subheading}
      </p>
    ) : null,
    cta: (
      <a
        href="#catalog"
        className="vibe-display inline-flex items-center justify-center rounded-[var(--vibe-radius)] bg-vibe-primary px-6 py-3 text-sm font-semibold text-vibe-primary-fg uppercase transition-transform active:scale-[0.98]"
      >
        {hero.cta || "Shop now"}
      </a>
    ),
  };

  return (
    <section className="flex flex-col gap-4 px-4 pt-6 pb-8 sm:px-6">
      {order.map((block, i) => {
        const node = blocks[block];
        if (!node) return null;
        return (
          <div
            key={block}
            className="animate-fade-up opacity-0"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
          >
            {node}
          </div>
        );
      })}
    </section>
  );
}
