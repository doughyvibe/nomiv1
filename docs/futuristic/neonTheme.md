# Store Link Platform — Neon Grunge / Urban Premium Design System

> **Audience:** AI coding agent with zero project context.
> **Goal:** Replicate the exact visual language of Store Link Platform on any new project.
> **Stack reference:** Next.js 15, React 19, Tailwind CSS v4 (`@theme` in CSS, not legacy `tailwind.config` colors).
> **Active theme:** This document is the **source of truth** for the current production aesthetic.
> **Legacy docs only:** `docs/orangeTheme.md` and `docs/lavenderTheme.md` describe retired palettes — do not implement them unless explicitly migrating.

---

## 1. Design Philosophy

**Aesthetic:** BurgerFuel-*inspired* neon grunge / urban premium — **NOT** BurgerFuel branding, logos, or copy. Think: charcoal concrete canvas, electric purple/cyan/lime neon accents, subtle grid texture, film grain, graffiti marker flourishes, glass panels with colored glow borders. Built for **Store Link** content: Singapore social sellers, Instagram/TikTok bio links, PayNow/PayLah checkout, mobile-first shoppable storefronts.

**Core principles:**

| Principle | Implementation |
|-----------|----------------|
| Dark-first charcoal | Base `#0a0a0a` (`charcoal`), never pure `#000` for page backgrounds |
| Neon accent triad | Purple `#b026ff` (structure/borders), cyan `#00e5ff` (links/active), lime `#c8ff00` (prices/CTA accents) |
| Graffiti personality | `Permanent Marker` via `.font-marker` / `.graffiti-accent` — sparse, decorative, never body text |
| Display authority | `Bebas Neue` uppercase headlines — tight tracking, urban poster feel |
| Depth via glass + glow | `bg-white/5` + `backdrop-blur` + `border-neon-purple/20` + raw `box-shadow` neon stacks |
| Concrete contrast break | Homepage "How it works" uses `.concrete-bg` light section — intentional palette shift |
| Pill geometry | Buttons, tags, cart bar, filter pills use `rounded-full` or large `rounded-2xl` |
| Mobile-first | Storefront `max-w-lg`; dashboard bottom nav below `md`; cart FAB clearance `pb-28` |

**Mood keywords:** urban, electric, shoppable, Singapore seller-friendly, bio-link native, PayNow-ready, grunge-premium, neon-at-night.

**Content voice (UI copy patterns):**

- Hero: "Your store link, ready in minutes"
- Tags: "PayNow", "No app needed", "Built for SG sellers"
- CTAs: "Create my free store", "View demo store →"
- Graffiti accents: "link in bio ↗", "tap to shop!", "share it!"
- Footer: "Simple bio-link storefronts for Singapore social sellers"

---

## 2. Color Palette

### 2.1 Neon accent tokens (Tailwind `@theme`)

| Token | Hex | Usage |
|-------|-----|-------|
| `neon-purple` | `#b026ff` | Primary borders, glow, button border default, radial ambient |
| `neon-purple-dim` | `#7c3aed` | Muted purple (concrete section step numbers at rest) |
| `neon-cyan` | `#00e5ff` | Active nav, links, hero accent span, hover button border |
| `neon-lime` | `#c8ff00` | Prices (storefront grid), tag pills, checkmarks, logo "S" text |
| `neon-pink` | `#ff2d95` | Graffiti accent default color |

### 2.2 Brand scale (lime — legacy name, still in `@theme`)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#f7ffe0` | — (reserved) |
| `brand-100` | `#efffc2` | — |
| `brand-200` | `#e5ff99` | — |
| `brand-500` | `#c8ff00` | Same as `neon-lime` |
| `brand-600` | `#b5e600` | — |
| `brand-700` | `#9acc00` | — |
| `brand-800` | `#7ab800` | — |

### 2.3 Charcoal & surface tokens

| Token | Value | Role |
|-------|-------|------|
| `charcoal` | `#0a0a0a` | Page background, button fill base |
| `charcoal-elevated` | `#121212` | Mockup inner, product placeholders |
| `--color-surface` | `rgba(255, 255, 255, 0.04)` | Flat glass fill token |
| `--color-surface-elevated` | `rgba(255, 255, 255, 0.07)` | Elevated glass token |
| `--color-muted` | `#a1a1aa` | Muted text token |
| `--color-border` | `rgba(176, 38, 255, 0.25)` | Default themed border token |
| `--color-foreground` | `#fafafa` | Primary text token |

### 2.4 Background & text (Tailwind classes in use)

| Role | Class / value |
|------|---------------|
| Page background | `#0a0a0a` via `body`, `.grid-bg`, `.storefront-bg`, `.auth-shell` |
| Body text default | `text-zinc-100` on `body`; UI uses `text-zinc-50`, `text-zinc-100`, `text-zinc-200` |
| Secondary text | `text-zinc-300`, `text-zinc-400` |
| Muted / caption | `text-zinc-500`, `text-zinc-600` |
| Default border (dark) | `border-white/10` (inputs, cards) |
| Neon border | `border-neon-purple/15`, `/20`, `/25`, `/30`, `/40`, `/50` |
| Cyan accent border | `border-neon-cyan/20`, `/50` |
| Lime accent border | `border-neon-lime/40`, `/50` |
| Concrete section text | `text-charcoal`, `text-zinc-600`, `text-zinc-700` |

### 2.5 Status / semantic colors

| Variant | Classes |
|---------|---------|
| Success | `bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25` |
| Warning | `bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25` |
| Danger / error | `bg-red-500/15 text-red-300 ring-1 ring-red-500/25`; inputs: `border-red-400/50`, text `text-red-400` |
| Info | `bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25` |
| WhatsApp | `bg-[#25D366] hover:bg-[#20bd5a]` |
| Policies notice | `border-amber-500/25 bg-amber-500/10 text-amber-200` |
| Success alert (auth) | `border-neon-purple/30 bg-neon-purple/10 text-neon-cyan` |
| Error alert (forms) | `border-red-500/20 bg-red-500/10 text-red-300` or `text-red-400` |
| Order status `preparing` | `bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/25` |

### 2.6 Hero accent (no gradient text — solid cyan span)

```html
<h1 class="font-display text-4xl uppercase leading-[0.95] tracking-wide text-zinc-50 sm:text-5xl lg:text-6xl">
  Your store link,
  <span class="text-neon-cyan">ready in minutes</span>
</h1>
```

### 2.7 Zinc palette (structural — preferred over stone/gray in neon theme)

Primary text stack: `zinc-50`, `zinc-100`, `zinc-200`, `zinc-300`, `zinc-400`, `zinc-500`, `zinc-600`.

---

## 3. Typography

### 3.1 Font families

Load via `next/font/google` in root layout:

```tsx
import { Bebas_Neue, Outfit, Permanent_Marker } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const permanentMarker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-permanent-marker" });

// <html className={`${outfit.variable} ${bebasNeue.variable} ${permanentMarker.variable}`}>
```

CSS theme mapping (`app/globals.css`):

```css
--font-sans: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
--font-display: var(--font-bebas), ui-sans-serif, system-ui, sans-serif;
--font-marker: var(--font-permanent-marker), cursive;
```

Apply:

- **Body / UI:** `font-sans` (default on `body`)
- **Headlines / logo / metrics / buttons (primary):** `font-display`
- **Graffiti accents only:** `font-marker` or `.graffiti-accent`

Utility classes in `@layer components`:

```css
.font-display { font-family: var(--font-display); }
.font-marker { font-family: var(--font-marker); }
```

### 3.2 Type scale

| Element | Classes | Notes |
|---------|---------|-------|
| Hero H1 | `font-display text-4xl uppercase leading-[0.95] tracking-wide text-zinc-50 sm:text-5xl lg:text-6xl` | Cyan span for accent phrase |
| Section H2 (dark) | `font-display text-3xl uppercase tracking-wide text-zinc-50 sm:text-4xl` | |
| Section H2 (concrete) | `font-display text-3xl uppercase tracking-wide text-charcoal sm:text-4xl` | Light section only |
| CTA section H2 | `font-display text-3xl uppercase text-zinc-50 sm:text-5xl` | Bottom hero |
| Page H1 (dashboard) | `font-display text-2xl uppercase tracking-tight text-zinc-50 sm:text-3xl` | |
| Card title (Card component) | `font-display text-xl uppercase tracking-wide text-zinc-50 sm:text-2xl` | |
| Store name (storefront) | `font-display text-2xl uppercase tracking-wide text-zinc-50` | |
| Product title (detail) | `font-display text-xl font-bold text-zinc-50` | |
| Step number (concrete) | `font-display text-3xl text-neon-purple-dim/40 transition group-hover:text-neon-purple` | |
| Step title (concrete) | `font-display text-lg uppercase text-charcoal` | |
| Body large | `text-lg leading-relaxed text-zinc-400` | Hero subcopy |
| Body default | `text-sm leading-relaxed text-zinc-400` | Cards, descriptions |
| Body UI | `text-sm font-medium text-zinc-200` | Benefit list items |
| Caption | `text-xs text-zinc-500` | Hints, footers |
| Uppercase label | `text-xs font-semibold uppercase tracking-wide text-zinc-500` | Metric labels, card labels |
| Metric value | `font-display text-2xl tabular-nums text-zinc-50` | |
| Logo | `font-display text-lg uppercase tracking-wide text-zinc-50` | |
| Primary button | `font-display uppercase tracking-widest` | Via Button primary variant |
| Mobile nav label | `text-[10px] font-semibold` | Bottom bar |
| Onboarding step pills | `text-[10px] font-semibold` | |
| Graffiti accent | `font-marker text-neon-pink -rotate-3 select-none` | Optional size/position overrides |

### 3.3 Weights

- Display headlines: uppercase Bebas (weight 400 only — size conveys hierarchy)
- UI buttons: `font-bold` on Button base; labels `font-semibold`
- Body: Outfit default weights

### 3.4 Body defaults

```css
body {
  @apply font-sans text-zinc-100 antialiased;
  background-color: #0a0a0a;
}
```

---

## 4. Spacing & Layout

### 4.1 Container widths

| Class | Max width | Padding | Usage |
|-------|-----------|---------|-------|
| `.page-container` | `max-w-5xl` | `px-4 sm:px-6` | Marketing homepage |
| Dashboard main | `max-w-3xl` | `px-4 py-8 sm:px-6` | Seller dashboard |
| Storefront main | `max-w-lg` | `px-4 py-6` or `py-10` | Public store, checkout, order confirm |
| Onboarding main | `max-w-lg` | `px-4 py-8 pb-16` | Setup wizard |
| Auth card wrapper | `max-w-md` | — | Login/signup |
| Mobile nav inner | `max-w-lg` | — | Bottom tab bar |
| Section content (centered) | `max-w-2xl` | — | Section intros |
| Benefits grid | `max-w-3xl` | — | Homepage list |
| Hero phone mockup | `max-w-[320px]` / inner `w-[280px]` | — | Homepage device preview |

### 4.2 Section spacing

| Pattern | Classes |
|---------|---------|
| Hero top padding | `pt-16 sm:pt-28 pb-24` |
| Standard section | `py-24` with `px-4` |
| Concrete section divider | `border-y border-zinc-300/50` |
| Vertical stack (dashboard) | `space-y-8` |
| Form fields | `space-y-4` |
| Form field internal | `space-y-1.5` (label → input) |
| Grid gap (steps) | `gap-5` |
| Grid gap (products) | `gap-3` |
| Hero two-col gap | `gap-16 lg:grid-cols-2 lg:gap-12` |

### 4.3 Breakpoints (Tailwind defaults)

| Prefix | Min width | Key behavior |
|--------|-----------|--------------|
| `sm` | 640px | Larger type, horizontal CTAs, 3-col grids, graffiti visible |
| `md` | 768px | Sidebar nav visible; hide bottom nav |
| `lg` | 1024px | Hero 2-column; mockup sizing |

### 4.4 Safe areas / fixed chrome

- Dashboard mobile: `pb-24` on `<main>` (bottom nav clearance)
- Storefront cart bar: `pb-28` on page wrapper (`storefront-bg pb-28`)
- Product detail: `pb-8` (no fixed cart when empty)
- Sticky header: `.header-scrim` → `sticky top-0 z-50`

---

## 5. Background System

### 5.1 Global grain overlay (`body::before`)

Fixed pseudo-element on every page — film grain texture:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

**Spec:** fractalNoise `baseFrequency=0.85`, 4 octaves, opacity `0.035`, z-index `9999`.

### 5.2 Base grid (`.grid-bg`)

Used on: homepage, dashboard shell, 404, onboarding.

```css
.grid-bg {
  background-color: #0a0a0a;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(176, 38, 255, 0.08), transparent);
  background-size: 48px 48px, 48px 48px, 100% 100%;
}
```

**Grid spec:** 48×48px cells, 1px lines at `rgba(255,255,255,0.025)`. Top purple radial at 8% opacity.

**Note:** `.lavender-bg` in `globals.css` duplicates `.grid-bg` — legacy class name; prefer `.grid-bg` in new code.

### 5.3 Storefront (`.storefront-bg`)

```css
.storefront-bg {
  @apply min-h-screen;
  background-color: #0a0a0a;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    radial-gradient(ellipse 80% 60% at 50% -15%, rgba(176, 38, 255, 0.1), transparent);
  background-size: 48px 48px, 48px 48px, 100% 100%;
}
```

### 5.4 Auth shell (`.auth-shell`)

Grid + dual radial glows + decorative orbs:

```css
.auth-shell {
  @apply relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12;
  background-color: #0a0a0a;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    radial-gradient(ellipse 70% 50% at 50% -10%, rgba(176, 38, 255, 0.12), transparent),
    radial-gradient(ellipse 40% 30% at 90% 80%, rgba(0, 229, 255, 0.06), transparent);
  background-size: 48px 48px, 48px 48px, 100% 100%, 100% 100%;
}

.auth-shell::before {
  content: "";
  @apply pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-25;
  background: radial-gradient(circle, rgba(176, 38, 255, 0.35), transparent 70%);
}

.auth-shell::after {
  content: "";
  @apply pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-20;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.3), transparent 70%);
}
```

### 5.5 Concrete section (`.concrete-bg`) — homepage "How it works"

Light break section — simulates poured concrete with noise:

```css
.concrete-bg {
  background-color: #e8e4df;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E"),
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(255, 255, 255, 0.5), transparent),
    linear-gradient(180deg, #ece8e3 0%, #e0dbd5 100%);
}
```

**Page wrapper classes:** `concrete-bg border-y border-zinc-300/50 px-4 py-24 text-charcoal`

**Step cards on concrete:** `group rounded-2xl border border-zinc-400/40 bg-white/70 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-neon-purple/40 hover:shadow-neon-purple/10`

**Tag pill override on concrete:** `tag-pill mx-auto mb-4 w-fit border-zinc-400/30 bg-white/60 text-zinc-700`

### 5.6 Floating orbs (`.floating-orb`)

Decorative blurred color blobs on homepage:

```css
.floating-orb {
  @apply pointer-events-none absolute rounded-full blur-3xl;
}
```

Homepage orb instances:

| Classes | Position |
|---------|----------|
| `floating-orb -left-16 top-24 h-48 w-48 bg-neon-purple/20` | Hero left |
| `floating-orb right-8 top-32 h-32 w-32 bg-neon-cyan/15` | Hero right |
| `floating-orb bottom-32 left-1/3 h-40 w-40 bg-neon-pink/10` | Hero bottom |
| `floating-orb -right-4 top-4 h-36 w-36 bg-neon-lime/15` | Mockup |
| `floating-orb -left-8 bottom-16 h-28 w-28 bg-neon-purple/20` | Mockup |
| `floating-orb bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 bg-neon-purple/15` | Bottom CTA |

### 5.7 Sticky header scrim (`.header-scrim`)

```css
.header-scrim {
  @apply sticky top-0 z-50 border-b border-neon-purple/15 bg-charcoal/80 backdrop-blur-xl;
}
```

Storefront header (inline, not `.header-scrim`):

```
border-b border-neon-purple/15 bg-charcoal/60 backdrop-blur-xl
```

---

## 6. Neon Glow Utilities

All glow classes live in `@layer components` in `globals.css`. **Tailwind v4 note:** these use raw `box-shadow` — safe to `@apply` other utilities inside the same rule, but do not `@apply` the glow classes themselves onto other custom classes (see Section 18).

### 6.1 `.neon-glow-purple`

```css
.neon-glow-purple {
  box-shadow:
    0 0 8px rgba(176, 38, 255, 0.45),
    0 0 24px rgba(176, 38, 255, 0.15),
    inset 0 0 12px rgba(176, 38, 255, 0.05);
}
```

### 6.2 `.neon-glow-cyan`

```css
.neon-glow-cyan {
  box-shadow:
    0 0 8px rgba(0, 229, 255, 0.4),
    0 0 20px rgba(0, 229, 255, 0.12);
}
```

### 6.3 `.neon-glow-lime`

```css
.neon-glow-lime {
  box-shadow:
    0 0 8px rgba(200, 255, 0, 0.45),
    0 0 20px rgba(200, 255, 0, 0.15);
}
```

### 6.4 `.neon-border`

```css
.neon-border {
  border: 1px solid rgba(176, 38, 255, 0.45);
  box-shadow:
    0 0 8px rgba(176, 38, 255, 0.25),
    inset 0 0 12px rgba(176, 38, 255, 0.04);
}
```

### 6.5 `.neon-border-cyan`

```css
.neon-border-cyan {
  border: 1px solid rgba(0, 229, 255, 0.35);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.15);
}
```

### 6.6 `.hero-neon-frame` / `.hero-neon-frame-inner`

```css
.hero-neon-frame {
  @apply relative rounded-[2rem] border border-neon-purple/40 p-1;
  box-shadow: 0 0 8px rgba(176, 38, 255, 0.45), 0 0 24px rgba(176, 38, 255, 0.15);
}

.hero-neon-frame-inner {
  @apply rounded-[1.75rem] border border-neon-cyan/20 bg-charcoal-elevated/90 backdrop-blur-sm;
}
```

### 6.7 `.neon-order-btn`

```css
.neon-order-btn {
  @apply inline-flex items-center justify-center rounded-full border-2 border-neon-purple bg-charcoal/80 px-6 py-3 text-sm font-display uppercase tracking-widest text-zinc-50 transition active:scale-[0.98];
  box-shadow: 0 0 8px rgba(176, 38, 255, 0.45), 0 0 24px rgba(176, 38, 255, 0.15);
}

.neon-order-btn:hover {
  @apply border-neon-cyan;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4), 0 0 20px rgba(0, 229, 255, 0.12);
}
```

Used by: homepage mockup CTA, `CartButton` fixed bottom bar.

### 6.8 Inline arbitrary glow (Button primary, Logo mark, filter pills)

Primary button shadow (in `components/ui.tsx`):

```
shadow-[0_0_8px_rgba(176,38,255,0.45),0_0_24px_rgba(176,38,255,0.15)]
hover:shadow-[0_0_8px_rgba(0,229,255,0.4),0_0_20px_rgba(0,229,255,0.12)]
```

Logo "S" mark:

```
shadow-[0_0_8px_rgba(200,255,0,0.45)]
```

Mockup avatar ring:

```
shadow-[0_0_8px_rgba(176,38,255,0.45)]
```

Active nav tab underline:

```
after:shadow-[0_0_8px_rgba(0,229,255,0.6)]
```

Onboarding progress fill:

```
shadow-[0_0_8px_rgba(176,38,255,0.45)]
```

---

## 7. Glassmorphism

| Class | Recipe |
|-------|--------|
| `.glass` | `rounded-2xl border border-neon-purple/20 bg-white/5 backdrop-blur-xl` |
| `.glass-elevated` | `rounded-2xl border border-neon-purple/25 bg-white/[0.07] shadow-lg shadow-black/40 backdrop-blur-xl` |
| Lighter glass | `bg-white/[0.03] backdrop-blur-sm` |
| Input glass | `border-white/10 bg-white/5 backdrop-blur-sm` |
| Product card | `.product-card` — see Section 9 |

**Rules:**

- Blur: `backdrop-blur-xl` (cards/shells) or `backdrop-blur-sm` (inputs, product cards)
- Never opaque white panels on dark pages (except `.concrete-bg` section)
- Border uses neon purple tint — `border-neon-purple/20` not plain `border-white/10` on elevated cards
- Hover on cards: increase purple border + colored shadow (`hover:border-neon-purple/40 hover:shadow-neon-purple/10`)

---

## 8. Border Radius Scale

| Token | Class | Usage |
|-------|-------|-------|
| Full pill | `rounded-full` | Buttons, tags, cart bar, badges, avatar rings, progress track |
| LG | `rounded-lg` | Logo mark (28×28), quantity stepper buttons |
| XL | `rounded-xl` | Inputs, nav items, product thumbs, alerts, slug input, checklist rows |
| 2XL | `rounded-2xl` | Cards, product cards, empty states, metric cards, hero frame outer |
| Custom | `rounded-[1.5rem]` | Phone mockup screen inner |
| Custom | `rounded-[1.75rem]` | `hero-neon-frame-inner` |
| Custom | `rounded-[2rem]` | `hero-neon-frame` |
| Custom | `rounded-[3rem]` | Mockup gradient blur wrapper |
| Tab underline | `after:rounded-full after:h-0.5` | Active nav tab indicator |

---

## 9. Shadow & Elevation

| Level | Classes | Usage |
|-------|---------|-------|
| Neon purple glow | See Section 6 | Buttons, frames, active filters |
| Neon cyan glow | See Section 6 | Button hover, active states |
| Neon lime glow | See Section 6 | Tag pills, add-to-cart |
| Elevated glass | `shadow-lg shadow-black/40` | `.glass-elevated` |
| Product hover | `hover:shadow-xl hover:shadow-neon-purple/10` | `.product-card` |
| Logo mark | `shadow-[0_0_8px_rgba(200,255,0,0.45)]` | Lime glow on "S" |
| Store logo ring | `shadow-xl shadow-neon-purple/20` | Storefront avatar |
| Concrete step card | `shadow-lg` + `hover:shadow-neon-purple/10` | Light section |
| Danger button | `shadow-lg shadow-red-600/25` | Destructive actions |
| Dashboard order card hover | `hover:shadow-lg hover:shadow-neon-purple/10` | Orders list |

**Elevation philosophy:** Colored neon shadows on brand/interactive elements; neutral `shadow-black/40` on glass surfaces. Avoid stacking more than 2–3 shadow layers.

---

## 10. Component Specs (`components/ui.tsx`)

### 10.1 Button

Base (all variants):

```
inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50
```

| Variant | Classes |
|---------|---------|
| **primary** | `border-2 border-neon-purple bg-charcoal/80 text-zinc-50 hover:border-neon-cyan font-display uppercase tracking-widest shadow-[0_0_8px_rgba(176,38,255,0.45),0_0_24px_rgba(176,38,255,0.15)] hover:shadow-[0_0_8px_rgba(0,229,255,0.4),0_0_20px_rgba(0,229,255,0.12)]` |
| **secondary** | `bg-white/10 text-zinc-100 border border-white/10 hover:bg-white/15 hover:border-neon-purple/30` |
| **outline** | `border border-neon-purple/40 bg-transparent text-zinc-100 hover:border-neon-cyan/50 hover:bg-white/5` |
| **ghost** | `text-zinc-400 hover:bg-white/5 hover:text-zinc-100` |
| **danger** | `bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-700` |
| **whatsapp** | `bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a]` |

Sizes:

| Size | Classes |
|------|---------|
| sm | `h-9 px-4 text-xs` |
| md | `h-11 px-5 text-sm` |
| lg | `h-12 px-7 text-base` |

**Primary arrow CTA:** Primary variant auto-appends arrow SVG (`h-4 w-4`) unless `showArrow={false}`. Arrow path: `M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3`.

### 10.2 Input

Wrapper: `space-y-1.5`

Label: `block text-sm font-semibold text-zinc-300`

Field:

```
h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 text-base text-zinc-100 placeholder:text-zinc-500 backdrop-blur-sm transition-colors focus:border-neon-purple/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/20
```

Error: `border-red-400/50 focus:border-red-500 focus:ring-red-500/20` + message `text-sm text-red-400`

Hint: `text-xs text-zinc-500`

### 10.3 Textarea

Same as Input except: `w-full py-2.5` (no fixed height).

### 10.4 Select

Same as Input: `h-11 w-full`; error border only (no focus ring override in error state).

### 10.5 Card

Container: `glass-elevated rounded-2xl` + padding variant

Padding: `p-5 sm:p-6` (default) | `p-0` (none) | `p-6 sm:p-8` (lg)

Header block (when title/description):

```
mb-6 border-b border-neon-purple/15 pb-5
```

Title: `font-display text-xl uppercase tracking-wide text-zinc-50 sm:text-2xl`

Description: `mt-1.5 text-sm leading-relaxed text-zinc-400`

### 10.6 Badge

Base: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize`

| Variant | Classes |
|---------|---------|
| default | `bg-white/10 text-zinc-300 ring-1 ring-white/10` |
| success | `bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25` |
| warning | `bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25` |
| danger | `bg-red-500/15 text-red-300 ring-1 ring-red-500/25` |
| info | `bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25` |

Extended order statuses: see `components/order-status-badge.tsx` (Section 10.15).

### 10.7 Logo

```
inline-flex items-center gap-2 font-display text-lg uppercase tracking-wide text-zinc-50
```

Mark:

```
flex h-8 w-8 items-center justify-center rounded-lg border border-neon-purple/50 bg-charcoal text-sm font-bold text-neon-lime shadow-[0_0_8px_rgba(200,255,0,0.45)]
```

### 10.8 PageHeader

```
flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
```

Title: `font-display text-2xl uppercase tracking-wide text-zinc-50 sm:text-3xl`

Description: `mt-1 text-sm text-zinc-400`

### 10.9 MetricCard

Uses `.metric-card`:

```
rounded-2xl border border-neon-purple/20 bg-white/5 p-4 backdrop-blur-sm
```

Structure:

1. Optional icon: `mb-2 text-neon-cyan`
2. Value: `font-display text-2xl tabular-nums text-zinc-50`
3. Label: `mt-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-500`

### 10.10 EmptyState

Uses `.empty-state`:

```
rounded-2xl border border-dashed border-neon-purple/25 bg-white/[0.03] p-8 text-center backdrop-blur-sm
```

Icon circle: `mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-neon-purple/30 bg-white/5 text-zinc-400`

Title: `font-display text-lg uppercase text-zinc-50`

Description: `mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-400`

Action slot: `mt-5`

### 10.11 SlugInput

```
flex items-center rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm focus-within:border-neon-purple/50 focus-within:ring-2 focus-within:ring-neon-purple/20
```

Prefix: `shrink-0 text-sm text-zinc-500`

Inner input: `min-w-0 flex-1 bg-transparent text-base text-zinc-100 outline-none`

Sanitizes to lowercase `[a-z0-9-]` on change.

### 10.12 Tag pills (globals.css)

**Default `.tag-pill`:**

```
inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300 backdrop-blur-sm
```

**Accent `.tag-pill-accent`:**

```
inline-flex items-center rounded-full border border-neon-lime/40 bg-neon-lime/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neon-lime
box-shadow: 0 0 8px rgba(200, 255, 0, 0.45), 0 0 20px rgba(200, 255, 0, 0.15);
```

### 10.13 Filter pills

**`.filter-pill`:**

```
inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition hover:border-neon-purple/30
```

**`.filter-pill-active`:**

```
border-neon-purple/50 bg-neon-purple/15 text-neon-cyan
box-shadow: 0 0 8px rgba(176, 38, 255, 0.45), 0 0 24px rgba(176, 38, 255, 0.15);
```

### 10.14 Product card (`.product-card`)

```
overflow-hidden rounded-2xl border border-neon-purple/20 bg-white/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-neon-purple/40 hover:shadow-xl hover:shadow-neon-purple/10
```

Body `.product-card-body`:

```
bg-charcoal-elevated/80 px-3 pb-3 pt-2
```

Add-to-cart hover pill `.add-to-cart-pill`:

```
mt-2 w-full rounded-full border border-neon-lime/50 bg-neon-lime/10 py-2 text-center text-xs font-bold uppercase tracking-wide text-neon-lime transition hover:bg-neon-lime/20 active:scale-[0.98]
box-shadow: 0 0 8px rgba(200, 255, 0, 0.45), 0 0 20px rgba(200, 255, 0, 0.15);
```

Storefront grid: `opacity-0 transition group-hover:opacity-100` on pill.

### 10.15 OrderStatusBadge (`components/order-status-badge.tsx`)

| Status | Classes |
|--------|---------|
| new | `bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25` |
| payment_pending | `bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25` |
| paid | `bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25` |
| preparing | `bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/25` |
| completed | `bg-white/10 text-zinc-300 ring-1 ring-white/10` |
| cancelled | `bg-red-500/15 text-red-300 ring-1 ring-red-500/25` |

Base: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize`

### 10.16 Navigation tabs (`.nav-tab` / `.nav-tab-active`)

```
nav-tab → relative whitespace-nowrap px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100

nav-tab-active → text-neon-cyan after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-neon-cyan after:shadow-[0_0_8px_rgba(0,229,255,0.6)]
```

---

## 11. Page Templates

### 11.1 Homepage (`app/page.tsx`)

```
<div class="min-h-screen grid-bg">
  <header class="header-scrim">
    <div class="page-container flex items-center justify-between py-4">
      Logo + ghost "Log in" + primary "Create my store" (hidden sm:block)
  <section class="relative overflow-hidden px-4 pb-24 pt-16 sm:pt-28">
    floating-orbs (purple, cyan, pink)
    graffiti-accent × 2 (hidden sm:block)
    page-container > lg:grid-cols-2
      left: tag-pill-accent row → H1 + text-neon-cyan span → body → CTAs
      right: hero-neon-frame phone mockup (rotate -2deg, hover:rotate-0)
  <section class="concrete-bg border-y border-zinc-300/50 px-4 py-24 text-charcoal">
    3× step cards on white/70
  <section class="px-4 py-24"> benefits 2-col grid with lime checkmarks
  <section class="relative overflow-hidden px-4 py-24">
    floating-orb + graffiti "share it!" + centered CTA
  <footer class="border-t border-neon-purple/15 px-4 py-12 text-center text-sm text-zinc-500">
</div>
```

Phone mockup layers:

1. Glow: `absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-neon-purple/20 via-transparent to-neon-cyan/10 blur-2xl`
2. Frame: `hero-neon-frame` > `hero-neon-frame-inner p-2`
3. Screen: `overflow-hidden rounded-[1.5rem] bg-charcoal`
4. URL bar: `bg-gradient-to-r from-neon-purple/30 to-neon-cyan/20 px-4 py-3 text-center`
5. Mini product cards + `add-to-cart-pill` + `neon-order-btn`

### 11.2 Auth (login / signup)

```
<div class="auth-shell">
  <div class="relative w-full max-w-md">
    Logo centered mb-8
    <Card padding="lg" title description>
      optional neon-purple success alert
      form space-y-4
      footer link text-sm text-zinc-400 + text-neon-cyan link
    </Card>
  </div>
</div>
```

### 11.3 Dashboard shell

```
<div class="flex min-h-screen grid-bg">
  <DashboardNav />
  <main class="flex-1 pb-24 md:pb-8">
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</div>
  </main>
</div>
```

### 11.4 Onboarding shell

```
<div class="min-h-screen grid-bg">
  <header class="header-scrim">
    <div class="mx-auto max-w-lg px-4 py-4">Logo</div>
  </header>
  <main class="mx-auto max-w-lg px-4 py-8 pb-16">
    <OnboardingProgress />
    <Card>...</Card>
  </main>
</div>
```

### 11.5 Storefront

```
<div class="storefront-bg pb-28">
  <StoreHeader />
  <main class="mx-auto max-w-lg px-4 py-6">
    optional amber policies banner
    grid grid-cols-2 gap-3 of product-card OR EmptyState
  </main>
  <CartButton />  <!-- neon-order-btn fixed bottom -->
</div>
```

Product detail: `storefront-bg pb-8` + back link (`text-neon-cyan`) + `glass-elevated` product card.

Checkout: `storefront-bg pb-28` + CheckoutForm in Card sections.

Order confirmation: `storefront-bg min-h-screen` + success icon + Cards.

### 11.6 404

```
<div class="grid-bg flex min-h-screen flex-col items-center justify-center px-4">
  Logo → font-display text-4xl uppercase "404" → text-zinc-400 → Button showArrow={false}
</div>
```

---

## 12. Motion & Interaction

| Interaction | Spec |
|-------------|------|
| Default transition | `transition-colors` or `transition-all duration-200` (buttons) |
| Card hover | `duration-300`; product: `-translate-y-1` |
| Benefit list hover | `hover:-translate-y-0.5` |
| Phone mockup | `transition-transform duration-500 hover:rotate-0` from `rotate-[-2deg]` |
| Step number (concrete) | `group-hover:text-neon-purple` |
| Button / cart active | `active:scale-[0.98]` on `.neon-order-btn`, `.add-to-cart-pill` |
| Progress fill | `duration-500 ease-out` |
| Add-to-cart pill reveal | `opacity-0 transition group-hover:opacity-100` |
| Disabled | `disabled:opacity-50 disabled:pointer-events-none` |
| Focus rings | `focus:ring-2 focus:ring-neon-purple/20` on inputs |

**Do not:** bounce animations, heavy parallax, light mode toggles, orange/warm palette (legacy).

---

## 13. Do's and Don'ts

### Do

- Use `#0a0a0a` charcoal + 48px grid on all dark app surfaces
- Use Bebas Neue (`font-display`) uppercase for all marketing/dashboard headings
- Use neon purple borders on glass cards (`border-neon-purple/20`)
- Use `neon-cyan` for links, active nav, hover button borders
- Use `neon-lime` for storefront prices and accent tag pills
- Use raw `box-shadow` rgba values from Section 6 — copy exactly
- Use `.concrete-bg` for intentional light section breaks (one per page max)
- Use `.graffiti-accent` sparingly (2–3 per marketing page)
- Use pill buttons (`rounded-full`) for CTAs
- Use `tabular-nums` on money and counts
- Keep storefront content within `max-w-lg`
- Provide mobile bottom nav for dashboard (`pb-24` clearance)
- Include global grain overlay on `body::before`

### Don't

- Use pure white `#fff` page backgrounds on app shells
- Reference or implement `orangeTheme.md` / `lavenderTheme.md` palettes as active theme
- Use the stale `tailwind.config.ts` rose colors — tokens live in `globals.css @theme`
- `@apply` custom component classes that themselves use `box-shadow` (Tailwind v4 limitation)
- Use `Permanent Marker` for body copy or form labels
- Overuse graffiti accents (more than 3–4 visible at once)
- Use sharp `rounded-none` on primary components
- Use saturated neon fills for large background areas (radial glows at 6–12% only)
- Mix unrelated warm-orange primary accents
- Use `text-stone-*` in new neon UI — prefer `text-zinc-*`
- Omit `antialiased` on body

---

## 14. Copy-Paste Starter Snippets

### 14.1 Full `globals.css` theme block (Tailwind v4)

```css
@import "tailwindcss";
@source "../app";
@source "../components";

@theme {
  --font-sans: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-bebas), ui-sans-serif, system-ui, sans-serif;
  --font-marker: var(--font-permanent-marker), cursive;

  --color-neon-purple: #b026ff;
  --color-neon-purple-dim: #7c3aed;
  --color-neon-cyan: #00e5ff;
  --color-neon-lime: #c8ff00;
  --color-neon-pink: #ff2d95;

  --color-brand-50: #f7ffe0;
  --color-brand-100: #efffc2;
  --color-brand-200: #e5ff99;
  --color-brand-500: #c8ff00;
  --color-brand-600: #b5e600;
  --color-brand-700: #9acc00;
  --color-brand-800: #7ab800;

  --color-charcoal: #0a0a0a;
  --color-charcoal-elevated: #121212;

  --color-surface: rgba(255, 255, 255, 0.04);
  --color-surface-elevated: rgba(255, 255, 255, 0.07);
  --color-muted: #a1a1aa;
  --color-border: rgba(176, 38, 255, 0.25);
  --color-foreground: #fafafa;
}

body {
  @apply font-sans text-zinc-100 antialiased;
  background-color: #0a0a0a;
}

/* See app/globals.css for full @layer components block including neon glows, backgrounds, graffiti-accent */
```

### 14.2 Root layout fonts

```tsx
import { Bebas_Neue, Outfit, Permanent_Marker } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const permanentMarker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-permanent-marker" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${bebasNeue.variable} ${permanentMarker.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

### 14.3 Primary CTA button (minimal)

```html
<button class="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-neon-purple bg-charcoal/80 px-7 text-base font-bold font-display uppercase tracking-widest text-zinc-50 shadow-[0_0_8px_rgba(176,38,255,0.45),0_0_24px_rgba(176,38,255,0.15)] transition-all duration-200 hover:border-neon-cyan hover:shadow-[0_0_8px_rgba(0,229,255,0.4),0_0_20px_rgba(0,229,255,0.12)]">
  Create my free store
  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
</button>
```

### 14.4 Graffiti accent snippet

```html
<p class="graffiti-accent absolute right-8 top-28 hidden text-lg sm:block lg:text-xl">
  link in bio ↗
</p>
```

Override color: add `text-neon-cyan`. Override rotation: add `rotate-6` (replaces default `-rotate-3` if placed after).

### 14.5 Concrete "How it works" section snippet

```html
<section class="concrete-bg border-y border-zinc-300/50 px-4 py-24 text-charcoal">
  <div class="page-container">
    <p class="tag-pill mx-auto mb-4 w-fit border-zinc-400/30 bg-white/60 text-zinc-700">How it works</p>
    <h2 class="font-display text-3xl uppercase tracking-wide text-charcoal sm:text-4xl">Three steps to your first order</h2>
    <div class="mt-14 grid gap-5 sm:grid-cols-3">
      <div class="group rounded-2xl border border-zinc-400/40 bg-white/70 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-neon-purple/40 hover:shadow-neon-purple/10">
        <div class="font-display text-3xl text-neon-purple-dim/40 transition group-hover:text-neon-purple">01</div>
        <h3 class="mt-3 font-display text-lg uppercase text-charcoal">Set up your store</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">...</p>
      </div>
    </div>
  </div>
</section>
```

---

## 15. Implementation Checklist (New Project)

- [ ] Install Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`)
- [ ] Copy full `app/globals.css` including `@theme`, grain overlay, all `@layer components` utilities
- [ ] Load Outfit + Bebas Neue + Permanent Marker via `next/font/google`; attach CSS variables to `<html>`
- [ ] Set `body` to `background-color: #0a0a0a; font-sans text-zinc-100 antialiased`
- [ ] Implement shared UI primitives from `components/ui.tsx` (Section 10)
- [ ] Apply `.grid-bg` to app shells (marketing, dashboard, onboarding, 404)
- [ ] Apply `.storefront-bg` to public store pages
- [ ] Apply `.auth-shell` to login/signup
- [ ] Build dashboard layout: `md:w-60` sidebar + fixed bottom nav `<md` with `pb-24` main padding
- [ ] Use `max-w-5xl` (marketing), `max-w-3xl` (dashboard), `max-w-lg` (storefront/onboarding)
- [ ] Primary actions: neon purple border pill buttons with cyan hover glow
- [ ] All form fields: glass input recipe with `focus:ring-neon-purple/20`
- [ ] All cards: `glass-elevated rounded-2xl` with `border-neon-purple/*`
- [ ] Product grids: 2 columns, `.product-card`, prices in `text-neon-lime` (grid) or `text-neon-cyan` (detail)
- [ ] Homepage: floating orbs + graffiti accents + `.concrete-bg` steps section
- [ ] Storefront cart: `.neon-order-btn` fixed bottom with `pb-28` page clearance
- [ ] Verify no legacy orange/lavender palette leakage
- [ ] Test mobile: bottom nav, cart FAB, sticky header blur, grain overlay visible

---

## 16. Source File Index

| File | Contains |
|------|----------|
| `app/globals.css` | All design tokens, grain overlay, neon glows, backgrounds, component utilities |
| `app/layout.tsx` | Font loading (Outfit, Bebas Neue, Permanent Marker) |
| `components/ui.tsx` | Button, Input, Textarea, Select, Card, Badge, MetricCard, EmptyState, Logo, PageHeader, SlugInput |
| `app/page.tsx` | Homepage hero, tags, concrete steps, benefits, CTA, phone mockup, graffiti |
| `app/dashboard/layout.tsx` | Dashboard shell |
| `components/dashboard-nav.tsx` | Sidebar + mobile bottom nav |
| `app/login/page.tsx`, `app/signup/page.tsx` | Auth template |
| `app/onboarding/layout.tsx`, `components/onboarding-progress.tsx` | Wizard shell + progress bar |
| `app/s/[slug]/page.tsx`, `store-header.tsx`, `cart-button.tsx` | Storefront |
| `app/s/[slug]/product/[id]/page.tsx`, `add-to-cart-form.tsx` | Product detail |
| `app/s/[slug]/checkout/page.tsx`, `checkout-form.tsx` | Checkout |
| `app/s/[slug]/order/[ref]/page.tsx` | Order confirmation |
| `components/order-status-badge.tsx` | Extended order status colors |
| `components/copy-button.tsx` | Outline copy button wrapper |
| `app/not-found.tsx` | 404 page |

**Legacy reference only (do not implement):** `docs/orangeTheme.md`, `docs/lavenderTheme.md`

---

## 17. Per-Page Class Inventory

Alphabetical by route. Lists custom utilities + notable Tailwind classes applied in each file.

### 17.1 `app/layout.tsx`

| Element | Classes |
|---------|---------|
| `<html>` | Font variable classes from next/font (no visual classes) |
| `<body>` | `min-h-screen` |

### 17.2 `app/page.tsx` (Homepage)

| Element | Classes |
|---------|---------|
| Root | `min-h-screen grid-bg` |
| Header | `header-scrim` |
| Header inner | `page-container flex items-center justify-between py-4` |
| Nav actions | `flex items-center gap-2`; signup link `hidden sm:block` |
| Hero section | `relative overflow-hidden px-4 pb-24 pt-16 sm:pt-28` |
| Floating orbs | `floating-orb` + position/size/color variants (see 5.6) |
| Graffiti | `graffiti-accent absolute ... hidden text-lg sm:block lg:text-xl`; second with `text-neon-cyan rotate-6` |
| Hero grid | `page-container relative`; inner `grid items-center gap-16 lg:grid-cols-2 lg:gap-12` |
| Tag row | `mb-6 flex flex-wrap gap-2`; items `tag-pill-accent` |
| H1 | `font-display text-4xl uppercase leading-[0.95] tracking-wide text-zinc-50 sm:text-5xl lg:text-6xl` |
| Accent span | `text-neon-cyan` |
| Subcopy | `mt-6 max-w-lg text-lg leading-relaxed text-zinc-400` |
| CTA row | `mt-10 flex flex-col gap-3 sm:flex-row`; buttons `min-w-[220px]` |
| Mockup wrapper | `relative mx-auto w-full max-w-[320px] lg:max-w-none` |
| Mockup tilt | `relative mx-auto w-[280px] rotate-[-2deg] transition-transform duration-500 hover:rotate-0 lg:mx-0 lg:ml-auto` |
| Mockup glow | `absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-neon-purple/20 via-transparent to-neon-cyan/10 blur-2xl` |
| Frame | `hero-neon-frame` > `hero-neon-frame-inner p-2` |
| Screen | `overflow-hidden rounded-[1.5rem] bg-charcoal` |
| URL bar | `bg-gradient-to-r from-neon-purple/30 to-neon-cyan/20 px-4 py-3 text-center` |
| Avatar | `mx-auto flex h-14 w-14 ... rounded-full border border-neon-purple/40 bg-charcoal-elevated text-2xl shadow-[0_0_8px_rgba(176,38,255,0.45)]` |
| Mini cards | `overflow-hidden rounded-xl border border-neon-purple/20 bg-white/5` |
| Price | `text-xs font-bold text-neon-lime` |
| Add pill | `add-to-cart-pill mt-1.5 py-1.5 text-[10px]` |
| Order btn | `neon-order-btn mt-3 w-full py-2.5 text-xs` |
| Caption | `mt-10 text-center text-sm text-zinc-500 lg:text-left` |
| Concrete section | `concrete-bg border-y border-zinc-300/50 px-4 py-24 text-charcoal` |
| Step cards | `group rounded-2xl border border-zinc-400/40 bg-white/70 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-neon-purple/40 hover:shadow-neon-purple/10` |
| Benefits section | `px-4 py-24` |
| Benefit items | `flex items-center gap-3 rounded-2xl border border-neon-purple/20 bg-white/5 px-4 py-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-neon-purple/35` |
| Check icon | `flex h-7 w-7 ... rounded-full border border-neon-lime/50 bg-neon-lime/10 text-xs font-bold text-neon-lime` |
| Bottom CTA | `relative overflow-hidden px-4 py-24`; graffiti `text-2xl opacity-60` |
| Footer | `border-t border-neon-purple/15 px-4 py-12 text-center text-sm text-zinc-500` |

### 17.3 `app/login/page.tsx`

| Element | Classes |
|---------|---------|
| Root | `auth-shell` |
| Wrapper | `relative w-full max-w-md` |
| Logo link | `mb-8 flex justify-center` |
| Success alert | `mb-4 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-4 py-3 text-sm text-neon-cyan` |
| Form | `space-y-4` |
| Error | `rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400` |
| Submit btn | `w-full` + `size="lg"` |
| Footer link | `mt-6 text-center text-sm text-zinc-400`; link `font-medium text-neon-cyan hover:underline` |

### 17.4 `app/signup/page.tsx`

Same shell as login; error alert uses red variant; footer link to `/login`.

### 17.5 `app/not-found.tsx`

| Element | Classes |
|---------|---------|
| Root | `grid-bg flex min-h-screen flex-col items-center justify-center px-4` |
| Logo | `mb-8` |
| H1 | `font-display text-4xl uppercase text-zinc-50` |
| Message | `mt-2 text-zinc-400` |
| Link wrapper | `mt-8` |

### 17.6 `app/dashboard/layout.tsx`

| Element | Classes |
|---------|---------|
| Root | `flex min-h-screen grid-bg` |
| Main | `flex-1 pb-24 md:pb-8` |
| Inner | `mx-auto max-w-3xl px-4 py-8 sm:px-6` |

### 17.7 `app/dashboard/page.tsx`

| Element | Classes |
|---------|---------|
| Root | `space-y-8` |
| H1 | `font-display text-2xl uppercase tracking-tight text-zinc-50 sm:text-3xl` |
| Store link Card | `border-neon-purple/20 bg-gradient-to-br from-neon-purple/10 to-charcoal` |
| Label | `text-xs font-semibold uppercase tracking-wide text-zinc-500` |
| URL | `mt-1 break-all font-medium text-zinc-400` |
| Actions | `mt-4 flex flex-wrap gap-2` |
| Metrics | `grid grid-cols-3 gap-3` |
| Order list | `divide-y divide-neon-purple/15` |
| Order row | `-mx-2 flex items-center justify-between rounded-2xl px-2 py-3.5 transition hover:bg-white/5` |
| View all link | `text-sm font-medium text-neon-cyan hover:underline` |
| Empty tips | `space-y-2 text-left text-sm text-zinc-400`; arrows `text-neon-cyan` |

### 17.8 `app/dashboard/products/page.tsx`

| Element | Classes |
|---------|---------|
| Root | `space-y-8` |
| Product Card | `flex gap-4 p-4` |
| Thumb | `h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-neon-purple/30` |
| Placeholder | `flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-charcoal-elevated text-2xl ring-1 ring-neon-purple/30` |
| Name | `font-medium text-zinc-50` |
| Price | `font-semibold text-neon-cyan` |
| List | `space-y-3` |

### 17.9 `app/dashboard/products/product-actions.tsx`

| Element | Classes |
|---------|---------|
| Actions row | `mt-2 flex gap-2` |
| Form page H1 | `font-display text-xl font-bold text-zinc-50` |
| Form | `mt-6 space-y-4` |
| Button row | `flex gap-3` |

### 17.10 `app/dashboard/orders/page.tsx`

| Element | Classes |
|---------|---------|
| Order Card | `p-4 transition hover:border-neon-purple/20 hover:shadow-lg hover:shadow-neon-purple/10` |
| Reference | `font-medium text-zinc-50` |
| Meta | `truncate text-sm text-zinc-500` |
| Total | `font-semibold tabular-nums text-zinc-50` |

### 17.11 `app/dashboard/orders/[id]/page.tsx`

| Element | Classes |
|---------|---------|
| Root | `space-y-6` |
| Back link | `inline-flex items-center gap-1 text-sm font-medium text-neon-cyan hover:underline` |
| H1 row | `flex flex-wrap items-center gap-3` |
| H1 | `font-display text-2xl font-bold text-zinc-50` |
| Item rows | `flex justify-between text-sm` |
| Totals divider | `mt-4 space-y-1 border-t border-white/10 pt-3 text-sm` |
| Fulfillment type | `capitalize text-neon-cyan` |

### 17.12 `app/dashboard/orders/order-actions.tsx`

| Element | Classes |
|---------|---------|
| Root | `flex flex-wrap gap-2` |

### 17.13 `app/dashboard/settings/settings-client.tsx`

| Element | Classes |
|---------|---------|
| Root | `space-y-8` |
| Tab bar | `flex gap-0 overflow-x-auto border-b border-white/10` |
| Tabs | `nav-tab` / `nav-tab-active` |
| Selected fulfillment | `border-neon-purple/30 bg-neon-purple/10` |
| Unselected | `border-white/10` |
| Publish status | `text-neon-cyan` or `text-amber-400` |
| Slug warning | `border-amber-500/25 bg-amber-500/10 text-amber-200` |

### 17.14 `app/onboarding/layout.tsx`

| Element | Classes |
|---------|---------|
| Root | `min-h-screen grid-bg` |
| Header | `header-scrim` |
| Header inner | `mx-auto max-w-lg px-4 py-4` |
| Main | `mx-auto max-w-lg px-4 py-8 pb-16` |

### 17.15 `components/onboarding-progress.tsx`

| Element | Classes |
|---------|---------|
| Root | `mb-8` |
| Labels | `text-xs font-semibold uppercase tracking-wide text-zinc-500` / `text-sm font-semibold text-zinc-100` |
| Track | `h-2 overflow-hidden rounded-full bg-white/10` |
| Fill | `h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-500 ease-out shadow-[0_0_8px_rgba(176,38,255,0.45)]` |
| Step links | `flex-1 truncate rounded-xl px-1 py-1 text-center text-[10px] font-semibold`; states `text-neon-cyan`, `text-zinc-100`, `text-zinc-600` |

### 17.16 Onboarding forms (shared patterns)

| File | Notable classes |
|------|-----------------|
| `store-basics.tsx` | Form `space-y-4`; file input `mt-1 text-sm text-zinc-400` |
| `store-link.tsx` | Error box `border-red-500/20 bg-red-500/10`; suggestions `rounded bg-neon-purple/15 px-2 py-1 text-zinc-400 underline` |
| `product.tsx` | Card with title/description |
| `fulfillment.tsx` | Selected `border-neon-purple/30 bg-neon-purple/10`; nested `border-t border-white/10 pt-3` |
| `payment.tsx` | Same form patterns |
| `publish.tsx` | Checklist rows `rounded-xl border border-white/10 bg-white/5 px-3 py-2.5`; done icon `bg-neon-lime/20 text-neon-cyan` |
| `preview.tsx` | Preview card `glass-elevated`; header `bg-gradient-to-b from-neon-lime/10 to-transparent p-6 text-center`; logo `ring-2 ring-neon-lime/40 shadow-xl` |
| `success.tsx` | Success icon `bg-neon-lime/20 ring-1 ring-neon-lime/40`; URL box `border-neon-purple/25 bg-neon-purple/10` |

### 17.17 `app/s/[slug]/page.tsx` (Storefront)

| Element | Classes |
|---------|---------|
| Unpublished | `storefront-bg flex min-h-screen items-center justify-center px-4` |
| Root | `storefront-bg pb-28` |
| Main | `mx-auto max-w-lg px-4 py-6` |
| Policies | `mb-5 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-200` |
| Grid | `grid grid-cols-2 gap-3` |
| Product link | `product-card group` |
| Image placeholder | `flex aspect-square items-center justify-center bg-gradient-to-br from-charcoal-elevated to-charcoal text-3xl` |
| Body | `product-card-body` |
| Price | `mt-0.5 text-sm font-bold text-neon-lime` |
| Hover pill | `add-to-cart-pill opacity-0 transition group-hover:opacity-100` |

### 17.18 `app/s/[slug]/store-header.tsx`

| Element | Classes |
|---------|---------|
| Header | `border-b border-neon-purple/15 bg-charcoal/60 backdrop-blur-xl` |
| Inner | `mx-auto max-w-lg px-4 py-10 text-center` |
| Logo img | `mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-neon-purple/40 shadow-xl shadow-neon-purple/20` |
| H1 | `mt-3 font-display text-2xl uppercase tracking-wide text-zinc-50` |
| Description | `mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-400` |
| WhatsApp btn | `mt-5 inline-flex ... rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#20bd5a]` |

### 17.19 `app/s/[slug]/cart-button.tsx`

| Element | Classes |
|---------|---------|
| Link (when count > 0) | `neon-order-btn fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg py-3.5 text-sm` |

### 17.20 `app/s/[slug]/product/[id]/page.tsx`

| Element | Classes |
|---------|---------|
| Root | `storefront-bg pb-8` |
| Back link | `inline-flex items-center gap-1 text-sm font-medium text-neon-cyan hover:underline` |
| Product card | `glass-elevated mt-4 overflow-hidden rounded-2xl` |
| Price | `mt-1 text-lg font-semibold text-neon-cyan` |

### 17.21 `app/s/[slug]/product/[id]/add-to-cart-form.tsx`

| Element | Classes |
|---------|---------|
| Root | `mt-6 space-y-4 border-t border-white/10 pt-5` |
| Quantity row | `flex items-end gap-3` |
| Input width | `w-24` |

### 17.22 `app/s/[slug]/checkout/page.tsx`

| Element | Classes |
|---------|---------|
| Root | `storefront-bg pb-28` |
| H1 | `font-display text-xl font-bold text-zinc-50` |
| Sub | `mt-1 text-sm text-zinc-400` |

### 17.23 `app/s/[slug]/checkout/checkout-form.tsx`

| Element | Classes |
|---------|---------|
| Form | `mt-6 space-y-5` |
| Line items | `space-y-3`; name `font-medium text-neon-cyan` |
| Stepper btns | `flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/10` |
| Totals | `mt-4 space-y-1.5 border-t border-white/10 pt-4 text-sm` |
| Total row | `text-base font-semibold text-zinc-50` |

### 17.24 `app/s/[slug]/order/[ref]/page.tsx`

| Element | Classes |
|---------|---------|
| Root | `storefront-bg min-h-screen` |
| Main | `mx-auto max-w-lg px-4 py-10` |
| Success icon | `mx-auto flex h-16 w-16 ... rounded-full bg-neon-lime/20 text-2xl font-bold text-neon-cyan ring-1 ring-neon-lime/40` |
| Total | `mt-3 text-2xl font-semibold tabular-nums text-neon-cyan` |
| PayNow blocks | `rounded-xl border border-white/10 bg-white/5 p-4` |
| QR img | `mx-auto rounded-xl ring-1 ring-neon-purple/30` |
| Amber note | `border-amber-500/25 bg-amber-500/10 text-amber-200` |

### 17.25 `components/dashboard-nav.tsx`

| Element | Classes |
|---------|---------|
| Sidebar | `hidden md:flex md:w-60 md:flex-col md:border-r md:border-neon-purple/15 md:bg-charcoal/50 md:backdrop-blur-xl` |
| Logo area | `border-b border-neon-purple/15 p-5` |
| Nav | `flex flex-1 flex-col gap-1 p-3` |
| Link base | `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors` |
| Active | `border border-neon-purple/30 bg-neon-purple/10 text-neon-cyan shadow-[0_0_8px_rgba(176,38,255,0.45)]` |
| Inactive | `text-zinc-400 hover:bg-white/5 hover:text-zinc-100` |
| Active icon | `text-neon-lime` |
| Inactive icon | `text-zinc-500` |
| Mobile bar | `fixed bottom-0 left-0 right-0 z-50 border-t border-neon-purple/20 bg-charcoal/90 backdrop-blur-xl md:hidden` |
| Mobile tab active | `text-neon-cyan` |
| Mobile tab inactive | `text-zinc-500` |

---

## 18. Tailwind v4 Notes

This project uses **Tailwind CSS v4** with design tokens declared in CSS `@theme`, not in `tailwind.config.ts`.

### 18.1 Source directives

```css
@import "tailwindcss";
@source "../app";
@source "../components";
```

### 18.2 No `@apply` on glow component classes

Custom classes that set `box-shadow` (`.neon-glow-purple`, `.neon-order-btn`, `.tag-pill-accent`, `.filter-pill-active`, etc.) must **not** be referenced via `@apply` in other custom component rules. Tailwind v4 cannot `@apply` utilities/rules that expand to illegal `@property` or conflicting at-rules in some builds.

**Instead:**

- Add the class directly in JSX: `className="neon-order-btn ..."`
- Or duplicate raw shadow in arbitrary values: `shadow-[0_0_8px_rgba(176,38,255,0.45),0_0_24px_rgba(176,38,255,0.15)]`
- Button primary variant uses inline arbitrary shadows for this reason

### 18.3 Safe `@apply` patterns

These component classes safely use `@apply` for layout/color only:

- `.page-container`, `.glass`, `.glass-elevated`, `.header-scrim`, `.product-card`, `.metric-card`, `.empty-state`, `.nav-tab`, `.auth-shell` (partial), `.graffiti-accent`, `.hero-neon-frame-inner`

### 18.4 Token usage

Reference theme colors as Tailwind utilities: `bg-neon-purple`, `text-neon-cyan`, `border-neon-purple/20`, `bg-charcoal`, `shadow-neon-purple/10`.

### 18.5 Legacy config warning

If `tailwind.config.ts` exists with outdated rose/orange colors, it is **not** the source of truth. Sync or remove conflicting extensions.

---

## 19. Graffiti Accent Usage

### 19.1 Base class (`.graffiti-accent`)

```css
.graffiti-accent {
  @apply font-marker text-neon-pink -rotate-3 select-none;
}
```

### 19.2 When to use

- Marketing homepage hero only (decorative, non-interactive)
- Bottom CTA section (one instance)
- Maximum 2–3 visible per page
- Hidden on mobile for hero side accents: `hidden sm:block`

### 19.3 Production instances (`app/page.tsx`)

| Text | Classes |
|------|---------|
| "link in bio ↗" | `graffiti-accent absolute right-8 top-28 hidden text-lg sm:block lg:text-xl` |
| "tap to shop!" | `graffiti-accent absolute left-6 top-40 hidden text-sm text-neon-cyan rotate-6 sm:block` |
| "share it!" | `graffiti-accent absolute left-1/4 top-8 text-2xl opacity-60` |

### 19.4 Overrides

- **Color:** append `text-neon-cyan` (overrides default pink)
- **Rotation:** append `rotate-6` or `-rotate-6` (overrides default `-rotate-3` when listed after)
- **Size:** `text-sm`, `text-lg`, `text-2xl`
- **Opacity:** `opacity-60` for background decoration

### 19.5 Don't

- Use for headings that carry primary information
- Use on dashboard, auth, storefront, or checkout flows
- Combine with `font-display` on same element
- Make graffiti text interactive (no links/buttons)

---

## 20. Light Concrete Section Variant (Homepage "How it works")

Full recipe for the intentional light-mode break within dark marketing page.

### 20.1 Section wrapper

```
concrete-bg border-y border-zinc-300/50 px-4 py-24 text-charcoal
```

Sets base text color to `charcoal` (`#0a0a0a`) for headings; body uses `text-zinc-600`.

### 20.2 Section label pill (adapted tag-pill)

```
tag-pill mx-auto mb-4 w-fit border-zinc-400/30 bg-white/60 text-zinc-700
```

Unlike dark `tag-pill`, uses light borders and dark text.

### 20.3 Step card

```
group rounded-2xl border border-zinc-400/40 bg-white/70 p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-neon-purple/40 hover:shadow-neon-purple/10
```

Hover reintroduces neon purple — bridges light section back to brand.

### 20.4 Step number

```
font-display text-3xl text-neon-purple-dim/40 transition group-hover:text-neon-purple
```

At rest: muted `#7c3aed` at 40% opacity. Hover: full `#b026ff`.

### 20.5 Step title & body

- Title: `mt-3 font-display text-lg uppercase text-charcoal`
- Body: `mt-2 text-sm leading-relaxed text-zinc-600`

### 20.6 Layout

```
page-container > mx-auto max-w-2xl text-center (intro)
mt-14 grid gap-5 sm:grid-cols-3 (cards)
```

### 20.7 Design intent

Simulates urban concrete wall under neon signage — breaks visual fatigue on long homepage scroll while keeping purple/lime brand hints on hover.

---

*Extracted from Store Link Platform implementation. All hex values, class strings, and box-shadow values match production code in `app/globals.css`, `components/ui.tsx`, and page components. Legacy theme docs (`orangeTheme.md`, `lavenderTheme.md`) are not active.*
