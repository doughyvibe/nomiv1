import { ArrowRight, Bell, Check, Plus } from "lucide-react";
import Link from "next/link";

import { PayNowQrCard } from "@/components/marketing/paynow-qr-card";
import { Reveal } from "@/components/marketing/reveal";
import { MiniPreview } from "@/components/storefront/mini-preview";
import { getDashboardUrl, getStorefrontUrl } from "@/lib/host";
import { getDemoStoreSlug } from "@/lib/marketing/demo-store";
import { HERO_BLOCKS, type Vibe } from "@/lib/stores/types";

const PREVIEW_VIBE: Vibe = "industrial";

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

const STEPS = [
  {
    n: "1",
    title: "Set up in minutes",
    body: "Pick a vibe, add your products and connect your PayNow number. No design skills, no code, no monthly plan.",
  },
  {
    n: "2",
    title: "Share one link",
    body: "Drop your store link in your Instagram bio, TikTok profile or WhatsApp status. Buyers shop without an account.",
  },
  {
    n: "3",
    title: "Get paid via PayNow",
    body: "Every order generates a QR with the exact amount and reference. Verify the payment, confirm the order, done.",
  },
];

const STATS = [
  { value: "0%", label: "transaction fees", note: "Nomi never takes a cut" },
  { value: "S$0", label: "monthly gateway fees", note: "no gateway at all" },
  { value: "Instant", label: "bank settlement", note: "PayNow, no cashout delays" },
];

const FAQS = [
  {
    q: "What is Nomi?",
    a: "Nomi turns your social media bio into a real storefront — a beautiful mobile-first shop link where customers browse your products, check out as guests, and pay you with PayNow.",
  },
  {
    q: "How do I get paid?",
    a: "Every order generates a dynamic PayNow QR with the exact amount and a unique reference. Your buyer scans it with any banking app and the money lands directly in your bank account. You verify the payment in your dashboard and confirm the order.",
  },
  {
    q: "What does it cost?",
    a: "Free to start, and Nomi takes 0% of your sales. There's no payment gateway in the middle, so there are no per-transaction fees and no cashout delays.",
  },
  {
    q: "Do my buyers need an account?",
    a: "No. Buyers open your link, browse, add to cart and check out as guests — name, contact and fulfilment details only.",
  },
  {
    q: "Is this a website builder?",
    a: "No — and that's the point. You pick one of four handcrafted vibes, add a hero and products, and your whole store is styled end to end. No dragging boxes around.",
  },
];

const VIBE_DOTS: { name: string; colors: [string, string] }[] = [
  { name: "Unicorn", colors: ["#dfff00", "#9376e0"] },
  { name: "Outback", colors: ["#9a5429", "#5e6f47"] },
  { name: "Futuristic", colors: ["#00e5ff", "#b026ff"] },
  { name: "Industrial", colors: ["#2dd4bf", "#a86a3a"] },
];

/* ---------------------------------------------------------------- pieces */

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex size-7 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
        n
        <span
          className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[var(--brand-purple)]"
          aria-hidden
        />
      </span>
      <span className="text-xl font-extrabold tracking-[-0.03em]">nomi</span>
    </span>
  );
}

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

function AddressChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-sm">
      <span
        className="size-2 rounded-full bg-[var(--brand-mint)]"
        aria-hidden
      />
      {label}
    </span>
  );
}

function FeaturePanel({
  index,
  eyebrow,
  reaction,
  heading,
  body,
  panelClass,
  reverse,
  signupUrl,
  children,
}: {
  index: string;
  eyebrow: string;
  reaction?: string;
  heading: React.ReactNode;
  body: string;
  panelClass: string;
  reverse?: boolean;
  signupUrl: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <article className="grid overflow-hidden rounded-[28px] border border-border bg-card lg:grid-cols-2">
        <div
          className={`flex flex-col justify-center p-7 sm:p-12 ${reverse ? "lg:order-2" : ""}`}
        >
          <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            <span className="font-extrabold text-foreground">{index}</span> / 03
            · {eyebrow}
          </p>
          {reaction ? (
            <p className="mt-4 text-[15px] leading-snug font-medium text-foreground/90 italic">
              &ldquo;{reaction}&rdquo;
            </p>
          ) : null}
          <h3 className="mt-4 font-display text-[1.75rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance sm:text-4xl">
            {heading}
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {body}
          </p>
          <a
            href={signupUrl}
            className="mt-7 inline-flex h-11 w-fit items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2c2a26]"
          >
            Create my store
          </a>
        </div>
        <div
          className={`relative flex min-h-[22rem] items-center justify-center overflow-hidden p-8 sm:p-12 ${panelClass} ${reverse ? "lg:order-1" : ""}`}
        >
          {children}
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ page */

export function MarketingHome() {
  const signupUrl = getDashboardUrl("/login");
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

            <nav
              className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-[14.5px] font-medium text-muted-foreground md:flex"
              aria-label="Main"
            >
              <a href="#why" className="transition-colors hover:text-foreground">
                Why Nomi
              </a>
              <a href="#how" className="transition-colors hover:text-foreground">
                How it works
              </a>
              <a href="#faq" className="transition-colors hover:text-foreground">
                FAQ
              </a>
            </nav>

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              <a
                href={signupUrl}
                className="px-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:text-[14.5px]"
              >
                Sign in
              </a>
              <a
                href={signupUrl}
                className="inline-flex h-9 items-center rounded-full bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:bg-[var(--brand-yellow-deep)] active:scale-[0.98] sm:px-4.5 sm:text-sm"
              >
                Create my store
              </a>
            </div>
          </div>
        </div>

        {/* Mobile nav links — below pill so Sign in stays visible in the bar */}
        <nav
          className="mx-auto mt-2 flex max-w-5xl items-center justify-center gap-5 text-[13px] font-medium text-muted-foreground md:hidden"
          aria-label="Mobile"
        >
          <a href="#why" className="transition-colors hover:text-foreground">
            Why Nomi
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>
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
            <BlackPillCta href={signupUrl}>Create my store</BlackPillCta>
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
                  eyebrow: "Since the Deep",
                  title: "JigWave",
                  subheading: "Metal jigs & assist hooks for SG anglers.",
                  cta: "Shop now",
                  order: [...HERO_BLOCKS],
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

      {/* ------------------------------------------------ Feature panels */}
      <section
        id="why"
        className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
              Still taking orders in your DMs?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              One clean storefront link replaces the back-and-forth — and
              your buyers feel the difference straight away.
            </p>
          </Reveal>

          <div className="mt-12 space-y-6">
            <FeaturePanel
              index="01"
              eyebrow="No more DM chaos"
              reaction="Oh… this solves my exact problem."
              heading={
                <>
                  Stop selling through{" "}
                  <span className="brand-hl">messy chat threads</span>.
                </>
              }
              body="No more 'how much?', screenshot PayNow codes, or scrolling back to see who paid. Share one link — buyers browse your catalog, add to cart, and check out like a proper store."
              panelClass="bg-[var(--brand-purple-soft)]"
              signupUrl={signupUrl}
            >
              <div className="relative">
                <div className="rotate-2">
                  <MiniPreview
                    vibe={PREVIEW_VIBE}
                    storeName="JigWave"
                    hero={{
                      eyebrow: "Since the Deep",
                      title: "JigWave",
                      subheading: "Metal jigs & assist hooks.",
                      cta: "Shop now",
                      order: [...HERO_BLOCKS],
                    }}
                    products={PREVIEW_PRODUCTS.slice(0, 2)}
                    className="shadow-[0_18px_40px_-12px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <div className="animate-brand-float absolute -top-3 -right-4 rotate-3 sm:-right-10">
                  <AddressChip label={demoLabel} />
                </div>
              </div>
            </FeaturePanel>

            <FeaturePanel
              index="02"
              eyebrow="PayNow checkout"
              reaction="That's actually much easier than what I'm doing."
              heading={
                <>
                  Every order gets a QR with the{" "}
                  <span className="brand-hl">exact amount</span>.
                </>
              }
              body="Nomi builds the PayNow QR for you — right total, unique order reference, no typing on either side. Your buyer scans, pays from their banking app, and the money lands in your account. You verify once. Done."
              panelClass="bg-primary brand-grain-light"
              reverse
              signupUrl={signupUrl}
            >
              <PayNowQrCard />
            </FeaturePanel>

            <FeaturePanel
              index="03"
              eyebrow="Your storefront"
              reaction="This looks professional."
              heading={
                <>
                  A store link you&apos;re{" "}
                  <span className="brand-hl">proud to share</span>.
                </>
              }
              body="Four polished vibes style your whole storefront — hero, products, cart, checkout. No drag-and-drop. No blank templates. Pick a look, add your stuff, publish. It looks finished before your first order."
              panelClass="bg-[var(--brand-mint-soft)]"
              signupUrl={signupUrl}
            >
              <div className="relative">
                <div className="-rotate-2">
                  <MiniPreview
                    vibe="unicorn"
                    storeName="Sarah Bakes"
                    hero={{
                      eyebrow: "Handmade with love",
                      title: "Sarah Bakes",
                      subheading: "Brownies, cookies & weekend treats.",
                      cta: "Order now",
                      order: [...HERO_BLOCKS],
                    }}
                    products={[
                      {
                        name: "Fudgy Brownie Box",
                        price_cents: 1800,
                        image_url: null,
                        category: "Brownies",
                      },
                      {
                        name: "Cookie Jar",
                        price_cents: 1400,
                        image_url: null,
                        category: "Cookies",
                      },
                    ]}
                    className="shadow-[0_18px_40px_-12px_rgba(0,0,0,0.3)]"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 flex flex-col gap-1.5 sm:-left-12">
                  {VIBE_DOTS.map((vibe) => (
                    <span
                      key={vibe.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold shadow-sm"
                    >
                      <span className="flex -space-x-1" aria-hidden>
                        {vibe.colors.map((color) => (
                          <span
                            key={color}
                            className="size-2.5 rounded-full border border-white"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </span>
                      {vibe.name}
                    </span>
                  ))}
                </div>
              </div>
            </FeaturePanel>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Stats */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
              Keep <span className="brand-hl">100%</span> of every sale.
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Your buyer pays you, not a platform. Nomi never touches the
              money.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="rounded-[20px] border border-border bg-card p-7 text-center transition-transform duration-300 hover:-translate-y-1">
                  <p className="font-display text-5xl font-extrabold tracking-[-0.02em]">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-semibold">{stat.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ How it works */}
      <section
        id="how"
        className="scroll-mt-24 border-y border-border bg-[var(--brand-bg-soft)] px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
              From bio to first order{" "}
              <span className="brand-hl">in an afternoon</span>.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <li className="h-full rounded-[20px] border border-border bg-card p-7">
                  <span
                    className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-lg font-extrabold text-primary-foreground"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ FAQ */}
      <section id="faq" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl leading-[1.08] font-extrabold tracking-[-0.02em] sm:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 60}>
                <details className="group rounded-[16px] border border-border bg-card px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold select-none [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <Plus
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
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
            Free to start. Keep every dollar you earn. No card required.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BlackPillCta href={signupUrl}>Create my store</BlackPillCta>
            <OutlinePillCta href={demoUrl} external onYellow>
              View demo store
            </OutlinePillCta>
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
