export type AppSurface = "marketing" | "dashboard" | "storefront";

export function getRootDomain(): string {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "lvh.me";
  return root.split(":")[0]!;
}

/** Dashboard origin for seller app (app.nomi.store / app.lvh.me:3000) */
export function getDashboardUrl(path = "/"): string {
  const root = getRootDomain();
  const isDev = process.env.NODE_ENV === "development";
  const port = isDev ? ":3000" : "";
  const protocol = isDev ? "http" : "https";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${protocol}://app.${root}${port}${normalizedPath}`;
}

/** ponytail: naive hostname parse; upgrade path = shared util + unit tests if edge cases appear */
export function resolveSurface(host: string | null): {
  surface: AppSurface;
  slug?: string;
} {
  if (!host) return { surface: "marketing" };

  const hostname = host.split(":")[0]!.toLowerCase();
  const rootDomain = getRootDomain();

  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return { surface: "marketing" };
  }

  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.slice(0, -(rootDomain.length + 1));

    if (!subdomain || subdomain === "www") {
      return { surface: "marketing" };
    }

    if (subdomain === "app") {
      return { surface: "dashboard" };
    }

    return { surface: "storefront", slug: subdomain };
  }

  // localhost / unknown host → marketing (dev without lvh.me)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { surface: "marketing" };
  }

  return { surface: "marketing" };
}
