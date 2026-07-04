export default function StorefrontLoading() {
  return (
    <main className="flex flex-col px-4 pt-[max(1.5rem,env(safe-area-inset-top,0px))]">
      <div className="bg-vibe-surface/60 h-48 w-full animate-pulse rounded-[var(--vibe-radius)]" />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-vibe-surface/60 aspect-[3/4] animate-pulse rounded-[var(--vibe-radius)]"
          />
        ))}
      </div>
    </main>
  );
}
