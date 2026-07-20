import { createBrowserClient } from "@supabase/ssr";

import { sharedAuthCookieOptions } from "@/lib/supabase/cookie-options";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createBrowserClient(url, publishableKey, {
    cookieOptions: sharedAuthCookieOptions(),
  });
}
