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

## 👉 YOUR MANUAL CHECK — Landing page redesign (v2, whacka aesthetic)

Visual-only change; no functionality touched. Open `http://lvh.me:3000` and check:

1. Desktop (1440px+): floating pill nav, centered hero with marker-highlighted "real store", phone scene with floating cards below — no overlap
2. Mobile (320–375px): everything stacks, floating cards/chips stay inside the viewport, no horizontal scroll
3. Fonts: everything renders in Hanken Grotesk (extrabold headings); sand `#F1EDE5` background, yellow `#F7C518` CTAs
4. Ink marquee strip scrolls seamlessly; pauses under `prefers-reduced-motion`
5. Three numbered feature panels (purple / yellow / mint) — visuals fit at all widths; scroll reveals fire once
6. All CTAs link correctly (Create my store → login, View demo store → demo storefront); FAQ accordions open/close
7. Yellow CTA band: black pill button with yellow arrow badge hover-shifts right

The `[data-brand]` token layer is the design system — apply the same attribute to dashboard/login later for a cohesive restyle (future overhaul sections). Reference: `docs/whackaDesignToken.md`, `docs/whackaUIspec.md`.

---

## 👉 YOUR MANUAL CHECK — Tasks 8.1–8.3

### 8.1 Loading & errors (quick smoke)

1. Navigate dashboard tabs — brief skeleton on load (no blank flash)
2. Onboarding slug check — disconnect network mid-check → friendly error (not spinner forever)
3. Copy store link on HTTP (`app.lvh.me`) → works or shows "Copy failed"
4. Checkout with removed product in cart → stale item warning
5. Notify seller → button shows "Notifying…" while pending
6. Push settings → success/error messages use green/red styling

### 8.2 Security (optional two-account test)

1. Sign in as Seller A; note a product UUID from URL
2. Sign in as Seller B; try editing Seller A's product UUID → should 404 / not found
3. Try Seller B's dashboard with Seller A's order reference → not found
4. Spam checkout rapidly → should eventually hit "Too many requests"

### 8.3 Mobile (real phone recommended)

1. iPhone Safari: checkout inputs don't zoom on focus
2. Bottom nav hidden on checkout + payment pages (no overlap with CTAs)
3. Cart +/- buttons easy to tap (44px)
4. No horizontal page scroll on storefront
5. Safe area: content not under notch/home indicator (especially PWA)
6. Spot-check all 4 vibes on 320px width

Reply **`8.1–8.3 ✅`** or paste issues. Then **Task 8.4** (production deploy + full loop).

---

## 👉 YOUR MANUAL CHECK — Task 8.4 (when ready)

Full production smoke per `docs/Implementation.md` Task 8.4:

1. Fresh seller signup → onboarding → publish
2. Real phone: browse → cart → checkout → save QR → pay S$0.50 → notify seller
3. Seller: verify payment → buyer status page shows confirmed
4. Test 404, unavailable store, expired payment window
5. Fix anything found; re-verify

---

## Suggested Next Step

**Task 8.4** — deploy to production domain and run the full end-to-end checklist with a real payment.

---

## Decision Log

| Date | Decision | Why |
|---|---|---|
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

## Open Questions / Blockers

| Item | Status |
|---|---|
| Real-phone mobile verification (8.3) | 👤 Checklist above |
| Two-account cross-tenant test (8.2) | 👤 Optional before launch |
| Production deploy + real payment (8.4) | 👤 Next milestone |

---
