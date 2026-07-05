export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-9 w-56 animate-pulse rounded-xl bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="dashboard-panel h-48 animate-pulse bg-card" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="dashboard-panel h-28 animate-pulse bg-card" />
        <div className="dashboard-panel h-28 animate-pulse bg-card" />
        <div className="dashboard-panel h-28 animate-pulse bg-card" />
      </div>
    </div>
  );
}
