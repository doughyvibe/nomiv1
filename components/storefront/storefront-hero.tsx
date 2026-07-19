"use client";

import type { HeroConfig, Vibe } from "@/lib/stores/types";
import { heroLogoClassName } from "@/lib/stores/hero-logo";

type StorefrontHeroProps = {
  storeName: string;
  hero: Partial<HeroConfig>;
  vibe?: Vibe | "industrial" | "unicorn" | "outback" | "futuristic";
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

function HeroLogo({
  url,
  alt,
  size,
  style,
}: {
  url: string;
  alt: string;
  size: HeroConfig["logo_size"];
  style: HeroConfig["logo_style"];
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={heroLogoClassName(size, style)}
    />
  );
}

function isNoirVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "epicurean" || vibe === "industrial";
}

function isAtelierVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "atelier" || vibe === "unicorn";
}

function isExpeditionVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "expedition" || vibe === "outback";
}

function isCyberpunkVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "cyberpunk" || vibe === "futuristic";
}

function isCandylandVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "candyland";
}

function isMarketVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "market";
}

function isGalleryVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "gallery";
}

function isStudioVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "studio";
}

function isLauraVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "laura";
}

function isStradaVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "strada";
}

function isAtlanticVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "atlantic";
}

function isVowsVibe(
  vibe: Vibe | "industrial" | "unicorn" | "outback" | "futuristic" | undefined,
): boolean {
  return vibe === "vows";
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
        <div className="mb-4">
          <HeroLogo
            url={hero.logo_url}
            alt={title}
            size={hero.logo_size}
            style={hero.logo_style}
          />
        </div>
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

/** Atelier: logo optional; no monogram; no cover/CTA (product locks). */
function AtelierHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero flex flex-col items-center px-5 pb-10 pt-10 text-center sm:px-6 md:pb-14 md:pt-14">
      {hero.logo_url ? (
        <div className="mb-6">
          <HeroLogo
            url={hero.logo_url}
            alt={title}
            size={hero.logo_size}
            style={hero.logo_style}
          />
        </div>
      ) : null}

      {eyebrow ? (
        <p className="hero-atelier-eyebrow mb-3 text-balance">{eyebrow}</p>
      ) : null}

      <h1 className="hero-atelier-title text-balance">{title}</h1>

      {tagline ? (
        <>
          <div className="hero-atelier-rule my-6" aria-hidden />
          <p className="hero-atelier-tagline text-balance">{tagline}</p>
        </>
      ) : null}
    </section>
  );
}

/** Expedition: heavy wordmark, yellow-ruled eyebrow; no cover/CTA. */
function ExpeditionHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero flex flex-col items-start px-5 pb-8 pt-10 text-left sm:px-6 md:pb-12 md:pt-14">
      {hero.logo_url ? (
        <div className="mb-5">
          <HeroLogo
            url={hero.logo_url}
            alt={title}
            size={hero.logo_size}
            style={hero.logo_style}
          />
        </div>
      ) : null}

      {eyebrow ? (
        <p className="hero-expedition-eyebrow mb-4 text-balance">{eyebrow}</p>
      ) : null}

      <h1 className="hero-expedition-title text-balance">{title}</h1>

      {tagline ? (
        <p className="hero-expedition-tagline mt-4 text-balance">{tagline}</p>
      ) : null}
    </section>
  );
}

/** Cyberpunk: cyan eyebrow, Orbitron wordmark; no cover/CTA. */
function CyberpunkHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero flex flex-col items-center px-5 pb-8 pt-10 text-center sm:px-6 md:pb-12 md:pt-14">
      {hero.logo_url ? (
        <div className="mb-5">
          <HeroLogo
            url={hero.logo_url}
            alt={title}
            size={hero.logo_size}
            style={hero.logo_style}
          />
        </div>
      ) : null}

      {eyebrow ? (
        <p className="hero-cyberpunk-eyebrow mb-3 text-balance">{eyebrow}</p>
      ) : null}

      <h1 className="hero-cyberpunk-title text-balance">{title}</h1>

      {tagline ? (
        <p className="hero-cyberpunk-tagline mt-4 text-balance">{tagline}</p>
      ) : null}
    </section>
  );
}

/** Candyland: white-stage wordmark + lime rule; no cover/CTA/monogram. */
function CandylandHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-candyland-band mb-3 md:mb-4">
      <div className="hero-candyland-inner flex flex-col items-center px-5 py-10 text-center sm:px-6 md:py-12">
        {hero.logo_url ? (
          <div className="mb-5">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-candyland-eyebrow mb-4 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-candyland-title text-balance">{title}</h1>
        <div className="hero-candyland-rule" aria-hidden />

        {tagline ? (
          <p className="hero-candyland-tagline mt-4 text-balance">{tagline}</p>
        ) : null}
      </div>
    </section>
  );
}

/** Market: rich peach brand band (FLAURA-style lockup); no cover/CTA/monogram. */
function MarketHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-market-band mb-6 md:mb-8">
      <div className="hero-market-inner flex flex-col items-center px-5 py-12 text-center sm:px-6 md:py-16">
        {hero.logo_url ? (
          <div className="hero-market-logo-wrap mb-5">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-market-eyebrow mb-3 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-market-title text-balance">{title}</h1>

        {tagline ? (
          <>
            <div className="hero-market-rule my-4" aria-hidden />
            <p className="hero-market-tagline text-balance">{tagline}</p>
          </>
        ) : null}
      </div>
    </section>
  );
}

/** Gallery: white-cube wordmark; no cover/CTA/monogram. */
function GalleryHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-gallery-band mb-8 md:mb-12">
      <div className="flex flex-col items-center px-5 py-14 text-center sm:px-6 md:py-20">
        {hero.logo_url ? (
          <div className="mb-6">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-gallery-eyebrow mb-4 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-gallery-title text-balance">{title}</h1>

        {tagline ? (
          <p className="hero-gallery-tagline mt-5 text-balance">{tagline}</p>
        ) : null}
      </div>
    </section>
  );
}

/** Studio: loud magazine wordmark; no cover/CTA/monogram. */
function StudioHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-studio-band mb-10 md:mb-14">
      <div className="hero-studio-inner flex flex-col items-start px-5 py-14 text-left sm:px-6 md:px-8 md:py-20">
        {hero.logo_url ? (
          <div className="mb-6">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-studio-eyebrow mb-4 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-studio-title text-balance">{title}</h1>

        {tagline ? (
          <p className="hero-studio-tagline mt-6 text-balance">{tagline}</p>
        ) : null}
      </div>
    </section>
  );
}

/** Laura: soft blush wordmark; no cover/CTA/monogram. */
function LauraHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-laura-band mb-6 md:mb-8">
      <div className="flex flex-col items-center px-5 py-12 text-center sm:px-6 md:py-16">
        {hero.logo_url ? (
          <div className="mb-5">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-laura-eyebrow mb-3 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-laura-title text-balance">{title}</h1>

        {tagline ? (
          <p className="hero-laura-tagline mt-4 text-balance">{tagline}</p>
        ) : null}
      </div>
    </section>
  );
}

/** Atlantic: cream editorial wordmark; no cover/CTA/monogram. */
function AtlanticHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-atlantic-band mb-6 md:mb-8">
      <div className="flex flex-col items-center px-5 py-12 text-center sm:px-6 md:py-16">
        {hero.logo_url ? (
          <div className="mb-5">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-atlantic-eyebrow mb-3 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-atlantic-title text-balance">{title}</h1>

        {tagline ? (
          <>
            <div className="hero-atlantic-rule my-4" aria-hidden />
            <p className="hero-atlantic-tagline text-balance">{tagline}</p>
          </>
        ) : null}
      </div>
    </section>
  );
}

/** Strada: centered B&W wordmark; no cover/CTA/monogram. */
function StradaHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-strada-band mb-6 md:mb-8">
      <div className="flex flex-col items-center px-5 py-12 text-center sm:px-6 md:py-16">
        {hero.logo_url ? (
          <div className="mb-5">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-strada-eyebrow mb-3 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-strada-title text-balance">{title}</h1>

        {tagline ? (
          <p className="hero-strada-tagline mt-5 text-balance">{tagline}</p>
        ) : null}
      </div>
    </section>
  );
}

/** Vows: slate canvas, charcoal type; no cover/CTA/monogram. */
function VowsHero({
  title,
  hero,
}: {
  title: string;
  hero: Partial<HeroConfig>;
}) {
  const eyebrow = hero.eyebrow?.trim();
  const tagline = hero.subheading?.trim();

  return (
    <section className="storefront-hero hero-vows-band mb-6 md:mb-8">
      <div className="flex flex-col items-center px-5 py-12 text-center sm:px-6 md:py-16">
        {hero.logo_url ? (
          <div className="mb-5">
            <HeroLogo
              url={hero.logo_url}
              alt={title}
              size={hero.logo_size}
              style={hero.logo_style}
            />
          </div>
        ) : null}

        {eyebrow ? (
          <p className="hero-vows-eyebrow mb-3 text-balance">{eyebrow}</p>
        ) : null}

        <h1 className="hero-vows-title text-balance">{title}</h1>

        {tagline ? (
          <p className="hero-vows-tagline mt-4 text-balance">{tagline}</p>
        ) : null}
      </div>
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
        <HeroLogo
          url={hero.logo_url}
          alt={title}
          size={hero.logo_size}
          style={hero.logo_style}
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
  vibe = "atelier",
}: StorefrontHeroProps) {
  const title = hero.title?.trim() || storeName;

  if (isNoirVibe(vibe)) {
    return <NoirHero title={title} hero={hero} />;
  }

  if (isAtelierVibe(vibe)) {
    return <AtelierHero title={title} hero={hero} />;
  }

  if (isExpeditionVibe(vibe)) {
    return <ExpeditionHero title={title} hero={hero} />;
  }

  if (isCyberpunkVibe(vibe)) {
    return <CyberpunkHero title={title} hero={hero} />;
  }

  if (isCandylandVibe(vibe)) {
    return <CandylandHero title={title} hero={hero} />;
  }

  if (isMarketVibe(vibe)) {
    return <MarketHero title={title} hero={hero} />;
  }

  if (isGalleryVibe(vibe)) {
    return <GalleryHero title={title} hero={hero} />;
  }

  if (isStudioVibe(vibe)) {
    return <StudioHero title={title} hero={hero} />;
  }

  if (isLauraVibe(vibe)) {
    return <LauraHero title={title} hero={hero} />;
  }

  if (isAtlanticVibe(vibe)) {
    return <AtlanticHero title={title} hero={hero} />;
  }

  if (isVowsVibe(vibe)) {
    return <VowsHero title={title} hero={hero} />;
  }

  if (isStradaVibe(vibe)) {
    return <StradaHero title={title} hero={hero} />;
  }

  return <DefaultHero title={title} hero={hero} />;
}
