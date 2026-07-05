import { ArrowRight, Link2, QrCode, ShoppingBag } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";

const STEPS = [
  {
    n: "01",
    title: "Share one link",
    body: "Drop it in your bio. Buyers tap and shop instantly.",
    Icon: Link2,
    tint: "bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]",
  },
  {
    n: "02",
    title: "Self-serve checkout",
    body: "Catalogue, cart and order — no DM back-and-forth.",
    Icon: ShoppingBag,
    tint: "bg-[var(--brand-bg-soft)] text-foreground",
  },
  {
    n: "03",
    title: "PayNow, automatically",
    body: "Dynamic QR with the exact amount and reference.",
    Icon: QrCode,
    tint: "bg-[var(--brand-mint-soft)] text-[var(--brand-mint)]",
  },
] as const;

/** Simple three-step flow: one icon per step, staggered reveal, subtle hover. */
export function FlowStepsVisual() {
  return (
    <div className="grid gap-5 sm:grid-cols-3 sm:gap-4 lg:gap-6">
      {STEPS.map((step, i) => (
        <Reveal key={step.n} delay={i * 120} className="relative">
          {i < STEPS.length - 1 ? (
            <ArrowRight
              className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 text-muted-foreground/40 lg:-right-4 sm:block"
              aria-hidden
            />
          ) : null}
          <article className="group h-full rounded-[24px] border border-border/80 bg-card p-8 shadow-[0_2px_24px_rgba(22,19,14,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgba(22,19,14,0.25)]">
            <div className="flex items-center justify-between">
              <span
                className={`flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${step.tint}`}
                aria-hidden
              >
                <step.Icon className="size-6" strokeWidth={2} />
              </span>
              <span className="font-display text-4xl font-extrabold tracking-[-0.02em] text-muted-foreground/30">
                {step.n}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-extrabold tracking-[-0.02em] sm:text-[1.35rem]">
              {step.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-[var(--brand-ink-soft)]">
              {step.body}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
