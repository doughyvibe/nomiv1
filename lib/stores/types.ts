import type { PayNowProxyType } from "@/lib/paynow";

export type Vibe = "unicorn" | "outback" | "futuristic" | "industrial";

export type StoreStatus =
  | "draft"
  | "published"
  | "unpublished"
  | "suspended"
  | "deleted";

export const HERO_BLOCKS = [
  "eyebrow",
  "image",
  "title",
  "subheading",
  "cta",
] as const;
export type HeroBlock = (typeof HERO_BLOCKS)[number];

export type HeroConfig = {
  eyebrow?: string;
  title: string;
  subheading?: string;
  cta?: string;
  image_url?: string;
  order: HeroBlock[];
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
