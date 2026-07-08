"use client";

import type { HeroConfig, Vibe } from "@/lib/stores/types";

type StorefrontHeroProps = {
  storeName: string;
  hero: Partial<HeroConfig>;
  vibe?: Vibe | "industrial";
};

function Monogram({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className="flex size-14 items-center justify-center rounded-full border border-vibe-border/30 bg-vibe-surface font-display text-xl font-bold text-vibe-primary md:size-16 md:text-2xl"
      aria-hidden
    >
      {letter}
    </div>
  );
}

function isNoirVibe(vibe: Vibe | "industrial" | undefined): boolean {
  return vibe === "epicurean" || vibe === "industrial";
}

function NoirHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero flex flex-col items-center px-5 pb-8 pt-10 text-center sm:px-6">
      {hero.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.logo_url}
          alt=""
          className="mb-4 size-14 rounded-full object-cover md:size-16"
        />
      ) : null}

      {eyebrow ? (
        <p className="hero-noir-eyebrow mb-2 text-balance">{eyebrow}</p>
      ) : null}

      <h1 className="hero-noir-title text-balance">{title}</h1>

      {tagline ? (
        <p className="hero-noir-tagline mt-4 text-balance">{tagline}</p>
      ) : null}
    </section>
  );
}

function DefaultHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  return (
    <section className="flex flex-col items-center gap-4 px-5 pb-10 pt-8 text-center sm:px-6 md:gap-5 md:pb-12 md:pt-12">
      {hero.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.logo_url}
          alt=""
          className="size-14 rounded-full object-cover md:size-16"
        />
      ) : (
        <Monogram name={title} />
      )}

      {hero.eyebrow?.trim() ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-vibe-text-muted">
          {hero.eyebrow}
        </p>
      ) : null}

      <h1 className="font-display text-balance text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tight text-vibe-primary">
        {title}
      </h1>

      {hero.subheading?.trim() ? (
        <p className="max-w-lg text-base leading-relaxed text-vibe-text-muted md:text-lg">
          {hero.subheading}
        </p>
      ) : null}
    </section>
  );
}

export function StorefrontHero({
  storeName,
  hero,
  vibe = "epicurean",
}: StorefrontHeroProps) {
  const title = hero.title?.trim() || storeName;

  if (isNoirVibe(vibe)) {
    return <NoirHero title={title} hero={hero} />;
  }

  return <DefaultHero title={title} hero={hero} />;
}
