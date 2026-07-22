import { CheckoutForm } from "@/components/storefront/checkout-form";
import { loadCapacityUsage } from "@/lib/fulfilment/capacity";
import {
  hasCapacityLimits,
  todaySgYmd,
} from "@/lib/fulfilment/dates";
import { getCheckoutStorefront } from "@/lib/stores/load-storefront";
import type { FulfillmentConfig } from "@/lib/stores/types";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const storefront = await getCheckoutStorefront(slug);
  const fulfillment = storefront?.store.fulfillment as
    | FulfillmentConfig
    | undefined;

  let capacityUsage = undefined;
  if (storefront && fulfillment && hasCapacityLimits(fulfillment)) {
    const admin = createAdminClient();
    capacityUsage = await loadCapacityUsage(
      admin,
      storefront.store.id,
      todaySgYmd(),
    );
  }

  return (
    <main>
      <CheckoutForm slug={slug} capacityUsage={capacityUsage} />
    </main>
  );
}
