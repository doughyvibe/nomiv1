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

## Hero Section Review — Goal vs Current (Jul 2026)

**References:** [`docs/goal.png`](goal.png) (target) · [`docs/currentlayout.png`](currentlayout.png) (built) · [`components/storefront/storefront-hero.tsx`](../components/storefront/storefront-hero.tsx)

**Scope:** Hero only — logo, eyebrow, store name, tagline. Ignore Featured, cart bar, grid.

---

### Executive summary

The hero has the **right content blocks in the right order** (logo → eyebrow → name → tagline), but the **typographic hierarchy is inverted**. The goal treats the eyebrow and store name as a **two-act display headline**; the current build styles the eyebrow like a tiny UI label and the store name like a mid-size accent line. The result reads as “form fields stacked” rather than “designed brand moment.”

**Gap severity:** Typography and hierarchy = critical. Color and atmosphere = high. Spacing = medium-high.

---

### Side-by-side anatomy

| Element | Goal (`goal.png`) | Current (`currentlayout.png`) | Verdict |
|---|---|---|---|
| **Background** | Dark charcoal + **faint grid texture** — feels cinematic, intentional | Flat solid `#121414` — feels like an empty page | ❌ Missing atmosphere |
| **Logo** | Small green leaf icon, accent only, does not compete | Logo present (good); monogram fallback is orange letter in circle | ⚠️ Fallback wrong |
| **Eyebrow** (“Eat Local, Eat Healthy”) | **Large bold white headline** (~28px feel), can break across 2 lines, primary hierarchy | **11px muted grey**, wide letter-spacing, reads as metadata label | ❌ Wrong role |
| **Store name** (“EATNaked”) | **Largest element** (~40px mobile), **split color**: “EAT” orange + “Naked” white | ~28–32px, **single color** (white or all-orange in code), no split | ❌ Wrong scale + color |
| **Tagline** | Warm peach-grey body, comfortable line-height, narrow column | Cold zinc grey (`#a1a1aa`), correct copy but weaker warmth | ⚠️ Close but off |
| **Vertical rhythm** | Logo → tight → **big gap** → mega name → tagline; hero feels like its own “chapter” | Uniform `gap-4` (16px) between all elements — flat rhythm | ❌ Wrong spacing |
| **Bottom of hero** | Clear visual end before “Signature Pick” | Hero bleeds into Featured with only `pb-10` — weak section break | ⚠️ |

---

### What’s wrong — detailed

#### 1. Inverted typographic hierarchy (critical)

In the goal, **two lines carry the brand moment:**

1. **Eyebrow line** — “Eat Local, Eat Healthy” is not a small label. It is a **white, bold, headline-sized** line (maps to `headline-lg-mobile`: 28px / 600–700 in [`sampleDESIGN.md`](sampleDESIGN.md)).
2. **Store name** — “EATNaked” is the **display moment** (maps to `display-xl-mobile`: **40px / 700**, tight tracking −0.02em).

In the current build:

```44:46:components/storefront/storefront-hero.tsx
      <h1 className="font-display text-balance text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tight text-vibe-primary">
        {title}
      </h1>
```

- Title starts at **28px** (`1.75rem`) — same size as the goal’s *secondary* headline, not the primary display.
- Eyebrow is **11px** — smaller than the goal’s *smallest* intentional text.

**Buyer perception:** Goal = premium restaurant brand. Current = SaaS settings page.

---

#### 2. Color system misapplied (high)

| Token role (sampleDESIGN) | Hex | Goal usage | Current usage |
|---|---|---|---|
| `on-background` | `#e2e2e2` | Eyebrow headline, “Naked” portion of name | Eyebrow uses `text-vibe-text-muted` instead |
| `primary` / `surface-tint` | `#ffb598` | **Only** “EAT” portion of store name | **Entire** `<h1>` uses `text-vibe-primary` |
| `on-surface-variant` | `#dfc0b4` | Tagline — warm, peach-tinted grey | `text-vibe-text-muted` → `#a1a1aa` (cold zinc) |
| `secondary` | `#9af131` | Accent on leaf / freshness (optional) | Unused in hero |

**What’s wrong:**

- Orange on the **full store name** makes everything scream “CTA” — orange in the design system is for **prices and action**, not entire wordmarks.
- Muted zinc eyebrow **fails contrast hierarchy** — it should be white and bold, not whisper-grey.
- Tagline lacks the **warm peach undertone** (`#dfc0b4`) that makes Epicurean Noir feel gastronomic rather than generic dark mode.

---

#### 3. Eyebrow styled as UI label, not headline (high)

Current:

```38:41:components/storefront/storefront-hero.tsx
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-vibe-text-muted">
          {hero.eyebrow}
        </p>
```

Problems:

- **`text-[11px]`** — goal eyebrow is ~**28px** (4× larger).
- **`uppercase` + `tracking-[0.2em]`** — this is “category pill” language from the old vibe system, not editorial headline style.
- **`text-vibe-text-muted`** — eyebrow should be **`text-vibe-text`** (white) at headline weight in the goal.
- **No intentional line break** — goal breaks “Eat Local, Eat / Healthy” across lines for rhythm; current is one cramped uppercase string.

---

#### 4. Store name missing split-color treatment (high)

Goal wordmark: **“EAT”** (orange) + **“Naked”** (white) — creates depth and draws the eye to the brand stem without painting the whole name orange.

Current: single `<h1>` with one color class — cannot express the goal’s **bicolor display** without a small presentation helper.

**Note for Nomi (general stores):** Sellers won’t have “EAT” + “naked” splits. Intelligent default options:

- **A (recommended):** First word orange, remainder white (auto-split on first space).
- **B:** Full name white; only highlight first word if ≤3 chars.
- **C:** Full name white; orange reserved for nothing in title (simplest, still beats all-orange).

---

#### 5. Font size and weight off-spec (medium-high)

From [`sampleDESIGN.md`](sampleDESIGN.md):

| Role | Spec | Current approximation |
|---|---|---|
| Display (mobile) | 40px / 700 / lh 48 / −0.02em tracking | `clamp(1.75rem–3rem)` ≈ 28–48px, `tracking-tight` (~−0.025em) ✓-ish |
| Headline (mobile) | 28px / 600 / lh 36 | Eyebrow at 11px ❌ |
| Body | 16–18px / 400 / lh 24–28 | `text-base` (16px) ✓ size; wrong color |

Plus Jakarta Sans is loaded but **hero doesn’t enforce display-xl-mobile sizes** — it uses generic Tailwind clamp instead of design tokens.

---

#### 6. Spacing and section rhythm (medium-high)

Current shell:

```26:26:components/storefront/storefront-hero.tsx
    <section className="flex flex-col items-center gap-4 px-5 pb-10 pt-8 text-center sm:px-6 md:gap-5 md:pb-12 md:pt-12">
```

| Spacing | Goal (approx) | Current | Issue |
|---|---|---|---|
| Top padding | ~48–64px (`stack-lg`) | `pt-8` = 32px | Hero starts too close to top edge |
| Logo → eyebrow | ~8–12px tight | `gap-4` = 16px | OK |
| Eyebrow → store name | **~24–32px** (dramatic) | `gap-4` = 16px | **Too tight** — name doesn’t “land” |
| Store name → tagline | ~16–20px | `gap-4` = 16px | OK |
| Hero → Featured | **~48px** clear chapter break | `pb-10` = 40px + Featured `mt` none | Weak separation |

**Problem:** Uniform `gap-4` makes all elements feel equal weight. Goal uses **variable rhythm**: tight clusters + one large gap before the display name.

---

#### 7. Background atmosphere missing (medium)

Goal hero sits on **dark + subtle grid** — signals “designed environment,” not plain `background-color`.

Current Epicurean token:

```172:185:styles/tokens.css
[data-vibe="epicurean"] {
  ...
  background-color: rgb(var(--vibe-bg));
}
```

No grid, no radial vignette, no hero-scoped texture. Flat fill is the biggest “template” tell after typography.

---

#### 8. Subtle details (low–medium)

- **Logo size:** Goal ~32–40px icon; current `size-14` (56px) — logo slightly **too large**, competes with wordmark.
- **Monogram fallback:** Orange letter in grey circle — reads “avatar placeholder,” not brand mark. Goal uses illustrative icon; fallback should be neutral (white/grey monogram, no orange fill).
- **`text-balance` on h1:** Good for long names; goal uses intentional line breaks for short names — consider `text-wrap: balance` only when name > N chars.
- **Safe area:** `pt-8` may be tight under iPhone notch; goal has more top air — use `pt-12` minimum + safe-area.

---

### Proposal — how to reach the goal

> **Superseded by [Hero Proposal v2](#hero-proposal-v2--founder-approved-jul-2026)** below. Original review kept for context.

---

## Hero Proposal v2 — Founder-approved (Jul 2026)

**References:** [`docs/goal.png`](goal.png) · [`docs/currentlayout.png`](currentlayout.png) · [`docs/heroeditor.png`](heroeditor.png)

**Scope:** Hero section only. **Noir vibe (`epicurean`) only.** Unicorn, Outback, and Futuristic keep their current hero styling until each gets its own design pass.

---

### Guiding principles (from founder review)

| Principle | Decision |
|---|---|
| Vibe-specific | Hero polish is **Noir-only** for now — not a shared hero system |
| Reference, not guardrails | Goal mockup inspires direction; we don't copy every pixel (especially spacing) |
| Seller freedom | Logo and eyebrow are **optional** — if empty, show nothing (no monogram, no placeholder) |
| Hierarchy | Store name must be **visibly bigger** than eyebrow |
| Noir color | Store name = **full orange** (`#ffb598`). No split-color wordmark |
| Spacing | **Logical and compact** — goal mockup is too airy; avoid excessive empty space |
| Logo | **No changes** to logo size in this pass |

---

### Revised element spec (Noir hero)

#### Logo
- **Show only if** `hero.logo_url` is set
- **Remove** monogram fallback entirely
- Keep current size (`size-14` / `size-16` desktop) — unchanged
- If no logo: hero starts with eyebrow or store name directly

#### Eyebrow (optional)
- **Show only if** seller entered eyebrow text
- **Typography:** Plus Jakarta Sans, **white** (`text-vibe-text`), **semibold/bold**
- **Size:** `text-xl` mobile (20px) → `text-2xl` desktop (24px) — headline role, but **smaller than store name**
- **Remove:** `uppercase`, `tracking-[0.2em]`, `text-[11px]`, muted grey color
- **Case:** Preserve seller's casing (sentence case OK — "Eat Local, Eat Healthy" not forced to ALL CAPS)
- Natural line wrap at viewport width — no forced `\n` logic needed for v1

#### Store name (always shown)
- **Typography:** Plus Jakarta Sans display, **bold 700**
- **Size:** `text-[2.5rem]` mobile (40px) → `text-[3rem]` desktop (48px) — **clearly larger than eyebrow**
- **Color (Noir only):** full **`text-vibe-primary`** orange `#ffb598`
- **Tracking:** `tracking-[-0.02em]` (tight, premium)
- **Line height:** `leading-[1.1]` — compact, not loose
- `text-balance` for long store names

#### Tagline (optional)
- **Show only if** seller entered subheading
- **Color:** warm peach **`#dfc0b4`** — new token `--vibe-text-variant` (from goal / sampleDESIGN `on-surface-variant`)
- **Not** white, **not** cold zinc (`#a1a1aa`)
- **Typography:** Inter, `text-base` (16px), `leading-relaxed` (lh ~26px)
- **Max width:** `max-w-xs` (~320px) — readable column, not full-bleed paragraph

#### Hero background (Noir only)
- Grid texture scoped to **hero section only** — not the full page (Featured section stays flat)
- Implementation: `.hero-noir` class on `<section>` with:

```css
background-color: rgb(var(--vibe-bg));
background-image:
  linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px),
  linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px);
background-size: 40px 40px;
```

- Subtle — visible on close look, not distracting

---

### Spacing spec (logical, not goal-excessive)

Goal mockup has too much vertical air. Target: **tight editorial stack** that flows naturally into Featured.

| Gap | Value | Notes |
|---|---|---|
| Section top padding | `pt-10` (40px) + safe-area | Enough clearance, not a void |
| Section bottom padding | `pb-8` (32px) | Clean handoff to Featured |
| Logo → next element | `mb-4` (16px) | Only when logo exists |
| Eyebrow → store name | `mb-3` (12px) | Close pair — eyebrow introduces name |
| Store name → tagline | `mb-0` / `mt-3` (12px) | Tagline reads as caption to name |
| Horizontal padding | `px-5` mobile / `px-6` desktop | Unchanged |

**No** large 32–48px gaps between eyebrow and title. Hierarchy comes from **font size + color**, not empty space.

---

### Architecture — Noir-only without blocking other vibes

**Recommended approach:** Keep one `StorefrontHero` component, branch on vibe:

```tsx
// page passes vibe from store, or hero reads data-vibe from context
if (vibe === "epicurean") return <NoirHero ... />;
return <DefaultHero ... />; // current/other vibes unchanged
```

Or simpler for now: Noir-specific CSS classes scoped under `[data-vibe="epicurean"] .storefront-hero`:

| Class | Purpose |
|---|---|
| `.storefront-hero` | Section wrapper — grid bg on epicurean only |
| `.hero-noir-eyebrow` | White headline sizing |
| `.hero-noir-title` | 40px orange display |
| `.hero-noir-tagline` | Peach variant color |

Other vibes ignore these classes and keep existing styles.

**New token** in `tokens.css` under `[data-vibe="epicurean"]`:

```css
--vibe-text-variant: 223 192 180; /* #dfc0b4 — warm tagline */
```

---

### Files to change

| File | Change |
|---|---|
| [`components/storefront/storefront-hero.tsx`](../components/storefront/storefront-hero.tsx) | Remove monogram; Noir typography/spacing; optional logo/eyebrow; grid bg on section |
| [`styles/tokens.css`](../styles/tokens.css) | Add `--vibe-text-variant`; `.hero-noir-*` utility classes under epicurean |
| [`app/(storefront)/s/[slug]/page.tsx`](../app/(storefront)/s/[slug]/page.tsx) | Pass `vibe` prop to hero if needed for branch |
| [`components/storefront/mini-preview.tsx`](../components/storefront/mini-preview.tsx) | Mirror Noir hero styles in dashboard preview (optional same pass) |

**No changes:** hero editor fields (logo/eyebrow already optional), logo size, Featured section.

---

### Acceptance checklist (Noir hero)

At **375px width**, compare to goal — with founder's spacing preferences:

- [ ] Eyebrow is **white, headline-sized** — not 11px grey label
- [ ] Store name is **visibly larger** than eyebrow (~40px vs ~20–24px)
- [ ] Store name is **full orange** on Noir vibe
- [ ] Tagline is **warm peach** (`#dfc0b4`), not white or zinc
- [ ] **Grid texture** on hero section background only
- [ ] **No monogram** when logo is not uploaded
- [ ] **No eyebrow block** when eyebrow field is empty
- [ ] Spacing feels **compact and logical** — flows into Featured without a large void
- [ ] Logo unchanged when present

---

### Explicitly out of scope

- Split-color wordmark
- Monogram / placeholder logo
- Copying goal's wide vertical spacing
- Logo size changes
- Hero changes for Unicorn / Outback / Futuristic
- Cover image, hero CTA, Featured section

---

### Implementation order

1. Remove monogram fallback; confirm optional logo + eyebrow (5 min)
2. Add `--vibe-text-variant` + Noir hero CSS classes in tokens (10 min)
3. Rewrite epicurean hero typography: eyebrow, title, tagline (15 min)
4. Apply logical spacing spec (5 min)
5. Grid texture on hero `<section>` only (5 min)
6. Update MiniPreview hero block to match (10 min)
7. Screenshot compare at 375px vs goal (5 min)

**Estimated total:** ~1 hour

---

### Decision Log
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
