---
name: Botanica Organic Minimalism
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#434843'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#737872'
  outline-variant: '#c3c8c1'
  surface-tint: '#506354'
  primary: '#334537'
  on-primary: '#ffffff'
  primary-container: '#4a5d4e'
  on-primary-container: '#c0d5c2'
  inverse-primary: '#b7ccb9'
  secondary: '#675d50'
  on-secondary: '#ffffff'
  secondary-container: '#efe0cf'
  on-secondary-container: '#6e6355'
  tertiary: '#6f2d12'
  on-tertiary: '#ffffff'
  tertiary-container: '#8d4327'
  on-tertiary-container: '#ffc1ac'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e8d5'
  primary-fixed-dim: '#b7ccb9'
  on-primary-fixed: '#0e1f13'
  on-primary-fixed-variant: '#394b3d'
  secondary-fixed: '#efe0cf'
  secondary-fixed-dim: '#d3c4b4'
  on-secondary-fixed: '#221a10'
  on-secondary-fixed-variant: '#4f4539'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#763217'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system embodies "Quiet Luxury"—a philosophy where quality speaks through restraint rather than excess. Drawing inspiration from Japanese *Wabi-sabi* and Scandinavian *Hygge*, the visual language prioritizes organic minimalism, tactile warmth, and an editorial sensibility.

The brand personality is calm, refined, and deeply intentional. It targets an audience that values slow living, craftsmanship, and the restorative power of nature. The UI should evoke an emotional response of serenity and sophisticated comfort, functioning as a high-end digital gallery for botanical art.

**Design Movement: Organic Minimalism**
The style utilizes heavy whitespace, a palette derived from natural pigments, and a "minimal chrome" approach where the interface recedes to allow high-fidelity photography to lead the experience. Elements are soft, layered, and use subtle physical metaphors to suggest depth without clutter.

## Colors

The palette is a curated collection of earth-toned neutrals and botanical greens, designed to feel grounded and timeless.

- **Primary (Muted Sage/Olive):** Used for key brand moments, active states, and primary actions. It represents the life of the plants.
- **Secondary (Linen/Stone):** Used for structural elements, borders, and subtle backgrounds to provide warmth.
- **Tertiary (Clay/Walnut):** An accent color used sparingly for natural warmth and emphasis.
- **Neutral (Warm Ivory/Travertine):** The foundation of the UI, providing a soft, non-clinical background that reduces eye strain and mimics high-end paper or stone surfaces.
- **Accents (Charcoal):** Reserved for high-contrast typography and iconography to ensure legibility and a premium editorial feel.

## Typography

The typography system pairs a classic, high-contrast serif with a clean, understated geometric sans-serif to achieve an editorial balance.

- **Headlines (EB Garamond):** Used for large displays and section headers. Its graceful curves and traditional proportions signal heritage and luxury. Letter spacing is tightened slightly for large headings to maintain a cohesive visual block.
- **Body & UI (DM Sans):** Chosen for its modern, low-contrast profile that doesn't compete with the imagery or the serif headlines. It provides exceptional readability for descriptions and functional UI elements.
- **Hierarchy:** Generous line heights (1.6x - 1.7x) are used for body text to create an airy, breathable reading experience. Labels use wide tracking and uppercase transformations to provide a rhythmic contrast to the fluid serif headings.

## Layout & Spacing

The layout philosophy is rooted in "Atmospheric Space"—the intentional use of large gaps to signify luxury and allow the eye to rest.

- **Grid System:** A 12-column fixed grid for desktop, centered within the viewport. On mobile, a fluid 4-column grid is used.
- **Spacing Rhythm:** Based on an 8px base unit. Vertical rhythm is expansive; sections are separated by significant gaps (`section-gap`) to ensure each botanical piece feels curated and isolated from the next.
- **Responsive Behavior:** On desktop, imagery is often allowed to "break" the grid or align to specific column spans (e.g., a 7-column image paired with 5 columns of whitespace) to create asymmetrical, dynamic compositions reminiscent of Japanese ikebana.

## Elevation & Depth

Visual hierarchy is established through "Soft Tonal Layering" rather than traditional heavy shadows.

- **Surface Tiers:** Depth is primarily communicated by subtle shifts in background color (e.g., a "Stone" colored card resting on a "Warm Ivory" background).
- **Shadows:** When used, shadows are extremely diffused and low-opacity (2-5%), using a tint of the secondary color (`#A89B8C`) rather than pure black. This creates a "soft glow" effect, suggesting the element is gently hovering.
- **Backdrop Blurs:** Used sparingly for navigation overlays to maintain a sense of translucency and light, ensuring the user never feels disconnected from the botanical imagery beneath.

## Shapes

The shape language is organic and soft, avoiding sharp technical corners in favor of radii that feel "weathered" or "tumbled" like river stones.

- **Global Radius:** Standard UI elements like buttons and input fields use a `0.5rem` (8px) radius.
- **Container Radius:** Larger cards and image containers use `rounded-xl` (1.5rem/24px) to emphasize the soft, welcoming nature of the brand.
- **Iconography:** Icons should feature rounded caps and corners, maintaining a consistent line weight that matches the `label-md` stroke.

## Components

- **Buttons:** Primary buttons are filled with the primary sage green. Secondary buttons use a "ghost" style with a fine 1px border in charcoal or walnut. All buttons feature generous horizontal padding and `label-md` typography.
- **Cards:** Cards should have no border, utilizing the "Soft Tonal Layering" (a slightly darker or lighter neutral background) and minimal soft shadows. Images within cards should always use the `rounded-xl` radius.
- **Input Fields:** Minimalist design with a single bottom border or a very light tonal fill. Focus states are indicated by a subtle color shift rather than a heavy ring.
- **Chips/Tags:** Used for botanical categories (e.g., "Succulent", "Low Light"). These are pill-shaped with a soft linen background and charcoal text.
- **Botanical Detail Lists:** Use the serif font for titles and the sans-serif for values. Spacing between list items should be generous to maintain the "quiet" aesthetic.
- **Image Carousels:** Use custom, minimal "dot" indicators that are small and non-intrusive, styled in the secondary color palette.