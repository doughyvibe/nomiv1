"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" || p === "/dashboard" },
  {
    href: "/orders",
    label: "Orders",
    match: (p: string) => p.startsWith("/orders") || p.startsWith("/dashboard/orders"),
    badge: true,
  },
  {
    href: "/products",
    label: "Products",
    match: (p: string) =>
      p.startsWith("/products") || p.startsWith("/dashboard/products"),
  },
  {
    href: "/storefront",
    label: "Storefront",
    match: (p: string) =>
      p.startsWith("/storefront") || p.startsWith("/dashboard/storefront"),
  },
  {
    href: "/settings",
    label: "Settings",
    match: (p: string) =>
      p.startsWith("/settings") || p.startsWith("/dashboard/settings"),
  },
] as const;

export function DashboardNav({
  pendingCount,
}: {
  pendingCount: number;
}) {
  const pathname = usePathname();

  if (pathname.includes("/onboarding")) return null;

  return (
    <header className="border-b bg-background pt-[env(safe-area-inset-top,0px)]">
      <nav className="mx-auto flex max-w-lg gap-1 overflow-x-auto px-4 py-3">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative shrink-0 rounded-md px-3 py-2.5 text-sm font-medium transition-colors min-h-11 inline-flex items-center",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {"badge" in item &&
                item.badge &&
                pendingCount > 0 &&
                !active && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
