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

export type LoginIntent = "create" | "login";

/** Seller login with optional intent for adaptive copy on the login page. */
export function getLoginUrl(intent: LoginIntent = "create"): string {
  return getDashboardUrl(`/login?intent=${intent}`);
}

/** Marketing site origin (nomi.store / lvh.me:3000) */
export function getMarketingUrl(path = "/"): string {
  const root = getRootDomain();
  const isDev = process.env.NODE_ENV === "development";
  const port = isDev ? ":3000" : "";
  const protocol = isDev ? "http" : "https";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${protocol}://${root}${port}${normalizedPath}`;
}

/** Public storefront origin for a slug (demo.nomi.store / demo.lvh.me:3000) */
export function getStorefrontUrl(slug: string, path = "/"): string {
  const root = getRootDomain();
  const isDev = process.env.NODE_ENV === "development";
  const port = isDev ? ":3000" : "";
  const protocol = isDev ? "http" : "https";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${protocol}://${slug}.${root}${port}${normalizedPath}`;
}

/** Owner-only private preview of a non-live storefront */
export function getStorefrontPreviewUrl(slug: string, path = "/"): string {
  const base = getStorefrontUrl(slug, path);
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}preview=1`;
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

  // localhost / *.localhost — secure context over HTTP (push dev); lvh.me stays primary
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { surface: "marketing" };
  }
  if (hostname === "app.localhost") {
    return { surface: "dashboard" };
  }
  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.slice(0, -".localhost".length);
    if (subdomain === "app") return { surface: "dashboard" };
    if (subdomain && subdomain !== "www") {
      return { surface: "storefront", slug: subdomain };
    }
    return { surface: "marketing" };
  }

  return { surface: "marketing" };
}
