import { ArrowRight, Bell, Check, Percent, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

import { FlowStepsVisual } from "@/components/marketing/flow-steps-visual";
import { PayNowQrCard } from "@/components/marketing/paynow-qr-card";
import { Reveal } from "@/components/marketing/reveal";
import { Wordmark } from "@/components/marketing/wordmark";
import { MiniPreview } from "@/components/storefront/mini-preview";
import { getLoginUrl, getStorefrontUrl } from "@/lib/host";
import { getDemoStoreSlug } from "@/lib/marketing/demo-store";
import type { Vibe } from "@/lib/stores/types";

const PREVIEW_VIBE: Vibe = "strada";

const PREVIEW_PRODUCTS = [
  {
    name: "Black Gold Slayer",
    price_cents: 950,
    image_url: null,
    category: "Metal Jigs",
  },
  {
    name: "Deep Assist Hook",
    price_cents: 1250,
    image_url: null,
    category: "Assist Hooks",
  },
  {
    name: "Tide Runner",
    price_cents: 1450,
    image_url: null,
    category: "Metal Jigs",
  },
  {
    name: "Reef King",
    price_cents: 890,
    image_url: null,
    category: "Assist Hooks",
  },
];

const MARQUEE_ITEMS = [
  "Made for SG sellers",
  "One simple link",
  "Browse catalogue",
  "Easy add to cart",
  "PayNow-ready checkout",
];

const PAYNOW_BENEFITS = [
  {
    Icon: Percent,
    tint: "bg-primary text-foreground",
    title: "0% transaction fees",
    body: "No processing cut — the full amount lands in your pocket.",
  },
  {
    Icon: Zap,
    tint: "bg-[var(--brand-mint-soft)] text-[var(--brand-mint)]",
    title: "Instant settlement",
    body: "Funds go straight to your bank account. No holds, no cashout delays.",
  },
  {
    Icon: ShieldCheck,
    tint: "bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]",
    title: "Zero payment errors",
    body: "Amount and order reference are locked to each QR — nothing to mistype, effortless to verify.",
  },
];

/* ---------------------------------------------------------------- pieces */

function BlackPillCta({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-foreground pr-2 pl-6 text-base font-semibold text-white transition-colors hover:bg-[#2c2a26] active:scale-[0.97]"
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

function OutlinePillCta({
  href,
  children,
  external,
  onYellow,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  onYellow?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={
        onYellow
          ? "inline-flex h-13 items-center justify-center rounded-full border-[1.5px] border-foreground px-7 text-base font-semibold text-foreground transition-colors hover:bg-foreground/10 active:scale-[0.97]"
          : "inline-flex h-13 items-center justify-center rounded-full border-[1.5px] border-foreground/30 bg-card px-7 text-base font-semibold text-foreground shadow-[0_2px_10px_rgba(22,19,14,0.08)] transition-all hover:border-foreground/45 hover:bg-[var(--brand-bg-soft)] hover:shadow-[0_4px_16px_rgba(22,19,14,0.12)] active:scale-[0.97]"
      }
    >
      {children}
    </a>
  );
}

function OrderCard() {
  return (
    <div className="w-44 rounded-[18px] border border-border bg-card p-3 shadow-[0_14px_32px_-16px_rgba(27,26,24,0.3)]">
      <div className="flex items-center gap-2">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-hidden
        >
          <Bell className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold">New order</p>
          <p className="truncate text-[10px] text-muted-foreground">
            NM-8F2KQ3 · just now
          </p>
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline justify-between">
        <p className="text-[11px] text-muted-foreground">2 items · Sarah T.</p>
        <p className="text-sm font-extrabold">S$48.00</p>
      </div>
    </div>
  );
}

function PaidCard() {
  return (
    <div className="w-52 rounded-[18px] border border-border bg-card p-3 shadow-[0_14px_32px_-16px_rgba(27,26,24,0.3)]">
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-mint)] text-white"
          aria-hidden
        >
          <Check className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold">S$48.00 received</p>
          <p className="text-[10px] leading-snug text-muted-foreground">
            Straight to your bank · 0% fees
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export function MarketingHome() {
  const createStoreUrl = getLoginUrl("create");
  const signInUrl = getLoginUrl("login");
  const demoUrl = getStorefrontUrl(getDemoStoreSlug());
  const demoLabel = `${getDemoStoreSlug()}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0] ?? "lvh.me"}`;

  return (
    <div data-brand className="min-h-full bg-background text-foreground">
      {/* ------------------------------------------------ Floating pill nav */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="relative mx-auto max-w-5xl rounded-full border border-border bg-[#fbf7f2]/95 py-2 pr-2 pl-5 shadow-[0_1px_3px_rgba(27,26,24,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="shrink-0" aria-label="Nomi home">
              <Wordmark />
            </Link>

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 sm:ml-auto">
              <a
                href={signInUrl}
                className="px-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:text-[14.5px]"
              >
                Sign in
              </a>
              <a
                href={createStoreUrl}
                className="inline-flex h-9 items-center rounded-full bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:bg-[var(--brand-yellow-deep)] active:scale-[0.98] sm:px-4.5 sm:text-sm"
              >
                Create my store
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ Hero */}
      <section className="relative overflow-hidden px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-20">
        <div
          className="brand-orb animate-brand-drift-1 top-10 left-[12%] size-72 bg-[rgba(247,197,24,0.18)]"
          aria-hidden
        />
        <div
          className="brand-orb animate-brand-drift-2 top-40 right-[10%] size-80 bg-[rgba(124,47,224,0.10)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl">
          <h1 className="mx-auto max-w-3xl animate-fade-up font-display text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.025em] text-balance [animation-fill-mode:both] sm:text-6xl lg:text-[4.1rem]">
            The easiest way to turn your bio into a{" "}
            <span className="brand-hl whitespace-nowrap">real store</span>.
          </h1>

          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:100ms] [animation-fill-mode:both] sm:flex-row">
            <BlackPillCta href={createStoreUrl}>Create my store</BlackPillCta>
            <OutlinePillCta href={demoUrl} external>
              View demo store
            </OutlinePillCta>
          </div>
        </div>

        {/* Phone scene */}
        <div className="relative mx-auto mt-14 w-full max-w-md animate-fade-up [animation-delay:300ms] [animation-fill-mode:both]">
          <span
            className="absolute -top-6 left-[8%] text-2xl text-[var(--brand-purple)] select-none"
            aria-hidden
          >
            ✦
          </span>
          <span
            className="absolute top-16 right-[4%] text-lg select-none"
            aria-hidden
          >
            ✦
          </span>

          <div className="relative px-10 sm:px-16">
            <div className="-rotate-2 transition-transform duration-500 hover:rotate-0">
              <MiniPreview
                vibe={PREVIEW_VIBE}
                storeName="JigWave"
                hero={{
                  eyebrow: "Est. 2024",
                  title: "JigWave",
                  subheading: "Metal jigs & assist hooks for SG anglers.",
                }}
                products={PREVIEW_PRODUCTS}
                className="shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)]"
              />
            </div>

            <div className="animate-brand-float absolute top-6 -left-1 sm:left-2">
              <div className="rotate-[-4deg]">
                <OrderCard />
              </div>
            </div>
            <div className="animate-brand-float absolute -right-1 bottom-8 [animation-delay:-3.5s] sm:right-2">
              <div className="rotate-[3deg]">
                <PaidCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Marquee */}
      <div className="overflow-hidden bg-foreground py-3.5 text-[#f1ede5]">
        <div className="animate-brand-marquee flex w-max items-center gap-8 pr-8">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex items-center gap-8"
              aria-hidden={copy === 1}
            >
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-8 text-sm font-semibold tracking-wide whitespace-nowrap"
                >
                  {item}
                  <span className="text-primary" aria-hidden>
                    ✦
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ Value prop */}
      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
              From messy DMs into{" "}
              <span className="brand-hl">1-click convenience</span>.
            </h2>
          </Reveal>
          <div className="mt-12">
            <FlowStepsVisual />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ PayNow value */}
      <section className="relative overflow-hidden bg-foreground px-4 py-20 text-[#f4efe6] sm:px-6 sm:py-28">
        <div
          className="brand-grain pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
        />
        <div
          className="brand-orb animate-brand-drift-1 top-[18%] left-[8%] size-72 bg-[rgba(247,197,24,0.14)]"
          aria-hidden
        />
        <div
          className="brand-orb animate-brand-drift-2 right-[6%] bottom-0 size-80 bg-[rgba(124,47,224,0.16)]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-3xl leading-[1.08] font-extrabold tracking-[-0.02em] text-balance text-white sm:text-5xl">
              Get paid instantly. Keep{" "}
              <span className="text-primary">100%</span>.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#d5cfc4] sm:text-lg">
              Every order generates a dynamic PayNow QR — prefilled with the
              exact amount and a reference tied to the invoice.
            </p>

            <ul className="mt-10 space-y-7">
              {PAYNOW_BENEFITS.map((benefit) => (
                <li key={benefit.title} className="flex gap-4">
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${benefit.tint}`}
                    aria-hidden
                  >
                    <benefit.Icon className="size-6" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-lg font-bold text-white">
                      {benefit.title}
                    </p>
                    <p className="mt-1 text-base leading-relaxed text-[#c9c2b4]">
                      {benefit.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={120}
            className="relative flex justify-center text-foreground lg:justify-end"
          >
            <div
              className="brand-orb top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 bg-[rgba(247,197,24,0.2)]"
              aria-hidden
            />
            <div className="animate-brand-float relative">
              <PayNowQrCard showBadge={false} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ Yellow CTA band */}
      <section className="relative overflow-hidden bg-primary px-4 py-20 text-primary-foreground sm:px-6 sm:py-28">
        <div
          className="brand-grain-light pointer-events-none absolute inset-0"
          aria-hidden
        />
        <span
          className="absolute top-10 right-[12%] text-2xl select-none"
          aria-hidden
        >
          ✦
        </span>
        <span
          className="absolute bottom-12 left-[10%] text-lg text-[var(--brand-purple)] select-none"
          aria-hidden
        >
          ✦
        </span>
        <Reveal className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl leading-[1.08] font-extrabold tracking-[-0.025em] text-balance sm:text-5xl">
            Your bio is one link away from a{" "}
            <span className="underline decoration-foreground decoration-4 underline-offset-[6px]">
              real store
            </span>
            .
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed opacity-80">
            Set up in minutes. 0% fees on every PayNow sale.
          </p>
          <div className="mt-9 flex justify-center">
            <BlackPillCta href={createStoreUrl}>Create my store</BlackPillCta>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ Footer */}
      <footer className="border-t border-border bg-[var(--brand-bg-soft)] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Wordmark />
            <p className="text-sm text-muted-foreground">
              Simple PayNow storefronts, made for Singapore social sellers.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Demo store:{" "}
            <a
              href={demoUrl}
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              {demoLabel}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
