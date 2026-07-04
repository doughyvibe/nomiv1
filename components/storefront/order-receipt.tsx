import { formatFulfillmentSummary } from "@/lib/orders/contact-buyer";
import { formatPrice } from "@/lib/money";
import type { LoadedOrder } from "@/lib/orders/load-order";

export function OrderReceipt({
  data,
  showPaidLabel = false,
}: {
  data: LoadedOrder;
  showPaidLabel?: boolean;
}) {
  const { order, store, items } = data;

  return (
    <div className="metal-panel rust-edge w-full rounded-[var(--vibe-radius)] p-4 text-left text-sm">
      <p className="vibe-display text-xs font-semibold text-vibe-text-muted uppercase">
        {showPaidLabel ? "Order receipt" : "Order summary"}
      </p>

      <dl className="mt-3 space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-vibe-text-muted">Store</dt>
          <dd className="text-right font-medium">{store.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-vibe-text-muted">Reference</dt>
          <dd className="break-all text-right font-medium">{order.reference}</dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-2 border-t border-vibe-border/30 pt-3">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <span className="shrink-0">
              {formatPrice(item.price_cents * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-3 space-y-1 border-t border-vibe-border/30 pt-3">
        <div className="flex justify-between">
          <dt className="text-vibe-text-muted">Subtotal</dt>
          <dd>{formatPrice(order.subtotal_cents)}</dd>
        </div>
        {order.fulfillment_fee_cents > 0 && (
          <div className="flex justify-between">
            <dt className="text-vibe-text-muted">Delivery fee</dt>
            <dd>{formatPrice(order.fulfillment_fee_cents)}</dd>
          </div>
        )}
        <div className="flex justify-between font-semibold text-vibe-primary">
          <dt>{showPaidLabel ? "Total paid" : "Total due"}</dt>
          <dd>{formatPrice(order.total_cents)}</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-vibe-border/30 pt-3">
        <p className="text-vibe-text-muted text-xs font-medium uppercase">
          Fulfillment
        </p>
        <p className="mt-1 capitalize">{order.fulfillment_method}</p>
        <p className="text-vibe-text-muted mt-0.5 text-xs">
          {formatFulfillmentSummary(order)}
        </p>
      </div>
    </div>
  );
}
