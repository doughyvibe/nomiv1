import { cn } from "@/lib/utils";
import type { HeroConfig, Product, Vibe } from "@/lib/stores/types";
import { HERO_BLOCKS } from "@/lib/stores/types";

type MiniPreviewProps = {
  vibe: Vibe;
  storeName: string;
  hero?: Partial<HeroConfig>;
  products?: Pick<Product, "name" | "price_cents" | "image_url" | "category">[];
  className?: string;
};

function formatPrice(cents: number): string {
  return `S$${(cents / 100).toFixed(2)}`;
}

/**
 * Phone-frame storefront preview rendered with real vibe tokens.
 * Used in the vibe picker (sample data), hero designer (live), and publish step.
 */
export function MiniPreview({
  vibe,
  storeName,
  hero,
  products = [],
  className,
}: MiniPreviewProps) {
  const order = hero?.order?.length ? hero.order : [...HERO_BLOCKS];
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ] as string[];

  const heroBlocks: Record<string, React.ReactNode> = {
    eyebrow: hero?.eyebrow ? (
      <p
        key="eyebrow"
        className="vibe-display text-[10px] tracking-widest uppercase"
        style={{ color: "rgb(var(--vibe-primary))" }}
      >
        {hero.eyebrow}
      </p>
    ) : null,
    image: hero?.image_url ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key="image"
        src={hero.image_url}
        alt=""
        className="h-20 w-full rounded object-cover"
      />
    ) : null,
    title: (
      <h2
        key="title"
        className="vibe-display font-display text-lg leading-tight font-bold"
      >
        {hero?.title || storeName}
      </h2>
    ),
    subheading: hero?.subheading ? (
      <p
        key="subheading"
        className="text-[11px] leading-snug"
        style={{ color: "rgb(var(--vibe-text-muted))" }}
      >
        {hero.subheading}
      </p>
    ) : null,
    cta: (
      <span
        key="cta"
        className="vibe-display inline-block px-3 py-1.5 text-[10px] font-semibold"
        style={{
          backgroundColor: "rgb(var(--vibe-primary))",
          color: "rgb(var(--vibe-primary-fg))",
          borderRadius: "var(--vibe-radius)",
        }}
      >
        {hero?.cta || "Shop now"}
      </span>
    ),
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[240px] overflow-hidden rounded-[1.5rem] border-4 border-zinc-800 shadow-lg",
        className,
      )}
    >
      <div
        data-vibe={vibe}
        className="flex h-[420px] flex-col gap-3 overflow-hidden p-4"
      >
        {/* Hero */}
        <div className="flex flex-col gap-1.5">
          {order.map((block) => heroBlocks[block])}
        </div>

        {/* Category pills: only when 2+ categories exist (PRD §13) */}
        {categories.length >= 2 && (
          <div className="flex gap-1.5 overflow-hidden">
            {["All", ...categories].map((cat, i) => (
              <span
                key={cat}
                className="vibe-display shrink-0 px-2 py-0.5 text-[9px]"
                style={{
                  backgroundColor:
                    i === 0 ? "rgb(var(--vibe-primary))" : "rgb(var(--vibe-surface))",
                  color:
                    i === 0
                      ? "rgb(var(--vibe-primary-fg))"
                      : "rgb(var(--vibe-text-muted))",
                  borderRadius: "var(--vibe-radius)",
                  border: "1px solid rgb(var(--vibe-border) / 0.4)",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-2">
          {(products.length
            ? products.slice(0, 4)
            : [
                { name: "Product one", price_cents: 950, image_url: null },
                { name: "Product two", price_cents: 1250, image_url: null },
              ]
          ).map((p, i) => (
            <div
              key={i}
              className="metal-panel rust-edge flex flex-col gap-1 p-2"
              style={{
                backgroundColor: "rgb(var(--vibe-surface))",
                borderRadius: "var(--vibe-radius)",
                border: "1px solid rgb(var(--vibe-border) / 0.4)",
              }}
            >
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image_url}
                  alt=""
                  className="h-14 w-full rounded object-cover"
                />
              ) : (
                <div
                  className="h-14 w-full rounded"
                  style={{ backgroundColor: "rgb(var(--vibe-border) / 0.3)" }}
                />
              )}
              <p className="vibe-display truncate text-[10px] font-semibold">
                {p.name}
              </p>
              <p
                className="text-[10px] font-medium"
                style={{ color: "rgb(var(--vibe-primary))" }}
              >
                {formatPrice(p.price_cents)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
