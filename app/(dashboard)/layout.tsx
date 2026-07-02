export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-surface="dashboard" className="min-h-full bg-background">
      {children}
    </div>
  );
}
