# Store Link Platform — Playful Lavender Design System

> **Audience:** AI coding agent with zero project context.  
> **Goal:** Replicate the exact visual language of Store Link Platform on any new project.  
> **Stack reference:** Next.js 15, React 19, Tailwind CSS v4 (`@theme` in CSS, not legacy `tailwind.config` colors).  
> **Content note:** Store Link product copy, features, and Singapore social-seller positioning (PayNow, PayLah, bio links) are unchanged — this document covers **visual language only**, not a BOM BON or third-party rebrand.

---

## 1. Design Philosophy

**Aesthetic:** Light, dreamy, playful lavender UI with electric lime CTAs. Inspired by soft pastel brand sites and bubbly mobile commerce: vertical lavender gradient canvas, white floating cards, CSS-only decorative orbs, pill CTAs, ALL CAPS display headlines, restrained lift-on-hover motion.

**Core principles:**

| Principle | Implementation |
|-----------|----------------|
| Light-first | Vertical gradient `#f5e6ff → #e8d4f5 → #dbc9f0`; never dark page backgrounds |
| Lime accent | Brand lime `#dfff00` / `#c8ff00` — CTAs, active tags, progress fill; **purple-900 text on buttons** |
| Depth via white cards | `bg-white` + soft `shadow-purple-900/*` — not glass-on-dark |
| Typography contrast | Archivo Black (display, ALL CAPS) for headings; Outfit (sans) for body/UI |
| Bubbly geometry | `rounded-3xl`, `rounded-4xl`, `rounded-full` pills — avoid sharp corners |
| Lavender as atmosphere | Radial white/pink-lavender orbs layered over vertical gradient — dreamy, not flat |
| Mobile-first | Storefront `max-w-lg`; dashboard bottom nav below `md` |

**Mood keywords:** playful, dreamy, shoppable, Singapore social-seller friendly, bio-link ready, soft but confident.

**What this is NOT:**

- Not a dark premium theme (see `orangeTheme.md` for that variant)
- Not a BOM BON rebrand — product name stays **Store Link**, copy references PayNow/PayLah/SG sellers
- Not glassmorphism-on-black — surfaces are opaque white with purple-tinted shadows

---

## 2. Color Palette

### 2.1 Brand scale — lime accent (Tailwind `@theme` tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#f7ffe0` | — (reserved) |
| `brand-100` | `#efffc2` | — |
| `brand-200` | `#e5ff99` | — |
| `brand-500` | `#dfff00` | **Primary CTA fill** — buttons, cart bar, tag-pill-accent, progress start |
| `brand-600` | `#c8ff00` | Button hover, progress end, add-to-cart hover |
| `brand-700` | `#b5e600` | Button active |
| `brand-800` | `#9acc00` | — |

**Critical rule:** Lime buttons always pair with **`text-purple-900`** (`#3d1f5c`), never white text on lime (except WhatsApp green).

### 2.2 Purple scale — text & active UI

| Token | Hex | Usage |
|-------|-----|-------|
| `purple-50` | `#faf5ff` | — |
| `purple-100` | `#f3e8ff` | Badge default bg |
| `purple-200` | `#e9d5ff` | Borders, progress track tint |
| `purple-600` | `#7c3a9a` | Muted labels, captions |
| `purple-700` | `#5b2869` | Secondary body text (`/70`, `/80` opacity) |
| `purple-800` | `#4a1a6b` | **Active filter pills**, nav active sidebar, prices, links |
| `purple-900` | `#3d1f5c` | **Primary text**, button text on lime, headlines |

### 2.3 Lavender scale — backgrounds & product card footers

| Token | Hex | Usage |
|-------|-----|-------|
| `lavender-100` | `#f8eeff` | Phone mockup screen, product placeholder gradient start |
| `lavender-200` | `#edd9f7` | **Product card body**, auth orbs, featured card gradient, empty-state icon bg |
| `lavender-300` | `#e0c4f0` | Floating orbs, decorative blurs |
| `lavender-400` | `#d4b8e8` | Gradient stops, orb accents |

### 2.4 Semantic tokens (`@theme`)

| Token | Value | Role |
|-------|-------|------|
| `--color-surface` | `#ffffff` | Card/panel fill |
| `--color-surface-elevated` | `#ffffff` | Elevated cards (same white; elevation via shadow) |
| `--color-muted` | `#7c6994` | Muted text token |
| `--color-border` | `rgba(74, 26, 107, 0.12)` | Default border (maps to purple-800 at 12%) |
| `--color-foreground` | `#3d1f5c` | Primary text (purple-900) |

### 2.5 Background & text (Tailwind classes in use)

| Role | Class / value |
|------|---------------|
| Page background (body) | `linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%)` + `background-attachment: fixed` |
| Shell backgrounds | `.grid-bg`, `.lavender-bg`, `.storefront-bg`, `.auth-shell` — layered radials + same vertical gradient |
| Primary text | `text-purple-900` |
| Secondary text | `text-purple-800`, `text-purple-700/70`, `text-purple-700/80` |
| Muted / caption | `text-purple-600/70`, `text-purple-600/50` (placeholders) |
| Default border | `border-purple-200/30`, `border-purple-200/40`, `border-purple-200/50` |
| Active / emphasis border | `border-purple-800/20`, `border-purple-800/30`, `border-purple-800/40` (focus) |
| White scrim surfaces | `bg-white/60`, `bg-white/70`, `bg-white/80`, `bg-white/90` |

### 2.6 Vertical gradient spec (canonical)

Used on `body` and as the base layer in all shell classes:

```css
linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%)
```

| Stop | Hex | Role |
|------|-----|------|
| 0% | `#f5e6ff` | Top — lightest pink-lavender |
| 45% | `#e8d4f5` | Mid transition |
| 100% | `#dbc9f0` | Bottom — slightly deeper lavender |

### 2.7 Status / semantic colors

| Variant | Classes |
|---------|---------|
| Success badge | `bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200` |
| Warning badge | `bg-amber-100 text-amber-800 ring-1 ring-amber-200` |
| Danger badge | `bg-red-100 text-red-800 ring-1 ring-red-200` |
| Info badge | `bg-sky-100 text-sky-800 ring-1 ring-sky-200` |
| Default badge | `bg-purple-100 text-purple-800 ring-1 ring-purple-200/50` |
| WhatsApp | `bg-[#25D366] hover:bg-[#20bd5a]` with **white** text |
| Policies notice (storefront) | `border-amber-200 bg-amber-50 text-amber-900` |
| Success alert (auth) | `border-purple-800/30 bg-lavender-200 text-purple-800` |
| Error alert (forms) | `border-red-500/20 bg-red-500/10 text-red-700`; field errors `text-red-600` |

### 2.8 Hero accent text (no gradient clip)

Unlike the orange dark theme, hero emphasis uses solid purple:

```html
<span class="text-purple-800">ready in minutes</span>
```

Inside ALL CAPS Archivo Black headline (`text-purple-900` base).

### 2.9 Opacity patterns

Common opacity modifiers on purple text:

| Pattern | Usage |
|---------|-------|
| `text-purple-700/70` | Card descriptions, footer, secondary copy |
| `text-purple-700/80` | Hero subcopy |
| `text-purple-600/70` | Captions, metric labels, hints |
| `text-purple-600/50` | Input placeholders |
| `text-purple-700/70` | Slug prefix, muted UI |

---

## 3. Typography

### 3.1 Font families

Load via `next/font/google` in root layout:

```tsx
import { Archivo_Black, Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

// <html className={`${outfit.variable} ${archivoBlack.variable}`}>
```

CSS theme mapping:

```css
--font-sans: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
--font-display: var(--font-archivo-black), ui-sans-serif, system-ui, sans-serif;
```

Apply:

- **Body / UI:** `font-sans` (default on `body`)
- **Headlines / logo / metrics:** `font-display` + **`uppercase`** on all display headings

Utility class:

```css
.font-display { font-family: var(--font-display); }
```

### 3.2 Display headline rule — ALL CAPS

Every `font-display` heading in marketing, dashboard, storefront, and cards uses **`uppercase`**. This is non-negotiable for the lavender aesthetic.

Examples:

- Hero H1: `font-display text-4xl uppercase ...`
- Section H2: `font-display text-3xl uppercase ...`
- Card title: `font-display text-xl uppercase ...`
- Store name: `font-display text-2xl uppercase ...`
- Empty state title: `font-display text-lg uppercase ...`

### 3.3 Type scale

| Element | Classes | Notes |
|---------|---------|-------|
| Hero H1 | `font-display text-4xl uppercase leading-[0.95] tracking-tight text-purple-900 sm:text-5xl lg:text-6xl` | Span: `text-purple-800` |
| Section H2 | `font-display text-3xl uppercase tracking-tight text-purple-900 sm:text-4xl` | Center or left |
| CTA section H2 | `font-display text-3xl uppercase text-purple-900 sm:text-5xl` | Bottom hero |
| Page H1 (dashboard) | `font-display text-2xl uppercase tracking-tight text-purple-900 sm:text-3xl` | |
| Card title | `font-display text-xl uppercase tracking-tight text-purple-900 sm:text-2xl` | Inside `Card` |
| Step number | `font-display text-3xl text-purple-300 transition group-hover:text-purple-500` | Homepage steps |
| Step title | `font-display text-lg uppercase text-purple-900` | |
| Store name (storefront) | `font-display text-2xl uppercase tracking-tight text-purple-900` | |
| Product title (card) | `text-sm font-semibold leading-snug text-purple-900` | Outfit, not display |
| Body large | `text-lg leading-relaxed text-purple-700/80` | Hero subcopy |
| Body default | `text-sm leading-relaxed text-purple-700/70` | Cards, descriptions |
| Body UI | `text-sm font-medium text-purple-800` | Benefits list |
| Caption | `text-xs text-purple-600/70` | Hints, footers, mockup caption |
| Uppercase label | `text-xs font-semibold uppercase tracking-wide text-purple-600/70` | Metric labels, step counters, store link label |
| Metric value | `font-display text-2xl tabular-nums text-purple-900` | No uppercase on numbers |
| Tabular numbers | `tabular-nums` | Prices, order totals |
| Logo wordmark | `font-display text-lg uppercase tracking-tight text-purple-900` | |
| Mobile nav label | `text-[10px] font-semibold` | Bottom bar |
| Onboarding step pills | `text-[10px] font-semibold` | |
| Tag pills | `text-xs font-semibold uppercase tracking-wide` | tag-pill, tag-pill-accent |
| Filter pills | `text-sm font-semibold` | filter-pill (not forced uppercase in CSS) |
| Add to cart pill | `text-xs font-bold uppercase tracking-wide text-purple-900` | |
| Cart FAB | `text-sm font-bold uppercase tracking-wide text-purple-900` | |
| Phone URL bar label | `text-[10px] font-semibold uppercase tracking-widest text-purple-200` | Mockup only |

### 3.4 Weights

- Display: Archivo Black is weight 400 only — emphasis via size/color, not weight
- UI buttons: `font-bold` (Button component base)
- Labels: `font-semibold`
- Product names: `font-semibold`
- Prices: `font-bold`

### 3.5 Body defaults

```css
body {
  @apply font-sans text-purple-900 antialiased;
  background: linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%);
  background-attachment: fixed;
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
| Section divider | `border-y border-purple-200/30` |
| Vertical stack (dashboard) | `space-y-8` |
| Form fields | `space-y-4` |
| Form field internal | `space-y-1.5` (label → input) |
| Grid gap (steps) | `gap-5` |
| Grid gap (products) | `gap-3` |
| Hero two-col gap | `gap-16 lg:grid-cols-2 lg:gap-12` |
| Benefits list gap | `gap-3` |
| Tag row gap | `gap-2` |

### 4.3 Breakpoints (Tailwind defaults)

| Prefix | Min width | Key behavior |
|--------|-----------|--------------|
| `sm` | 640px | Larger type, horizontal CTAs, 3-col grids, onboarding step links visible |
| `md` | 768px | Sidebar nav visible; hide bottom nav |
| `lg` | 1024px | Hero 2-column; mockup sizing |

### 4.4 Safe areas / fixed chrome

- Dashboard mobile: `pb-24` on `<main>` (bottom nav clearance)
- Storefront cart bar: `pb-28` on page wrapper
- Sticky header: `sticky top-0 z-50` via `.header-scrim`

---

## 5. Background System

### 5.1 Body gradient (global)

Every page inherits the fixed vertical gradient from `body`. Shell classes **repeat** the same gradient plus decorative radial layers for consistency when components don't fill the viewport.

### 5.2 Lavender shell (`.lavender-bg`, `.grid-bg`)

Used on: homepage, dashboard shell, onboarding, 404 (when applicable).

```css
.lavender-bg,
.grid-bg {
  background-color: #edd9f7;
  background-image:
    radial-gradient(ellipse 80% 50% at 15% 8%, rgba(255, 255, 255, 0.65) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 85% 15%, rgba(255, 230, 250, 0.45) 0%, transparent 50%),
    radial-gradient(ellipse 45% 35% at 50% 90%, rgba(212, 184, 232, 0.35) 0%, transparent 55%),
    linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%);
}
```

**Layer spec:**

| Layer | Shape | Position | Color |
|-------|-------|----------|-------|
| 1 | Ellipse 80×50% | 15% 8% | White 65% → transparent |
| 2 | Ellipse 55×45% | 85% 15% | Pink `#ffe6fa` 45% → transparent |
| 3 | Ellipse 45×35% | 50% 90% | Lavender `#d4b8e8` 35% → transparent |
| 4 | Linear 180deg | full | `#f5e6ff → #e8d4f5 → #dbc9f0` |

### 5.3 Storefront (`.storefront-bg`)

Same layered recipe as `.grid-bg` with `min-h-screen`:

```css
.storefront-bg {
  @apply min-h-screen;
  background-color: #edd9f7;
  background-image: /* same 4 layers as .grid-bg */;
}
```

### 5.4 Auth shell (`.auth-shell`)

Same gradient base + two CSS pseudo-element orbs (no JS):

```css
.auth-shell {
  @apply relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12;
  /* same 4-layer background-image as .grid-bg */
}

.auth-shell::before {
  content: "";
  @apply pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full opacity-50;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, transparent 70%);
}

.auth-shell::after {
  content: "";
  @apply pointer-events-none absolute -right-16 bottom-24 h-64 w-64 rounded-full opacity-40;
  background: radial-gradient(circle, rgba(212, 184, 232, 0.6) 0%, transparent 70%);
}
```

### 5.5 CSS-only floating orbs (`.floating-orb`)

Decorative blurs placed in JSX — no images, no canvas.

Base class:

```css
.floating-orb {
  @apply pointer-events-none absolute rounded-full blur-3xl;
}
```

**Homepage hero orbs** (`app/page.tsx`):

| Classes | Size | Color |
|---------|------|-------|
| `-left-16 top-24 h-48 w-48 bg-white/50` | 192px | White 50% |
| `right-8 top-32 h-32 w-32 bg-lavender-300/60` | 128px | Lavender-300 60% |
| `bottom-32 left-1/3 h-40 w-40 bg-purple-200/40` | 160px | Purple-200 40% |

**Phone mockup orbs:**

| Classes | Size | Color |
|---------|------|-------|
| `-right-4 top-4 h-36 w-36 bg-brand-500/30` | 144px | Lime 30% |
| `-left-8 bottom-16 h-28 w-28 bg-white/60` | 112px | White 60% |

**Bottom CTA orb:**

| Classes | Size | Color |
|---------|------|-------|
| `bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 bg-lavender-300/50` | 256×384px | Lavender-300 50% |

**Rules:**

- Always `pointer-events-none` (via class)
- Always `absolute` positioning in parent `relative overflow-hidden` section
- Use `blur-3xl` — do not use sharp circles
- Mix white, lavender-300, purple-200, brand-500 at low opacity

### 5.6 Sticky header scrim (`.header-scrim`)

```css
.header-scrim {
  @apply sticky top-0 z-50 border-b border-purple-200/30 bg-white/70 backdrop-blur-xl;
}
```

Storefront header (store-header): `border-b border-purple-200/30 bg-white/60 backdrop-blur-xl`

---

## 6. Cards & Surfaces (White Floating Panels)

The lavender theme replaces dark glassmorphism with **opaque white cards** and purple-tinted shadows.

| Class | Recipe |
|-------|--------|
| `.glass` | `rounded-3xl border border-purple-200/40 bg-white shadow-md shadow-purple-900/5` |
| `.glass-elevated` | `rounded-3xl border border-purple-200/30 bg-white shadow-lg shadow-purple-900/8` |
| Semi-transparent list row | `border border-purple-200/30 bg-white/80 shadow-sm` |
| Dashed empty | `border-dashed border-purple-300/50 bg-white/60 shadow-sm` |

**Rules:**

- Default card radius: **`rounded-3xl`** (not `rounded-2xl` from orange theme)
- Borders use purple-200 at 30–50% opacity — subtle, not harsh
- Shadows use **`shadow-purple-900/5`** through **`/15`** — never pure black shadows on cards
- Hover on step cards: `-translate-y-1 hover:shadow-xl` (no border color shift required)
- Never use `bg-white/5` or dark glass on page shells

**Featured dashboard card (store link):**

```
glass-elevated rounded-3xl border-purple-800/20 bg-gradient-to-br from-lavender-200 to-white
```

---

## 7. Border Radius Scale

| Token | Class | Usage |
|-------|-------|-------|
| Full pill | `rounded-full` | Buttons, tags, cart bar, progress track, badges, logo mark, add-to-cart |
| 2XL | `rounded-2xl` | Inputs, nav items, alerts, slug input, policies banner, mini mockup cards |
| 3XL | `rounded-3xl` | **Primary card radius** — glass, product-card, metric-card, empty-state, step cards, benefits rows |
| 4XL frame | `rounded-[2.5rem]` | Phone mockup outer |
| 4XL screen | `rounded-[2rem]` | Phone mockup inner |
| Glow wrapper | `rounded-[3rem]` | Phone mockup blur halo |
| Step underline | `after:rounded-full after:h-0.5` | Active nav tab indicator |
| Onboarding step link | `rounded-xl` | Step label pills in progress bar |

**Philosophy:** Bubbly, soft, generous radii. Prefer `rounded-3xl` over `rounded-2xl` for any panel-sized surface.

---

## 8. Shadow & Elevation

| Level | Classes | Usage |
|-------|---------|-------|
| Subtle card | `shadow-sm` | Benefits rows, tag pills, inputs |
| Default card | `shadow-md shadow-purple-900/5` | `.glass`, `.metric-card` |
| Elevated card | `shadow-lg shadow-purple-900/8` | `.glass-elevated`, `.product-card` |
| Hover product | `hover:shadow-xl hover:shadow-purple-900/12` | `.product-card` |
| Step card hover | `hover:shadow-xl` | Homepage steps |
| Logo mark | `shadow-md` | Lime "S" circle |
| Phone mockup | `shadow-2xl shadow-purple-900/15` | Hero device frame |
| Store logo ring | `shadow-lg shadow-purple-900/10` | Storefront avatar |
| Cart FAB | `shadow-lg shadow-purple-900/15` | Fixed bottom CTA |
| Primary button | `shadow-lg shadow-purple-900/10` | Lime CTA |
| Danger button | `shadow-lg shadow-red-500/20` | Destructive |
| Filter pill active | `shadow-md hover:shadow-lg` | Purple-800 active state |
| Filter pill inactive | `shadow-sm hover:shadow-md` | White inactive |

**Elevation philosophy:** Purple-tinted shadows at low alpha (`/5`–`/15`); colored lime only on CTA fills, not shadow color. Avoid heavy black `shadow-black/*` stacks.

---

## 9. Component Specs

### 9.1 Buttons

Base (all variants):

```
inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50
```

| Variant | Classes |
|---------|---------|
| **primary** | `bg-brand-500 text-purple-900 shadow-lg shadow-purple-900/10 hover:bg-brand-600 active:bg-brand-700` |
| **secondary** | `bg-white text-purple-900 hover:bg-purple-50 border border-purple-200/50 shadow-sm` |
| **outline** | `border-2 border-purple-800/20 bg-white/80 text-purple-900 hover:border-purple-800/40 hover:bg-white` |
| **ghost** | `text-purple-700 hover:bg-white/60 hover:text-purple-900` |
| **danger** | `bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600` |
| **whatsapp** | `bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a]` |

Sizes:

| Size | Classes |
|------|---------|
| sm | `h-9 px-4 text-sm` |
| md | `h-11 px-5 text-sm` |
| lg | `h-12 px-7 text-base` |

**Primary arrow CTA:** Primary variant auto-appends arrow SVG (`h-4 w-4`, strokeWidth `2.5`) unless `showArrow={false}`. Arrow path: `M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3`.

**Full-width form CTAs:** add `w-full` + `size="lg"`.

**Fixed cart button (storefront):**

```
fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-lg items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-bold uppercase tracking-wide text-purple-900 shadow-lg shadow-purple-900/15 transition hover:bg-brand-600 active:scale-[0.98]
```

### 9.2 Tag pills

**Default (`tag-pill`):**

```
inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-900 shadow-sm
```

Usage: section labels like "How it works" — white bg, dark purple text.

**Accent (`tag-pill-accent`):**

```
inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-900 shadow-sm
```

Usage: hero feature tags (PayNow, No app needed, Built for SG sellers) — lime bg, purple-900 text.

Layout: `flex flex-wrap gap-2`.

| Class | Background | Text | Weight |
|-------|------------|------|--------|
| `tag-pill` | White | purple-900 | semibold |
| `tag-pill-accent` | brand-500 (lime) | purple-900 | bold |

### 9.3 Filter pills

For category/filter UI (defined in CSS; combine classes in JSX):

**Inactive (`filter-pill`):**

```
inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-purple-900 shadow-sm transition hover:shadow-md
```

**Active (`filter-pill-active`):**

```
bg-purple-800 text-white shadow-md hover:shadow-lg
```

Apply both: `className={cn("filter-pill", active && "filter-pill-active")}`

| State | Background | Text |
|-------|------------|------|
| Inactive | White | purple-900 |
| Active | purple-800 | white |

### 9.4 Cards

**Elevated card (`Card` component):**

```
glass-elevated rounded-3xl
```

Padding: `p-5 sm:p-6` (default) | `p-0` (none) | `p-6 sm:p-8` (lg)

Header block (when title/description):

```
mb-6 border-b border-purple-200/40 pb-5
```

Card title: `font-display text-xl uppercase tracking-tight text-purple-900 sm:text-2xl`  
Card description: `mt-1.5 text-sm leading-relaxed text-purple-700/70`

**Step cards (homepage):**

```
glass-elevated group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl
```

### 9.5 Inputs / Textareas / Selects

Wrapper: `space-y-1.5`

Label: `block text-sm font-semibold text-purple-800`

Shared field classes:

```
rounded-2xl border border-purple-200/50 bg-white px-3.5 text-base text-purple-900 placeholder:text-purple-600/50 shadow-sm transition-colors focus:border-purple-800/40 focus:outline-none focus:ring-2 focus:ring-purple-800/10
```

| Field | Extra |
|-------|-------|
| Input | `h-11 w-full` |
| Textarea | `w-full py-2.5` |
| Select | `h-11 w-full` |
| Error state | `border-red-400 focus:border-red-500 focus:ring-red-500/20` |
| Hint | `text-xs text-purple-600/70` |
| Error message | `text-sm text-red-600` |

**Slug input (composite):**

```
flex items-center rounded-2xl border border-purple-200/50 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-purple-800/40 focus-within:ring-2 focus-within:ring-purple-800/10
```

Prefix: `shrink-0 text-sm text-purple-600/70`  
Inner input: `min-w-0 flex-1 bg-transparent text-base text-purple-900 outline-none`

### 9.6 Badges

Base: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize`

| Variant | Classes |
|---------|---------|
| default | `bg-purple-100 text-purple-800 ring-1 ring-purple-200/50` |
| success | `bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200` |
| warning | `bg-amber-100 text-amber-800 ring-1 ring-amber-200` |
| danger | `bg-red-100 text-red-800 ring-1 ring-red-200` |
| info | `bg-sky-100 text-sky-800 ring-1 ring-sky-200` |

Light-mode pastel badges — not translucent dark variants.

### 9.7 Metric cards

Class: `.metric-card`

```
rounded-3xl border border-purple-200/30 bg-white p-4 shadow-md shadow-purple-900/5
```

Structure:

1. Optional icon: `mb-2 text-purple-800`
2. Value: `font-display text-2xl tabular-nums text-purple-900`
3. Label: `mt-0.5 text-xs font-semibold uppercase tracking-wide text-purple-600/70`

Grid: `grid grid-cols-3 gap-3`.

### 9.8 Product cards — split design

**Critical pattern:** White image area on top, **lavender-200 footer** on bottom.

Class: `.product-card`

```
overflow-hidden rounded-3xl bg-white shadow-lg shadow-purple-900/8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/12
```

**Image zone (top):**

- With image: `aspect-square w-full bg-white object-cover`
- Placeholder: `flex aspect-square items-center justify-center bg-gradient-to-br from-lavender-100 to-lavender-200 text-3xl`

**Body zone (bottom) — `.product-card-body`:**

```
bg-lavender-200 px-3 pb-3 pt-2
```

Content:

- Name: `line-clamp-2 text-sm font-semibold leading-snug text-purple-900`
- Price: `mt-0.5 text-sm font-bold text-purple-800`
- Add to cart: `.add-to-cart-pill` — visible on hover via `opacity-0 transition group-hover:opacity-100`

**Add to cart pill (`.add-to-cart-pill`):**

```
mt-2 w-full rounded-full bg-brand-500 py-2 text-center text-xs font-bold uppercase tracking-wide text-purple-900 shadow-md transition hover:bg-brand-600 active:scale-[0.98]
```

Storefront grid: `grid grid-cols-2 gap-3`.

**Mini mockup product cards (homepage phone):**

```
overflow-hidden rounded-2xl bg-white shadow-md
  aspect-square bg-gradient-to-br from-lavender-200 to-lavender-300  /* image area */
  bg-lavender-200 p-2  /* footer */
  add-to-cart-pill mt-1.5 py-1.5 text-[10px]  /* smaller variant */
```

### 9.9 Navigation

**Desktop sidebar (`md+`):**

```
aside: hidden md:flex md:w-60 md:flex-col md:border-r md:border-purple-200/30 md:bg-white/50 md:backdrop-blur-xl
```

Logo area: `border-b border-purple-200/30 p-5`

Nav links:

```
flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors
```

| State | Classes |
|-------|---------|
| Active | `bg-purple-800 text-white shadow-md` + icon `text-brand-500` |
| Inactive | `text-purple-700 hover:bg-white/80 hover:text-purple-900` + icon `text-purple-500` |

Icon size: `h-5 w-5`, strokeWidth `1.75`.

**Mobile bottom bar (`<md`):**

```
fixed bottom-0 left-0 right-0 z-50 border-t border-purple-200/40 bg-white/90 backdrop-blur-xl
```

Tab:

```
flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors
```

Active: `text-purple-900` + icon `text-purple-800`; inactive: `text-purple-500`.

**Horizontal nav tabs (utility classes):**

```
nav-tab → relative whitespace-nowrap px-4 py-2.5 text-sm font-medium text-purple-700/70 transition-colors hover:text-purple-900
nav-tab-active → text-purple-900 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-purple-800
```

### 9.10 Empty states

Class: `.empty-state`

```
rounded-3xl border border-dashed border-purple-300/50 bg-white/60 p-8 text-center shadow-sm
```

Icon circle: `mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lavender-200 text-purple-700`

Title: `font-display text-lg uppercase text-purple-900`  
Description: `mx-auto mt-2 max-w-sm text-sm leading-relaxed text-purple-700/70`  
Action slot: `mt-5`

### 9.11 Logo

```
inline-flex items-center gap-2 font-display text-lg uppercase tracking-tight text-purple-900
```

Mark:

```
flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-purple-900 shadow-md
```

Letter **"S"** in purple-900 on lime circle (not white on orange).

### 9.12 Page header (dashboard)

```
flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
```

Title: `font-display text-2xl uppercase tracking-tight text-purple-900 sm:text-3xl`  
Description: `mt-1 text-sm text-purple-700/70`

### 9.13 Progress bar (onboarding)

Track: `h-2 overflow-hidden rounded-full bg-purple-200/50`  
Fill: `h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 ease-out`

Step label row:

- Counter: `text-xs font-semibold uppercase tracking-wide text-purple-600/70`
- Current step name: `text-sm font-semibold text-purple-900`

Step link pills (`sm+`):

```
flex-1 truncate rounded-xl px-1 py-1 text-center text-[10px] font-semibold transition-colors
```

| State | Color |
|-------|-------|
| Completed (`i < idx`) | `text-purple-800` |
| Current (`i === idx`) | `text-purple-900` |
| Upcoming (`i > idx`) | `text-purple-400` |

Minimum progress width: `8%` (so bar never empty at step 1).

### 9.14 List rows (orders)

Container: `divide-y divide-purple-200/30` (or similar light divider)  
Row link: `-mx-2 flex items-center justify-between rounded-lg px-2 py-3.5 transition hover:bg-white/80`

### 9.15 Benefit list items (homepage)

```
flex items-center gap-3 rounded-3xl border border-purple-200/30 bg-white/80 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
```

Check icon: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-purple-900`

### 9.16 Storefront header

Wrapper: `border-b border-purple-200/30 bg-white/60 backdrop-blur-xl`  
Content: `mx-auto max-w-lg px-4 py-10 text-center`

Logo: `mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-purple-200/60 shadow-lg shadow-purple-900/10`

Store name: `mt-3 font-display text-2xl uppercase tracking-tight text-purple-900`  
Description: `mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-purple-700/70`

### 9.17 Links

- Inline accent: `font-medium text-purple-800 hover:underline`
- Back link: `inline-flex items-center gap-1 text-sm font-medium text-purple-800 hover:underline`
- Auth footer link: `font-medium text-purple-800 hover:underline`

### 9.18 Policies banner (storefront)

```
mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900
```

---

## 10. Page Templates

### 10.1 Homepage

```
<div class="min-h-screen grid-bg">
  <header class="header-scrim">
    page-container > Logo + ghost Log in + primary Create my store
  </header>
  <section hero relative overflow-hidden px-4 pb-24 pt-16 sm:pt-28>
    3× floating-orb decorative blurs
    page-container > lg:grid-cols-2
      left:
        tag-pill-accent row (PayNow, No app needed, Built for SG sellers)
        H1 uppercase "Your store link," + span text-purple-800 "ready in minutes"
        body text-purple-700/80
        CTAs: primary lg + outline lg "View demo store →"
      right:
        phone mockup (max-w-[320px], rotate -2deg, hover:rotate-0)
        caption text-purple-600/70
  <section border-y border-purple-200/30 py-24>
    tag-pill "How it works" + H2 uppercase
    3× glass-elevated step cards (purple-300 step numbers)
  <section py-24> benefits 2-col grid with lime check circles
  <section relative py-24> bottom floating-orb + centered CTA
  <footer border-t border-purple-200/30 py-12 text-purple-600/70>
</div>
```

Phone mockup structure:

1. Glow: `absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-white/40 via-transparent to-transparent blur-2xl`
2. Frame: `rounded-[2.5rem] border border-purple-200/40 bg-white p-2 shadow-2xl shadow-purple-900/15`
3. Screen: `rounded-[2rem] bg-lavender-100`
4. URL bar: `bg-purple-800 px-4 py-3 text-center` — label `text-purple-200`, slug `text-white font-bold`
5. Store avatar: `rounded-full bg-white ring-2 ring-purple-200/50 shadow-md`
6. Product mini-cards: split white/lavender-200 with add-to-cart-pill
7. Cart CTA in mockup: `rounded-full bg-brand-500 ... text-purple-900 uppercase`

### 10.2 Auth (login / signup)

```
<div class="auth-shell">
  <div class="relative w-full max-w-md">
    <Logo centered mb-8 />
    <Card padding="lg" title description>
      optional lavender-200 success alert (registered)
      form space-y-4
      footer link text-sm text-purple-700/70 + purple-800 link
    </Card>
  </div>
</div>
```

Registered alert:

```
mb-4 rounded-xl border border-purple-800/30 bg-lavender-200 px-4 py-3 text-sm text-purple-800
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

Typical home content order: title uppercase + Badge → featured store link Card (lavender gradient) → 3 MetricCards → EmptyState or orders Card.

### 10.4 Onboarding shell

```
<div class="min-h-screen grid-bg">
  <header class="header-scrim">
    max-w-lg px-4 py-4 > Logo
  </header>
  <main class="mx-auto max-w-lg px-4 py-8 pb-16">
    <OnboardingProgress />
    <Card>...</Card>
  </main>
</div>
```

### 10.5 Storefront

```
<div class="storefront-bg pb-28">
  <StoreHeader />  <!-- white/60 blur header -->
  <main class="mx-auto max-w-lg px-4 py-6">
    optional policies amber banner
    grid grid-cols-2 gap-3 of product-card split OR EmptyState
  </main>
  <CartButton fixed bottom lime pill />
</div>
```

Product detail: `storefront-bg pb-8` + back link + single `glass-elevated` product card.

### 10.6 404

```
grid-bg flex min-h-screen flex-col items-center justify-center px-4
Logo → font-display text-4xl uppercase "404" → text-purple-700/70 → Button
```

---

## 11. Motion & Interaction

| Interaction | Spec |
|-------------|------|
| Default transition | `transition-colors` or `transition-all duration-200` (buttons) |
| Card hover | `duration-300`; product: `-translate-y-1` + shadow increase |
| Step card hover | `hover:-translate-y-1 hover:shadow-xl` |
| Benefits row hover | `hover:-translate-y-0.5 hover:shadow-md` |
| Phone mockup | `transition-transform duration-500 hover:rotate-0` from `rotate-[-2deg]` |
| Step number | `group-hover:text-purple-500` from `text-purple-300` |
| Add to cart reveal | `opacity-0 transition group-hover:opacity-100` on product cards |
| Button active (cart, add-to-cart) | `active:scale-[0.98]` |
| Progress fill | `duration-500 ease-out` |
| Disabled | `disabled:opacity-50 disabled:pointer-events-none` |
| Focus rings | `focus:ring-2 focus:ring-purple-800/10` on inputs |
| Filter pill | `hover:shadow-md` inactive, `hover:shadow-lg` active |

**Do not:** bounce animations, parallax scroll JS, dark mode toggles, neon glow on text.

**Do:** CSS-only floating orbs with `blur-3xl`; subtle lift on hover.

---

## 12. Do's and Don'ts

### Do

- Use the vertical lavender gradient on all app surfaces (`body` + shell classes)
- Use Archivo Black + **`uppercase`** for all display headings
- Use `brand-500` lime for primary actions with **`text-purple-900`** on buttons
- Use white cards with `shadow-purple-900/*` and `rounded-3xl`
- Use split product cards: white image top + `lavender-200` footer + lime add-to-cart pill
- Use `tag-pill-accent` (lime) for hero feature tags; `tag-pill` (white) for section labels
- Use filter pills: white inactive, `purple-800` active with white text
- Place `.floating-orb` blurs in hero/CTA sections for dreamy atmosphere
- Keep storefront content within `max-w-lg`
- Provide mobile bottom nav for dashboard (`pb-24` clearance)
- Keep Store Link copy: PayNow, PayLah, Singapore social sellers, bio links

### Don't

- Use dark `#080808` backgrounds or white-on-dark glass (that's `orangeTheme.md`)
- Use white text on lime buttons (except WhatsApp green buttons)
- Use the stale `tailwind.config.ts` rose colors — tokens live in `globals.css @theme`
- Use Syne or gradient text clips from the orange theme
- Use sharp `rounded-none` or tiny `rounded-md` on primary cards
- Use heavy black `shadow-black/*` without purple tint
- Rebrand product to BOM BON or change SG seller positioning in UI copy
- Use `text-gray-*` or `text-stone-*` in new UI — use `purple-*` scale
- Omit `antialiased` on body
- Use JS canvas/WebGL for background orbs — CSS only

---

## 13. Copy-Paste Starter Snippets

### 13.1 Full `globals.css` theme block (Tailwind v4)

```css
@import "tailwindcss";
@source "../app";
@source "../components";

@theme {
  --font-sans: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-archivo-black), ui-sans-serif, system-ui, sans-serif;

  --color-brand-50: #f7ffe0;
  --color-brand-100: #efffc2;
  --color-brand-200: #e5ff99;
  --color-brand-500: #dfff00;
  --color-brand-600: #c8ff00;
  --color-brand-700: #b5e600;
  --color-brand-800: #9acc00;

  --color-purple-50: #faf5ff;
  --color-purple-100: #f3e8ff;
  --color-purple-200: #e9d5ff;
  --color-purple-600: #7c3a9a;
  --color-purple-700: #5b2869;
  --color-purple-800: #4a1a6b;
  --color-purple-900: #3d1f5c;

  --color-lavender-100: #f8eeff;
  --color-lavender-200: #edd9f7;
  --color-lavender-300: #e0c4f0;
  --color-lavender-400: #d4b8e8;

  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-muted: #7c6994;
  --color-border: rgba(74, 26, 107, 0.12);
  --color-foreground: #3d1f5c;
}

body {
  @apply font-sans text-purple-900 antialiased;
  background: linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%);
  background-attachment: fixed;
}

@layer components {
  .font-display {
    font-family: var(--font-display);
  }

  .page-container {
    @apply mx-auto max-w-5xl px-4 sm:px-6;
  }

  .lavender-bg {
    background-color: #edd9f7;
    background-image:
      radial-gradient(ellipse 80% 50% at 15% 8%, rgba(255, 255, 255, 0.65) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 85% 15%, rgba(255, 230, 250, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse 45% 35% at 50% 90%, rgba(212, 184, 232, 0.35) 0%, transparent 55%),
      linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%);
  }

  .grid-bg {
    background-color: #edd9f7;
    background-image:
      radial-gradient(ellipse 80% 50% at 15% 8%, rgba(255, 255, 255, 0.65) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 85% 15%, rgba(255, 230, 250, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse 45% 35% at 50% 90%, rgba(212, 184, 232, 0.35) 0%, transparent 55%),
      linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%);
  }

  .glass {
    @apply rounded-3xl border border-purple-200/40 bg-white shadow-md shadow-purple-900/5;
  }

  .glass-elevated {
    @apply rounded-3xl border border-purple-200/30 bg-white shadow-lg shadow-purple-900/8;
  }

  .auth-shell {
    @apply relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12;
    background-color: #edd9f7;
    background-image:
      radial-gradient(ellipse 80% 50% at 15% 8%, rgba(255, 255, 255, 0.65) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 85% 15%, rgba(255, 230, 250, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse 45% 35% at 50% 90%, rgba(212, 184, 232, 0.35) 0%, transparent 55%),
      linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%);
  }

  .auth-shell::before {
    content: "";
    @apply pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full opacity-50;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, transparent 70%);
  }

  .auth-shell::after {
    content: "";
    @apply pointer-events-none absolute -right-16 bottom-24 h-64 w-64 rounded-full opacity-40;
    background: radial-gradient(circle, rgba(212, 184, 232, 0.6) 0%, transparent 70%);
  }

  .storefront-bg {
    @apply min-h-screen;
    background-color: #edd9f7;
    background-image:
      radial-gradient(ellipse 80% 50% at 15% 8%, rgba(255, 255, 255, 0.65) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 85% 15%, rgba(255, 230, 250, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse 45% 35% at 50% 90%, rgba(212, 184, 232, 0.35) 0%, transparent 55%),
      linear-gradient(180deg, #f5e6ff 0%, #e8d4f5 45%, #dbc9f0 100%);
  }

  .product-card {
    @apply overflow-hidden rounded-3xl bg-white shadow-lg shadow-purple-900/8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/12;
  }

  .product-card-body {
    @apply bg-lavender-200 px-3 pb-3 pt-2;
  }

  .metric-card {
    @apply rounded-3xl border border-purple-200/30 bg-white p-4 shadow-md shadow-purple-900/5;
  }

  .empty-state {
    @apply rounded-3xl border border-dashed border-purple-300/50 bg-white/60 p-8 text-center shadow-sm;
  }

  .nav-tab {
    @apply relative whitespace-nowrap px-4 py-2.5 text-sm font-medium text-purple-700/70 transition-colors hover:text-purple-900;
  }

  .nav-tab-active {
    @apply text-purple-900 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-purple-800;
  }

  .tag-pill {
    @apply inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-900 shadow-sm;
  }

  .tag-pill-accent {
    @apply inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-900 shadow-sm;
  }

  .filter-pill {
    @apply inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-purple-900 shadow-sm transition hover:shadow-md;
  }

  .filter-pill-active {
    @apply bg-purple-800 text-white shadow-md hover:shadow-lg;
  }

  .header-scrim {
    @apply sticky top-0 z-50 border-b border-purple-200/30 bg-white/70 backdrop-blur-xl;
  }

  .floating-orb {
    @apply pointer-events-none absolute rounded-full blur-3xl;
  }

  .add-to-cart-pill {
    @apply mt-2 w-full rounded-full bg-brand-500 py-2 text-center text-xs font-bold uppercase tracking-wide text-purple-900 shadow-md transition hover:bg-brand-600 active:scale-[0.98];
  }
}
```

### 13.2 Root layout fonts

```tsx
import type { Metadata } from "next";
import { Archivo_Black, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "Store Link — Simple store links for social sellers",
  description: "Create a simple store link in minutes. Share it in your bio. Built for Singapore social sellers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${archivoBlack.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

### 13.3 Primary CTA button (minimal)

```html
<button class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-7 text-base font-bold text-purple-900 shadow-lg shadow-purple-900/10 transition-all duration-200 hover:bg-brand-600 active:bg-brand-700">
  Create my free store
  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
</button>
```

### 13.4 Product card split (storefront)

```html
<a class="product-card group" href="/s/demo/product/1">
  <img class="aspect-square w-full bg-white object-cover" src="..." alt="Product" />
  <div class="product-card-body">
    <p class="line-clamp-2 text-sm font-semibold leading-snug text-purple-900">Brownies (6pc)</p>
    <p class="mt-0.5 text-sm font-bold text-purple-800">S$12.00</p>
    <div class="add-to-cart-pill opacity-0 transition group-hover:opacity-100">Add to cart</div>
  </div>
</a>
```

### 13.5 Hero floating orbs block

```html
<section class="relative overflow-hidden px-4 pb-24 pt-16 sm:pt-28">
  <div class="floating-orb -left-16 top-24 h-48 w-48 bg-white/50"></div>
  <div class="floating-orb right-8 top-32 h-32 w-32 bg-lavender-300/60"></div>
  <div class="floating-orb bottom-32 left-1/3 h-40 w-40 bg-purple-200/40"></div>
  <div class="page-container relative"><!-- hero content --></div>
</section>
```

### 13.6 Filter pill toggle (React)

```tsx
<button
  className={cn("filter-pill", isActive && "filter-pill-active")}
  type="button"
>
  {label}
</button>
```

### 13.7 Onboarding progress bar

```tsx
<div className="h-2 overflow-hidden rounded-full bg-purple-200/50">
  <div
    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 ease-out"
    style={{ width: `${progress}%` }}
  />
</div>
```

### 13.8 Tailwind config note

This project uses **Tailwind v4** with tokens in CSS. The repo's `tailwind.config.ts` may contain outdated rose colors (`#e11d48`) and is **not** the source of truth. Either delete legacy color extensions or sync them to match `@theme` above.

---

## 14. Implementation Checklist (New Project)

- [ ] Install Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`)
- [ ] Add `globals.css` with full `@theme` lavender + lime scale + component utilities (Section 13.1)
- [ ] Load Outfit + Archivo Black via `next/font/google`; attach CSS variables to `<html>`
- [ ] Set `body` to lavender vertical gradient + `font-sans text-purple-900 antialiased`
- [ ] Implement shared UI primitives: Button, Input, Textarea, Select, Card, Badge, MetricCard, EmptyState, Logo, PageHeader, SlugInput
- [ ] Apply `.grid-bg` to app shells (marketing, dashboard, onboarding, 404)
- [ ] Apply `.storefront-bg` to public store pages
- [ ] Apply `.auth-shell` to login/signup
- [ ] Use `.header-scrim` on sticky marketing/onboarding headers
- [ ] Build dashboard layout: `md:w-60` white sidebar + fixed bottom nav `<md` with `pb-24` main padding
- [ ] Use `max-w-5xl` (marketing), `max-w-3xl` (dashboard), `max-w-lg` (storefront/onboarding)
- [ ] Primary actions: lime `brand-500` pill buttons with **purple-900 text** and arrow on primary variant
- [ ] All form fields: white inputs with purple border/focus ring
- [ ] All cards: `glass-elevated rounded-3xl` white panels
- [ ] Product grids: 2 columns, split `.product-card` + `.product-card-body`, `.add-to-cart-pill`
- [ ] Hero: `tag-pill-accent` for features, `tag-pill` for section labels, `.floating-orb` decorations
- [ ] Filter UI: `.filter-pill` + `.filter-pill-active`
- [ ] Onboarding: lime-to-lime progress gradient, purple step labels
- [ ] Verify ALL CAPS on `font-display` headings
- [ ] Verify no dark `#080808` leakage from orange theme variant
- [ ] Verify no white text on lime buttons (except WhatsApp)
- [ ] Test mobile: bottom nav, cart FAB, sticky header blur

---

## 15. Source File Index

| File | Contains |
|------|----------|
| `app/globals.css` | All design tokens, lavender gradient shells, component utility classes |
| `app/layout.tsx` | Archivo Black + Outfit font loading, Store Link metadata |
| `components/ui.tsx` | Button, Input, Textarea, Select, Card, Badge, MetricCard, EmptyState, Logo, PageHeader, SlugInput |
| `app/page.tsx` | Homepage hero, tag pills, floating orbs, steps, benefits, CTA, phone mockup |
| `app/dashboard/layout.tsx` | Dashboard shell with grid-bg |
| `components/dashboard-nav.tsx` | Sidebar + mobile bottom nav (purple-800 active) |
| `app/login/page.tsx`, `app/signup/page.tsx` | Auth template with auth-shell |
| `app/onboarding/layout.tsx`, `components/onboarding-progress.tsx` | Wizard shell + lime progress bar |
| `app/s/[slug]/page.tsx` | Storefront product grid with split cards |
| `app/s/[slug]/store-header.tsx` | Storefront header, avatar, WhatsApp |
| `app/s/[slug]/cart-button.tsx` | Fixed lime cart FAB |
| `app/s/[slug]/product/[id]/page.tsx` | Product detail |
| `components/order-status-badge.tsx` | Extended badge colors |
| `docs/orangeTheme.md` | Dark orange variant reference (do not merge — parallel theme doc) |

---

*Extracted from Store Link Platform lavender implementation. All hex values and class strings match production code. Product positioning remains Store Link for Singapore social sellers — visual system only.*
