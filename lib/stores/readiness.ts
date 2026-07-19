import {
  fulfillmentIsComplete,
  paynowIsComplete,
  type Store,
} from "@/lib/stores/types";

export const READINESS_ITEM_IDS = [
  "store_created",
  "add_products",
  "fulfillment",
  "payments",
  "logo",
  "preview",
  "publish",
] as const;

export type ReadinessItemId = (typeof READINESS_ITEM_IDS)[number];

export type ReadinessItemDef = {
  id: ReadinessItemId;
  title: string;
  description?: string;
  /** Locked items are always done and cannot be toggled (onboarding truth). */
  locked?: boolean;
  /** Internal path or "storefront" for external store URL */
  href: string | "storefront";
};

export const READINESS_ITEMS: ReadinessItemDef[] = [
  {
    id: "store_created",
    title: "Storefront created and store link ready",
    locked: true,
    href: "/settings",
  },
  {
    id: "add_products",
    title: "Add your products",
    description: "Customers need something to buy.",
    href: "/products",
  },
  {
    id: "fulfillment",
    title: "Configure pickup & delivery",
    description: "Let customers know how they'll receive their order.",
    href: "/settings",
  },
  {
    id: "payments",
    title: "Set up payments",
    description: "Connect your PayNow details.",
    href: "/settings",
  },
  {
    id: "logo",
    title: "Add your logo",
    description: "Help customers recognise your brand.",
    href: "/storefront",
  },
  {
    id: "preview",
    title: "Preview your store",
    description: "Experience your shop exactly as customers will.",
    href: "storefront",
  },
  {
    id: "publish",
    title: "Publish with confidence",
    description: "Your store is ready to share.",
    href: "storefront",
  },
];

export type ReadinessDerived = Record<ReadinessItemId, boolean>;

export function deriveReadiness(
  store: Store,
  productCount: number,
): ReadinessDerived {
  return {
    store_created: true,
    add_products: productCount >= 1,
    fulfillment: fulfillmentIsComplete(store.fulfillment),
    payments: paynowIsComplete(store.paynow),
    logo: Boolean(store.hero.logo_url?.trim()),
    preview: false,
    publish: store.status === "published",
  };
}

export function isItemDone(
  id: ReadinessItemId,
  derived: ReadinessDerived,
  overrides: Partial<Record<ReadinessItemId, boolean>>,
): boolean {
  // Onboarding foundation — always complete, ignore overrides
  if (id === "store_created") return true;
  return overrides[id] ?? derived[id];
}

export function countDone(
  derived: ReadinessDerived,
  overrides: Partial<Record<ReadinessItemId, boolean>>,
): number {
  return READINESS_ITEM_IDS.filter((id) =>
    isItemDone(id, derived, overrides),
  ).length;
}

export type ReadinessStorage = {
  overrides: Partial<Record<ReadinessItemId, boolean>>;
  open?: boolean;
};

export function storageKey(storeId: string): string {
  return `nomi:readiness:${storeId}`;
}

export function loadReadinessStorage(storeId: string): ReadinessStorage {
  if (typeof window === "undefined") return { overrides: {} };
  try {
    const raw = localStorage.getItem(storageKey(storeId));
    if (!raw) return { overrides: {} };
    const parsed = JSON.parse(raw) as ReadinessStorage;
    return {
      overrides: parsed.overrides ?? {},
      open: parsed.open,
    };
  } catch {
    return { overrides: {} };
  }
}

export function saveReadinessStorage(
  storeId: string,
  data: ReadinessStorage,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(storeId), JSON.stringify(data));
}
