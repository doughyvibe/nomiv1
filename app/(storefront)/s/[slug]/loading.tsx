export default function StorefrontLoading() {
  return (
    <main className="flex flex-col px-5 pt-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
        <div className="bg-vibe-surface/60 size-14 animate-pulse rounded-full" />
        <div className="bg-vibe-surface/60 h-8 w-48 animate-pulse rounded-lg" />
        <div className="bg-vibe-surface/60 h-4 w-64 animate-pulse rounded" />
      </div>
      <div className="bg-vibe-surface/60 mx-auto mt-10 h-48 w-full max-w-2xl animate-pulse rounded-[var(--vibe-radius)]" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-vibe-surface/60 aspect-[4/5] animate-pulse rounded-[var(--vibe-radius)]"
          />
        ))}
      </div>
    </main>
  );
}
