export default function DashboardLoading() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <div className="bg-muted h-8 w-40 animate-pulse rounded-md" />
      <div className="bg-muted h-4 w-56 animate-pulse rounded-md" />
      <div className="flex flex-col gap-3">
        <div className="bg-muted h-24 animate-pulse rounded-lg" />
        <div className="bg-muted h-24 animate-pulse rounded-lg" />
        <div className="bg-muted h-24 animate-pulse rounded-lg" />
      </div>
    </main>
  );
}
