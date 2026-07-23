import {
  CalendarDays,
  Download,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type MoreDestination = {
  href: string;
  label: string;
  description: string;
  Icon: LucideIcon;
};

/** Destinations launched from the More hub (not bottom-nav primaries). */
export const MORE_DESTINATIONS: readonly MoreDestination[] = [
  {
    href: "/storefront",
    label: "Storefront",
    description: "Vibe, logo, and what buyers see first",
    Icon: Palette,
  },
  {
    href: "/fulfilment",
    label: "Fulfilment",
    description: "Pickup, delivery, dates, and capacity",
    Icon: CalendarDays,
  },
  {
    href: "/settings/install",
    label: "Install Nomi App",
    description: "Add Nomi to your phone for quick access",
    Icon: Download,
  },
] as const;

export function isMoreDestinationPath(pathname: string): boolean {
  if (pathname === "/more" || pathname === "/dashboard/more") return true;
  if (pathname.startsWith("/more/") || pathname.startsWith("/dashboard/more/")) {
    return true;
  }
  return MORE_DESTINATIONS.some((d) => {
    const bare = d.href;
    const underDashboard = `/dashboard${d.href}`;
    return (
      pathname === bare ||
      pathname.startsWith(`${bare}/`) ||
      pathname === underDashboard ||
      pathname.startsWith(`${underDashboard}/`)
    );
  });
}

export function isSettingsNavPath(pathname: string): boolean {
  const isSettings =
    pathname === "/settings" ||
    pathname.startsWith("/settings/") ||
    pathname === "/dashboard/settings" ||
    pathname.startsWith("/dashboard/settings/");
  if (!isSettings) return false;
  // Install Nomi App is a More destination (same URL path for now)
  if (
    pathname === "/settings/install" ||
    pathname.startsWith("/settings/install/") ||
    pathname === "/dashboard/settings/install" ||
    pathname.startsWith("/dashboard/settings/install/")
  ) {
    return false;
  }
  return true;
}
