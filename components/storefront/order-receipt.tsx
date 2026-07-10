import { formatFulfillmentSummary } from "@/lib/orders/contact-buyer";
import { formatPrice } from "@/lib/money";
import type { LoadedOrder } from "@/lib/orders/load-order";
import { cn } from "@/lib/utils";

export function OrderReceipt({
  data,
  showPaidLabel = false,
  atelier = false,
  expedition = false,
  cyberpunk = false,
}: {
  data: LoadedOrder;
  showPaidLabel?: boolean;
  atelier?: boolean;
  expedition?: boolean;
  cyberpunk?: boolean;
}) {
  const { order, store, items } = data;
  const fulfillmentSummary = formatFulfillmentSummary(order);
  const methodLabel =
    order.fulfillment_method.charAt(0).toUpperCase() +
    order.fulfillment_method.slice(1);
  // Avoid "Pickup / Pickup" — only show summary when it adds detail
  const showSummaryDetail =
    fulfillmentSummary.toLowerCase() !== methodLabel.toLowerCase();

  return (
    <div
      className={cn(
        "metal-panel rust-edge w-full rounded-[var(--vibe-radius)] p-4 text-left text-sm",
        atelier && "checkout-atelier-panel",
        expedition && "checkout-expedition-panel",
        cyberpunk && "checkout-cyberpunk-panel",
      )}
    >
      <p
        className={cn(
          "vibe-display text-xs font-semibold text-vibe-text-muted uppercase",
          atelier && "checkout-atelier-section-label",
          expedition && "checkout-expedition-section-label",
          cyberpunk && "checkout-cyberpunk-section-label",
        )}
      >
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
        <div
          className={cn(
            "flex justify-between font-semibold text-vibe-primary",
            atelier && "checkout-atelier-total",
            expedition && "pay-expedition-amount",
            cyberpunk && "pay-cyberpunk-amount",
          )}
        >
          <dt>{showPaidLabel ? "Total paid" : "Total due"}</dt>
          <dd>{formatPrice(order.total_cents)}</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-vibe-border/30 pt-3">
        <p
          className={cn(
            "text-vibe-text-muted text-xs font-medium uppercase",
            atelier && "checkout-atelier-section-label",
          expedition && "checkout-expedition-section-label",
          cyberpunk && "checkout-cyberpunk-section-label",
          )}
        >
          Fulfillment
        </p>
        <p className="mt-1 capitalize">{methodLabel}</p>
        {showSummaryDetail ? (
          <p className="text-vibe-text-muted mt-0.5 text-xs">
            {fulfillmentSummary}
          </p>
        ) : null}
      </div>
    </div>
  );
}
