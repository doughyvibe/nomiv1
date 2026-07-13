---
name: Studio Void Design System
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#434656'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004af1'
  primary: '#003dcb'
  on-primary: '#ffffff'
  primary-container: '#0f52ff'
  on-primary-container: '#e1e4ff'
  inverse-primary: '#b8c4ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#952500'
  on-tertiary: '#ffffff'
  tertiary-container: '#bf3200'
  on-tertiary-container: '#ffded6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#0037b9'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a0'
  on-tertiary-fixed: '#3b0900'
  on-tertiary-fixed-variant: '#872100'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 120px
    fontWeight: '800'
    lineHeight: 110px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 160px
---

## Brand & Style

The visual identity of the design system is rooted in **Modern Minimalism** with a strong **Editorial** influence. It is designed to feel like a digital gallery where the products are the primary exhibits. The aesthetic prioritizes negative space and high-contrast intentionality to evoke a sense of premium exclusivity.

Key visual pillars:
- **Asymmetry:** Layouts avoid predictable centering, opting for dynamic, tension-filled compositions.
- **Museum-Quality:** Use of "Electric Cobalt" is sparse but aggressive, used only to command attention or signal interaction.
- **Bold Grounding:** Heavy use of crisp white and deep charcoal creates a sophisticated, timeless foundation.
- **Sharp Precision:** A rejection of soft aesthetics in favor of geometric clarity and sharp edges.

## Colors

The palette is stark and intentional, designed to highlight product photography without distraction.

- **Electric Cobalt (#0F52FF):** The system’s signature accent. Used for primary CTAs, active states, and critical brand moments. It should never exceed 10% of the screen real estate.
- **Deep Charcoal (#121212):** Used for all primary typography, borders, and structural icons to provide a heavy, grounded feel.
- **Crisp White (#FFFFFF):** The canvas. Used to create expansive whitespace and separate content blocks.
- **Soft Slate (#757575):** A functional neutral used strictly for secondary metadata or disabled states to maintain hierarchy without clutter.

## Typography

Typography functions as a structural element rather than just information. 

- **Display & Headlines:** Use **Hanken Grotesk** for its sharp, neo-grotesque personality. Tight letter spacing and heavy weights are preferred for a "brutalist-lite" editorial feel.
- **Body Text:** **Inter** provides high legibility at smaller scales, ensuring the commerce experience remains functional.
- **Functional Labels:** **Geist** is used for technical data (SKUs, price, categories) to provide a clean, monospaced-adjacent aesthetic that feels precise.
- **Scale:** Dramatic contrast between massive display type and small, functional body text is encouraged to create visual rhythm.

## Layout & Spacing

This design system utilizes a **Fluid-Fixed Hybrid Grid**. While the underlying structure is a 12-column grid, content is often intentionally "broken" or offset to create an asymmetrical, editorial feel.

- **Safe Margins:** Generous outer margins (80px on desktop) ensure the content feels like it's floating in a void.
- **Vertical Rhythm:** Extreme vertical spacing (160px+) between sections is used to give products "room to breathe."
- **Asymmetry:** Encourage "power-aligned" layouts where text may be pinned to the left margin while the primary image spans the center to the right edge.
- **Mobile Reflow:** On mobile, asymmetry is simplified to a single-column stack, but large margins are maintained to preserve the premium feel.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **High-Contrast Outlines** rather than traditional shadows.

- **Flat Hierarchy:** Avoid drop shadows entirely. Hierarchy is established through scale, color blocks (Cobalt vs. White), and 1px Deep Charcoal borders.
- **Image Treatment:** Products should be high-resolution, often with "knock-out" backgrounds (transparent PNGs) to allow them to sit directly on the white canvas or overlap color blocks.
- **The "Hover" State:** Interactions should feel snappy and digital. Use solid color fills or inverted colors rather than lifting elements with shadows.

## Shapes

The shape language is strictly **Sharp (0px)**. 

- All buttons, input fields, and image containers must have square corners. 
- Circular elements are permitted only for specific functional icons (e.g., cart counters, radio buttons) to create a singular point of contrast against the otherwise rectangular world.
- Use 1px or 2px solid lines for borders to maintain a structural, blueprint-like quality.

## Components

### Buttons
- **Primary:** Solid Electric Cobalt with white text. Sharp corners. No gradient.
- **Secondary:** Transparent background with a 1px Deep Charcoal border. 
- **Interaction:** On hover, primary buttons should invert or shift to a slightly darker shade of cobalt (#0039CB).

### Input Fields
- Underline-only or 1px border frames. 
- Labels use `label-caps` typography positioned above the field.
- Active state is signaled by an Electric Cobalt border.

### Product Cards
- No borders or background colors. 
- The image is the hero, followed by `label-caps` for the category and `headline-md` for the product name.
- Price should be clearly stated in `label-caps`.

### Navigation
- Vertical navigation options are encouraged for sidebars to mimic editorial magazine layouts.
- Use `label-caps` for all navigation items to maintain a sophisticated, understated tone.

### Lists & Tables
- Minimalist rows separated by 1px light grey (#E0E0E0) or charcoal lines.
- Heavy use of whitespace between row items.