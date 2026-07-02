"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

function getDashboardOrigin(): string {
  const root =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0] ?? "lvh.me";
  const port = window.location.port ? `:${window.location.port}` : "";
  return `${window.location.protocol}//app.${root}${port}`;
}

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const redirectTo = `${getDashboardOrigin()}/auth/callback?next=/`;

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (oauthError) {
        setLoading(false);
        setError(oauthError.message);
        return;
      }

      if (data.url) {
        window.location.assign(data.url);
        return;
      }

      setLoading(false);
      setError("No OAuth URL returned. Check Supabase Google provider settings.");
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Sign-in failed to start.");
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="h-10 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
        disabled={loading}
        onClick={handleSignIn}
      >
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
