# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase 7 — Vibes + Marketing:** ✅ COMPLETE (4/4)
**Phase 8 — Polish, Hardening & Launch:** in progress (3/4)
**Just finished:** UI overhaul part 1 (v2) — marketing landing page rebuilt in "Warm Tactile" brand (whacka-inspired)
**Next up:** Task 8.4 — Final Deploy & Full Production Smoke Test 👤

---

### Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-11 | Market visual overhaul (shop home + cart/checkout/payment/PDP) | Libre Caslon + DM Sans; peach/terracotta/linen; outline featured “Add to cart”; soft linen sticky dock (not mockup charcoal); no cover/bottom nav |
| 2026-07-11 | Candyland visual overhaul (shop home + cart/checkout/payment/PDP) | League Spartan + Satoshi; neo-brutalist pink/purple/lime; hard shadows; candy stripes hero; featured “Add to cart”; sticky lime bar; no cover/tints/bottom nav |
| 2026-07-11 | Added provisional vibes: **Candyland**, **Gallery**, **Market** | Light placeholder tokens + picker entries; Candyland + Market overhauled since; Gallery still provisional |
| 2026-07-11 | Cyberpunk visual overhaul (shop home + cart/checkout/payment/PDP) | Orbitron + Space Grotesk; black/cyan/purple neon; sticky checkout; featured “Add to cart”; no cover/hero CTA/bottom nav/fake specs; scoped under `[data-vibe="cyberpunk"]` |
| 2026-07-11 | Futuristic renamed → **Cyberpunk** (`vibe: "cyberpunk"`) | Display + DB id; migration remaps `futuristic` → `cyberpunk` |
| 2026-07-09 | Noir (`epicurean`) storefront styling complete | Hero, featured, catalog, sticky bar — scoped under `[data-vibe="epicurean"]` |
| 2026-07-10 | Expedition visual overhaul (shop home + cart/checkout/payment/PDP) | Chivo + JetBrains Mono + Hanken; navy/safety-yellow; 0 radius; hard shadows; scoped under `[data-vibe="expedition"]`; featured CTA “Add to cart”; no cover/hero CTA/bottom nav/fake specs |
| 2026-07-10 | Outback renamed → **Expedition** (`vibe: "expedition"`) | Display + DB id; migration remaps `outback` → `expedition` |
| 2026-07-10 | Hero logo is shared media (all vibes); **no banner/cover** | `logo_size` + `logo_style` on `HeroConfig`; render with `object-contain` (never crop); circle frames without cover-crop |
| 2026-07-10 | Atelier visual overhaul (shop home) | EB Garamond + DM Sans; hero/featured/catalog/sticky/MiniPreview scoped under `[data-vibe="atelier"]`; no cover/CTA/monogram |
| 2026-07-10 | Unicorn renamed → **Atelier** (`vibe: "atelier"`) | Display + DB id; migration remaps `unicorn` → `atelier`; monogram dropped when no logo |
| 2026-07-09 | Unicorn overhaul supersedes `lavenderTheme.md` | New mockups are spec; old Phase 7 lavender doc is provisional only |
| 2026-07-03 | Per-vibe CSS on shared classes | One storefront codebase; `[data-vibe]` drives look |
| 2026-07-03 | Theme docs as rough guides only | Adapted to Nomi token system, not 1:1 port |
| 2026-07-03 | `MiniPreview` for marketing mockup | Reuses live vibe preview; no static screenshot asset |
| 2026-07-03 | Demo slug via env, default `jigwave` | PRD example; override without code change |
| 2026-07-03 | In-memory rate limit (MVP) | Task 8.2 basic protection; upgrade to Cloudflare KV at scale |
| 2026-07-03 | Hide bottom nav on checkout/order | Prevents CTA overlap on payment flow |
| 2026-07-03 | `friendlyDbError` helper | One place to sanitize Supabase errors for UI |
| 2026-07-04 | `[data-brand]` token layer overrides shadcn vars | One attribute restyles any surface (marketing now, dashboard later) without touching components |
| 2026-07-04 | All landing visuals code-drawn (MiniPreview, react-qr-code, CSS mocks) | Crisp at any DPI, zero image assets, always on-brand |
| 2026-07-04 | **Brand v2: "Warm Tactile"** (sand `#F1EDE5` / warm ink / yellow `#F7C518`, Hanken Grotesk, pill geometry, marker highlights) replaces v1 teal/Fraunces | Human chose whacka.app aesthetic direction; tokens in `docs/whackaDesignToken.md` |
| 2026-07-04 | Scroll reveals via tiny `Reveal` (IntersectionObserver) + CSS keyframes, no GSAP/magicui deps | Same effect, zero new dependencies |

---

## Unicorn Vibe Overhaul — Master Prompt (paste into new chat)

Copy everything inside the block below into a **fresh chat window** when starting the Unicorn redesign. Attach your new goal mockups (`docs/unicorn/goal-*.png` or similar) in the first message.

---

````
# Nomi — Unicorn Vibe Storefront Overhaul (Master Brief)

You are working on **Nomi**, a mobile-first PayNow storefront platform for Singapore social sellers. I am the non-technical founder. **Pre-launch** — design completeness matters more than shipping to users right now.

## Your mission

Perform a **complete visual overhaul** of the **Unicorn** storefront vibe (`vibe: "unicorn"`). Everything currently in the Unicorn vibe is **provisional placeholder styling** from an early Phase 7 pass. I will provide **new mockups** — those mockups are the source of truth, not the old theme doc.

**Do NOT redesign Noir, Outback, or Futuristic.** Only Unicorn.

---

## Non-negotiable guardrails

1. **Do not break Noir (`epicurean`).** Noir is finished and locked.
   - Do NOT edit `[data-vibe="epicurean"]` or `[data-vibe="industrial"]` rules in `styles/tokens.css`
   - Do NOT modify `NoirHero`, `isNoirVibe()`, or any `.hero-noir-*`, `.featured-noir-*`, `.catalog-pill-active` (Noir-scoped) CSS unless I explicitly ask
   - After every change, verify Noir still looks correct (I will test; you must not regress shared behavior)

2. **Do not touch business logic** unless I explicitly ask:
   - Cart, checkout, PayNow, orders, Supabase, RLS, migrations, dashboard onboarding
   - Product filtering, featured product resolution, quick-add rules

3. **Scope styling to Unicorn:**
   - Prefer new CSS under `[data-vibe="unicorn"]` in `styles/tokens.css`
   - Prefer new classes like `.hero-unicorn-*`, `.featured-unicorn-*`, `.catalog-unicorn-*`
   - If layout differs from DefaultHero, add a `UnicornHero` branch in the component (mirror Noir pattern) — do NOT merge all vibes into one hero

4. **Minimal diffs.** No drive-by refactors, no new dependencies, no "cleanup" of Noir code.

---

## How vibes work in this codebase

- Storefront root: `app/(storefront)/s/[slug]/layout.tsx` sets `data-vibe={store.vibe}` on the page wrapper
- Tokens: `styles/tokens.css` — each vibe has a `[data-vibe="…"]` block overriding `--vibe-*` CSS variables
- Tailwind utilities: `text-vibe-primary`, `bg-vibe-surface`, etc. (see `app/globals.css`)
- Vibe enum: `lib/stores/types.ts` → `"unicorn" | "outback" | "futuristic" | "epicurean"`
- Display name: `lib/vibes.ts` → Unicorn id `"unicorn"`, name `"Unicorn"`

**Noir pattern (copy this architecture for Unicorn):**
- `components/storefront/storefront-hero.tsx`: `isNoirVibe()` → `NoirHero` | `DefaultHero`
- Unicorn currently uses **`DefaultHero`** (legacy: monogram fallback, generic typography)
- Featured/catalog/checkout: Noir uses scoped CSS classes; Unicorn uses generic `vibe-*` + old lavender tokens

---

## Storefront sections to restyle (Unicorn buyer-facing)

Work section-by-section. Match my new mockups — section order on the shop home page:

1. **Hero** — `components/storefront/storefront-hero.tsx`
   - Fields: optional logo, optional eyebrow, store name, optional tagline (no cover image, no hero CTA — product decision from Noir pass)
   - Noir removed monogram fallback; confirm whether Unicorn mockup wants the same

2. **Featured product** — `components/storefront/featured-product.tsx`
   - Seller-editable section title: `store.featured_section_title` (fallback: `"Feature Product"`)
   - Featured product: `store.featured_product_id` (star toggle in dashboard)
   - Noir: mobile stacked card, desktop 2-col grid — match Unicorn mockup layout

3. **Category pills + product grid** — `components/storefront/product-catalog.tsx`
   - Mobile: scrollable pills; Desktop: underline tabs (Noir pattern)
   - No "All products" section heading (removed globally)
   - Quick-add `+` on cards when description ≤ 100 chars

4. **Sticky checkout bar** — `components/storefront/sticky-checkout-bar.tsx`
   - Shop home only (`storefront-shell.tsx`)
   - Empty: "Your cart is empty"; With items: count + total + Checkout pill

5. **MiniPreview** — `components/storefront/mini-preview.tsx`
   - Dashboard live preview must reflect Unicorn styling

**Out of scope unless mockups include them:** cart page, checkout form, product detail, order status (can be a later pass).

---

## Key files (read before coding)

| File | Role |
|---|---|
| `styles/tokens.css` | Vibe tokens + scoped CSS (primary work surface) |
| `app/globals.css` | Tailwind `@theme` vibe color mappings |
| `components/storefront/storefront-hero.tsx` | Hero |
| `components/storefront/featured-product.tsx` | Featured section |
| `components/storefront/product-catalog.tsx` | Categories + grid |
| `components/storefront/sticky-checkout-bar.tsx` | Bottom bar |
| `components/storefront/mini-preview.tsx` | Dashboard preview |
| `app/(storefront)/s/[slug]/page.tsx` | Shop home composition |
| `lib/vibes.ts` | Vibe metadata |
| `docs/whiteboard.md` | Living notes + decisions |
| `docs/sampleDESIGN.md` | Noir reference (Epicurean tokens — **do not copy colors to Unicorn**) |

**Legacy Unicorn reference (PROVISIONAL — do not treat as spec):**
- `docs/unicorn/lavenderTheme.md` — old lavender/lime system from Phase 7; **superseded by my new mockups**

---

## Product / UX decisions already locked (storefront v2)

These apply to all vibes unless my Unicorn mockup explicitly differs:

- No cover/hero background image
- No desktop-only header
- No bottom nav on storefront (sticky checkout bar instead)
- First product auto-featured; seller can change via star
- Category pills on mobile, underline tabs on desktop
- Hero editor: logo, eyebrow, tagline optional (dashboard)
- Featured section title editable (dashboard)

If mockup conflicts, **ask me** — mockup wins for Unicorn aesthetics; these win for structure/features.

---

## Local dev & testing

```bash
npm install
npm run dev
```

Use **lvh.me** (not localhost) for multi-tenant routing:
- Storefront: `http://{slug}.lvh.me:3000` (e.g. demo store)
- Dashboard: `http://app.lvh.me:3000`

To test Unicorn: set store vibe to `unicorn` in dashboard → Storefront → Vibe picker.

**After each implementation pass:**
1. `npm run build` must pass
2. Compare 375px mobile + desktop against goal mockups
3. Spot-check a **Noir** store — must be unchanged

---

## What I will provide in this chat

- [ ] New Unicorn goal mockups (mobile + desktop) — **primary spec**
- [ ] Current Unicorn screenshots (optional — you can capture from dev)
- [ ] Optional: HTML/CSS export from design tool (like `docs/code.html` for Noir)

**Start by asking me to attach mockups if not present, then produce Phase 1 audit + Phase 2 proposal only — do not code until I approve.**

---

## Acceptance mindset

- Goal mockup = visual north star; I may reject excessive whitespace or optional elements (same as Noir pass)
- Typography and colors must come from mockups / my approval, not from old `lavenderTheme.md`
- One vibe, one chat focus — finish Unicorn before suggesting Outback/Futuristic

## Repo path

`/Users/therealdoughy/Desktop/nomiv1`

Read `docs/whiteboard.md` and skim Noir sections for workflow examples. Read `styles/tokens.css` `[data-vibe="epicurean"]` blocks as the **pattern** for how to scope vibe CSS — not the **colors** to use.
````

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| Real-phone mobile verification (8.3) | 👤 Checklist above |
| Two-account cross-tenant test (8.2) | 👤 Optional before launch |
| Production deploy + real payment (8.4) | 👤 Next milestone |

---
