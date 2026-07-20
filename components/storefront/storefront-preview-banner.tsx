export function StorefrontPreviewBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-50 border-b border-amber-300/80 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950"
    >
      <p className="font-semibold">Preview mode — only you can see this shop</p>
      <p className="mt-0.5 text-amber-900/80">
        Customers still see Coming Soon. You can place a test order to check
        PayNow.
      </p>
    </div>
  );
}
