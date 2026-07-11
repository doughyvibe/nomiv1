---
name: Harvest & Co. Design System
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#54433e'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#86736d'
  outline-variant: '#d9c1bb'
  surface-tint: '#904b36'
  primary: '#884530'
  on-primary: '#ffffff'
  primary-container: '#a65d46'
  on-primary-container: '#fff4f1'
  inverse-primary: '#ffb59e'
  secondary: '#73594b'
  on-secondary: '#ffffff'
  secondary-container: '#ffdbc9'
  on-secondary-container: '#795f51'
  tertiary: '#60574e'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a6f66'
  on-tertiary-container: '#fff4ed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#733521'
  secondary-fixed: '#ffdbc9'
  secondary-fixed-dim: '#e1c0ae'
  on-secondary-fixed: '#29170d'
  on-secondary-fixed-variant: '#594235'
  tertiary-fixed: '#eee0d5'
  tertiary-fixed-dim: '#d2c4b9'
  on-tertiary-fixed: '#211a14'
  on-tertiary-fixed-variant: '#4e453d'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

This design system embodies "Quiet Luxury" for the modern agrarian. It balances the raw, tactile nature of homemade goods with a sophisticated, editorial lens. The brand personality is grounded, artisanal, and serene, targeting a discerning audience that values slow living, provenance, and high-craft aesthetics.

The visual style is **Editorial Minimalism**. It utilizes generous whitespace to create a "gallery-like" experience, ensuring that high-quality product photography remains the focal point. The interface should feel sun-drenched and airy, avoiding heavy digital artifacts in favor of organic textures and soft, natural transitions.

## Colors

The palette is derived from natural, earthy elements—baked clay, sun-bleached linen, and rich soil. 

- **Primary (Terra Cotta):** Used for key brand moments, primary calls to action, and subtle accents.
- **Secondary (Warm Peach):** The core background color, providing a "sun-drenched" warmth that is softer and more premium than pure white.
- **Tertiary (Linen):** A functional mid-tone for subtle background shifts or container fills.
- **Neutral (Charcoal):** A deep, warm-toned grey used exclusively for typography and fine iconography to maintain high legibility without the harshness of pure black.

## Typography

The typographic hierarchy relies on the tension between a sophisticated, traditional serif and a modern, understated sans-serif.

**Libre Caslon Text** is utilized for headlines to evoke a sense of heritage and editorial authority. It should be typeset with ample leading (line height) to maintain an airy feel.

**DM Sans** provides a clean, neutral counterpoint for body copy and UI labels. Its low-contrast, geometric forms ensure legibility across all digital devices. Use the `label-caps` style for small headers, tags, and category labels to add a rhythmic, structured feel to the page.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for desktop to preserve the "gallery" composition, transitioning to a fluid model for mobile.

- **Desktop (1200px+):** A 12-column grid with wide 64px outer margins and generous 24px gutters.
- **Mobile (<768px):** A 4-column fluid grid with 20px margins.
- **Rhythm:** Vertical rhythm is governed by a 8px baseline. Large "section-gaps" (120px+) are encouraged between major content blocks to emphasize the minimalist, premium nature of the brand.

Whitespace is not "empty space"; it is a structural element used to group related items and allow high-quality imagery to breathe.

## Elevation & Depth

To maintain the tactile, organic feel, depth is created through **Ambient Shadows** and **Tonal Layers** rather than sharp shadows or heavy gradients.

- **Soft Elevation:** Use extremely diffused shadows with a tint of the Primary color (Terra Cotta) at very low opacity (e.g., 5-8%). This makes elements like cards feel like they are resting lightly on a paper surface.
- **Subtle Borders:** 1px solid borders in a slightly darker shade of the background color are used to define boundaries without adding visual weight.
- **Image Treatment:** Photography should utilize soft, natural lighting. UI containers should avoid being pure white; instead, use the secondary or tertiary linen tones to create a sense of physical material.

## Shapes

The shape language is "Soft," utilizing subtle radii that feel hand-finished rather than machine-cut.

- **Cards & Inputs:** Use the standard `rounded` (0.25rem) or `rounded-lg` (0.5rem) to soften edges without making the UI feel "bubbly" or juvenile.
- **Buttons:** Rectangular with a slight 4px radius, emphasizing a sturdy, architectural feel.
- **Imagery:** Product photography may occasionally use a "soft arch" or a standard sharp corner to mimic a high-end lookbook or physical gallery frame.

## Components

### Buttons
Primary buttons use a solid Terra Cotta background with Charcoal or White text. Secondary buttons are "Ghost" style with a 1px Terra Cotta border. Hover states should be subtle, involving a slight shift in background saturation or a very soft lift via ambient shadow.

### Input Fields
Inputs should be minimalist: a single bottom border or a very light linen-colored fill with a 4px radius. Focus states use a slightly thicker Primary color bottom border.

### Cards
Cards are the primary vehicle for products and stories. They should have no visible border, instead relying on the Tertiary background color and a very soft ambient shadow for definition. Typography inside cards should be center-aligned for an editorial feel.

### Chips & Tags
Use the `label-caps` typography style. Tags should have a light linen fill and no border, keeping the UI clean and unobtrusive.

### Navigation
The navigation should be sparse. Use the Serif font for the brand mark and the Sans-serif for links. Ensure significant horizontal spacing between menu items to reflect the brand's "quiet" nature.