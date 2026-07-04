import { notFound } from "next/navigation";

import { OrderStatusPageContent } from "@/components/storefront/order-status-page";
import { getOrderForPayment } from "@/lib/orders/load-order";
import { buildPayNowPayload } from "@/lib/paynow";
import { formatPayNowExpiry } from "@/lib/paynow/format-expiry";
import { isPaymentWindowExpired } from "@/lib/orders/status";
import { paynowIsComplete } from "@/lib/stores/types";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ slug: string; reference: string }>;
}) {
  const { slug, reference } = await params;
  const data = await getOrderForPayment(slug, reference);
  if (!data) notFound();

  const { order, store } = data;
  const paynow = store.paynow;

  let payload = "";
  if (
    paynowIsComplete(paynow) &&
    order.status === "payment_pending" &&
    !isPaymentWindowExpired(order)
  ) {
    payload = buildPayNowPayload({
      proxyType: paynow.proxy_type!,
      proxyValue: paynow.proxy_value!,
      amount: order.total_cents / 100,
      reference: order.reference,
      merchantName: paynow.recipient_name,
      expiry: formatPayNowExpiry(order.payment_expires_at),
      editable: false,
    });
  }

  return (
    <main>
      <OrderStatusPageContent slug={slug} data={data} payload={payload} />
    </main>
  );
}
