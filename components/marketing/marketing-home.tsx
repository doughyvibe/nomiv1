import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PayNowQrCard } from "@/components/marketing/paynow-qr-card";
import { Reveal } from "@/components/marketing/reveal";
import { SpineLink } from "@/components/marketing/spine-link";
import { StoreTour } from "@/components/marketing/store-tour";
import { getLoginUrl, getMarketingUrl } from "@/lib/host";

function PrimaryCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-foreground pr-2 pl-6 text-base font-semibold text-white transition-colors hover:bg-[#2c2a26] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]"
    >
      {children}
      <span
        className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:scale-105"
        aria-hidden
      >
        <ArrowRight className="size-4" />
      </span>
    </a>
  );
}

function GhostCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex h-12 min-w-[12rem] items-center justify-center rounded-full border-[1.5px] border-foreground/35 bg-transparent px-7 text-base font-semibold text-foreground transition-colors hover:border-foreground/55 hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]"
    >
      {children}
    </a>
  );
}

const BITES = [
  {
    title: "Real shop",
    body: "Buyers browse and cart — not another link list in your bio.",
  },
  {
    title: "Exact PayNow",
    body: "Amount and order reference locked into every QR.",
  },
  {
    title: "Made for SG",
    body: "Built for Instagram, TikTok, and WhatsApp sellers.",
  },
] as const;

export function MarketingHome() {
  const createStoreUrl = getLoginUrl("create");
  const signInUrl = getLoginUrl("login");
  const termsUrl = getMarketingUrl("/terms");
  const privacyUrl = getMarketingUrl("/privacy");

  return (
    <div data-brand className="relative min-h-full text-foreground">
      {/* Match login/dashboard: white base + soft orbs (NOT sand --background) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
        aria-hidden
      >
        <div className="brand-grain absolute inset-0 opacity-40" />
        <div className="brand-orb animate-brand-drift-1 top-[12%] left-[6%] size-64 bg-[rgba(247,197,24,0.1)]" />
        <div className="brand-orb animate-brand-drift-2 right-[8%] bottom-[14%] size-72 bg-[rgba(124,47,224,0.08)]" />
      </div>

      <a
        href="#main-content"
        className="bg-primary text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:ring-3 focus:outline-none"
      >
        Skip to content
      </a>

      {/* Minimal chrome — no sticky pill nav */}
      <div className="absolute top-4 right-4 z-40 sm:top-6 sm:right-6">
        <details className="group relative">
          <summary
            className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-foreground/20 bg-card/80 text-foreground shadow-sm backdrop-blur-sm marker:content-none [&::-webkit-details-marker]:hidden"
            aria-label="Menu"
          >
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
            </span>
          </summary>
          <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-card py-2 shadow-lg">
            <a
              href={createStoreUrl}
              className="block px-4 py-2.5 text-sm font-semibold hover:bg-[var(--brand-bg-soft)]"
            >
              Create my store
            </a>
            <a
              href={signInUrl}
              className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-[var(--brand-bg-soft)] hover:text-foreground"
            >
              Sign in
            </a>
            <Link
              href={termsUrl}
              className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-[var(--brand-bg-soft)] hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href={privacyUrl}
              className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-[var(--brand-bg-soft)] hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </details>
      </div>

      <main id="main-content">
        {/* Hero */}
        <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-20 pb-4 text-center sm:px-6">
          <div className="relative mx-auto max-w-3xl">
            <div className="animate-fade-up flex justify-center [animation-fill-mode:both]">
              <Image
                src="/marketing/nomilogo.png"
                alt="nomi"
                width={400}
                height={400}
                priority
                className="animate-brand-logo h-48 w-48 object-contain sm:h-56 sm:w-56"
              />
            </div>

            <h1 className="mt-3 animate-fade-up font-display text-[2.15rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance [animation-delay:80ms] [animation-fill-mode:both] sm:mt-4 sm:text-5xl lg:text-[3.4rem]">
              Your business deserves a{" "}
              <span className="brand-hl">better storefront</span>.
            </h1>

            <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-muted-foreground [animation-delay:140ms] [animation-fill-mode:both] sm:text-lg">
              Create a beautiful storefront, showcase your products, accept
              payments, and start selling.
            </p>

            <div className="mt-9 flex animate-fade-up flex-col items-center gap-3 [animation-delay:200ms] [animation-fill-mode:both]">
              <PrimaryCta href={createStoreUrl}>Create my store</PrimaryCta>
              <GhostCta href={signInUrl}>Sign in</GhostCta>
            </div>
          </div>

          <SpineLink label="See What's Possible" href="#stores" accent />
        </section>

        {/* Proof river */}
        <section
          id="stores"
          className="scroll-mt-12 px-4 pt-12 pb-16 sm:scroll-mt-16 sm:px-6 sm:pt-14 sm:pb-20"
          aria-labelledby="stores-heading"
        >
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2
              id="stores-heading"
              className="font-display text-2xl font-extrabold tracking-[-0.02em] text-balance sm:text-3xl lg:text-[2.15rem]"
            >
              See how different businesses come to life with Nomi.
            </h2>
          </Reveal>
          <div className="mt-6 sm:mt-8">
            <StoreTour />
          </div>
          <SpineLink label="PayNow integrated" href="#paynow" accent />
        </section>

        {/* PayNow USP */}
        <section
          id="paynow"
          className="scroll-mt-24 px-4 py-8 sm:scroll-mt-28 sm:px-6 sm:py-12"
          aria-labelledby="paynow-heading"
        >
          <div className="mx-auto grid max-w-5xl items-center gap-12 rounded-[2rem] border border-border/80 bg-card/75 px-6 py-12 shadow-[0_20px_60px_-30px_rgba(22,19,14,0.35)] backdrop-blur-md sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2
                id="paynow-heading"
                className="font-display text-3xl leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-4xl"
              >
                Exact PayNow.{" "}
                <span className="brand-hl">Every order.</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                Amount + reference. Built for you.
              </p>
            </Reveal>
            <Reveal delay={100} className="flex justify-center lg:justify-end">
              <PayNowQrCard showBadge={false} />
            </Reveal>
          </div>
          <div className="flex justify-center pt-10" aria-hidden>
            <div className="h-16 w-px bg-gradient-to-b from-foreground/30 to-transparent sm:h-20" />
          </div>
        </section>

        {/* Three bites */}
        <section className="px-4 py-8 sm:px-6 sm:py-16" aria-label="Why Nomi">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-5">
            {BITES.map((bite, i) => (
              <Reveal key={bite.title} delay={i * 80}>
                <div className="h-full rounded-[1.5rem] border border-border/80 bg-card/70 p-6 shadow-sm backdrop-blur-sm sm:p-7">
                  <h3 className="font-display text-xl font-extrabold tracking-[-0.02em]">
                    {bite.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {bite.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Soft close */}
        <section className="px-4 py-16 text-center sm:px-6 sm:py-24">
          <Reveal className="mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-extrabold tracking-[-0.025em] text-balance sm:text-4xl">
              Ready when you are.
            </h2>
            <div className="mt-8 flex justify-center">
              <PrimaryCta href={createStoreUrl}>Create my store</PrimaryCta>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border/60 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p className="font-extrabold tracking-[-0.03em]">nomi</p>
          <nav aria-label="Legal" className="flex gap-5">
            <Link
              href={termsUrl}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Terms
            </Link>
            <Link
              href={privacyUrl}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
