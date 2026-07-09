import type { PayNowProxyType } from "@/lib/paynow";

export type Vibe = "atelier" | "outback" | "futuristic" | "epicurean";

export type TradeHint = "general" | "food" | "handmade" | "services" | "plants";

export type StoreStatus =
  | "draft"
  | "published"
  | "unpublished"
  | "suspended"
  | "deleted";

/** @deprecated Legacy hero blocks — fixed order in storefront v2 */
export const HERO_BLOCKS = [
  "eyebrow",
  "title",
  "subheading",
] as const;
export type HeroBlock = (typeof HERO_BLOCKS)[number];

export const HERO_LOGO_SIZES = ["s", "m", "l"] as const;
export type HeroLogoSize = (typeof HERO_LOGO_SIZES)[number];

export const HERO_LOGO_STYLES = ["plain", "rounded", "circle"] as const;
export type HeroLogoStyle = (typeof HERO_LOGO_STYLES)[number];

export type HeroConfig = {
  eyebrow?: string;
  title: string;
  subheading?: string;
  logo_url?: string;
  /** Brand mark size preset — default medium */
  logo_size?: HeroLogoSize;
  /** Frame style — default plain (no crop). Circle uses contain, not cover. */
  logo_style?: HeroLogoStyle;
  /** @deprecated */
  cta?: string;
  /** @deprecated Cover/banner — not used (product lock: no hero banner) */
  image_url?: string;
  /** @deprecated */
  order?: HeroBlock[];
};

export type FulfillmentConfig = {
  pickup?: {
    enabled: boolean;
    instructions: string;
    location?: string;
  };
  delivery?: {
    enabled: boolean;
    fee_cents: number;
    instructions: string;
  };
};

export type PayNowConfig = {
  proxy_type: PayNowProxyType;
  proxy_value: string;
  recipient_name: string;
  instructions?: string;
};

export type Store = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  status: StoreStatus;
  vibe: Vibe | null;
  hero: Partial<HeroConfig>;
  fulfillment: FulfillmentConfig;
  paynow: Partial<PayNowConfig>;
  featured_product_id?: string | null;
  featured_section_title?: string | null;
  trade_hint?: TradeHint | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  store_id: string;
  name: string;
  price_cents: number;
  description: string;
  image_url: string | null;
  category: string | null;
  archived: boolean;
};

export function heroIsComplete(hero: Partial<HeroConfig>): boolean {
  return Boolean(hero.title?.trim());
}

export function fulfillmentIsComplete(f: FulfillmentConfig): boolean {
  const pickupOk = f.pickup?.enabled && f.pickup.instructions?.trim();
  const deliveryOk =
    f.delivery?.enabled &&
    typeof f.delivery.fee_cents === "number" &&
    f.delivery.instructions?.trim();
  return Boolean(pickupOk || deliveryOk);
}

export function paynowIsComplete(p: Partial<PayNowConfig>): boolean {
  return Boolean(p.proxy_type && p.proxy_value?.trim() && p.recipient_name?.trim());
}
