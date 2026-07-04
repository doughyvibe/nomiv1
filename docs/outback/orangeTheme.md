# Store Link Platform — Dark Premium Orange Design System

> **Audience:** AI coding agent with zero project context.  
> **Goal:** Replicate the exact visual language of Store Link Platform on any new project.  
> **Stack reference:** Next.js 15, React 19, Tailwind CSS v4 (`@theme` in CSS, not legacy `tailwind.config` colors).

---

## 1. Design Philosophy

**Aesthetic:** Awwwards-grade dark premium UI with warm orange accent. Inspired by high-end food/brand sites (EATNaked-style): near-black canvas, subtle grid texture, glass surfaces, pill CTAs, display-serif headlines, restrained motion.

**Core principles:**

| Principle | Implementation |
|-----------|----------------|
| Dark-first | Base `#080808`, never pure black `#000` for page bg |
| Warm accent | Brand orange `#ff6b2b` — CTAs, links, active states, price text |
| Depth via glass | `bg-white/5` + `backdrop-blur` + `border-white/10`, not heavy shadows |
| Typography contrast | Syne (display) for headings; Outfit (sans) for body/UI |
| Pill geometry | Buttons, tags, cart bar, logo mark use `rounded-full` or large radii (`rounded-2xl`) |
| Orange as light | Radial gradients at 12–20% brand mix — ambient glow, not flat fills |
| Mobile-first | Storefront `max-w-lg`; dashboard bottom nav below `md` |

**Mood keywords:** premium, warm, confident, minimal chrome, shoppable, Singapore social-seller friendly.

---

## 2. Color Palette

### 2.1 Brand scale (Tailwind `@theme` tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#fff7ed` | — (reserved) |
| `brand-100` | `#ffedd5` | — |
| `brand-200` | `#fed7aa` | Accent tag text (`tag-pill-accent`) |
| `brand-500` | `#ff6b2b` | **Primary accent** — buttons, links, prices, active nav |
| `brand-600` | `#f5590a` | Button hover, gradient stops |
| `brand-700` | `#e54d00` | Button active |
| `brand-800` | `#c2410c` | Gradient accents in mockups |

### 2.2 Warm alias (legacy parity)

| Token | Hex |
|-------|-----|
| `warm-50` | `#fff7ed` |
| `warm-100` | `#ffedd5` |
| `warm-500` | `#ff6b2b` |

### 2.3 Semantic tokens

| Token | Value | Role |
|-------|-------|------|
| `--color-surface` | `rgba(255, 255, 255, 0.04)` | Flat glass fill |
| `--color-surface-elevated` | `rgba(255, 255, 255, 0.07)` | Cards, elevated glass |
| `--color-muted` | `#a3a3a3` | Muted text (token; prefer Tailwind `stone-400/500` in UI) |
| `--color-border` | `rgba(255, 255, 255, 0.08)` | Default border (token; UI uses `border-white/10`) |
| `--color-foreground` | `#fafafa` | Primary text (token; UI uses `text-stone-50/100`) |

### 2.4 Background & text (Tailwind classes in use)

| Role | Class / value |
|------|---------------|
| Page background | `bg-[#080808]` or `.grid-bg` / `.storefront-bg` / `.auth-shell` |
| Inner mockup bg | `bg-[#0c0c0c]` |
| Primary text | `text-stone-50`, `text-stone-100` |
| Secondary text | `text-stone-300`, `text-stone-400` |
| Muted / caption | `text-stone-500`, `text-stone-600` |
| Default border | `border-white/5` (headers), `border-white/10` (cards/inputs) |
| Subtle border | `border-white/15` (outline buttons, dashed empty states) |
| Accent border | `border-brand-500/20`, `border-brand-500/30`, `border-brand-500/50` (focus) |

### 2.5 Status / semantic colors

| Variant | Classes |
|---------|---------|
| Success | `bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25` |
| Warning | `bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25` |
| Danger / error | `bg-red-500/15 text-red-300 ring-1 ring-red-500/25`; inputs: `border-red-400/50`, text `text-red-400` |
| Info | `bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25` |
| WhatsApp | `bg-[#25D366] hover:bg-[#20bd5a]` |
| Policies notice | `border-amber-500/25 bg-amber-500/10 text-amber-200` |
| Success alert (auth) | `border-brand-500/30 bg-brand-500/10 text-brand-200` |
| Error alert (forms) | `border-red-500/20 bg-red-500/10 text-red-300` |

### 2.6 Gradient text (hero)

```html
<span class="bg-gradient-to-r from-brand-500 to-orange-300 bg-clip-text text-transparent">
  ready in minutes
</span>
```

### 2.7 Stone palette (structural)

Used for phone mockup, placeholders, gradients: `stone-800`, `stone-900`, `stone-950`, `orange-300`, `orange-400`, `orange-900`.

---

## 3. Typography

### 3.1 Font families

Load via `next/font/google` in root layout:

```tsx
import { Outfit, Syne } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["500", "600", "700", "800"],
});

// <html className={`${outfit.variable} ${syne.variable}`}>
```

CSS theme mapping:

```css
--font-sans: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
--font-display: var(--font-syne), ui-sans-serif, system-ui, sans-serif;
```

Apply:

- **Body / UI:** `font-sans` (default on `body`)
- **Headlines / logo / metrics:** `font-display`

Utility class (if not using Tailwind font-display token):

```css
.font-display { font-family: var(--font-display); }
```

### 3.2 Type scale

| Element | Classes | Notes |
|---------|---------|-------|
| Hero H1 | `font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-stone-50 sm:text-5xl lg:text-6xl` | Gradient span optional |
| Section H2 | `font-display text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl` | Center or left |
| CTA section H2 | `font-display text-3xl font-bold text-stone-50 sm:text-5xl` | Bottom hero |
| Page H1 (dashboard) | `font-display text-2xl font-bold tracking-tight text-stone-50 sm:text-3xl` | |
| Card title | `font-display text-xl font-bold tracking-tight text-stone-50 sm:text-2xl` | Inside `Card` |
| Step number | `font-display text-3xl font-extrabold text-brand-500/40` | Hover → `group-hover:text-brand-500/70` |
| Step title | `font-display text-lg font-bold text-stone-50` | |
| Store name (storefront) | `font-display text-2xl font-bold tracking-tight text-stone-50` | |
| Product title | `font-display text-xl font-bold text-stone-50` | |
| Body large | `text-lg leading-relaxed text-stone-400` | Hero subcopy |
| Body default | `text-sm leading-relaxed text-stone-400` | Cards, descriptions |
| Body UI | `text-sm font-medium text-stone-300` | List items, labels |
| Caption | `text-xs text-stone-500` | Hints, footers |
| Uppercase label | `text-xs font-medium uppercase tracking-wide text-stone-500` | Metric labels, step counters |
| Metric value | `font-display text-2xl font-bold tabular-nums text-stone-50` | |
| Tabular numbers | `tabular-nums` | Prices, order totals |
| Logo | `font-display text-lg font-bold tracking-tight text-stone-50` | |
| Mobile nav label | `text-[10px] font-medium` | Bottom bar |
| Onboarding step pills | `text-[10px] font-medium` | |

### 3.3 Weights

- Display: `font-bold`, `font-extrabold`, `font-semibold`
- UI buttons: `font-semibold`
- Labels: `font-medium`

### 3.4 Body defaults

```css
body {
  @apply bg-[#080808] font-sans text-stone-100 antialiased;
}
```

---

## 4. Spacing & Layout

### 4.1 Container widths

| Class | Max width | Padding | Usage |
|-------|-----------|---------|-------|
| `.page-container` | `max-w-5xl` | `px-4 sm:px-6` | Marketing homepage |
| Dashboard main | `max-w-3xl` | `px-4 py-8 sm:px-6` | Seller dashboard |
| Storefront main | `max-w-lg` | `px-4 py-6` | Public store, checkout |
| Onboarding main | `max-w-lg` | `px-4 py-8 pb-16` | Setup wizard |
| Auth card wrapper | `max-w-md` | — | Login/signup |
| Mobile nav inner | `max-w-lg` | — | Bottom tab bar |
| Section content (centered) | `max-w-2xl` | — | Section intros |
| Benefits grid | `max-w-3xl` | — | Homepage list |

### 4.2 Section spacing

| Pattern | Classes |
|---------|---------|
| Hero top padding | `pt-16 sm:pt-28 pb-24` |
| Standard section | `py-24` with `px-4` |
| Section divider | `border-y border-white/5` |
| Vertical stack (dashboard) | `space-y-8` |
| Form fields | `space-y-4` |
| Form field internal | `space-y-1.5` (label → input) |
| Grid gap (steps) | `gap-5` |
| Grid gap (products) | `gap-3` |
| Hero two-col gap | `gap-16 lg:grid-cols-2 lg:gap-12` |

### 4.3 Breakpoints (Tailwind defaults)

| Prefix | Min width | Key behavior |
|--------|-----------|--------------|
| `sm` | 640px | Larger type, horizontal CTAs, 3-col grids |
| `md` | 768px | Sidebar nav visible; hide bottom nav |
| `lg` | 1024px | Hero 2-column; mockup sizing |

### 4.4 Safe areas / fixed chrome

- Dashboard mobile: `pb-24` on `<main>` (bottom nav clearance)
- Storefront cart bar: `pb-28` on page wrapper
- Sticky header: `sticky top-0 z-50`

---

## 5. Background System

### 5.1 Base grid (`.grid-bg`)

Used on: homepage, dashboard shell, 404, onboarding.

```css
.grid-bg {
  background-color: #080808;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
```

**Grid spec:** 48×48px cells, 1px lines at `rgba(255,255,255,0.03)`.

### 5.2 Storefront (`.storefront-bg`)

Grid + top radial orange glow:

```css
.storefront-bg {
  @apply min-h-screen;
  background-color: #080808;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    radial-gradient(ellipse 80% 60% at 50% -15%, color-mix(in oklab, var(--color-brand-500) 12%, transparent), transparent);
  background-size: 48px 48px, 48px 48px, 100% 100%;
}
```

### 5.3 Auth shell (`.auth-shell`)

Grid + stronger top glow + decorative orb:

```css
.auth-shell {
  @apply relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12;
  background-color: #080808;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    radial-gradient(ellipse 70% 50% at 50% -10%, color-mix(in oklab, var(--color-brand-500) 18%, transparent), transparent);
  background-size: 48px 48px, 48px 48px, 100% 100%;
}

.auth-shell::before {
  content: "";
  @apply pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30;
  background: radial-gradient(circle, color-mix(in oklab, var(--color-brand-500) 40%, transparent), transparent 70%);
}
```

### 5.4 Inline hero glows (homepage)

Top hero (inline style):

```css
background: radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in oklab, #ff6b2b 20%, transparent), transparent);
```

Bottom CTA:

```css
background: radial-gradient(ellipse 70% 80% at 50% 100%, color-mix(in oklab, #ff6b2b 15%, transparent), transparent);
```

Decorative blurs near phone mockup:

- `bg-brand-500/20 blur-3xl` — 128×128 orb, `-left-8 top-8`
- `bg-orange-400/10 blur-3xl` — 160×160 orb, `-right-4 bottom-12`

### 5.5 Sticky header scrim

```html
<header class="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl">
```

Storefront header: `bg-[#080808]/60 backdrop-blur-xl border-b border-white/5`

---

## 6. Glassmorphism

| Class | Recipe |
|-------|--------|
| `.glass` | `border border-white/10 bg-white/5 backdrop-blur-xl` |
| `.glass-elevated` | `border border-white/10 bg-white/[0.07] backdrop-blur-xl shadow-lg shadow-black/20` |
| Lighter glass | `bg-white/[0.03] backdrop-blur-sm` |
| Input glass | `border-white/10 bg-white/5 backdrop-blur-sm` |

**Rules:**

- Blur: `backdrop-blur-xl` (cards/shells) or `backdrop-blur-sm` (inputs, product cards)
- Never opaque white panels on dark pages
- Border always present — glass reads via edge + blur, not fill alone
- Hover on cards: increase border warmth (`hover:border-brand-500/20` or `/30`)

---

## 7. Border Radius Scale

| Token | Class | Usage |
|-------|-------|-------|
| Full pill | `rounded-full` | Buttons, tags, cart bar, progress track, badges, avatar rings |
| XL | `rounded-xl` | Inputs, nav items, product thumbs, alerts, slug input |
| 2XL | `rounded-2xl` | Cards, product cards, empty states, metric cards, phone inner |
| Logo mark | `rounded-lg` | 28×28 brand square in logo |
| Phone frame | `rounded-[2.5rem]` | Hero mockup outer |
| Phone screen | `rounded-[2rem]` | Hero mockup inner |
| Phone glow | `rounded-[3rem]` | Gradient blur wrapper |
| Step underline | `after:rounded-full after:h-0.5` | Active nav tab indicator |

---

## 8. Shadow & Elevation

| Level | Classes | Usage |
|-------|---------|-------|
| Brand button | `shadow-lg shadow-brand-500/25` | Primary CTA |
| Danger button | `shadow-lg shadow-red-600/25` | Destructive |
| Elevated glass | `shadow-lg shadow-black/20` | `.glass-elevated` |
| Product hover | `hover:shadow-xl hover:shadow-brand-500/10` | `.product-card` |
| Logo mark | `shadow-lg shadow-brand-500/30` | Orange "S" square |
| Phone mockup | `shadow-2xl shadow-black/60` | Hero device |
| Store logo ring | `shadow-xl shadow-black/40` | Storefront avatar |
| Cart FAB | `shadow-lg shadow-brand-500/30` | Fixed bottom CTA |
| Mockup CTA | `shadow-lg shadow-brand-500/30` | In-device button |

**Elevation philosophy:** Colored shadows on brand elements; neutral black shadows on surfaces. Avoid heavy drop shadows on flat lists.

---

## 9. Component Specs

### 9.1 Buttons

Base (all variants):

```
inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50
```

| Variant | Classes |
|---------|---------|
| **primary** | `bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 active:bg-brand-700` |
| **secondary** | `bg-white/10 text-stone-100 hover:bg-white/15 border border-white/10` |
| **outline** | `border border-white/15 bg-transparent text-stone-100 hover:border-white/25 hover:bg-white/5` |
| **ghost** | `text-stone-400 hover:bg-white/5 hover:text-stone-100` |
| **danger** | `bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-700` |
| **whatsapp** | `bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a]` |

Sizes:

| Size | Classes |
|------|---------|
| sm | `h-9 px-4 text-sm` |
| md | `h-11 px-5 text-sm` |
| lg | `h-12 px-7 text-base` |

**Primary arrow CTA:** Primary variant auto-appends arrow SVG (`h-4 w-4`) unless `showArrow={false}`. Arrow path: `M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3`.

**Full-width form CTAs:** add `w-full` + `size="lg"`.

**Fixed cart button (storefront):**

```
fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-lg items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 active:scale-[0.98]
```

### 9.2 Tag pills

**Default:**

```
tag-pill → inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-stone-300 backdrop-blur-sm
```

**Accent (hero badges):**

```
tag-pill-accent → inline-flex items-center rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200
```

Layout: `flex flex-wrap gap-2`.

### 9.3 Cards

**Glass card (`Card` component):**

```
glass-elevated rounded-2xl
```

Padding: `p-5 sm:p-6` (default) | `p-0` (none) | `p-6 sm:p-8` (lg)

Header block (when title/description):

```
mb-6 border-b border-white/10 pb-5
```

**Featured dashboard card (store link):**

```
glass-elevated rounded-2xl border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-transparent
```

**Step cards (homepage):**

```
glass-elevated group rounded-2xl p-6 transition duration-300 hover:border-brand-500/20
```

**Product detail card:**

```
glass-elevated mt-4 overflow-hidden rounded-2xl
```

**List row card (dashboard products):**

```
glass-elevated rounded-2xl flex gap-4 p-4
```

### 9.4 Inputs / Textareas / Selects

Wrapper: `space-y-1.5`

Label: `block text-sm font-medium text-stone-300`

Shared field classes:

```
rounded-xl border border-white/10 bg-white/5 px-3.5 text-base text-stone-100 backdrop-blur-sm transition-colors focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20
```

| Field | Extra |
|-------|-------|
| Input | `h-11 w-full`; placeholder: `placeholder:text-stone-500` |
| Textarea | `w-full py-2.5` |
| Select | `h-11 w-full` |
| Error state | `border-red-400/50 focus:border-red-500 focus:ring-red-500/20` |
| Hint | `text-xs text-stone-500` |
| Error message | `text-sm text-red-400` |

**Slug input (composite):**

```
flex items-center rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/20
```

Prefix: `shrink-0 text-sm text-stone-500`  
Inner input: `min-w-0 flex-1 bg-transparent text-base text-stone-100 outline-none`

**Quantity stepper (checkout):**

```
flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-stone-400 transition hover:bg-white/5
```

### 9.5 Badges

Base: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize`

| Variant | Classes |
|---------|---------|
| default | `bg-white/10 text-stone-300 ring-1 ring-white/10` |
| success | `bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25` |
| warning | `bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25` |
| danger | `bg-red-500/15 text-red-300 ring-1 ring-red-500/25` |
| info | `bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25` |

Order status badges extend palette (see `order-status-badge.tsx`): sky, amber, emerald, purple, white/10, red.

### 9.6 Metric cards

Class: `.metric-card`

```
rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm
```

Structure:

1. Optional icon: `mb-2 text-brand-500`
2. Value: `font-display text-2xl font-bold tabular-nums text-stone-50`
3. Label: `mt-0.5 text-xs font-medium uppercase tracking-wide text-stone-500`

Grid: `grid grid-cols-3 gap-3`.

### 9.7 Product cards

Class: `.product-card`

```
overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/10
```

Image: `aspect-square w-full object-cover`  
Placeholder: `flex aspect-square items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900`  
Body: `p-3`  
Name: `line-clamp-2 text-sm font-medium leading-snug text-stone-100`  
Price: `mt-1 text-sm font-semibold text-brand-500`

Storefront grid: `grid grid-cols-2 gap-3`.

### 9.8 Navigation

**Desktop sidebar (`md+`):**

```
aside: hidden md:flex md:w-60 md:flex-col md:border-r md:border-white/5 md:bg-[#080808]/50 md:backdrop-blur-xl
```

Logo area: `border-b border-white/5 p-5`

Nav links:

```
flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
```

| State | Classes |
|-------|---------|
| Active | `bg-brand-500/10 text-brand-400` + icon `text-brand-500` |
| Inactive | `text-stone-400 hover:bg-white/5 hover:text-stone-100` + icon `text-stone-500` |

Icon size: `h-5 w-5`, strokeWidth `1.75`.

**Mobile bottom bar (`<md`):**

```
fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#080808]/90 backdrop-blur-xl
```

Tab:

```
flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors
```

Active: `text-brand-500`; inactive: `text-stone-500`.

**Horizontal nav tabs (utility classes):**

```
nav-tab → relative whitespace-nowrap px-4 py-2.5 text-sm font-medium text-stone-400 transition-colors hover:text-stone-100
nav-tab-active → text-brand-500 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-brand-500
```

### 9.9 Empty states

Class: `.empty-state`

```
rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center backdrop-blur-sm
```

Icon circle: `mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-stone-400`

Title: `font-display text-lg font-bold text-stone-100`  
Description: `mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-400`  
Action slot: `mt-5`

### 9.10 Logo

```
inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight text-stone-50
```

Mark:

```
flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-sm text-white shadow-lg shadow-brand-500/30
```

### 9.11 Page header (dashboard)

```
flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
```

Title: same as dashboard H1. Description: `mt-1 text-sm text-stone-400`.

### 9.12 Progress bar (onboarding)

Track: `h-1.5 overflow-hidden rounded-full bg-white/10`  
Fill: `h-full rounded-full bg-gradient-to-r from-brand-500 to-orange-400 transition-all duration-500 ease-out`

Step label row: `text-xs font-medium uppercase tracking-wide text-stone-500` / `text-sm font-semibold text-stone-200`

### 9.13 List rows (orders)

Container: `divide-y divide-white/5`  
Row link: `-mx-2 flex items-center justify-between rounded-lg px-2 py-3.5 transition hover:bg-white/5`

### 9.14 Benefit list items (homepage)

```
flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-sm transition hover:border-brand-500/20
```

Check icon: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-500`

### 9.15 Storefront header

Centered block in `max-w-lg px-4 py-10`. Logo: `h-20 w-20 rounded-full object-cover ring-2 ring-brand-500/30 shadow-xl shadow-black/40`.

### 9.16 Links

- Inline accent: `font-medium text-brand-500 hover:underline`
- Back link: `inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:underline`

---

## 10. Page Templates

### 10.1 Homepage

```
<div class="min-h-screen grid-bg">
  <header sticky scrim>...</header>
  <section hero relative overflow-hidden px-4 pb-24 pt-16 sm:pt-28>
    radial glow absolute inset-0
    page-container > lg:grid-cols-2
      left: tag-pill-accent row → H1 + gradient span → body → CTAs (flex-col sm:flex-row gap-3)
      right: phone mockup (max-w-[320px], rotate -2deg, hover:rotate-0)
  <section border-y py-24> 3× glass-elevated step cards
  <section py-24> benefits 2-col grid
  <section relative py-24> bottom radial CTA
  <footer border-t py-12 text-center text-sm text-stone-500>
</div>
```

Phone mockup structure:

1. Glow: `absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-brand-500/20 via-transparent to-transparent blur-2xl`
2. Frame: `rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-stone-800 to-stone-950 p-2 shadow-2xl shadow-black/60`
3. Screen: `rounded-[2rem] bg-[#0c0c0c]`
4. URL bar: `bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-center`
5. Product mini-cards: `rounded-xl border border-white/10 bg-white/5 shadow-lg`

### 10.2 Auth (login / signup)

```
<div class="auth-shell">
  <div class="relative w-full max-w-md">
    <Logo centered mb-8 />
    <Card padding="lg" title description>
      optional brand alert
      form space-y-4
      footer link text-sm text-stone-400 + brand link
    </Card>
  </div>
</div>
```

### 10.3 Dashboard shell

```
<div class="flex min-h-screen grid-bg">
  <DashboardNav />  <!-- sidebar md+ / bottom bar mobile -->
  <main class="flex-1 pb-24 md:pb-8">
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {children}
    </div>
  </main>
</div>
```

Typical home content order: title + Badge → featured store link Card → 3 MetricCards → EmptyState or orders Card.

### 10.4 Onboarding shell

```
<div class="min-h-screen grid-bg">
  <header border-b scrim max-w-lg py-4 />
  <main class="mx-auto max-w-lg px-4 py-8 pb-16">
    <OnboardingProgress />
    <Card>...</Card>
  </main>
</div>
```

### 10.5 Storefront

```
<div class="storefront-bg pb-28">
  <StoreHeader />
  <main class="mx-auto max-w-lg px-4 py-6">
    optional policies amber banner
    grid grid-cols-2 gap-3 of product-card OR EmptyState
  </main>
  <CartButton fixed bottom pill />
</div>
```

Product detail: `storefront-bg pb-8` + back link + single `glass-elevated` product card.

### 10.6 404

```
grid-bg flex min-h-screen flex-col items-center justify-center px-4
Logo → font-display text-4xl "404" → text-stone-400 → Button
```

---

## 11. Motion & Interaction

| Interaction | Spec |
|-------------|------|
| Default transition | `transition-colors` or `transition-all duration-200` (buttons) |
| Card hover | `duration-300`; product: `-translate-y-1` |
| Phone mockup | `transition-transform duration-500 hover:rotate-0` from `rotate-[-2deg]` |
| Step number | `group-hover:text-brand-500/70` |
| Button active (cart) | `active:scale-[0.98]` |
| Progress fill | `duration-500 ease-out` |
| Disabled | `disabled:opacity-50 disabled:pointer-events-none` |
| Focus rings | `focus:ring-2 focus:ring-brand-500/20` on inputs; no thick outlines |

**Do not:** bounce animations, parallax, neon glows, light mode toggles.

---

## 12. Do's and Don'ts

### Do

- Use `#080808` + 48px grid on all app surfaces
- Use Syne for all marketing/dashboard headings
- Use `brand-500` for primary actions and price display
- Use glass panels with visible `border-white/10`
- Use pill buttons (`rounded-full`) for CTAs
- Use `tabular-nums` on money and counts
- Add orange radial glows at section tops/bottoms (12–20% mix)
- Keep storefront content within `max-w-lg`
- Provide mobile bottom nav for dashboard (`pb-24` clearance)

### Don't

- Use pure white `#fff` backgrounds or light gray page bg
- Use the stale `tailwind.config.ts` brand (`#e11d48` rose) — colors live in `globals.css @theme`
- Use sharp `rounded-none` or tiny `rounded-md` on primary components
- Use saturated orange fills for large background areas (gradients only)
- Use heavy box-shadow stacks without glass borders
- Mix unrelated accent colors (blue/purple primary) — status badges only
- Use `text-gray-*` in new UI — use `stone-*` palette
- Omit `antialiased` on body

---

## 13. Copy-Paste Starter Snippets

### 13.1 Full `globals.css` theme block (Tailwind v4)

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-syne), ui-sans-serif, system-ui, sans-serif;

  --color-brand-50: #fff7ed;
  --color-brand-100: #ffedd5;
  --color-brand-200: #fed7aa;
  --color-brand-500: #ff6b2b;
  --color-brand-600: #f5590a;
  --color-brand-700: #e54d00;
  --color-brand-800: #c2410c;

  --color-warm-50: #fff7ed;
  --color-warm-100: #ffedd5;
  --color-warm-500: #ff6b2b;

  --color-surface: rgba(255, 255, 255, 0.04);
  --color-surface-elevated: rgba(255, 255, 255, 0.07);
  --color-muted: #a3a3a3;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-foreground: #fafafa;
}

body {
  @apply bg-[#080808] font-sans text-stone-100 antialiased;
}

@layer components {
  .font-display { font-family: var(--font-display); }
  .page-container { @apply mx-auto max-w-5xl px-4 sm:px-6; }

  .grid-bg {
    background-color: #080808;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .glass { @apply border border-white/10 bg-white/5 backdrop-blur-xl; }
  .glass-elevated { @apply border border-white/10 bg-white/[0.07] backdrop-blur-xl shadow-lg shadow-black/20; }

  .auth-shell {
    @apply relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12;
    background-color: #080808;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      radial-gradient(ellipse 70% 50% at 50% -10%, color-mix(in oklab, var(--color-brand-500) 18%, transparent), transparent);
    background-size: 48px 48px, 48px 48px, 100% 100%;
  }
  .auth-shell::before {
    content: "";
    @apply pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30;
    background: radial-gradient(circle, color-mix(in oklab, var(--color-brand-500) 40%, transparent), transparent 70%);
  }

  .storefront-bg {
    @apply min-h-screen;
    background-color: #080808;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      radial-gradient(ellipse 80% 60% at 50% -15%, color-mix(in oklab, var(--color-brand-500) 12%, transparent), transparent);
    background-size: 48px 48px, 48px 48px, 100% 100%;
  }

  .product-card {
    @apply overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/10;
  }
  .metric-card { @apply rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm; }
  .empty-state { @apply rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center backdrop-blur-sm; }
  .nav-tab { @apply relative whitespace-nowrap px-4 py-2.5 text-sm font-medium text-stone-400 transition-colors hover:text-stone-100; }
  .nav-tab-active { @apply text-brand-500 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-brand-500; }
  .tag-pill { @apply inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-stone-300 backdrop-blur-sm; }
  .tag-pill-accent { @apply inline-flex items-center rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200; }
}
```

### 13.2 Root layout fonts

```tsx
import { Outfit, Syne } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["500", "600", "700", "800"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${syne.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

### 13.3 Primary CTA button (minimal)

```html
<button class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-7 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 active:bg-brand-700">
  Create my free store
  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
</button>
```

### 13.4 Tailwind config note

This project uses **Tailwind v4** with tokens in CSS. The repo's `tailwind.config.ts` contains outdated rose colors (`#e11d48`) and is **not** the source of truth. Either delete legacy color extensions or sync them to match `@theme` above.

---

## 14. Implementation Checklist (New Project)

- [ ] Install Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`)
- [ ] Add `globals.css` with full `@theme` brand scale + component utilities (Section 13.1)
- [ ] Load Outfit + Syne via `next/font/google`; attach CSS variables to `<html>`
- [ ] Set `body` to `bg-[#080808] font-sans text-stone-100 antialiased`
- [ ] Implement shared UI primitives: Button, Input, Textarea, Select, Card, Badge, MetricCard, EmptyState, Logo, PageHeader
- [ ] Apply `.grid-bg` to app shells (marketing, dashboard, onboarding, 404)
- [ ] Apply `.storefront-bg` to public store pages
- [ ] Apply `.auth-shell` to login/signup
- [ ] Build dashboard layout: `md:w-60` sidebar + fixed bottom nav `<md` with `pb-24` main padding
- [ ] Use `max-w-5xl` (marketing), `max-w-3xl` (dashboard), `max-w-lg` (storefront/onboarding)
- [ ] Primary actions: `brand-500` pill buttons with arrow on primary variant
- [ ] All form fields: glass input recipe with brand focus ring
- [ ] All cards: `glass-elevated rounded-2xl`
- [ ] Product grids: 2 columns, `.product-card`, prices in `text-brand-500`
- [ ] Add hero radial glows (20% top, 15% bottom) on marketing pages
- [ ] Verify no light-mode leakage; no `#e11d48` / rose accent
- [ ] Test mobile: bottom nav, cart FAB, sticky header blur

---

## 15. Source File Index

| File | Contains |
|------|----------|
| `app/globals.css` | All design tokens, utilities, background patterns |
| `app/layout.tsx` | Font loading |
| `components/ui.tsx` | Button, Input, Card, Badge, MetricCard, EmptyState, Logo, PageHeader, SlugInput |
| `app/page.tsx` | Homepage hero, tags, steps, benefits, CTA, phone mockup |
| `app/dashboard/layout.tsx` | Dashboard shell |
| `components/dashboard-nav.tsx` | Sidebar + mobile bottom nav |
| `app/login/page.tsx`, `app/signup/page.tsx` | Auth template |
| `app/onboarding/layout.tsx`, `components/onboarding-progress.tsx` | Wizard shell |
| `app/s/[slug]/page.tsx`, `store-header.tsx`, `cart-button.tsx` | Storefront |
| `app/s/[slug]/product/[id]/page.tsx` | Product detail |
| `components/order-status-badge.tsx` | Extended badge colors |

---

*Extracted from Store Link Platform implementation. All hex values and class strings match production code.*
