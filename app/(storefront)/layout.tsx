export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-surface="storefront" data-vibe="industrial" className="min-h-full">
      {children}
    </div>
  );
}
