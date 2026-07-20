import { getMarketingUrl } from "@/lib/host";

export function StoreComingSoon({
  storeName,
  slug,
}: {
  storeName: string;
  slug: string;
}) {
  const marketingUrl = getMarketingUrl("/");

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8 text-center">
      <p className="font-display text-sm tracking-widest text-vibe-text-muted uppercase">
        Coming soon
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-vibe-text">
        {storeName}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-vibe-text-muted">
        This store is coming soon.
      </p>
      <p className="mt-8 max-w-sm text-sm text-vibe-text-muted">
        Built with Nomi —{" "}
        <a
          href={marketingUrl}
          className="font-medium text-vibe-primary underline underline-offset-2"
        >
          create your own storefront
        </a>
      </p>
      <p className="mt-2 text-xs text-vibe-text-muted/80">{slug}</p>
    </main>
  );
}
