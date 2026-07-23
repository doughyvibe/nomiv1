"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Home,
  MoreHorizontal,
  Package,
  Settings,
} from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { UnsavedChangesProvider } from "@/components/dashboard/unsaved-changes";
import { Wordmark } from "@/components/marketing/wordmark";
import {
  isMoreDestinationPath,
  isSettingsNavPath,
} from "@/lib/dashboard/more-destinations";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    Icon: Home,
    match: (p: string) => p === "/" || p === "/dashboard",
  },
  {
    href: "/orders",
    label: "Orders",
    Icon: ClipboardList,
    match: (p: string) =>
      p.startsWith("/orders") || p.startsWith("/dashboard/orders"),
    badge: true,
  },
  {
    href: "/products",
    label: "Products",
    Icon: Package,
    match: (p: string) =>
      p.startsWith("/products") || p.startsWith("/dashboard/products"),
  },
  {
    href: "/settings",
    label: "Settings",
    Icon: Settings,
    match: isSettingsNavPath,
  },
  {
    href: "/more",
    label: "More",
    Icon: MoreHorizontal,
    match: isMoreDestinationPath,
  },
] as const;

function NavLink({
  item,
  active,
  pendingCount,
  layout,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  pendingCount: number;
  layout: "sidebar" | "bottom";
}) {
  const showBadge =
    "badge" in item && item.badge && pendingCount > 0 && !active;

  if (layout === "bottom") {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-xl transition-colors",
            active ? "bg-primary text-foreground" : "bg-transparent",
          )}
        >
          <item.Icon className="size-5" strokeWidth={2} />
        </span>
        {item.label}
        {showBadge ? (
          <span className="absolute top-1.5 right-[calc(50%-1.4rem)] flex size-5 items-center justify-center rounded-full bg-[var(--brand-purple)] text-[10px] font-bold text-white">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-base font-semibold transition-colors",
        active
          ? "bg-primary text-foreground shadow-[0_2px_8px_rgba(247,197,24,0.25)]"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <item.Icon className="size-5 shrink-0" strokeWidth={2} />
      {item.label}
      {showBadge ? (
        <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-[var(--brand-purple)] text-xs font-bold text-white">
          {pendingCount > 9 ? "9+" : pendingCount}
        </span>
      ) : null}
    </Link>
  );
}

export function DashboardShell({
  pendingCount,
  children,
}: {
  pendingCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.includes("/onboarding")) {
    return <>{children}</>;
  }

  return (
    <UnsavedChangesProvider>
      <div
        data-brand
        data-dashboard
        className="relative flex min-h-dvh flex-col text-foreground lg:flex-row"
      >
      <div
        className="brand-grain pointer-events-none absolute inset-0 opacity-35"
        aria-hidden
      />
      <div
        className="brand-orb animate-brand-drift-1 pointer-events-none absolute top-[8%] left-[4%] size-72 bg-[rgba(247,197,24,0.12)]"
        aria-hidden
      />
      <div
        className="brand-orb animate-brand-drift-2 pointer-events-none absolute right-[6%] bottom-[20%] size-80 bg-[rgba(124,47,224,0.08)]"
        aria-hidden
      />

      {/* Desktop sidebar */}
      <aside className="relative z-10 hidden w-[17.5rem] shrink-0 flex-col border-r border-border/80 bg-card/60 px-4 py-6 backdrop-blur-md lg:flex">
        <Link href="/" className="px-2" aria-label="Dashboard home">
          <Wordmark />
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={item.match(pathname)}
              pendingCount={pendingCount}
              layout="sidebar"
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-border px-2 pt-4">
          <SignOutButton className="w-full justify-center rounded-full" />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-border/80 bg-card/80 px-4 py-3.5 backdrop-blur-md pt-[max(0.75rem,env(safe-area-inset-top,0px))] lg:hidden">
        <Link href="/" aria-label="Dashboard home">
          <Wordmark />
        </Link>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:max-w-4xl lg:px-10 lg:py-10 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] lg:pb-10">
          {children}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-card/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Dashboard"
      >
        <div className="mx-auto flex max-w-lg px-1 pt-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={item.match(pathname)}
              pendingCount={pendingCount}
              layout="bottom"
            />
          ))}
        </div>
      </nav>
      </div>
    </UnsavedChangesProvider>
  );
}
