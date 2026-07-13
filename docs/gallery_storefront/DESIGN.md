---
name: Gallery Nine
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.03em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 128px
---

## Brand & Style

The design system embodies the "White Cube" aesthetic—an architectural philosophy that prioritizes the art object by stripping away all visual noise. It targets high-net-worth collectors and art enthusiasts who value curation, provenance, and silent luxury.

The style is **Extreme Minimalism**. It utilizes expansive negative space to create a "sun-drenched" atmosphere where every element has room to breathe. The interface acts as a pristine vessel, ensuring that the vibrancy of the artwork remains the sole protagonist. The emotional response is one of reverence, calm, and sophisticated authority.

## Colors

The palette is strictly monochromatic and environmental. 

- **Stark White (#FFFFFF):** The primary canvas. Used for all major backgrounds to simulate gallery walls.
- **Gallery Grays (#F5F5F5, #E0E0E0):** Used for subtle structural differentiation, such as masonry grids, hover states, or secondary UI containers.
- **Deep Charcoal (#121212):** Used exclusively for typography, iconography, and high-contrast call-to-action elements.

Color should never be used for "flavor." Use color only for information (e.g., a red dot for "Sold") or for the artwork itself.

## Typography

Typography follows a curated, editorial hierarchy. 

**Headlines:** Utilize **Playfair Display** in a regular weight. It provides the "museum-grade" authority and elegance required for titling works and exhibitions.

**Body & UI:** Utilize **Hanken Grotesk**. This choice offers a sharp, contemporary counterpoint to the serif headings. Increased letter spacing (kerning) is mandatory for body text and labels to enhance the sense of "air" and luxury. All labels and secondary meta-data should be set in uppercase with significant tracking to mimic architectural signage.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain the integrity of a curated composition, transitioning to a fluid model on mobile.

- **Desktop:** 12-column grid with generous 32px gutters and 64px outer margins.
- **Vertical Rhythm:** Use massive section gaps (128px+) to separate different exhibits or collections.
- **Asymmetry:** Encourage "white space" by intentionally leaving columns empty in the grid to simulate the varied hanging heights of a physical gallery.
- **Safe Zones:** Artwork should never feel crowded; a minimum padding of 48px should surround any image-focused card.

## Elevation & Depth

This design system rejects shadows in favor of **Tonal Layers and Low-Contrast Outlines**. 

Depth is achieved through the physical overlap of elements (z-index) rather than lighting effects. 
- **Level 0 (Floor):** White (#FFFFFF) background.
- **Level 1 (Pedestal):** Soft Gray (#F5F5F5) backgrounds for image containers or scrollable areas.
- **Outlines:** Use 1px solid lines in #E0E0E0 for structural separation. 

The "Sun-drenched" effect is created by high brightness levels and the absence of heavy drop shadows, relying on the contrast between the white background and charcoal text for clarity.

## Shapes

The shape language is **Strictly Geometric and Sharp**. 

All buttons, cards, and input fields must have a **0px border radius**. Roundness contradicts the architectural, "white cube" aesthetic. Precision is communicated through right angles and straight lines, echoing the frames of the artwork.

## Components

### Buttons
- **Primary:** Solid #121212 background with #FFFFFF text. No border.
- **Secondary/Ghost:** 1px solid #121212 border, transparent background. 
- **Padding:** Extremely generous horizontal padding (e.g., 40px) relative to height to create a slim, wide profile.

### Image-Focused Cards
- No borders or shadows.
- The image fills the container. 
- Typography (Artist, Title, Year) is placed below the image using the `label-caps` and `body-md` styles. 
- Aspect ratios should be preserved; do not crop artwork.

### Category Navigation
- Horizontal, scrollable list of text links.
- No background chips; use simple text with a 1px underline for the active state.

### Persistent Checkout Bar
- High-contrast: #121212 background with #FFFFFF text.
- Full width, fixed to the bottom of the viewport.
- Contains only essential information: Item count and a "Proceed to Acquisition" button.

### Input Fields
- 1px bottom border only (#E0E0E0). 
- No background color. 
- Labels float above in `label-caps` style.