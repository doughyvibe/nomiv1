# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase 7 — Vibes + Marketing:** ✅ COMPLETE (storefront vibes all shipped)
**Phase 8 — Polish, Hardening & Launch:** in progress
**Just finished:** All vibes overhauled (Noir → Strada); **Strada** is system default
**Next up:** App polish outside vibe themes (dashboard / marketing / flows) — see handoff prompt below

---

### Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-14 | PRD = intent; whiteboard/architecture/code = truth | Agents must not treat full PRD as live UI/vibe checklist; as-built banner at top of PRD; Implementation.md reading order updated |
| 2026-07-14 | Strada = system default (B&W + Inter) | Strict white/`#111`; solid black CTAs; picker first; storefront/marketing fallbacks `epicurean`→`strada` |
| 2026-07-14 | Vows: Poppins + category underline fix | Swapped Fredoka→Poppins; desktop no longer uses full-width tab rule (pillsOnDesktop + short underline) |
| 2026-07-14 | Vows palette → light slate + charcoal + lime | BG `#F2F3F5`; text/border `#241F21`; CTA `#E9E778` with charcoal type; Fredoka kept |
| 2026-07-13 | Vows: Fredoka type + readable sticky | Whole vibe on Fredoka; ivory glass dock + taupe Checkout with cream type |
| 2026-07-13 | Atlantic → strict 2-color | Indigo `#121F4B` + cream `#F7F3F0` only; terracotta/grey dropped; muted via indigo opacity |
| 2026-07-13 | Atlantic visual overhaul (shop home + cart/checkout/payment/PDP) | Libre Caslon + Inter; cream `#F5EEE6` / indigo `#121F4B` / terracotta `#AC572D`; indigo sticky + terracotta CTA; no image fades |
| 2026-07-13 | Laura visual overhaul (shop home + cart/checkout/payment/PDP) | Playfair + Inter; blush glass; soft mauve `#7D5B6D`; sticky keeps glassmorphism + mauve glow outline; filled soft pill CTAs |
| 2026-07-13 | Added provisional vibes: **Laura**, **Atlantic**, **Vows**, **Strada** | Soft toned-down placeholders for quieter aesthetics; overhaul one at a time next |
| 2026-07-12 | Studio bold magazine polish | Underline category band; `+` beside price (not on image); LOUD Hanken type; ink hero + cobalt hard shadows |
| 2026-07-12 | Added provisional vibe: **Studio** (`studio`) | Scaffolded then overhauled same day |
| 2026-07-11 | Gallery visual overhaul (shop home + cart/checkout/payment/PDP) | Playfair + Hanken; white cube mono; 0 radius; outline featured “Add to cart”; 1-col mobile / 2-col desktop; museum-plaque sticky bar; no cover/bottom nav |
| 2026-07-11 | Market hero → FLAURA-style peach lockup | Solid `#FDDAC8` band; Caslon tracked wordmark + caps labels; tall logo room for brand art; no store-name initial |
| 2026-07-11 | Candyland visual overhaul (shop home + cart/checkout/payment/PDP) | League Spartan + Satoshi; neo-brutalist pink/purple/lime; hard shadows; candy stripes hero; featured “Add to cart”; sticky lime bar; no cover/tints/bottom nav |
| 2026-07-11 | Added provisional vibes: **Candyland**, **Gallery**, **Market** | Light placeholder tokens + picker entries; all three overhauled since |
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

## AI handoff — next session (paste into a fresh chat)

Copy everything inside the block below into a **new chat**. Vibes are done; next work is polishing the rest of the app.

---

````
# Nomi — App Polish Handoff (post-vibes)

You are working on **Nomi** at `/Users/therealdoughy/Desktop/nomiv1`.
I am the non-technical founder. Pre-launch. Prefer small, correct diffs (lazy senior / YAGNI). Follow repo rules in `AGENTS.md` / `.cursor/rules` (esp. ponytail).

## Where we are

**Done:** All storefront vibes are real themes (not placeholders). System default is **Strada** (`strada`).

| ID | Name | Notes |
|---|---|---|
| `strada` | Strada | **Default** — white / `#111`, Inter only, solid black CTAs |
| `epicurean` | Noir | Dark cinematic (id stays `epicurean`) |
| `atelier` | Atelier | EB Garamond + DM Sans |
| `expedition` | Expedition | Chivo + JetBrains Mono |
| `cyberpunk` | Cyberpunk | Orbitron + Space Grotesk |
| `candyland` | Candyland | League Spartan + Satoshi |
| `gallery` | Gallery | Playfair white cube |
| `market` | Market | Libre Caslon + peach/terracotta |
| `studio` | Studio | Bold cobalt magazine |
| `laura` | Laura | Blush glass, Playfair + Inter |
| `atlantic` | Atlantic | Cream + indigo `#121F4B` only |
| `vows` | Vows | Slate + `#241F21` + lime `#E9E778`, Poppins |

**Still provisional flag in `lib/vibes.ts`:** `vows` only (visuals shipped; flag can be cleared when polish pass touches picker copy).

## This session’s mission

Polish **non-vibe** product surfaces. Do **not** reopen vibe theme work unless I explicitly ask.

Likely areas (confirm with me which to do first):
- Dashboard (products, orders, settings, onboarding, vibe picker chrome)
- Marketing landing (`components/marketing/`, brand tokens / `[data-brand]`)
- Shared UI consistency, empty states, forms, a11y, mobile polish
- Hardening leftovers from Phase 8 (smoke, deploy) if I ask

**Start:** Read `docs/whiteboard.md` Decision Log + this handoff (+ architecture if touching storefront). **Do not** read the full `docs/PRD.md` unless you need product-intent context — and then only the as-built banner at the top. Then ask which surface to polish first. Propose a short plan before coding.

## Non-negotiable guardrails

1. **Do not break finished vibes.** Prefer not editing `[data-vibe="…"]` blocks in `styles/tokens.css` unless fixing a clear bug I name.
2. **Do not touch PayNow / cart / order / RLS / migrations** unless I explicitly ask.
3. **Minimal diffs.** No drive-by refactors, no new deps if avoidable.
4. **Product locks (storefront)** — still apply if you touch shop UI:
   - No cover/hero CTA, no bottom nav (sticky checkout stays), no fake product specs
   - Featured always “Add to cart”; no description-length quick-add heuristic
5. After meaningful changes: `npm run build` must pass. Spot-check Strada + one other vibe if shared storefront components change.

## How vibes work (don’t rewrite; don’t break)

- Wrapper: `app/(storefront)/s/[slug]/layout.tsx` → `data-vibe={store.vibe ?? "strada"}`
- Tokens: `styles/tokens.css` per `[data-vibe="…"]`
- Metadata / picker order: `lib/vibes.ts` (Strada first)
- Shared components branch with `isXVibe` + scoped classes (hero, featured, catalog, cart, checkout, PDP, MiniPreview)
- Local test: `http://{slug}.lvh.me:3000` and `http://app.lvh.me:3000`

## Brand (marketing / dashboard)

Warm Tactile brand v2: sand / warm ink / yellow `#F7C518`, Hanken — see Decision Log and `docs/whackaDesignToken.md` if present. Marketing uses `[data-brand]` + `MiniPreview`.

## Docs note

**Agent reading order:** `whiteboard.md` → `NOMI_STOREFRONT_ARCHITECTURE.md` → `Implementation.md` → code. **`PRD.md` is product intent only** (as-built banner at top); do not implement from its old Unicorn/bottom-nav sections.

Folders like `docs/atlantic_storefront`, `docs/gallery_storefront`, etc. are **design reference only** (screenshots / DESIGN.md / code.html). The app does **not** import them. Safe to delete. Source of truth for vibes is code: `styles/tokens.css` + storefront components.

## Local

```bash
npm install
npm run dev
```

## Repo path

`/Users/therealdoughy/Desktop/nomiv1`
````

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| Real-phone mobile verification (8.3) | 👤 Checklist |
| Two-account cross-tenant test (8.2) | 👤 Optional before launch |
| Production deploy + real payment (8.4) | 👤 Milestone |
| Clear `vows.provisional` in `lib/vibes.ts` | Optional cleanup |
| Delete `docs/*_storefront` mockup packs | Safe — human choice |

---
