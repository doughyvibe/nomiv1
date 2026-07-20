export function StoreUnavailable({
  slug,
  storeName,
}: {
  slug: string;
  storeName?: string;
}) {
  const title = storeName?.trim();

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8 text-center">
      <p className="font-display text-sm tracking-widest text-vibe-text-muted uppercase">
        Store closed
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold text-vibe-text">
        {title || "This store isn’t open right now"}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-vibe-text-muted">
        {title ? (
          "This store is currently closed. Check back later or contact the seller directly."
        ) : (
          <>
            <span className="font-medium text-vibe-text">{slug}</span> may be
            unpublished or temporarily suspended. Check back later or contact the
            seller directly.
          </>
        )}
      </p>
    </main>
  );
}
