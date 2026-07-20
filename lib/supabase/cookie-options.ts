import { getRootDomain } from "@/lib/host";

/**
 * Share auth cookies across app.* and {slug}.* (via Context7 / @supabase/ssr).
 * Root domain only — never include port.
 */
export function getAuthCookieDomain(): string | undefined {
  const root = getRootDomain();
  if (!root || root === "127.0.0.1") return undefined;
  return `.${root}`;
}

export function sharedAuthCookieOptions(): {
  domain?: string;
  path: string;
  sameSite: "lax";
  secure: boolean;
} {
  const domain = getAuthCookieDomain();
  const secure = process.env.NODE_ENV === "production";
  return {
    ...(domain ? { domain } : {}),
    path: "/",
    sameSite: "lax",
    secure,
  };
}
