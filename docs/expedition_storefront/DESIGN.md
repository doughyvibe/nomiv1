---
name: Expedition
colors:
  surface: '#0c141c'
  surface-dim: '#0c141c'
  surface-bright: '#323a43'
  surface-container-lowest: '#070f17'
  surface-container-low: '#141c24'
  surface-container: '#182029'
  surface-container-high: '#232b33'
  surface-container-highest: '#2e363e'
  on-surface: '#dbe3ef'
  on-surface-variant: '#c4c6cc'
  inverse-surface: '#dbe3ef'
  inverse-on-surface: '#29313a'
  outline: '#8e9196'
  outline-variant: '#44474c'
  surface-tint: '#b9c8da'
  primary: '#b9c8da'
  on-primary: '#243240'
  primary-container: '#1e2c3a'
  on-primary-container: '#8593a5'
  inverse-primary: '#52606f'
  secondary: '#bbc8d6'
  on-secondary: '#25323c'
  secondary-container: '#3e4a56'
  on-secondary-container: '#adbac7'
  tertiary: '#ddc2a1'
  on-tertiary: '#3e2d16'
  tertiary-container: '#382811'
  on-tertiary-container: '#a68e70'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d5e4f7'
  primary-fixed-dim: '#b9c8da'
  on-primary-fixed: '#0e1d2a'
  on-primary-fixed-variant: '#3a4857'
  secondary-fixed: '#d7e4f2'
  secondary-fixed-dim: '#bbc8d6'
  on-secondary-fixed: '#101d27'
  on-secondary-fixed-variant: '#3c4853'
  tertiary-fixed: '#fbdebb'
  tertiary-fixed-dim: '#ddc2a1'
  on-tertiary-fixed: '#271904'
  on-tertiary-fixed-variant: '#56442a'
  background: '#0c141c'
  on-background: '#dbe3ef'
  surface-variant: '#2e363e'
typography:
  headline-xl:
    fontFamily: Chivo
    fontSize: 80px
    fontWeight: '900'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Chivo
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

This design system is built for the modern explorer—rugged, precise, and uncompromisingly functional. The brand personality is rooted in high-stakes utility and industrial durability, favoring performance over decoration. The emotional response is one of preparedness and technical reliability.

The design style is a hybrid of **High-Contrast Bold** and **Modern Industrial**. It utilizes a "No-Nonsense" philosophy where every element serves a structural or informational purpose. Visual interest is generated through massive typographic scales, heavy-weighted borders, and physical depth cues inspired by military-grade equipment and technical instrumentation.

## Colors

The palette is strictly high-contrast and utilitarian. **Deep Navy** serves as the primary canvas, providing a more sophisticated and atmospheric depth than pure black. **Cool Flint Grey** acts as the secondary tone for structural elements, borders, and disabled states.

**Safety Yellow** is reserved exclusively for high-priority actions, critical status indicators, and directional cues. It should be used sparingly to maintain its "warning" and "active" significance. Backgrounds should utilize the **Neutral** (Darker Navy) for deep layering. All text should be rendered in either pure white or the high-contrast Flint Grey to ensure AAA accessibility against the dark backgrounds.

## Typography

The typographic system emphasizes hierarchy through weight and density. Headlines use **Chivo** with "Black" weights and tight tracking to mimic industrial signage and bold editorial spreads. 

**Hanken Grotesk** provides a clean, contemporary grotesque for body copy, ensuring legibility during extended reading. **JetBrains Mono** is utilized for all labels, data points, and metadata, reinforcing the technical and "instrument-panel" feel of the interface. Large headlines should always use negative letter spacing to create a compact, heavy visual block.

## Layout & Spacing

This design system uses a strict **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. The layout philosophy centers on "Breathing Utility"—large margins and generous gutters that allow high-contrast elements to sit comfortably without clutter.

Spacing is based on a 4px baseline grid. Use 24px gutters to maintain clear separation between technical modules. Layouts should favor asymmetrical compositions to create a sense of movement and "expeditionary" energy. Critical data should be grouped in modular "dashboard" blocks with consistent 32px or 48px internal padding.

## Elevation & Depth

Depth is conveyed through **Physicality and Hard Directional Shadows**. Avoid all soft, blurred ambient occlusion. Instead, use "Hard-Drop" shadows (100% opacity, 0px blur) offset by 4px or 8px to the bottom-right to simulate objects being bolted onto the surface.

Layering is achieved through color-stepping:
1.  **Level 0 (Base):** Neutral (#0F171F).
2.  **Level 1 (Plates):** Primary Navy (#1E2C3A) with a 1px Flint Grey border.
3.  **Level 2 (Active Elements):** Elevated by hard shadows and potentially a thin 1px Safety Yellow top-border for "active" modules.

Background images should feature a 40-60% navy overlay to ensure text legibility while maintaining the "Golden Hour" or "Overcast" drama.

## Shapes

The shape language is strictly **Sharp (0px)**. There are no rounded corners in this design system. Every button, card, input field, and image container must have 90-degree angles to maintain the industrial, precision-machined aesthetic. 

Decorative elements should use 45-degree chamfered corners (clipped corners) for a "technical equipment" look, especially on tabs or status badges.

## Components

**Buttons:** Solid blocks. Primary buttons use a Safety Yellow background with black (or Deep Navy) text. Secondary buttons use a transparent background with a 2px Flint Grey border. Hover states should shift the hard-shadow offset or invert the colors instantly (no soft transitions).

**Inputs:** Large, 1px Flint Grey bordered boxes with JetBrains Mono placeholder text. Focus states use a Safety Yellow bottom border (2px).

**Cards:** "Instrument Modules." Sharp corners, hard shadows, and a 1px border. Headers should be separated by a 1px horizontal rule.

**Chips/Tags:** Monospaced text inside a boxed container. Status tags for "Danger" or "Active" should utilize Safety Yellow.

**Data Display:** Use heavy vertical rules to separate data columns, mimicking technical spreadsheets or logbooks. Imagery should be treated with high-grain textures and high-contrast levels.