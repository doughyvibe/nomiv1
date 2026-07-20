import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { sharedAuthCookieOptions } from "@/lib/supabase/cookie-options";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function createClient() {
  const { url, publishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();
  const shared = sharedAuthCookieOptions();

  return createServerClient(url, publishableKey, {
    cookieOptions: shared,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, { ...options, ...shared });
          });
        } catch {
          // ponytail: setAll can fail in Server Components; session refresh moves to middleware
        }
      },
    },
  });
}
