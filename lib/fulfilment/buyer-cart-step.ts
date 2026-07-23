import { fulfilmentDateRequired, maxCartLeadDays } from "@/lib/fulfilment/dates";
import { resolveDeliveryMethods } from "@/lib/fulfilment/delivery-methods";
import type { FulfillmentConfig } from "@/lib/stores/types";

type LeadLine = { lead_time_days?: number | null };

/** Cart should collect method/date before checkout when there is a real choice. */
export function buyerNeedsCartFulfilmentStep(
  fulfillment: FulfillmentConfig,
  cartLeadLines: LeadLine[],
): boolean {
  const pickup = Boolean(fulfillment.pickup?.enabled);
  const deliveryCount = resolveDeliveryMethods(fulfillment).length;
  const methodChoices = (pickup ? 1 : 0) + deliveryCount;
  if (methodChoices > 1) return true;
  const maxLead = maxCartLeadDays(cartLeadLines);
  return fulfilmentDateRequired(fulfillment, maxLead);
}
