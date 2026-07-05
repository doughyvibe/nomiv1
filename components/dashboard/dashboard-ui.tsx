import Link from "next/link";

import { cn } from "@/lib/utils";

/** White card panel — matches login card (24px radius, warm shadow). */
export function DashboardPanel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("dashboard-panel", className)} {...props}>
      {children}
    </section>
  );
}

export function DashboardPanelHeader({
  className,
  title,
  description,
  action,
}: {
  className?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5 sm:px-7",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-lg font-extrabold tracking-[-0.02em]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DashboardPanelBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-6 py-5 sm:px-7 sm:py-6", className)}>{children}</div>
  );
}

export function DashboardPageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  eyebrow?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[2rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

const STAT_TINTS = {
  yellow: "bg-primary text-foreground",
  purple: "bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]",
  mint: "bg-[var(--brand-mint-soft)] text-[var(--brand-mint)]",
} as const;

export function DashboardStatCard({
  href,
  label,
  value,
  tint = "yellow",
  className,
}: {
  href?: string;
  label: string;
  value: React.ReactNode;
  tint?: keyof typeof STAT_TINTS;
  className?: string;
}) {
  const inner = (
    <>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="font-display mt-2 text-3xl font-extrabold tabular-nums tracking-[-0.02em]">
        {value}
      </p>
    </>
  );

  const classes = cn(
    "dashboard-stat group rounded-2xl border border-border bg-card p-4 transition-all sm:p-5",
    href && "hover:border-foreground/15 hover:shadow-[0_4px_20px_rgba(22,19,14,0.06)]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        <span
          className={cn(
            "mb-3 inline-flex size-9 items-center justify-center rounded-xl",
            STAT_TINTS[tint],
          )}
          aria-hidden
        >
          <span className="size-2 rounded-full bg-current opacity-80" />
        </span>
        {inner}
      </Link>
    );
  }

  return (
    <div className={classes}>
      <span
        className={cn(
          "mb-3 inline-flex size-9 items-center justify-center rounded-xl",
          STAT_TINTS[tint],
        )}
        aria-hidden
      >
        <span className="size-2 rounded-full bg-current opacity-80" />
      </span>
      {inner}
    </div>
  );
}

export function DashboardEmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center sm:py-12">
      <p className="font-display text-lg font-extrabold tracking-[-0.02em]">
        {title}
      </p>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}

/** Primary pill CTA — matches login Google button (warm ink). */
export function BrandCta({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button type="button" className={cn("btn-brand-dark", className)} {...props}>
      {children}
    </button>
  );
}

/** Secondary pill — outline on white card. */
export function BrandCtaOutline({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn("btn-brand-outline", className)}
      {...props}
    >
      {children}
    </button>
  );
}
