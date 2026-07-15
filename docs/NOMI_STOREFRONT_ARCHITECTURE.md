# Nomi Storefront Architecture

**Classification:** Product constitution  
**Scope:** Permanent. Applies to every Nomi storefront — present and future.  
**Authority:** This document supersedes visual specifications. No theme, vibe, or design tool may override the architecture defined here.

---

## 1. Core Product Philosophy

A Nomi storefront exists to answer one question for the buyer: *"What does this person sell, and how do I get it?"*

Every architectural decision flows from five beliefs:

**1. Every store should feel professionally designed by default.**  
Sellers on Nomi are individuals — cooks, makers, fishers, bakers. They do not have design teams. The platform must guarantee that every storefront looks intentionally crafted without requiring a single design decision from the seller beyond choosing a vibe.

**2. Trust is built through clarity, not decoration.**  
A buyer visiting a Nomi store for the first time has no prior relationship with the seller. The storefront must establish credibility through clear information hierarchy, consistent layout, and predictable interactions — not through visual complexity.

**3. Products are always the protagonist.**  
The storefront exists to sell. Brand expression serves the product, never the reverse. A beautiful hero section that pushes products below the fold has failed.

**4. Simplicity is not a constraint — it is the product.**  
Nomi storefronts are deliberately small. One hero. One featured product. One catalog. One cart. This constraint is architectural, not a limitation. Removing decisions removes friction.

**5. Every scroll should reveal something worth seeing.**  
The vertical flow of a Nomi storefront is a narrative: identity → recommendation → discovery → action. No section exists without a purpose. No empty space without intention.

---

## 2. Immutable Storefront Architecture

The customer journey through a Nomi storefront follows a fixed sequence. This sequence cannot be reordered, skipped, or restructured by any theme.

```
┌─────────────────────────┐
│      HERO SECTION       │  ← Brand identity & value proposition
├─────────────────────────┤
│    FEATURED PRODUCT     │  ← Seller's best recommendation
├─────────────────────────┤
│  CATEGORY NAVIGATION    │  ← Product discovery by type
├─────────────────────────┤
│     PRODUCT CATALOG     │  ← Full browsable inventory
├─────────────────────────┤
│    STICKY CART BAR      │  ← Persistent purchase intent
└─────────────────────────┘
         ↓ tap
┌─────────────────────────┐
│     PRODUCT DETAIL      │  ← Full product information
└─────────────────────────┘
         ↓ add to cart
┌─────────────────────────┐
│       CART PAGE         │  ← Review & quantity management
└─────────────────────────┘
         ↓ checkout
┌─────────────────────────┐
│     CHECKOUT FORM       │  ← Buyer details & fulfillment
└─────────────────────────┘
         ↓ place order
┌─────────────────────────┐
│     PAYMENT PAGE        │  ← QR code & payment instructions
└─────────────────────────┘
         ↓ notify seller
┌─────────────────────────┐
│     ORDER STATUS        │  ← Confirmation & receipt
└─────────────────────────┘
```

### Section Definitions

#### Hero Section
- **Purpose:** Establish who the seller is and what they offer in under 3 seconds.
- **Required content:** Store name (always). Subheading (when provided). Logo or monogram (always — generated from store name if no logo uploaded).
- **User expectation:** "I know what this store is about."
- **Why it exists:** A buyer arriving from a social media link has zero context. The hero replaces the physical experience of walking into a shop and looking around.

#### Featured Product
- **Purpose:** The seller's curated recommendation. The single product the seller would hand to a customer who asked "What should I try first?"
- **Required content:** Product name, price, image (when available), description excerpt. Quick-add action for simple products.
- **User expectation:** "The seller is personally recommending this to me."
- **Why it exists:** Eliminates choice paralysis. In a catalog of 20 products, the featured pick tells the buyer where to start. This is the digital equivalent of a market seller holding up their best catch.

#### Category Navigation
- **Purpose:** Enable product discovery by type without requiring the buyer to scroll through every item.
- **Required content:** Category pills derived from seller-assigned product categories. "All" is always the first option. Only appears when 2+ categories exist.
- **User expectation:** "I can filter by what I'm looking for."
- **Why it exists:** Nomi stores can carry products across multiple categories (e.g., a baker selling cakes, cookies, and drinks). Category navigation prevents the catalog from feeling like an undifferentiated list.

#### Product Catalog
- **Purpose:** The complete browsable inventory.
- **Required content:** Grid of product cards. Each card shows name, price, image, and quick-add button (when applicable).
- **User expectation:** "I can see everything available and add items directly."
- **Why it exists:** This is the core commercial surface. Every product must be visible, browsable, and actionable.

#### Sticky Cart Bar
- **Purpose:** Persistent, non-intrusive purchase intent indicator once the buyer has items.
- **Required content:** Item count, running subtotal, and navigation to cart/checkout. Hidden while the cart is empty; slides in when the first item is added.
- **User expectation:** "Once I've added something, I can always see what I've added and get to checkout."
- **Why it exists:** Mobile commerce has no sidebar. The sticky cart replaces the physical shopping basket — present when useful, out of the way when not.

#### Product Detail
- **Purpose:** Full product information and quantity selection before adding to cart.
- **Required content:** Product image (full width), name, price, description, category badge, quantity selector, add-to-cart action, back navigation.
- **User expectation:** "I can learn everything about this product and decide how many I want."
- **Why it exists:** Some products require more information before purchase (services, bundles, custom items). The detail page serves products that cannot be impulse-added.

#### Cart Page
- **Purpose:** Review all selected items, adjust quantities, and proceed to checkout.
- **Required content:** Line items with thumbnails, per-item price, quantity controls, remove action, subtotal, checkout action.
- **User expectation:** "I can review and adjust my order before committing."
- **Why it exists:** The cart is the last decision point before the buyer commits personal information. It must be frictionless and transparent.

#### Checkout Form
- **Purpose:** Collect buyer details and fulfillment preference to create the order.
- **Required content:** Order summary, fulfillment method selection (pickup/delivery), buyer name, phone, email, optional notes, place-order action.
- **User expectation:** "I can complete my order in under 60 seconds."
- **Why it exists:** Nomi uses PayNow (manual bank transfer) rather than card payments. The checkout must collect enough information for the seller to fulfill the order and verify payment.

#### Payment Page
- **Purpose:** Present the PayNow QR code and guide the buyer through the payment process.
- **Required content:** Total amount, order reference, QR code, countdown timer, step-by-step payment instructions, save-QR action, notify-seller action.
- **User expectation:** "I know exactly how to pay and what happens next."
- **Why it exists:** PayNow is not automatically verified. The payment page must compensate for this by being maximally clear about the process, the deadline, and the next step.

#### Order Status
- **Purpose:** Show the current state of the order after payment.
- **Required content:** Order status (awaiting verification / confirmed / cancelled / expired), order receipt, contextual guidance.
- **User expectation:** "I can bookmark this page and check back to see if my order is confirmed."
- **Why it exists:** Because payment verification is manual, the buyer needs a persistent status page. This page is the buyer's only window into order progress.

---

## 3. Information Hierarchy

When a buyer lands on any Nomi storefront, their attention must be directed in this exact order:

| Priority | Element | Purpose |
|:---------|:--------|:--------|
| 1st | **Brand identity** | Logo/monogram + store name. "Who is this?" |
| 2nd | **Value proposition** | Eyebrow + subheading. "What do they sell?" |
| 3rd | **Featured product** | Seller's recommendation. "What should I try?" |
| 4th | **Category navigation** | Filtering mechanism. "What types of things are here?" |
| 5th | **Product catalog** | Full inventory. "What else is available?" |
| 6th | **Cart indicator** | Purchase state. "What have I added so far?" |

This hierarchy must hold regardless of visual treatment. A vibe may change typography, color, and material — but the featured product must always command more visual weight than catalog cards, and the hero must always precede the catalog.

### Product Card Hierarchy

Within every product card, information must be ordered:

1. **Product image** — dominant, occupying the majority of the card
2. **Product name** — legible at scan speed
3. **Price** — immediately visible without interaction
4. **Quick-add action** — discoverable but not competing with the image

No theme may reorder these elements within a product card.

### Checkout Information Hierarchy

1. **Order summary** — what the buyer is paying for
2. **Fulfillment selection** — how they'll receive it
3. **Personal details** — who they are
4. **Action** — place the order

This sequence reflects progressive commitment: see what you owe → choose how to get it → identify yourself → confirm.

---

## 4. Interaction Rules

These rules define behavior, not appearance. They must be preserved across every theme.

### Cart Interactions
- The sticky cart bar is hidden while the cart is empty (no “empty cart” chrome on the shop home).
- When the first item is added, the bar slides in with a short ease animation and shows item count, subtotal, and a checkout affordance.
- When the cart returns to empty, the bar slides out the same way.
- While visible, the cart is reachable within one tap from shop/cart/product pages (still hidden on checkout/order).

### Product Interactions
- Products with short descriptions (≤ 100 characters) support quick-add directly from the catalog card and featured section.
- Products with longer descriptions require the buyer to visit the detail page before adding to cart. This is intentional — it forces the buyer to read before committing.
- Product images scale subtly on hover (desktop) to signal interactivity.
- Product cards compress subtly on press (mobile) to provide tactile feedback.
- Every product card is a link to its detail page, regardless of whether quick-add is available.

### Navigation Interactions
- Category pills scroll horizontally on mobile. They do not wrap.
- On desktop, categories render as underline tabs. They do not scroll.
- The "All" category is always the first option and is selected by default.
- Filtering is instant and client-side. No loading state, no page navigation.
- Back navigation is always available as an inline text link, never a browser-dependent back button.

### Checkout Interactions
- The checkout form uses native form semantics (no JavaScript-dependent validation for required fields).
- Fulfillment method defaults to the first available option (pickup preferred over delivery).
- The place-order action disables during submission to prevent double-orders.
- After order creation, the cart is automatically cleared.

### Payment Interactions
- The PayNow QR code is displayed at a size large enough to scan directly from the screen.
- A countdown timer shows remaining time in the payment window.
- The buyer can save the QR code as an image for use in another app.
- The "notify seller" action requires explicit confirmation via a modal with a checkbox ("I have completed payment").
- After notification, the page transitions to an awaiting-verification state.

### Order Status Interactions
- The order status page is bookmarkable and shareable.
- The page displays contextual guidance based on state (e.g., "Bookmark this page" when awaiting, "Contact the seller" when expired).
- No login is required to view order status. The URL is the authentication.

---

## 5. Layout Rules

These rules define spatial relationships and structural constraints. They contain no visual styling.

### Page Structure
- The hero section always appears first on the page. No content precedes it.
- The featured product always appears immediately after the hero. It is never interleaved with catalog items.
- Category navigation always precedes the product grid. It never appears after or within the grid.
- The product grid uses a consistent column structure: 2 columns on mobile, 4 columns on desktop.
- The sticky cart bar is fixed to the bottom of the viewport. It floats above page content.
- The sticky cart bar respects device safe areas (notch, home indicator).

### Content Width
- All storefront content is constrained to a maximum width (1280px) and horizontally centered.
- Horizontal padding is consistent across all sections (20px mobile, 24px tablet+).

### Vertical Rhythm
- Each architectural section has its own vertical padding. Sections are never flush against each other.
- The page includes bottom padding to prevent the sticky cart from obscuring the last row of products.

### Product Detail Layout
- Product image is full-width on mobile. No side padding.
- Product information appears below the image on mobile, beside it on desktop.
- The quantity selector appears before the add-to-cart button.
- The store name appears below the add-to-cart button as a trust signal.

### Cart & Checkout Layout
- Cart items stack vertically. They do not use a grid.
- Each cart item shows a thumbnail, name, unit price, quantity controls, and remove action in a single row.
- The checkout form is a single-column vertical stack. No multi-column form layouts.
- Form fields use standard spacing between them. Labels are above inputs, never beside them.

### Responsive Behavior
- The storefront is mobile-first. Mobile is the primary design target.
- Desktop adds width, column count, and spacing. It never adds new sections or rearranges the architecture.
- Category navigation adapts between scrollable pills (mobile) and underline tabs (desktop). The underlying functionality is identical.

---

## 6. Components That Are Fixed

These components are structurally locked. Their presence, position, purpose, and information content must not change across themes.

| Fixed Component | Reason | Can Never Be Removed |
|:----------------|:-------|:---------------------|
| Hero section | Brand introduction is the entry point for every storefront | ✓ |
| Logo/monogram | Visual brand identity anchor — auto-generated when no logo exists | ✓ |
| Featured product section | Seller's curated recommendation reduces choice paralysis | ✓ |
| Featured product quick-add | Enables impulse purchase at the point of highest interest | ✓ |
| Category navigation | Product discovery mechanism for multi-category stores | Conditional — hidden when < 2 categories |
| Product catalog grid | Core commercial surface — every product must be browsable | ✓ |
| Product card information hierarchy | Consistency across all cards: image → name → price → action | ✓ |
| Sticky cart bar | Persistent purchase state indicator, always one tap from checkout | ✓ |
| Product detail page | Full product info with quantity selection for considered purchases | ✓ |
| Cart page | Order review and quantity adjustment before commitment | ✓ |
| Checkout form structure | Progressive disclosure: summary → fulfillment → details → action | ✓ |
| Payment QR display | PayNow-specific: QR code, countdown, save, notify flow | ✓ |
| Order status page | Persistent, bookmarkable order tracking without login | ✓ |
| Order receipt | Consistent summary format across payment, confirmation, and receipt states | ✓ |
| "How to pay" instructions | Payment literacy: step-by-step guidance for QR-based payment | ✓ |
| Seller notification modal | Prevents premature verification requests with explicit confirmation | ✓ |
| Back navigation links | Inline, text-based. Never rely on browser back button. | ✓ |

---

## 7. Components That Are Themeable

These components may be visually reinterpreted by each vibe. They define the art direction, not the architecture.

| Themeable Component | Guidance |
|:--------------------|:---------|
| Color palette | Full control. Background, text, primary action, secondary, muted, surface, border, and accent colors. |
| Typography | Display and body typefaces, weights, sizes, tracking, and line height. |
| Border radius | From sharp (0) to fully rounded (9999px). Applied consistently via a theme token. |
| Shadows & elevation | From flat (no shadow) to elevated (layered shadows). Defines perceived depth. |
| Card material | Surface treatment of product cards, panels, and containers. Glass, paper, metal, fabric — any metaphor. |
| Photography direction | How product images are framed, lit, and contextualized. Moody, bright, editorial, candid. |
| Background treatment | Solid, gradient, textured, patterned. May include decorative overlays on the hero. |
| Decorative elements | Grain, grid lines, orbs, illustrations, textures. Applied to hero or page background. |
| Iconography | Icon style for UI elements (cart, arrows, plus, checkmark). Line, solid, custom. |
| Button styling | Shape, fill, border, hover/active states. Must preserve minimum touch target (44px). |
| Motion language | Transition timing, easing, entrance animations. Must respect `prefers-reduced-motion`. |
| Section spacing | Vertical padding between sections. Must maintain clear visual separation. |
| Hero layout variant | The hero may be centered, left-aligned, or split. The content (name, eyebrow, subheading) is fixed. |
| Featured product card layout | May be horizontal split, vertical stack, or overlay. The information content is fixed. |
| Category pill/tab styling | Shape, fill, active indicator style. The behavior (scroll on mobile, tabs on desktop) is fixed. |
| Brand voice | Tone of UI microcopy (section headers, empty states, button labels). "Featured" vs "Signature Pick" vs "Top Seller". |
| Texture & grain | Noise, film grain, paper texture applied as overlays. Must not reduce text legibility. |

---

## 8. Non-Negotiable Design Principles

These principles are permanent. They apply to every storefront, every vibe, and every future design decision.

1. **Architecture before aesthetics.** The structure of the storefront is more important than how it looks. A beautiful store with a broken journey has failed.

2. **Products are always the hero.** The brand supports the products, not the reverse. No theme should ever subordinate product visibility to decorative expression.

3. **Every scroll reveals something worth seeing.** The vertical flow is a curated narrative: identity → recommendation → discovery → action. Dead space is a design failure.

4. **Consistency beats creativity.** A buyer who has visited one Nomi store should feel immediately oriented in any other. Familiarity is a feature.

5. **Every store should feel intentionally designed.** No Nomi storefront should ever look like a template. The vibe system exists to make every store feel curated, even when the seller made only one choice.

6. **Visual polish must never compromise usability.** Animations that delay interaction, contrast ratios that reduce legibility, or decorative elements that obscure content violate this principle absolutely.

7. **Remove before adding.** When in doubt about whether a component belongs, remove it. A Nomi storefront should feel edited, not assembled.

8. **Mobile is the primary customer.** Over 80% of Nomi store visits come from social media links on phones. Every architectural decision must work on a 375px screen first.

9. **Trust is earned through predictability.** Buyers trust stores that behave consistently. Surprising interactions — no matter how clever — erode confidence.

10. **The seller's time is sacred.** The storefront must work beautifully with minimal seller input. A store with only a name, one product, and a PayNow number must still feel complete.

---

## 9. Future AI Generation Rules

This section provides binding instructions for any AI design tool (Google Stitch, Figma AI, custom generators) that creates new Nomi storefront vibes.

### Absolute Constraints

1. **Preserve the storefront architecture exactly.** The section sequence defined in §2 is immutable. No AI-generated theme may reorder, merge, split, add, or remove architectural sections.

2. **Never redesign the customer journey.** The path from hero → featured → catalog → cart → checkout → payment → status is a product decision, not a design decision. It cannot be altered.

3. **Only reinterpret the visual language.** A new vibe changes how the storefront looks and feels. It never changes what the storefront does or how information is organized.

4. **Preserve information hierarchy.** The priority order defined in §3 must hold. Brand identity before value proposition. Featured product before catalog. Product name before price. Always.

5. **Preserve the interaction model.** Every interaction rule in §4 must be implemented identically. Quick-add behavior, category filtering, cart persistence, payment confirmation — these are product behaviors, not stylistic choices.

6. **Preserve the product discovery flow.** Featured → categories → grid is the discovery architecture. A new vibe may change the visual treatment of each step but cannot change the sequence or remove any step.

### Creative Freedoms

AI tools are encouraged to generate vibes that are radically different in visual expression while obeying the constraints above. Example vibes that this architecture supports:

| Vibe Name | Art Direction | What Changes |
|:----------|:-------------|:-------------|
| **Noir** | Dark, cinematic, premium | Color, typography (Plus Jakarta Sans), card material, grid overlay texture, warm accent tones |
| **Atelier** | Minimalist, whitespace-driven, editorial | Color (cream/black), serif typography, generous spacing, no decorative elements |
| **Expedition** | Outdoor, rugged, earthy | Color (olive/terracotta), slab-serif typography, textured surfaces, organic shapes |
| **Gallery** | Art-forward, asymmetric, high-contrast | Color (white/black with accent), geometric typography, oversized product images |
| **Market** | Bright, approachable, friendly | Color (warm pastels), rounded sans-serif, soft shadows, playful micro-animations |
| **Modern** | Tech-forward, clean, systematic | Color (monochrome + accent), geometric sans, sharp corners, minimal ornamentation |

Each of these vibes would produce a visually distinct storefront while sharing the identical architecture, journey, hierarchy, and interaction model.

### Generation Checklist

Before any AI-generated vibe is accepted, it must pass these checks:

- [ ] Hero section is the first visible content on the page
- [ ] Featured product appears between hero and catalog
- [ ] Category navigation appears before the product grid
- [ ] Product cards contain: image, name, price, quick-add (in that order)
- [ ] Sticky cart bar is present and fixed to the bottom
- [ ] All touch targets meet the 44px minimum
- [ ] Text passes WCAG AA contrast ratio (4.5:1 body, 3:1 large)
- [ ] Motion respects `prefers-reduced-motion`
- [ ] The storefront looks intentionally designed, not templated
- [ ] A seller with one product and no logo still has a complete-looking store
- [ ] The payment flow (QR → instructions → notify → status) is fully intact
- [ ] Category pills scroll horizontally on mobile
- [ ] Product grid is 2 columns on mobile, 4 on desktop
- [ ] Checkout form is single-column
- [ ] Back navigation uses inline text links

### Token Interface

Every vibe must provide values for the following semantic tokens. These tokens are the contract between the architecture and the visual layer:

```
--vibe-bg               Page background
--vibe-primary          Primary action / accent color
--vibe-primary-fg       Text on primary color
--vibe-secondary        Secondary accent
--vibe-surface          Card / panel background
--vibe-border           Borders and dividers
--vibe-text             Primary text color
--vibe-text-muted       Secondary / helper text
--vibe-text-variant     Decorative / accent text
--vibe-text-bright      Maximum contrast text (e.g., white on dark)
--vibe-primary-container  Hero accent / highlight color
--vibe-surface-elevated   Elevated panel background
--vibe-surface-high       High-emphasis surface
--vibe-radius           Global border radius for cards, buttons, inputs
```

Additional vibe-specific tokens may be added, but the above set is mandatory.

---

## Appendix: Architectural Boundaries

### What This Document Governs
- Storefront customer journey
- Section sequence and content requirements
- Information hierarchy
- Interaction behavior
- Layout constraints
- Component inventory (fixed vs. themeable)
- AI generation guardrails

### What This Document Does Not Govern
- Seller dashboard UI
- Marketing website
- Authentication flow
- Administrative tools
- API design
- Database schema
- Performance optimization

---

*The Noir storefront is the first successful implementation of this architecture. It is a reference, not the definition. This document is the definition.*
