# Whacka Design Token File

> Extracted from production CSS (`tailwindcss v4.1.18`) and three stylesheets.
> All values are exact unless marked **[estimate]**. Focused on the Home/Landing section per user request.

---

## 1. Color Palette

### Landing Page Custom Properties (`.whacka-landing`)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F1EDE5` | Page background |
| `--bg-soft` | `#F6F2EA` | Soft background areas |
| `--bg-alt` | `var(--bg-soft)` | Alternate background |
| `--surface` | `#FFFFFF` | Card / elevated surfaces |
| `--paper` | `var(--surface)` | Paper-like containers |
| `--cream` | `#FAF6EE` | Warm cream tint |
| `--line` | `#E5DFD3` | Primary border color |
| `--line-soft` | `#EDE8DD` | Subtle borders |
| `--stack` | `#EAE7E0` | Stacked card edges |
| `--ink` | `#16130E` | Primary text (near-black) |
| `--ink-soft` | `#57514A` | Secondary text |
| `--ink-mute` | `#736A5A` | Tertiary / muted text |
| `--ink-faint` | `#B9B1A4` | Placeholder / disabled text |
| `--brand` | `#16130E` | Brand accent (dark) |
| `--brand-deep` | `#16130E` | Brand deep |
| `--brand-soft` | `#ECE5DA` | Brand soft background |
| `--brand-ink` | `#16130E` | Brand text on soft bg |
| `--lime` | `#F7C518` | Primary yellow / gold |
| `--lime-deep` | `#EAB408` | Deeper gold |
| `--yellow` | `#F7C518` | Yellow accent |
| `--yellow-deep` | `#EAB408` | Deep yellow |
| `--purple` | `#7C2FE0` | Purple accent |
| `--purple-soft` | `#9C6CEC` | Soft purple |
| `--black` | `#141414` | True black |
| `--hl` | `#FFE27A` | Highlight / marker color |
| `--shadow` | `28, 18, 8` | Shadow RGB base |

### Accent Color System

| Token | Value | Usage |
|---|---|---|
| `--accent-blue` | `#3B6FB0` | Blue accent |
| `--accent-blue-soft` | `#E1EAF4` | Blue soft bg |
| `--accent-blue-ink` | `#2C5488` | Blue text |
| `--accent-mint` | `#2E9C68` | Mint / green accent |
| `--accent-mint-soft` | `#DEF0E6` | Mint soft bg |
| `--accent-mint-ink` | `#1F6A47` | Mint text |
| `--accent-amber` | `#E0A526` | Amber accent |
| `--accent-amber-soft` | `#F7ECCF` | Amber soft bg |
| `--accent-amber-ink` | `#8C6A2C` | Amber text |
| `--accent-violet` | `#7C2FE0` | Violet accent |
| `--accent-violet-soft` | `#F1E9FC` | Violet soft bg |

### Additional Background Colors Used

| Hex | Usage |
|---|---|
| `#F4F0E8` | Alt section bg |
| `#F7F1E8` | Warm bg variant |
| `#FBF8F2` | Lightest warm bg |
| `#ECE5DA` | Card stacking bg |
| `#221E18` | Dark surfaces |
| `#16130E` | Dark buttons / nav items |

### Gradient Definitions

| Name | Value |
|---|---|
| Hero wash (before) | `radial-gradient(50% 60% at 30% 40%, #c95a3c1a, transparent)` |
| Hero wash (after) | `radial-gradient(55% 50% at 70% 55%, #3b6fb01a, transparent)` |
| CTA banner bg | Solid `#F7C518` (yellow) to `#EAB408` transition area |
| Footer bg | `var(--bg-soft)` / `#F6F2EA` |

---

## 2. Typography

### Font Families

| Token | Font | Weights | Usage |
|---|---|---|---|
| `--font-hanken` | Hanken Grotesk | 400–800 | Primary body & headings |
| `--font-geist-sans` | Geist Sans | — | System / app UI |
| `--font-geist-mono` | Geist Mono | — | Monospace / code |
| `--font-pacifico` | Pacifico | 400 | Decorative / script |
| `--font-arabic` | Cairo | 200–1000 | Arabic locale |

**Primary landing font**: `var(--font-hanken), system-ui, -apple-system, sans-serif`

### Font Rendering
```css
-webkit-font-smoothing: antialiased;
text-rendering: optimizeLegibility;
```

### Type Scale

| Class | Size | Line Height | Weight | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `.h-display` | `clamp(28px, 3.6vw, 46px)` | `1.04` | 700 | `-0.02em` | Hero headline |
| `.h-section` | `clamp(26px, 2.8vw, 38px)` | `1.08` | 700 | `-0.02em` | Section headings |
| Body large | `clamp(20px, 2.4vw, 28px)` | `1.4–1.5` | 400 | — | Hero subheadline |
| Body | `16px` | `1.5` | 400 | — | Paragraph text |
| Body small | `15px` | `1.55` | 400 | — | Card body text |
| Caption | `13px–14px` | `1.4` | 500 | — | Labels |
| Chip text | `12px` | — | 500 | — | Pill / chip labels |
| Micro | `11px–11.5px` | — | 500–600 | `0.06em–0.08em` | Uppercase labels |
| Nav links | `14px–15px` | — | 500 | — | Navigation items |
| CTA button | `15px` | — | 600 | `-0.005em` | Primary buttons |

### Heading Styles (Tailwind Classes Observed)

| Level | Classes | Approx Result |
|---|---|---|
| H1 (hero) | `h-display` | 46px / 700 / tight leading |
| H2 (section) | `h-section` | 38px / 700 / 1.08 leading |
| H3 (card title) | `text-[22px] font-bold leading-[1.25]` | 22px / bold |
| H4 (feature) | `text-[17px] font-semibold` | 17px / 600 |

---

## 3. Spacing Scale

Base unit: `--spacing: 0.25rem` (4px)

### Common Spacing Values Used

| Token | Value | Usage |
|---|---|---|
| `gap-1` | 4px | Tight inline gaps |
| `gap-1.5` | 6px | Chip internals |
| `gap-2` | 8px | Small component gaps |
| `gap-3` | 12px | Card content gaps |
| `gap-4` | 16px | Section element spacing |
| `gap-5` | 20px | Medium spacing |
| `gap-6` | 24px | Large spacing |
| `py-12` | 48px | Section vertical padding |
| `py-16` | 64px | Large section padding |
| `py-20` | 80px | Hero vertical padding |
| `py-[clamp(40px,7vh,72px)]` | 40–72px | Responsive section padding |

### Section Spacing (Desktop)

| Section | Top Padding | Bottom Padding |
|---|---|---|
| Hero | `~80px` (pt-20) | `~80px` |
| "Just say what you want" | `64–80px` | `64–80px` |
| "Built in, not bolted on" | `64px` | `64px` |
| "Not just a vibe" | `64px` | `64px` |
| Corkboard | `64px` | `64px` |
| FAQ | `64px` | `64px` |
| CTA banner | `64px` | `64px` |
| Footer | `48px` | `24px` |

### Container Widths

| Element | Max Width |
|---|---|
| Page container | `1080px` (`max-w-[1080px]`) |
| Wide container | `1040px` (`max-w-[1040px]`) |
| Narrow content | `640px` (`max-w-[640px]`) |
| Card grid | `880px` (`max-w-[880px]`) |
| Heading block | `580px` (`max-w-[580px]`) |
| Carousel card | `540px` (`max-w-[540px]`) |

---

## 4. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius` | `1rem` (16px) | Base radius |
| `rounded-full` | `9999px` | Pills, avatars, buttons |
| `rounded-[20px]` | 20px | Large cards |
| `rounded-[18px]` | 18px | Cards |
| `rounded-[15px]` | 15px | Medium cards |
| `rounded-[14px]` | 14px | Inner card content |
| `rounded-[12px]` | 12px | Containers, chips |
| `rounded-[10px]` | 10px | Small cards |
| `rounded-[9px]` | 9px | Inputs |
| `rounded-[7px]` | 7px | Small elements |
| `rounded-[5px]` | 5px | Tags |
| `rounded-2xl` | 24px (radius+8) | Large panels |
| `rounded-3xl` | 28px (radius+12) | Hero input shell |

### Key Component Radii

| Component | Radius |
|---|---|
| Navigation bar | `~999px` (pill shape) |
| Primary CTA button | `999px` (full pill) |
| Secondary CTA button | `999px` (full pill) |
| Chip / badge | `999px` |
| Hero input shell | `20px` |
| Carousel card | `18–20px` |
| Sticky feature cards | `18–20px` |
| FAQ accordion items | `14–16px` |
| Footer | `0` (full-width) |

---

## 5. Shadows

### Named Shadow Tokens

| Name | Value | Usage |
|---|---|---|
| Card shadow | `0 1px 6px rgba(0,0,0,0.03)` | Default card |
| Card hover | `0 14px 32px -16px rgba(27,26,24,0.16)` | Card hover lift |
| Input shell | `0 10px 30px rgba(71,85,105,0.15)` | Hero input glow |
| Elevated card | `0 6px 20px -16px rgba(20,16,6,0.4)` | Sticky cards |
| CTA button | `0 5px 16px -4px rgba(247,197,24,0.75)` | Yellow button glow |
| CTA button alt | `0 2px 7px -1px rgba(247,197,24,0.55)` | Subtle yellow glow |
| Deep drop | `0 18px 40px -12px rgba(0,0,0,0.25)` | Phone mockup |
| Nav shadow | `0 1px 3px rgba(27,26,24,0.08)` | Navigation bar |
| Inset border | `inset 0 0 0 1px #E5DFD3` | Inset card border |

### Shadow Hierarchy (Elevation Layers)

1. **Flat** — no shadow (text-level elements)
2. **Resting** — `0 1px 3px rgba(27,26,24,0.08)` (nav, chips)
3. **Card** — `0 1px 6px rgba(0,0,0,0.03)` (cards)
4. **Raised** — `0 6px 20px -16px rgba(20,16,6,0.4)` (sticky cards)
5. **Floating** — `0 18px 40px -12px rgba(0,0,0,0.25)` (mockups, modals)
6. **Overlay** — `0 20px 60px rgba(0,0,0,0.3)` (full overlays)

---

## 6. Breakpoints

| Name | Min Width | Usage |
|---|---|---|
| Mobile (default) | `0px` | Base styles |
| `sm` | `640px` (40rem) | Small tablets |
| `md` | `768px` (48rem) | Tablets |
| `lg` | `1024px` (64rem) | Desktop |
| `xl` | `1280px` (80rem) | Wide desktop |
| `2xl` | `1536px` (96rem) | Ultra-wide |

### Mobile breakpoint (`max-width: 480px`)
Used for component-level adjustments (padding, font size reductions).

---

## 7. Animation & Motion Tokens

### Easing Curves

| Name | Value | Usage |
|---|---|---|
| Default | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| Ease out | `cubic-bezier(0, 0, 0.2, 1)` | Exit / settle |
| Spring | `cubic-bezier(0.22, 1, 0.36, 1)` | Glow transitions |
| Bounce | `cubic-bezier(0.2, 1.3, 0.4, 1)` | Pop-in effects |
| Smooth | `cubic-bezier(0.65, 0, 0.35, 1)` | Draw animations |

### Duration Scale

| Duration | Usage |
|---|---|
| `150ms` | Default Tailwind transitions |
| `160ms` | Fast micro-interactions |
| `200ms` | Button hovers, chevron rotations |
| `250ms` | Medium transitions |
| `300ms` | Card transitions |
| `450ms` | Fade-in / slide-up reveals |
| `500ms` | Longer content transitions |
| `800ms` | Scroll-triggered reveals |

### Keyframe Animations

| Name | Duration | Easing | Description |
|---|---|---|---|
| `landing-drift-1` | `22s` | ease-in-out | Background orb 1 movement |
| `landing-drift-2` | `26s` | ease-in-out | Background orb 2 movement |
| `landing-drift-3` | `24s` | ease-in-out | Background orb 3 movement |
| `landing-float` | `10s` | ease-in-out | Gentle float (8px Y translate) |
| `landing-float` (slow) | `14s` | ease-in-out | Slower floating variant |
| `landing-float` (fast) | `7s` | ease-in-out | Faster floating variant |
| `landing-shine` | `4.5s` | ease-in-out | Shimmer sweep across card |
| `landing-gradient-move` | `6s` | ease-in-out | Gradient color shift |
| `landing-border-shift` | `8s` | ease-in-out | Animated gradient border |
| `landing-ribbon` | `14s` | ease-in-out | Decorative ribbon drift |
| `landing-pulse` | `3.5s` | ease-in-out | Badge pulse ring |
| `wk-draw` | `1.1s` | cubic-bezier(.65,0,.35,1) | Logo stroke draw |
| `wk-fade` | `0.5–0.6s` | ease | Fade-in |
| `wk-pop` | `0.45s` | cubic-bezier(.2,1.3,.4,1) | Scale pop-in |
| `fadeSlideUp` | `0.4s` | ease-out | Scroll reveal |

### Scroll-Triggered Reveal Pattern
```css
/* Initial state */
opacity: 0;
transform: translateY(12px);

/* Revealed state */
opacity: 1;
transform: translateY(0);
animation: fadeSlideUp 0.4s ease-out both;
```

---

## 8. Z-Index Layers

| Value | Usage |
|---|---|
| `0` | Base content |
| `1` | Slightly elevated elements |
| `10` | Floating elements |
| `20` | Dropdowns |
| `30` | Sticky elements |
| `40` | Navigation |
| `50` | Navigation overlays |
| `60` | Modals |
| `80` | Important overlays |
| `100` | Toast / alerts |
| `998–999` | Critical overlays |
| `1000` | Top-level overlays |
| `9998–99999` | System overlays |
| `2147483600` | Boot splash screen |

---

## 9. Blur & Glass Effects

### Backdrop Blur Scale

| Token | Value | Usage |
|---|---|---|
| `blur-sm` | `8px` | Subtle glass |
| `blur-md` | `12px` | Medium glass |
| `blur-xl` | `24px` | Strong glass |
| `blur-2xl` | `40px` | Heavy glass |

### Glass Variants (Landing Page)

| Variant | Backdrop Blur | Background | Border |
|---|---|---|---|
| Navigation | `blur(8px)` | `rgba(251,247,242,0.95)` | `1px solid var(--line)` |
| Landing surface | — | `linear-gradient(#ffffffeb, #ffffffc2)` | `1px solid #0000000f` |
| Landing card | — | `var(--surface)` / `#FFFFFF` | `1px solid var(--line)` |

---

## 10. Component Inventory

### Buttons

| Variant | Background | Text Color | Border | Radius | Padding | Shadow |
|---|---|---|---|---|---|---|
| Primary CTA | `#F7C518` | `#16130E` | none | `999px` | `13px 22px` | `0 5px 16px -4px rgba(247,197,24,0.75)` |
| Secondary CTA | transparent | `#16130E` | `1.5px solid #16130E` | `999px` | `13px 22px` | none |
| Nav CTA | `#F7C518` | `#16130E` | none | `999px` | `7px 18px` | none |
| Nav sign-in | transparent | `#57514A` | none | — | — | none |

### Chips / Badges

| Variant | Background | Border | Text | Radius | Padding |
|---|---|---|---|---|---|
| Default chip | `var(--paper)` | `1px solid var(--line)` | `var(--ink-soft)` | `999px` | `5px 10px` |
| Brand chip | `var(--brand-soft)` | `1px solid rgba(201,90,60,0.18)` | `var(--brand-ink)` | `999px` | `5px 10px` |
| Green dot | `var(--brand)` | — | — | `50%` | — |

### Cards

| Type | Background | Border | Radius | Shadow | Hover |
|---|---|---|---|---|---|
| Feature card | `#FFFFFF` | `1px solid var(--line)` | `18–20px` | `0 1px 6px rgba(0,0,0,0.03)` | `translateY(-4px)` + deeper shadow |
| Sticky card | `#FFFFFF` | `1px solid var(--line)` | `20px` | `0 6px 20px -16px rgba(20,16,6,0.4)` | — |
| Carousel card | `#FFFFFF` | `1px solid var(--line)` | `18px` | subtle | — |
| Showcase (pinned) | — | — | `12px` | `0 18px 40px -12px rgba(0,0,0,0.25)` | — |

### Navigation

| Property | Value |
|---|---|
| Height | `~56px` **[estimate]** |
| Background | `rgba(251,247,242,0.95)` with `backdrop-filter: blur(8px)` |
| Border | `1px solid var(--line)` |
| Radius | `999px` (pill shape) |
| Position | `sticky top-0` |
| Width | `max-w-[1080px]` centered |
| Shadow | `0 1px 3px rgba(27,26,24,0.08)` |

### FAQ Accordion

| Property | Value |
|---|---|
| Background | `var(--surface)` |
| Border | `1px solid var(--line)` |
| Radius | `14–16px` |
| Padding | `18px` |
| Chevron rotation | `180deg` on open |
| Transition | `200ms ease` |

---

## 11. Icon Specifications

| Context | Size | Stroke | Color |
|---|---|---|---|
| Nav dropdown | `16px` | `2px` | `var(--ink-mute)` |
| Feature icons | `20–24px` | `1.5–2px` | Accent color |
| Card icons | `18px` | `2px` | `var(--ink-soft)` |
| Input icons (attach/mic) | `20px` | — | `var(--ink-faint)` |
| Arrow in CTA | `18px` | `2px` | `var(--ink)` |
| Social (footer) | `18px` | — | `var(--ink-soft)` |

---

## 12. Image & Asset Tokens

### Showcase Images (Corkboard)

| File | Content |
|---|---|
| `02-kids-bedtime-story.webp` | Kids app screenshot |
| `05-personal-finance.webp` | Finance app screenshot |
| `11-yoga-classes.webp` | Yoga booking screenshot |
| `14-restaurant-menu.webp` | Restaurant menu screenshot |
| `20-pet-care.webp` | Pet care app screenshot |
| `21-grocery-list.webp` | Grocery list screenshot |

All images are `.webp` format, served from `/landing/showcase/`.

### Image Treatment

| Property | Value |
|---|---|
| Format | WebP |
| Border radius | `12px` |
| Shadow | `0 18px 40px -12px rgba(0,0,0,0.25)` |
| Rotation | Random slight tilt (`-3deg` to `4deg`) **[estimate]** |
| Pin graphic | Colored circle pin at top-center |

---

## 13. Landing Page Class Reference

### Utility Classes (`.whacka-landing` scope)

```
.h-display     — Hero display heading
.h-section     — Section heading
.chip          — Pill badge component
.chip.brand    — Brand-colored pill
.dot           — 6px brand-colored dot
.pacifico      — Decorative script font
.mono          — Monospace font
.hero-wash     — Background gradient overlay
.landing-card  — Hoverable card with lift effect
.landing-surface — Frosted elevated panel
.landing-shimmer — Card with sweeping shine animation
.landing-float — Gentle up/down float
.landing-float-slow — Slower float variant
.landing-float-fast — Faster float variant
.landing-orb   — Background blur orb (80px blur)
.landing-orb-1/2/3 — Individual positioned orbs
.landing-grid  — Dot grid background pattern
.landing-highlight-line — Animated gradient line
.landing-gradient-border — Animated gradient border wrapper
.landing-input-shell — Conic gradient border for input
.landing-input-inner — Inner input container
.landing-ribbon — Decorative blur ribbon
.landing-badge-pulse — Pulsing ring around badge
.landing-metric — Hoverable metric card
.landing-metric-surface — Frosted metric container
```

---

## 14. Responsive Token Overrides

### Mobile (< 640px)

| Token | Desktop | Mobile |
|---|---|---|
| Hero heading | `~46px` | `~28px` |
| Section heading | `~38px` | `~26px` |
| Section padding | `64–80px` | `40–48px` |
| Container padding | `0` (centered) | `16–20px` side padding |
| Card grid | 2–3 columns | 1 column |
| Nav layout | Horizontal pill | Logo + CTA + hamburger |
| Carousel | Dot navigation | Swipe + dots |

---

## 15. Print / Export Reference

### CSS Custom Properties (Complete Copy-Paste Block)

```css
:root {
  /* Landing page tokens */
  --bg: #F1EDE5;
  --bg-soft: #F6F2EA;
  --bg-alt: var(--bg-soft);
  --surface: #FFFFFF;
  --paper: var(--surface);
  --cream: #FAF6EE;
  --line: #E5DFD3;
  --line-soft: #EDE8DD;
  --stack: #EAE7E0;
  --ink: #16130E;
  --ink-soft: #57514A;
  --ink-mute: #736A5A;
  --ink-faint: #B9B1A4;
  --brand: #16130E;
  --brand-deep: #16130E;
  --brand-soft: #ECE5DA;
  --brand-ink: #16130E;
  --lime: #F7C518;
  --lime-deep: #EAB408;
  --yellow: #F7C518;
  --yellow-deep: #EAB408;
  --purple: #7C2FE0;
  --purple-soft: #9C6CEC;
  --black: #141414;
  --hl: #FFE27A;
  --shadow: 28, 18, 8;
  --accent-blue: #3B6FB0;
  --accent-blue-soft: #E1EAF4;
  --accent-blue-ink: #2C5488;
  --accent-mint: #2E9C68;
  --accent-mint-soft: #DEF0E6;
  --accent-mint-ink: #1F6A47;
  --accent-amber: #E0A526;
  --accent-amber-soft: #F7ECCF;
  --accent-amber-ink: #8C6A2C;
  --accent-violet: #7C2FE0;
  --accent-violet-soft: #F1E9FC;

  /* System tokens */
  --radius: 1rem;
  --spacing: 0.25rem;
}
```
