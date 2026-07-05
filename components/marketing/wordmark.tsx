export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex size-7 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
        n
        <span
          className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[var(--brand-purple)]"
          aria-hidden
        />
      </span>
      <span className="text-xl font-extrabold tracking-[-0.03em]">nomi</span>
    </span>
  );
}
