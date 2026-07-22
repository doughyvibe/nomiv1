import type { PayNowProxyType } from "@/lib/paynow";
import type { ProductStatus } from "@/lib/products/contracts";
import type { ProductCustomisation } from "@/lib/products/customisations";
import type { SoldOutPolicy } from "@/lib/products/inventory";
import type {
  ProductOption,
  ProductVariant,
} from "@/lib/products/variants";

export type Vibe =
  | "atelier"
  | "expedition"
  | "cyberpunk"
  | "epicurean"
  | "candyland"
  | "gallery"
  | "market"
  | "studio"
  | "laura"
  | "atlantic"
  | "vows"
  | "strada";

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
  /** Set when seller continues past onboarding Store Branding (optional fields). */
  onboarding_branding_done?: boolean;
  /** @deprecated */
  cta?: string;
  /** @deprecated Cover/banner — not used (product lock: no hero banner) */
  image_url?: string;
  /** @deprecated */
  order?: HeroBlock[];
};

/** Named handoff window (AM/PM or custom). Phase 7. */
export type FulfilmentWindow = {
  /** Stable id stored on the order snapshot. */
  id: string;
  /** Buyer-facing label, e.g. "Morning (AM)" or "1–5pm". */
  label: string;
  /** Max orders for this window on a given date; omit/null = unlimited. */
  capacity?: number | null;
};

/**
 * Store-level handoff calendar (Phase 6 dates + Phase 7 windows/blackouts/capacity).
 */
export type FulfilmentCalendarConfig = {
  enabled: boolean;
  /** JS weekday: 0=Sun … 6=Sat */
  allowed_weekdays: number[];
  /** Calendar days from earliest to offer (default 28). */
  horizon_days?: number;
  /** YYYY-MM-DD dates never offerable. */
  blackouts?: string[];
  /** Named windows; empty/absent = date-only checkout. */
  windows?: FulfilmentWindow[];
  /** Max orders per day across windows; omit/null = unlimited. */
  daily_capacity?: number | null;
};

/**
 * Live / campaign override (Phase 8). Stored on `stores.fulfillment.campaign`.
 * When active (and not expired), checkout locks to campaign methods/dates/windows.
 */
export type FulfilmentCampaign = {
  active: boolean;
  /** Storefront banner copy. */
  banner?: string;
  /** Preset id, e.g. tomorrow_delivery_1_5. */
  preset?: string;
  /** Methods allowed during Live; omit = keep store methods. */
  methods?: ("pickup" | "delivery")[];
  /** Exact YYYY-MM-DD dates; omit = no date lock. */
  dates?: string[];
  /** Campaign-owned windows (prefer over calendar when set). */
  windows?: FulfilmentWindow[];
  /** Or filter existing calendar windows by id. */
  window_ids?: string[];
  /** ISO timestamp; after this, engine treats campaign as off. */
  expires_at?: string | null;
  started_at?: string;
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
  /** Optional calendar; date step also fires when cart max lead_time > 0 (§8 #2). */
  calendar?: FulfilmentCalendarConfig;
  /** Optional Live mode override (Phase 8). */
  campaign?: FulfilmentCampaign;
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
  stripe_customer_id?: string | null;
  subscription_id?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  subscription_period_end?: string | null;
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
  /** Source of truth for catalog lifecycle (Phase 1+). */
  status: ProductStatus;
  /** Transition mirror of status === 'archived'; prefer `status`. */
  archived: boolean;
  /**
   * Prep constraint in whole days (Phase 5). Default 0.
   * Constraint only — never shown as a buyer date picker on product/catalog.
   */
  lead_time_days?: number;
  /** Opt-in choices (Phase 2). Empty/absent = simple one-tap offer. */
  options?: ProductOption[];
  variants?: ProductVariant[];
  /** Typed prompts (Phase 3). Empty/absent = none. */
  customisations?: ProductCustomisation[];
  /** Opt-in stock (Phase 4). Default false = unlimited. */
  track_inventory?: boolean;
  /** Product-level qty when tracking and no variants. */
  stock_qty?: number | null;
  /** When tracking hits 0: hide from catalog or show as sold out. */
  sold_out_policy?: SoldOutPolicy;
};

export function heroIsComplete(hero: Partial<HeroConfig>): boolean {
  return Boolean(hero.title?.trim());
}

export function fulfillmentIsComplete(f: FulfillmentConfig): boolean {
  return Boolean(f.pickup?.enabled || f.delivery?.enabled);
}

export function paynowIsComplete(p: Partial<PayNowConfig>): boolean {
  return Boolean(p.proxy_type && p.proxy_value?.trim() && p.recipient_name?.trim());
}
