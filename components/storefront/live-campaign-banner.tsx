import {
  campaignBannerText,
  resolveActiveCampaign,
} from "@/lib/fulfilment/campaigns";
import type { FulfillmentConfig } from "@/lib/stores/types";

export function LiveCampaignBanner({
  fulfillment,
}: {
  fulfillment: FulfillmentConfig;
}) {
  const campaign = resolveActiveCampaign(fulfillment);
  if (!campaign) return null;

  return (
    <div
      role="status"
      className="border-b border-vibe-primary/30 bg-vibe-primary/10 px-4 py-2.5 text-center text-sm text-vibe-text"
    >
      <p className="font-semibold">{campaignBannerText(campaign)}</p>
    </div>
  );
}
