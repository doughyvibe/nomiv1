---
name: Epicurean Noir
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#dfc0b4'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#a78b80'
  outline-variant: '#584239'
  surface-tint: '#ffb598'
  primary: '#ffb598'
  on-primary: '#591d00'
  primary-container: '#ff7a3d'
  on-primary-container: '#652200'
  inverse-primary: '#a53c00'
  secondary: '#9af131'
  on-secondary: '#1d3700'
  secondary-container: '#80d402'
  on-secondary-container: '#315600'
  tertiary: '#51d7f4'
  on-tertiary: '#003640'
  tertiary-container: '#00b0cc'
  on-tertiary-container: '#003d49'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb598'
  on-primary-fixed: '#360f00'
  on-primary-fixed-variant: '#7e2c00'
  secondary-fixed: '#a2fa3b'
  secondary-fixed-dim: '#88dc16'
  on-secondary-fixed: '#0f2000'
  on-secondary-fixed-variant: '#2d5000'
  tertiary-fixed: '#aaedff'
  tertiary-fixed-dim: '#51d7f4'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered to evoke an atmosphere of exclusive, high-end gastronomy. It targets a discerning audience that values quality, health, and convenience without compromising on aesthetic pleasure. 

The visual style is **Minimalist with a Cinematic Dark Mode** foundation. It prioritizes high-contrast focal points—where the food photography is the hero—set against deep, obsidian backgrounds. The aesthetic uses subtle "glow" effects and vibrant accenting to create a sense of freshness and energy within a sophisticated, moody environment. The interface should feel like a digital concierge for a Michelin-star kitchen.

## Colors

This color palette is built on a "Midnight Canvas" philosophy. 

- **Primary (Vibrant Orange):** Inspired by heat and fresh ingredients, used exclusively for primary calls to action and critical highlights.
- **Secondary (Lime Zest):** A sharp, organic green used sparingly for health indicators, badges, or "freshness" markers.
- **Backgrounds:** We use a true black (#0A0A0A) for the deepest layers to ensure infinite depth on OLED screens. Secondary surfaces use a slightly lifted charcoal (#161616) to create subtle separation.
- **Typography:** Pure white is reserved for high-level headings, while a muted "Zinc" grey is used for secondary body text to reduce eye strain in high-contrast environments.

## Typography

The typography system balances the friendly modernism of **Plus Jakarta Sans** for headlines with the functional precision of **Inter** for UI and body copy. 

Headlines utilize tight letter-spacing and heavy weights to create a "bold statement" feel. Body text is set with generous line-height to maintain legibility against the dark background. We use uppercase labels with slight tracking (letter-spacing) for metadata and categories to give them a premium, architectural feel.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is centered within a 1280px container on desktop, while margins expand dynamically. We utilize a 12-column grid for desktop and a 4-column grid for mobile.

Spacing is generous to communicate "luxury." We avoid clutter by using large vertical "stacks" (48px+) between major content sections. Elements within a group (like a card's title and description) use a tight 8px rhythm. The "Gourmet" feel is achieved through intentional whitespace that lets the product imagery breathe.

## Elevation & Depth

In this design system, depth is communicated through **Tonal Layering and Glows** rather than traditional drop shadows.

1.  **Level 0 (Base):** True black (#0A0A0A).
2.  **Level 1 (Cards/Surfaces):** Dark Charcoal (#161616) with a very thin, 1px low-opacity border (White at 5% opacity).
3.  **Level 2 (Interactive):** Elements that are hovered or active gain a subtle outer glow using the primary orange color (opacity at 10-15%) to simulate a "backlit" effect.
4.  **Overlays:** Modals and menus use a high-blur backdrop filter (glassmorphism) to maintain context of the underlying food imagery while providing a focused interaction surface.

## Shapes

The shape language is defined by **Pill-shaped (Fully Rounded)** interactive elements and **Soft-rounded** containers. 

Buttons and tags always use the pill shape to create a friendly, organic contrast against the structured grid. Image containers and cards use a more structured `rounded-lg` (16px) corner radius. This duality creates a UI that feels both professional and approachable.

## Components

- **Buttons:** Primary buttons are pill-shaped, using a gradient from the primary orange to a slightly darker shade. They feature a white icon (chevron or arrow) nested in a circular sub-element for a "directional" feel.
- **Cards:** Product cards use the Level 1 surface color. They should have no visible shadow; instead, they use a 1px border. The image should occupy the top 60% of the card, bleed to the edges, and have a subtle bottom-fade to black.
- **Chips/Badges:** Small, pill-shaped markers for "Organic," "Vegan," or "High Protein." These use a ghost-style (outline only) or the secondary lime color with low-opacity backgrounds.
- **Inputs:** Form fields are dark with a 1px border. Upon focus, the border transitions to the primary orange with a soft outer glow.
- **Progressive Disclosure:** Use elegant, thin-line icons for accordions and menus. Interaction states (hover) should always involve a color shift to the primary accent.