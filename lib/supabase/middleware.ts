import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { sharedAuthCookieOptions } from "@/lib/supabase/cookie-options";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";

export function isPublicDashboardPath(pathname: string): boolean {
  return pathname === "/login" || pathname.startsWith("/auth");
}

export async function getMiddlewareUser(
  request: NextRequest,
  response: NextResponse,
) {
  if (!isSupabaseConfigured()) {
    return { user: null, response };
  }

  const { url, publishableKey } = getSupabaseEnv();
  const shared = sharedAuthCookieOptions();
  const supabase = createServerClient(url, publishableKey, {
    cookieOptions: shared,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, { ...options, ...shared });
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response };
}

export function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
}
