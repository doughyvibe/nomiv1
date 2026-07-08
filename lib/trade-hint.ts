import type { TradeHint } from "@/lib/stores/types";

export const TRADE_HINTS: {
  id: TradeHint;
  label: string;
  description: string;
}[] = [
  {
    id: "general",
    label: "General shop",
    description: "Mixed products and gifts",
  },
  {
    id: "food",
    label: "Food & drink",
    description: "Bakes, meals, beverages",
  },
  {
    id: "handmade",
    label: "Handmade & retail",
    description: "Crafts, jewellery, accessories",
  },
  {
    id: "services",
    label: "Services & digital",
    description: "Consulting, courses, bookings",
  },
  {
    id: "plants",
    label: "Plants & home",
    description: "Plants, pots, home goods",
  },
];

const STARTER_CATEGORIES: Record<TradeHint, string[]> = {
  general: ["Shop", "Bundles", "New", "Gifts"],
  food: ["Coffee", "Desserts", "Drinks", "Gift Sets"],
  handmade: ["Accessories", "Bestsellers", "Custom", "Sets"],
  services: ["Services", "Courses", "Consultations", "Packages"],
  plants: ["Plants", "Pots", "Care Kits", "Bundles"],
};

export function categorySuggestions(
  tradeHint: TradeHint | null | undefined,
  existing: string[],
): string[] {
  const starters = STARTER_CATEGORIES[tradeHint ?? "general"];
  const merged = [...existing];
  for (const s of starters) {
    if (!merged.some((c) => c.toLowerCase() === s.toLowerCase())) {
      merged.push(s);
    }
  }
  return merged.slice(0, 12);
}
