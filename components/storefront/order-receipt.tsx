import { formatFulfillmentSummary } from "@/lib/orders/contact-buyer";
import { formatPrice } from "@/lib/money";
import type { LoadedOrder } from "@/lib/orders/load-order";
import { formatCustomisationSnapshotLines } from "@/lib/products/customisations";
import { formatFulfilmentDateLabel } from "@/lib/fulfilment/dates";
import { cn } from "@/lib/utils";

export function OrderReceipt({
  data,
  showPaidLabel = false,
  atelier = false,
  expedition = false,
  cyberpunk = false,
  candyland = false,
  market = false,
  gallery = false,
  studio = false,
  laura = false,
  atlantic = false,
  strada = false,
}: {
  data: LoadedOrder;
  showPaidLabel?: boolean;
  atelier?: boolean;
  expedition?: boolean;
  cyberpunk?: boolean;
  candyland?: boolean;
  market?: boolean;
  gallery?: boolean;
  studio?: boolean;
  laura?: boolean;
  atlantic?: boolean;
  strada?: boolean;
}) {
  const { order, store, items } = data;
  const fulfillmentSummary = formatFulfillmentSummary(order);
  const methodLabel =
    order.fulfillment_method === "delivery" &&
    order.delivery_method_label?.trim()
      ? order.delivery_method_label.trim()
      : order.fulfillment_method.charAt(0).toUpperCase() +
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
        candyland && "checkout-candyland-panel",
          market && "checkout-market-panel",
          gallery && "checkout-gallery-panel",
          studio && "checkout-studio-panel",
          laura && "checkout-laura-panel",
          atlantic && "checkout-atlantic-panel",
          strada && "checkout-strada-panel",
      )}
    >
      <p
        className={cn(
          "vibe-display text-xs font-semibold text-vibe-text-muted uppercase",
          atelier && "checkout-atelier-section-label",
          expedition && "checkout-expedition-section-label",
          cyberpunk && "checkout-cyberpunk-section-label",
          candyland && "checkout-candyland-section-label",
          market && "checkout-market-section-label",
          gallery && "checkout-gallery-section-label",
          studio && "checkout-studio-section-label",
          laura && "checkout-laura-section-label",
          atlantic && "checkout-atlantic-section-label",
          strada && "checkout-strada-section-label",
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
        {items.map((item) => {
          const customLines = formatCustomisationSnapshotLines(
            item.customisations_snapshot,
          );
          return (
          <li key={item.id} className="flex justify-between gap-4">
            <span className="min-w-0">
              {item.product_name} × {item.quantity}
              {item.variant_label?.trim() ? (
                <span className="mt-0.5 block text-xs text-vibe-text-muted">
                  {item.variant_label}
                </span>
              ) : null}
              {customLines.map((line) => (
                <span
                  key={line}
                  className="mt-0.5 block text-xs text-vibe-text-muted"
                >
                  {line}
                </span>
              ))}
            </span>
            <span className="shrink-0">
              {formatPrice(item.price_cents * item.quantity)}
            </span>
          </li>
          );
        })}
      </ul>

      <dl className="mt-3 space-y-1 border-t border-vibe-border/30 pt-3">
        <div className="flex justify-between">
          <dt className="text-vibe-text-muted">Subtotal</dt>
          <dd>{formatPrice(order.subtotal_cents)}</dd>
        </div>
        {order.fulfillment_method === "delivery" &&
        order.fulfillment_fee_cents === 0 ? (
          <div className="flex justify-between">
            <dt className="text-vibe-text-muted">Delivery</dt>
            <dd>Free</dd>
          </div>
        ) : order.fulfillment_fee_cents > 0 ? (
          <div className="flex justify-between">
            <dt className="text-vibe-text-muted">
              {order.delivery_method_label?.trim() || "Delivery"} fee
            </dt>
            <dd>{formatPrice(order.fulfillment_fee_cents)}</dd>
          </div>
        ) : null}
        <div
          className={cn(
            "flex justify-between font-semibold text-vibe-primary",
            atelier && "checkout-atelier-total",
            expedition && "pay-expedition-amount",
            cyberpunk && "pay-cyberpunk-amount",
            candyland && "pay-candyland-amount",
          market && "pay-market-amount",
          gallery && "pay-gallery-amount",
          studio && "pay-studio-amount",
          laura && "pay-laura-amount",
          atlantic && "pay-atlantic-amount",
          strada && "pay-strada-amount",
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
          candyland && "checkout-candyland-section-label",
          market && "checkout-market-section-label",
          gallery && "checkout-gallery-section-label",
          studio && "checkout-studio-section-label",
          laura && "checkout-laura-section-label",
          atlantic && "checkout-atlantic-section-label",
          strada && "checkout-strada-section-label",
          )}
        >
          Fulfillment
        </p>
        <p className="mt-1 capitalize">{methodLabel}</p>
        {order.fulfillment_date ? (
          <p className="mt-0.5 text-sm font-medium">
            {formatFulfilmentDateLabel(order.fulfillment_date)}
            {order.fulfillment_window_label?.trim()
              ? ` · ${order.fulfillment_window_label.trim()}`
              : ""}
          </p>
        ) : null}
        {showSummaryDetail ? (
          <p className="text-vibe-text-muted mt-0.5 text-xs">
            {fulfillmentSummary}
          </p>
        ) : null}
      </div>
    </div>
  );
}
