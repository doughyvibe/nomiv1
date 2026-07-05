import Link from "next/link";

import { LoginBenefits } from "@/components/auth/login-benefits";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Wordmark } from "@/components/marketing/wordmark";
import { getMarketingUrl } from "@/lib/host";

function getLoginCopy(intent: string | undefined) {
  if (intent === "login") {
    return {
      title: "Welcome back",
      description: "Manage your store, orders, and PayNow settings.",
    };
  }
  return {
    title: "Create your store",
    description: "Get started in minutes — no website required.",
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; intent?: string }>;
}) {
  const { error, intent } = await searchParams;
  const copy = getLoginCopy(intent);
  const marketingUrl = getMarketingUrl("/");
  const termsUrl = getMarketingUrl("/terms");
  const privacyUrl = getMarketingUrl("/privacy");

  return (
    <div
      data-brand
      className="relative flex min-h-dvh flex-col items-center justify-center text-foreground"
    >
      <div
        className="brand-grain pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div
        className="brand-orb animate-brand-drift-1 pointer-events-none absolute top-[12%] left-[6%] size-64 bg-[rgba(247,197,24,0.1)]"
        aria-hidden
      />
      <div
        className="brand-orb animate-brand-drift-2 pointer-events-none absolute right-[8%] bottom-[14%] size-72 bg-[rgba(124,47,224,0.08)]"
        aria-hidden
      />

      <main className="relative w-full px-4 py-12 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <article className="rounded-[24px] border border-border bg-card shadow-[0_8px_32px_rgba(22,19,14,0.08)]">
            <div className="p-8 sm:p-10">
              <Link href={marketingUrl} aria-label="Nomi home">
                <Wordmark />
              </Link>

              <header className="mt-8">
                <h1 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em]">
                  {copy.title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
              </header>

              <div className="mt-6">
                {error ? (
                  <p className="mb-3 text-sm text-destructive">
                    Sign-in failed. Please try again.
                  </p>
                ) : null}
                <GoogleSignInButton />
              </div>

              <section
                className="mt-8 border-t border-border pt-8"
                aria-label="Why Nomi"
              >
                <LoginBenefits />
              </section>

              <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
                By continuing, you agree to Nomi&apos;s{" "}
                <Link
                  href={termsUrl}
                  className="text-foreground underline underline-offset-2 hover:opacity-80"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href={privacyUrl}
                  className="text-foreground underline underline-offset-2 hover:opacity-80"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </article>

          <p className="mt-6 text-center">
            <Link
              href={marketingUrl}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to Nomi
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
