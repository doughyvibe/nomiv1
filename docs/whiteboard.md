# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase 7 — Vibes + Marketing:** ✅ COMPLETE (storefront vibes all shipped)
**Phase 8 — Polish, Hardening & Launch:** in progress → **Product Refinement**
**Just finished:** Sprints 0–4 (non-marketing polish)
**Next up:** Landing carousel **v2 built** — founder visual QA (CSS phone + peeks + slide track).

**Launch note (H4):** Real PayNow already verified. **Production deploy + domain purchase deferred** until polish is complete and founder is confident.

---

## Carousel polish v2 — DaisyUI study + proposal

> **Status:** ✅ **Built** (2026-07-17). Founder review.  
> **Date:** 2026-07-17  
> **Docs:** (via Context7, lib: daisyUI) [carousel](https://daisyui.com/components/carousel), [mockup-phone](https://daisyui.com/components/mockup-phone), [stack](https://daisyui.com/components/stack)  
> **Code:** `components/marketing/store-tour.tsx`, `lib/marketing/demo-stores.ts` (raw screens)  
> **Shipped (v2.1):** [shadcn Carousel / Embla](https://ui.shadcn.com/docs/components/base/carousel) — whole phone (bezel+screen) per slide; center align + loop; neighbor peeks via `basis`; contact shadow on active.

### What’s wrong today

| Issue | Cause |
|-------|--------|
| Clunky ←→ swap | Exit → remount → CSS keyframe enter. Two-phase JS, short travel (~14%), feels like a fade not a slide |
| Phone looks flat | Soft CSS halo removed; PNG bezels sit on white with no depth layer |
| Old halo looked bad | Hard-edged radial / baked PNG glow — not a soft contact shadow |
| Layout feels busy | Arrows float in empty space; stage has no “device pedestal” |

### What DaisyUI actually teaches (steal these)

**1. Carousel = scroll-snap track, not opacity swap**  
`carousel` + `carousel-item w-full` is a horizontal scroller. Next/prev use snap/`scrollIntoView` (Daisy uses `#slideN` anchors). Browser-native smooth scroll reads as a real carousel.

**2. Full-width items**  
One item owns the track width → only one phone centered; neighbors live off-canvas until you scroll.

**3. `mockup-phone`**  
Real CSS bezel: `mockup-phone` → `mockup-phone-camera` → `mockup-phone-display`. Screen content goes *inside* the display — we already have `*-raw.png` screen captures for this.

**4. `stack` (stacked images)**  
Peek of 2–3 layered cards behind the hero → depth + “more demos” without a harsh glow blob.

**Also useful:** circular prev/next (`btn-circle` pattern), keep our yellow **View Demo Store** CTA under the stage.

### Recommended Nomi system (don’t install daisyUI)

```
┌─────────────────────────────────────────────────────────────┐
│  See how different businesses come to life with Nomi.       │
│                                                             │
│        ←                                            →       │
│                                                             │
│              ╭── soft contact shadow (ellipse) ──╮          │
│              │   ┌─────────────────────────┐     │          │
│   [peek]     │   │  CSS phone bezel        │     │  [peek]  │
│   scaled     │   │  ┌───────────────────┐  │     │  scaled  │
│   dimmed     │   │  │ raw store screen  │  │     │  dimmed  │
│              │   │  └───────────────────┘  │     │          │
│              │   └─────────────────────────┘     │          │
│              ╰───────────────────────────────────╯          │
│                                                             │
│                   [ View Demo Store ]                       │
└─────────────────────────────────────────────────────────────┘
```

**Motion:** inner screen track `translate3d` 500ms ease; peeks update to prev/next.

**Depth:** soft ellipse contact shadow + side peeks; no colored halo.

**Bezel:** CSS mockup (Daisy structure, our Tailwind) + `*-raw.png` in the display.

### Founder decisions (locked 2026-07-17)

1. Bezel: CSS phone + raw screens ✅  
2. Side peeks: yes ✅  
3. Build carousel v2 ✅  

---

## Demo stage carousel — Bucks Sauce analysis + Nomi proposal

> **Status:** ✅ **Built** (2026-07-15). Founder review.  
> **Date:** 2026-07-15  
> **Code:** `components/marketing/store-tour.tsx`  
> **Reference:** [Bucks Sauce](https://www.awwwards.com/sites/bucks-sauce) (Awwwards SOTD) — home product slider  
> **Replaces:** horizontal snap river of 4 equal phones

**Shipped defaults:** right-rail = concept label; progress dots on; fixed yellow/purple halo; no autoplay.

---

### A) How Bucks Sauce’s carousel actually works

This is **not** a strip of equal thumbnails. It is a **stage** — one hero product owns the viewport; everything else is supporting theater.

#### System model

```
STATE = index 0…N-1

On ← / → :
  1. Swap hero product (bottle)
  2. Swap halo color/mood behind it
  3. Swap floating garnish art (cherry / pineapple / garlic…)
  4. Update rail labels (PRODUCT NO.0X  ·  NAME)
  5. Keep the same CTA slot ("SHOP NOW" → that product)
```

One click = one new *world*, not a scroll nudge.

#### Anatomy (from founder screenshots)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [logo]                                      [GET SAUCE] [cart] [☰]      │  site chrome
│                                                                              │
│                         ( section title / brand line )                       │
│                                                                              │
│   PRODUCT NO.03  · · · · · · · · · · · · · · · · · ·  CRUSHED CHERRY…    │  LABEL RAIL
│         ○←                    │                         →○                  │  ARROWS on rail
│                               │                                              │
│              🍒               │               🧄 🌿                          │  FLOATING GARNISH
│                    ┌──────────┴──────────┐                                   │
│                    │    ◯ HALO CIRCLE    │                                   │  SPOTLIGHT
│                    │   ┌──────────────┐  │                                   │
│                    │   │    BOTTLE    │  │                                   │  HERO (1 only)
│                    │   │   (center)   │  │                                   │
│                    │   └──────────────┘  │                                   │
│                    └─────────────────────┘                                   │
│                                                                              │
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·  │  lower rail
│                           [  SHOP NOW  ]                                     │  PRIMARY CTA
└──────────────────────────────────────────────────────────────────────────┘
```

| Piece | Job |
|-------|-----|
| **Single hero** | Forces attention — “look at *this*” |
| **Halo circle** | Spotlight / depth without 3D |
| **Floating garnish** | Personality + motion (Bucks goes hard here) |
| **Dotted horizontal rail** | Structure; anchors arrows + labels |
| **PRODUCT NO.0X / Name** | Orientation — where am I in the set? |
| **← → circles** | Explicit control (filled = available / outline = hover affordance) |
| **SHOP NOW** | Always maps to the *current* hero |

#### Why it feels premium vs our current river

| Bucks | Nomi today (snap river) |
|-------|-------------------------|
| One product = star | Four phones compete |
| Stage + spotlight | Flat row |
| Labels + index | Tiny captions under each |
| Big arrows | Drag/scroll discovery only |
| CTA tied to active item | One link under the row (OK) but stage is weak |

---

### B) What we steal / skip for Nomi

| Steal | Skip |
|-------|------|
| One-at-a-time hero stage | Black void background (keep Nomi white/Warm Tactile) |
| Halo behind the phone | 3D fruit / stop-motion garnish budget |
| Rail + STORE 0X / name labels | Cloning cream/black Bucks palette 1:1 |
| Big ← → controls | Autoplay unless founder wants it later |
| CTA under hero = current demo | Extra floating food art |

**Nomi garnish substitute (optional, light):** soft yellow/purple orbs behind halo — brand, not cartoon fruit.

---

### C) Proposed Nomi system (ASCII)

Section heading stays: *See how different businesses come to life with Nomi.*

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│     See how different businesses come to life with Nomi.                 │
│                                                                          │
│   STORE 01  · · · · · · · · · · · · · · · · · · · · · · ·  BAKERY        │  RAIL + labels
│                                                                          │
│      ( ● ) ←                                              → ( ○ )        │  ARROWS
│                                                                          │
│                         ╭──────────────╮                                 │
│                         │  soft HALO   │  yellow or ink wash             │
│                         │   ┌────────┐ │                                 │
│                         │   │ PHONE  │ │  ONE bezeled demo               │
│                         │   │ MOCKUP │ │  (EATNight / …)                 │
│                         │   └────────┘ │                                 │
│                         ╰──────────────╯                                 │
│                                                                          │
│                      [  Open this demo →  ]                              │  CTA = active
│                                                                          │
│                   ○  ●  ○  ○     (optional dots)                         │  progress
│                                                                          │
│                      ( PayNow integrated )                               │  spine (existing)
└──────────────────────────────────────────────────────────────────────────┘
```

#### Interaction

| Input | Behavior |
|-------|----------|
| ← / → | Cycle bakery → music → florist → candy (wrap) |
| Keyboard ← → | Same (a11y) |
| Swipe on phone (mobile) | Optional: swipe hero left/right |
| “Open this demo” | Live URL for **active** concept only |
| Dots (optional) | Jump to index |

#### Label copy (draft)

| Index | Left rail | Right rail |
|-------|-----------|------------|
| 01 | STORE 01 | ARTISAN CAFE |
| 02 | STORE 02 | AUDIO LAB |
| 03 | STORE 03 | EXOTIC SUCCULENTS |
| 04 | STORE 04 | SWEET TREATS |

Or right rail = store name (`EATNight`, `Cyberpunk Audio Lab`, …) — founder pick.

#### Motion (restrained)

- Crossfade or short slide (~300–400ms) when index changes  
- Halo tint can shift subtly per vibe (Noir dark / Candyland bright) — optional  
- No autoplay in v1  

#### Mobile

```
┌────────────────────────┐
│  heading…              │
│  STORE 02 ··· MUSIC    │
│     (←)        (→)     │
│      ╭────────╮        │
│      │ PHONE  │        │  large single
│      ╰────────╯        │
│  [ Open this demo → ]  │
│     ○ ● ○ ○            │
└────────────────────────┘
```

---

### D) Contrast: current vs proposed

```
NOW (river)                    PROPOSED (Bucks stage)
┌──┐┌──┐┌──┐┌──┐               ┌─────────────┐
│  ││  ││  ││  │  equal        │   ONE PHONE │  + halo
└──┘└──┘└──┘└──┘  peers    →   └─────────────┘
  drag to explore                ← → deliberate
```

---

### E) Decision needed

1. Approve **Bucks-style single-hero stage** for the `#stores` section?  
2. Right-rail label: concept (`BAKERY`) vs store name (`EATNight`)?  
3. Progress dots under CTA — yes / no?  
4. Halo color: fixed brand yellow vs per-concept tint?  
5. ~~Say “build carousel” when ready~~ → **built** 2026-07-15.

---

## Landing v3.1 — Carrd corrections + claim↔proof + Awwwards aesthetic

> **Status:** ✅ **Built** (2026-07-15). Founder review next.  
> **Date:** 2026-07-15 (v3.1) · copy lock same day · implemented same day  
> **Code:** `components/marketing/marketing-home.tsx`, `store-tour.tsx`, `public/marketing/nomilogo.png`  
> **Inputs:** Founder Carrd notes; claim↔proof; founder headline + support; logo; [carrd.co](https://carrd.co/); Awwwards refs.  
> **Supersedes:** v3 ASCII that led with *Exact PayNow* into store demos.

---

### 0) Locked copy + logo (founder)

| Slot | Locked |
|------|--------|
| **Headline** | *Your business deserves a better storefront.* |
| **Supporting** | *Create a beautiful storefront, showcase your products, accept payments, and start selling.* |
| **Primary CTA** | *Create my store* (filled) |
| **Secondary CTA** | *Sign in* (ghost) |
| **Logo mark** | `docs/nomilogo.png` — yellow disc + black **n** + purple orbit dot (on black). On build: copy to `public/` and use as Carrd-style brand monument (not only tiny nav text). |

**Claim ↔ proof check:** ✅  
`better storefront` → four beautiful demo store phones. Same noun. Brain clicks.  
PayNow / exact amount stays **chapter 2** (spine → QR), not the hero.

Optional polish later (not blocking): supporting line is a 4-beat list — still clear; can tighten to one breath if it feels long on mobile.

---

### 1) Founder’s Carrd observations — confirmed + upgraded analysis

From the live hero screenshot:

| Observation | What it does | Steal for Nomi? |
|-------------|--------------|-----------------|
| **No top nav bar** | Hamburger only — hero is uninterrupted | **Yes** — menu icon or nothing; Sign in as **ghost CTA under primary**, not a sticky pill fighting the brand |
| **2 hero CTAs** | Teal filled *Choose a Starting Point* + ghost *Log In* | **Yes** — Create (filled) + Sign in (ghost). Carrd proves dual CTA works when hierarchy is obvious |
| **“What is Carrd?” pill + vertical spine line** | Curiosity tether — eye follows the line into the next chapter | **Yes — critical.** Pill + thin ink/yellow line into demos, then again into PayNow |
| **Fixed atmospheric background** | Gradient + hex texture stays put; content scrolls over it | **Yes** — fixed Warm Tactile stage; content scrolls over it |

---

### 2) Claim ↔ proof (resolved)

```
CLAIM:  "Your business deserves a better storefront."
PROOF:  bakery · music · florist · candy phones
```

Same noun. (Old bug was Exact PayNow → pretty shops.)

| Chapter | Promise | Proof |
|---------|---------|-------|
| 1 Hero + river | Better storefront | 4 curated store phones |
| 2 Spine → PayNow | Exact PayNow every order | QR with amount + reference |
| 3 Three bites | Easy digestion | Short parallel cards |
| 4 Soft close | Create | Same CTA |

---

### 3) Awwwards crawl — aesthetic ingredients (stunning, not WebGL cosplay)

| Reference | Steal | Skip |
|-----------|-------|------|
| [Bucks Sauce](https://www.awwwards.com/sites/bucks-sauce) (SOTD) | Product stage/slider; cream-on-ink contrast | 3D fruit budget |
| [Outfit](https://www.awwwards.com/sites/outfit) (SOTD) | Photography *is* the UI | Full GSAP merch rebuild |
| [Brunello Cucinelli AI E-com](https://www.awwwards.com/sites/brunello-cucinelli-ai-e-com) (SOTD) | Quiet pacing; few words | Multi-agent AI UX |
| [Object & Archive](https://www.awwwards.com/sites/object-archive) | Curated worlds by mood | Art-house density |
| [House of Honey](https://www.awwwards.com/sites/house-of-honey) | Warm cream + deep accent; gallery as desire | Horizontal-only layout |

**Visual thesis:** Fixed Warm Tactile stage + logo mark as monument (yellow/purple from `nomilogo.png`) + photographic store river + spine + one PayNow artifact. Not Carrd purple-hex clone; not Three.js.

---

### 4) ASCII — Nomi landing v3.1 (updated with locked copy)

```
╔═════════════════════════════════════════════════════════════════════════╗
║  FIXED STAGE: warm sand · grain · yellow/purple orbs (logo colors)      ║
╚═════════════════════════════════════════════════════════════════════════╝
        content scrolls over fixed stage ↓

┌─────────────────────────────────────────────────────────────────────────┐
│                                                    ☰                    │  no sticky nav
│                                                                         │
│                         ( yellow ● n · purple )                         │  LOGO MARK
│                              nomi                                       │  + wordmark
│                                                                         │
│           Your business deserves a better storefront.                   │  LOCKED H1
│                                                                         │
│     Create a beautiful storefront, showcase your products,              │  LOCKED SUPPORT
│          accept payments, and start selling.                            │
│                                                                         │
│                 [  Create my store  → ]   filled                        │
│                 [      Sign in      ]   ghost                           │
│                                                                         │
│                      ( See real stores )                                │
│                             │                                           │
│                             │  spine                                    │
│                             ▼                                           │
├─────────────────────────────────────────────────────────────────────────┤
│   ◂════ phone river: bakery · music · florist · candy ════▸             │  PROOF
│              Open this demo →                                           │
│                             │                                           │
│                             ▼                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                      ( How you get paid )                               │
│   Exact PayNow. Every order.           ┌─────────────────────┐          │
│   Amount + reference. Built for you.   │  QR · S$ · Ref      │          │
│                                        └─────────────────────┘          │
│                             │                                           │
│                             ▼                                           │
├─────────────────────────────────────────────────────────────────────────┤
│     [ Real shop ]  [ Exact amount+ref ]  [ Made for SG ]                │  3 bites
├─────────────────────────────────────────────────────────────────────────┤
│                      Ready when you are.                                │
│                 [  Create my store  → ]                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  Terms · Privacy                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5) Decision needed

| # | Item | Status |
|---|------|--------|
| 1 | Hero + support copy | ✅ Locked + shipped |
| 2 | Logo mark on hero | ✅ `public/marketing/nomilogo.png` |
| 3 | Dual CTAs + spine + fixed bg + river | ✅ Shipped |
| 4 | Build v3.1 | ✅ Done — review locally |

---

## Landing v3 — archive (superseded by v3.1)

> Kept for history. Flaw: led with *Exact PayNow* into store demos (claim↔proof mismatch).

---

## Marketing landing redesign — CRO archive (v2.1)

> **Status:** Implemented, then aesthetically rejected. Assets still valid; layout superseded by v3.1.  
> **Influences:** [Wes McDowell](https://www.youtube.com/watch?v=BhpylIEuxjE); [Awwwards e-commerce](https://www.awwwards.com/websites/e-commerce/)

---

### 1) Critical rethink: what is Nomi actually selling?

v1 defaulted to **"link in bio → shop."** That is lazy positioning. It is true as a *distribution habit*, but it is **not** the distinctive value. Linktree already owns that sentence.

| Layer | Claim | Verdict |
|-------|--------|---------|
| **Channel** | "Turn your bio into a shop" | Commodity — whisper near CTA, not hero |
| **Category ease** | "Shop without setup confusion" | Real vs Shopify; weak as hero |
| **Problem** | "For SG sellers tired of messy DMs" | Audience filter — subhead |
| **USP** | Dynamic PayNow: **exact amount + order reference** | Hard-to-copy wedge |
| **Outcome** | Orders paid cleanly, no chasing screenshots | What the page must make feel true |

**Craft rule:** Shop worlds first (desire) → one PayNow proof beat (amount + ref) → ask.

#### Locked copy (v2.1)

| Slot | Locked line |
|------|-------------|
| **Headline** | *Exact PayNow. Every order.* |
| **Subhead** | *For Singapore sellers tired of messy DMs.* |
| **CTA** | *Create my store* |
| **Near-CTA micro** | *Share one link.* (optional whisper) |
| **PayNow beat** | *PayNow that matches the order.* / *Amount + reference. Built for you.* |
| **Tour label** | *Tour stores* |

---

### 2) Diagnosis (short)

Current page = mini-website (dual CTAs, marquee, 3-step, PayNow essay, yellow band). MiniPreview / vibe cards fail because they skin **one catalog** across vibes — proves a theme engine, not a beautiful store. **Vibe-swap chips rejected.**

---

### 3) Wow model — 4 curated static concepts

**Locked concepts (founder):** bakery · music production tools · florist · candy store

| Concept | Suggested vibe | Why |
|---------|----------------|-----|
| Florist | Atelier or Laura | Quiet, organic |
| Bakery | Market or Vows | Warm, food-friendly |
| Candy store | Candyland | Already built for this world |
| Music production tools | Studio or Cyberpunk | Gear/tech energy |

Static hi-fi mockups first. Live demo URLs later. Dashboard vibe picker curated thumbs = **parked** until marketing assets exist.

---

### 4) Awwwards steal list (why v1 was thin)

v1 = clean SaaS wireframe. Award commerce stages **curated worlds** ([e-commerce collection](https://www.awwwards.com/websites/e-commerce/)).

| Reference | Steal for Nomi |
|-----------|----------------|
| [Outfit](https://www.awwwards.com/sites/outfit) | Photography *is* the UI |
| [Bucks Sauce](https://www.awwwards.com/sites/bucks-sauce) | Product stage / slider for touring concepts |
| [Object & Archive](https://www.awwwards.com/sites/object-archive) | Curate by mood — not skins |
| [Brunello Cucinelli AI E-com](https://www.awwwards.com/sites/brunello-cucinelli-ai-e-com) | Few words, quiet discovery |
| [Bécane Paris](https://www.awwwards.com/sites/becane-paris) | Phone frame as craft |
| [Inkwell](https://www.awwwards.com/inkwell-a-scroll-driven-narrative-for-ais-most-stealth-player.html) | Linear desire → proof → one CTA |

Do **not** copy WebGL / invisible-nav experiments.

---

### 5–6) Locked structure + ASCII

```
1. Quiet header (nomi · Sign in)
2. Hero: Exact PayNow. Every order. + subhead + Create CTA
3. Tour stores — bakery / music / florist / candy (static mockups)
4. PayNow proof beat (amount + reference)
5. Soft footer
```

```
┌──────────────────────────────────────────────────────────────────┐
│  nomi                                               Sign in      │
├──────────────────────────────────────────────────────────────────┤
│         Exact PayNow. Every order.                               │
│         For Singapore sellers tired of messy DMs.                │
│              [  Create my store  ]                               │
│                 Share one link.                                  │
├──────────────────────────────────────────────────────────────────┤
│  Tour stores                                                     │
│   ( bakery ) ( music ) ( florist ) ( candy )                     │
│        ┌────────────────────────────────────┐                    │
│        │   STATIC HI-FI MOCKUP (large)      │                    │
│        └────────────────────────────────────┘                    │
│              Open this demo →   (wire later)                     │
├──────────────────────────────────────────────────────────────────┤
│  PayNow that matches the order          ┌─────────────┐          │
│  Amount + reference. Built for you.     │ QR  S$42.50 │          │
│                                         │ Ref NOM-…   │          │
│                                         └─────────────┘          │
├──────────────────────────────────────────────────────────────────┤
│  nomi · Terms · Privacy                                          │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8) Decisions — LOCKED (CRO + founder)

| # | Question | Decision | Why |
|---|----------|----------|-----|
| 1 | Hero claim | **Mechanism:** *Exact PayNow. Every order.* | Distinctive, scannable, SG-true. Pain in subhead. |
| 2 | Four concepts | **Bakery · Music production tools · Florist · Candy store** | Founder lock; strong contrast. |
| 3 | Mockups | **Static hi-fi first** | MiniPreview is the quality problem. Assets before code. |
| 4 | PayNow proof | **Own beat after tour** | Desire first, then proof. Hero stays short. |
| 5 | Dashboard vibe picker | **Park** | Same curated thumbs later; don't expand scope now. |
| 6 | Code | **Not yet** — Steps A→C, then say "build" | Overwhelm fix = sequence. |

---

### 9) Mentor path — how we proceed (read when overwhelmed)

You are not behind. The **product** (storefronts, PayNow, polish) is largely done. What remains for landing is **marketing theater**: words + four little brand worlds. That feels big because it is creative work — not because Nomi is broken.

**Rule:** One step at a time. Do not open code, domain, Figma-for-all-four, and live demos in the same week.

```
NOW ──► A Briefs (paper) ──► B Photos for ONE store ──► C One mockup
         ──► D Remaining 3 ──► E Landing code ──► F Live demos (optional)
         ──► G Domain + deploy (when you feel proud)
```

| Step | What you do | What I do | Done when |
|------|-------------|-----------|-----------|
| **A** | Fill 4 one-page briefs (template below). Pick vibe. Invent store names. List 4–6 products. | Help tighten if stuck. | 4 briefs written. |
| **B** | Source photos for **one** concept only (start **florist** or **bakery**). | Review: "one brand world?" | 4–6 images for concept #1. |
| **C** | Make **one** static phone mockup (or commission / AI under your taste). | Spec what must be visible. | One mockup you'd show a stranger. |
| **D** | Repeat B–C for the other three. | Same review loop. | Four mockups. |
| **E** | Say **"build the landing."** | Implement structure + copy + tour. | New page locally. |
| **F** | Optional: live demo URLs per concept. | Wire "Open this demo." | Click-through works. |
| **G** | Domain + production deploy. | Only when you're proud. | Public URL. |

#### Shortcut (founder already has vibe hi-fi mockups)

If each vibe was designed with real store concept + photography + copy, **skip photo hunting**. Do this instead:

1. **Map** the 4 landing concepts → existing vibe mockups (e.g. candy→Candyland, florist→Atelier).
2. **Export** 1 hero phone frame (or full home screenshot) per concept for the landing tour — static images, not MiniPreview.
3. **Then say “build the landing”** — wire tour to those images.
4. **Live demos (optional, after):** create real published stores for click-through (see §10).

**Asset progress:** Tall scroll captures in `public/marketing/demos/tall/` (~430px wide):
- `eatnight-scroll.png` · `cyberpunk-scroll.png` · `botanica-scroll.png` · `candyshop-scroll.png`
Next: founder says **“build the landing”** when ready (live demo links can follow).

#### How a demo store works (plain English) — §10

A demo store is a **normal published Nomi storefront** at a public slug (today: env `NEXT_PUBLIC_DEMO_STORE_SLUG`, default `jigwave` → `jigwave.lvh.me:3000` / eventually `jigwave.nomi.store`).

| Who | What they do |
|-----|----------------|
| **Visitor (cold lead)** | Opens the link. **No login.** Browses/cart like a buyer. |
| **You (founder)** | **Once:** sign up / sign in with email → create store → upload products → pick vibe → publish. That store *is* the demo. |

You do **not** need a special “demo mode.” Four concepts = up to **four published stores** (four slugs), or static mockups on the landing + one live store first.

**Not doing right now unless you ask:** vibe picker redesign · domain · building four live tenants before landing structure exists.

---

### Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-17 | Carousel **v2 built**: CSS phone + raw screens, side peeks, translate3d slide, contact shadow | Founder approved DaisyUI-inspired plan |
| 2026-07-16 | Carousel declutter: drop STORE rail + dots; ghost **View Demo Store**; tighter gaps; directional slide easing | Founder screenshot feedback |
| 2026-07-15 | Demo **carousel built**: single-hero stage, rail labels, ←→, dots, Open demo CTA | Founder said build carousel |
| 2026-07-15 | Demo labels → Artisan Cafe / Audio Lab / Exotic Succulents / Sweet Treats | Founder rename |
| 2026-07-15 | Demo tour **carousel proposal** (Bucks-style single-hero stage); await approval before code | Founder asked analysis + ASCII first |
| 2026-07-15 | Landing **v3.1 shipped**: fixed Warm Tactile stage, logo monument, locked H1/support, dual CTA, spine tethers, phone river, PayNow chapter, 3 bites, soft close | Founder said build v3.1 |
| 2026-07-15 | Hero copy **locked**: *Your business deserves a better storefront.* + support line; logo `docs/nomilogo.png` for hero mark | Founder choice; claim↔proof matches demo river |
| 2026-07-15 | Landing **v3.1**: claim↔proof fix (hero = shops; Exact PayNow = ch.2); Carrd dual CTA + spine + fixed bg; Awwwards aesthetic thesis; no code | Founder Carrd screenshot + confusion callout |
| 2026-07-15 | Landing **v3 study**: Carrd flow analysis + Nomi ASCII (Warm Tactile + locked copy + demo river). No code until approve | Founder: v2.1 too plain; study carrd.co |
| 2026-07-15 | Landing **built** (v2.1): quiet nav, Exact PayNow hero, 4-concept StoreTour + static bezels, PayNow proof beat, Terms/Privacy footer | Founder approved build; assets ready |
| 2026-07-15 | **v2.1 locked:** headline *Exact PayNow. Every order.*; concepts bakery/music tools/florist/candy; static-first; PayNow own beat; vibe picker parked; mentor path A→G; no code until assets | Founder asked CRO to decide §8 + guidance under overwhelm |
| 2026-07-15 | Landing proposal → **v2 discussion**: reject "bio" as hero; lead outcome/PayNow exactness; ≥4 static curated store concepts (no vibe-skin swap); Awwwards-grounded stage; no code yet | Founder challenge + MiniPreview quality + Awwwards research |
| 2026-07-15 | Marketing landing redesign: proposal only (CRO / Apple-short / demo-wow); await founder approval before code | Founder requested proposal + ASCII; no implementation yet |
| 2026-07-14 | Sprint 4 done (non-marketing): vibe picker guidance, featured toggle, publish deep-links, checkout polish, order polling; E2/E3 marketing landing deferred for redesign | Polish tail without landing rewrite |
| 2026-07-14 | Sprint 3 done: branded error/404, BrandLink CTAs, useSavedFlash, marketing focus/skip/main, form aria-invalid | Platform resilience & a11y baseline |
| 2026-07-14 | Sprint 2 done: vibe Continue (no auto-advance), Settings store identity, branded onboarding shell, PWA/dashboard primary → brand yellow | Seller setup quality |
| 2026-07-14 | Sprint 1 done: sticky on browse paths, PDP post-add links, PayNow checkout gate, expired→shop CTA, stale cart prune, delivery address only when delivery | Buyer conversion / trust continuity |
| 2026-07-14 | Sprint 0 done: terms/privacy, checkout total due, seller contact on order pages, order URLs survive unpublish | Trust blockers before more polish |
| 2026-07-14 | H4 production deploy + domain held | PayNow already tested live; deploy only after full polish confidence |
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
| 2026-07-11 | Gallery visual overhaul (shop home + cart/checkout/payment/PDP) | Playfair + Hanken; white cube mono; 0 radius; outline featured "Add to cart"; 1-col mobile / 2-col desktop; museum-plaque sticky bar; no cover/bottom nav |
| 2026-07-11 | Market hero → FLAURA-style peach lockup | Solid `#FDDAC8` band; Caslon tracked wordmark + caps labels; tall logo room for brand art; no store-name initial |
| 2026-07-11 | Candyland visual overhaul (shop home + cart/checkout/payment/PDP) | League Spartan + Satoshi; neo-brutalist pink/purple/lime; hard shadows; candy stripes hero; featured "Add to cart"; sticky lime bar; no cover/tints/bottom nav |
| 2026-07-11 | Added provisional vibes: **Candyland**, **Gallery**, **Market** | Light placeholder tokens + picker entries; all three overhauled since |
| 2026-07-11 | Cyberpunk visual overhaul (shop home + cart/checkout/payment/PDP) | Orbitron + Space Grotesk; black/cyan/purple neon; sticky checkout; featured "Add to cart"; no cover/hero CTA/bottom nav/fake specs; scoped under `[data-vibe="cyberpunk"]` |
| 2026-07-11 | Futuristic renamed → **Cyberpunk** (`vibe: "cyberpunk"`) | Display + DB id; migration remaps `futuristic` → `cyberpunk` |
| 2026-07-09 | Noir (`epicurean`) storefront styling complete | Hero, featured, catalog, sticky bar — scoped under `[data-vibe="epicurean"]` |
| 2026-07-10 | Expedition visual overhaul (shop home + cart/checkout/payment/PDP) | Chivo + JetBrains Mono + Hanken; navy/safety-yellow; 0 radius; hard shadows; scoped under `[data-vibe="expedition"]`; featured CTA "Add to cart"; no cover/hero CTA/bottom nav/fake specs |
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
| Production deploy + domain + real payment (8.4) | ⏸️ Deferred — PayNow verified; deploy after polish confidence |
| Clear `vows.provisional` in `lib/vibes.ts` | ✅ Cleared |
| Marketing landing redesign | ✅ v3.1 shipped — founder visual review |
| Delete `docs/*_storefront` mockup packs | Safe — human choice |
| Sprint 0 (E1/A1/A2/A3) | ✅ Done 2026-07-14 |
| Sprint 1 (B1/B2/A4–A7) | ✅ Done 2026-07-14 |
| Sprint 2 (C1/C2/C3/D5) | ✅ Done 2026-07-14 |
| Sprint 3 (F1/F2/D1/D2/E4/G1) | ✅ Done 2026-07-14 |
| Sprint 4 (non-marketing) | ✅ Done 2026-07-14 — E2/E3 landing deferred |

---
