import {
  fulfillmentIsComplete,
  paynowIsComplete,
  type Store,
} from "@/lib/stores/types";

export const READINESS_ITEM_IDS = [
  "store_created",
  "add_products",
  "fulfillment",
  "personalise",
  "style",
  "payments",
  "preview",
  "install",
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
  /** Featured-card primary button label (omit for locked items). */
  ctaLabel?: string;
};

export const READINESS_ITEMS: ReadinessItemDef[] = [
  {
    id: "store_created",
    title: "Store's foundation created",
    locked: true,
    href: "/settings",
  },
  {
    id: "add_products",
    title: "Add more products",
    description:
      "Customers can’t buy until there’s something to browse. Add your catalog to bring your store to life.",
    href: "/products",
    ctaLabel: "Add products",
  },
  {
    id: "fulfillment",
    title: "Configure fulfilment",
    description:
      "Complete your pickup and delivery details before accepting your first order.",
    href: "/settings",
    ctaLabel: "Open settings",
  },
  {
    id: "personalise",
    title: "Personalise your storefront",
    description:
      "Give customers a great first impression with a welcoming short introduction about your business.",
    href: "/storefront",
    ctaLabel: "Open storefront",
  },
  {
    id: "style",
    title: "Find your store’s style",
    description:
      "Try different storefront styles until you find one that perfectly matches your brand and products",
    href: "/storefront",
    ctaLabel: "Open storefront",
  },
  {
    id: "payments",
    title: "Verify your PayNow details",
    description:
      "Double-check your PayNow information so every payment goes to the right account.",
    href: "/settings",
    ctaLabel: "Open settings",
  },
  {
    id: "preview",
    title: "Test your first order",
    description:
      "Open your store link, browse your store and place a test order to make sure everything feels smooth before sharing it.",
    href: "storefront",
    ctaLabel: "Open store",
  },
  {
    id: "install",
    title: "Install Nomi on your phone",
    description:
      "Get instant order notifications and manage your store like an app—right from your home screen.",
    href: "/settings/install",
    ctaLabel: "How to install",
  },
  {
    id: "publish",
    title: "Publish with confidence",
    description:
      "You’ve done the hard work. Use Publish below when you’re ready to go live.",
    href: "/dashboard",
    // ponytail: no ctaLabel — dedicated PublishStoreCta sits under the checklist
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
    personalise: Boolean(store.hero.subheading?.trim()),
    // vibe is defaulted at create — treat style / install / preview as manual
    style: false,
    payments: paynowIsComplete(store.paynow),
    preview: false,
    install: false,
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
  /** Only meaningful when checklist is 100% — incomplete always starts open. */
  open?: boolean;
};

/** Incomplete → always open on load; complete → remember preference (default collapsed). */
export function initialChecklistOpen(
  allDone: boolean,
  storedOpen?: boolean,
): boolean {
  return allDone ? (storedOpen ?? false) : true;
}

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
