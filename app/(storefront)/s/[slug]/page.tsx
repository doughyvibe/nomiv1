export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-vibe-text">
        Storefront
      </h1>
      <p className="mt-2 text-vibe-text-muted">Storefront for: {slug}</p>
    </main>
  );
}
