# Whacka UI/UX Specification — Home & Hero Section

> A near-forensic design specification for the homepage/hero section of **whacka.app**, designed for 1:1 engineering recreation without referencing the original website.
> Focused specifically on the **Home / Hero section** per user requirements.

---

## 1. Global Design Language & Visual System

### 1.1 Philosophy & Aesthetic
Whacka employs a **"warm tactile organic tech"** design language. It rejects sterile corporate SaaS aesthetics (pure white, cold cool-greys, sharp 4px radii) in favor of:
- **Warm, paper-like backgrounds** (`#F1EDE5` base, `#FAF6EE` cream tints) that simulate premium stationery or editorial print.
- **High-contrast typography** combining a geometric, approachable sans-serif (**Hanken Grotesk**) with playful, human touches (**Pacifico** script for brand highlights, **Geist Mono** for AI reasoning steps).
- **Extreme roundness & pill geometries** (`999px` pill navigation, `20px–28px` card radii) creating an approachable, friendly touch target system.
- **Subtle depth & tactile layering**: Frosted glassmorphism (`backdrop-blur(8px)`), multi-layered shadow elevations, and subtle border outlines (`#E5DFD3`) that give elements a physical, "stamped" or "pinned" presence.

### 1.2 Color Architecture (Home Section)
- **Page Background (`--bg`)**: `#F1EDE5` — A warm, earthy light stone/sand color.
- **Primary Ink (`--ink` / `--brand`)**: `#16130E` — A deep, warm charcoal/off-black used for all primary headings, body text, and dark button states.
- **Soft Ink (`--ink-soft`)**: `#57514A` — Warm medium-grey for subheadings, navigation links, and secondary text.
- **Muted Ink (`--ink-mute`)**: `#736A5A` — Muted earthy grey for metadata, timestamps, and tertiary elements.
- **Faint Ink (`--ink-faint`)**: `#B9B1A4` — Light warm grey for input placeholders, borders, and disabled icons.
- **Primary Action Yellow (`--lime` / `--yellow`)**: `#F7C518` — Vibrant, warm golden yellow used for primary CTAs and highlight banners. Hover state deepens to `#EAB408`.
- **Surface / Paper (`--surface` / `--paper`)**: `#FFFFFF` — Pure white, used exclusively inside elevated cards, input shells, and floating chips to pop against the `#F1EDE5` background.
- **Primary Line (`--line`)**: `#E5DFD3` — Soft sand border color used to delineate cards, chips, and navigation separators.

### 1.3 Typography Rules
- **Primary Font**: `Hanken Grotesk`, sans-serif. Weights used: `400` (body), `500` (nav/buttons), `600` (CTAs/subheadings), `700` (headings), `800` (logo/display).
- **Monospace Font**: `Geist Mono`, ui-monospace. Used for system status, AI thinking chips, timestamps, and code snippets.
- **Script Font**: `Pacifico`. Used selectively for playful decorative callouts or brand accents.
- **Display Heading Styling**: 
  - Size: `clamp(28px, 3.6vw, 46px)`
  - Line height: `1.04` (extremely tight, structural leading)
  - Letter spacing: `-0.02em` (slight negative tracking for tight word grouping)
  - Weight: `700` (Bold)
- **Body Large / Subheading Styling**:
  - Size: `clamp(20px, 2.4vw, 28px)`
  - Line height: `1.4` to `1.5`
  - Color: `#57514A` (`--ink-soft`)
  - Weight: `400` (Normal)

---

## 2. Navigation Bar Specification

### 2.1 Anatomy & Dimensions
- **Positioning**: `sticky top-0 z-40`, centered horizontally within the viewport.
- **Container Width**: `max-w-[1080px] w-full mx-auto` (with `px-4 sm:px-6` side margins on smaller viewports).
- **Height**: `56px` total height.
- **Vertical Padding / Margins**: `pt-4` (`16px` offset from viewport top on scroll/load).
- **Shape & Radii**: `rounded-full` (`9999px`), forming a continuous floating pill.
- **Background Treatment**: `rgba(251, 247, 242, 0.95)` (`#FBF7F2` at 95% opacity) paired with `-webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);` for a smooth frosted glass effect over page scrolling content.
- **Border**: `1px solid var(--line)` (`#E5DFD3`).
- **Shadow**: `0 1px 3px rgba(27, 26, 24, 0.08)` — subtle resting elevation.

### 2.2 Layout & Spacing (Desktop)
- **Display**: `flex items-center justify-between px-6 py-2.5`.
- **Left Zone (Brand Logo)**:
  - Display: `flex items-center gap-2 cursor-pointer`.
  - Logo Icon: A circular yellow mark (`#F7C518`) containing an stylized `w` waveform in `#16130E` with a purple accent dot (`#7C2FE0`). Diameter: `28px`.
  - Wordmark: "whacka" rendered in `Hanken Grotesk`, `800` weight, `20px` font size, `-0.03em` letter spacing, `#16130E` color.
- **Center Zone (Navigation Links)**:
  - Display: `hidden md:flex items-center gap-8` (hidden on mobile, visible on `md` 768px+).
  - Link Items: "Home", "Use cases", "Resources", "Pricing", "Security".
  - Typography: `14.5px` font size, `500` weight, `#57514A` (`--ink-soft`) default color.
  - Interactive Hover State: Color transitions smoothly (`150ms ease`) to `#16130E` (`--ink`).
  - Dropdown Triggers ("Use cases", "Resources"): Include an inline SVG chevron (`12px x 12px`, stroke width `2px`) rotated `0deg` default, transitioning to `180deg` when open.
- **Right Zone (Actions)**:
  - Display: `flex items-center gap-4`.
  - **"Sign in" Link**: `14.5px`, weight `500`, `#57514A` text, hover transitions to `#16130E`. Hidden on very small screens, visible on `sm` (640px+).
  - **"Start building" Button**:
    - Background: `#F7C518` (`--yellow`).
    - Color: `#16130E` (`--ink`).
    - Typography: `14px`, weight `600`, `-0.005em` letter spacing.
    - Padding: `7px 18px` (`py-1.5 px-4.5`).
    - Shape: `rounded-full` (`999px`).
    - Hover State: Background transitions (`150ms ease`) to `#EAB408` (`--yellow-deep`). Subtle translateY(`-1px`) lift with button glow shadow `0 4px 12px rgba(247, 197, 24, 0.4)`.
    - Active / Pressed State: Scale down to `0.98`, shadow flattens.

### 2.3 Mobile Navigation Behavior (< 768px)
- **Center Links**: Entire center flex container sets to `display: none`.
- **Right Zone**: Displays "Start building" CTA button alongside a **Hamburger Menu Trigger**.
- **Hamburger Button**:
  - Size: `36px x 36px` circle (`rounded-full`).
  - Background: `transparent`, hovering/tapping changes to `rgba(22, 19, 14, 0.05)`.
  - Icon: 3 horizontal bars (or 2 bars depending on animation state), `20px` width, stroke `#16130E`.
- **Mobile Menu Overlay**:
  - When triggered, opens a full-screen or dropdown sheet (`z-50`) with frosted background `#F1EDE5` at `98%` opacity + `blur(16px)`.
  - Links stack vertically with `20px` spacing, font size scaled up to `18px` (`600` weight).

---

## 3. Hero Section Specification

### 3.1 Structure & Geometry
- **Container**: `max-w-[1040px] w-full mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center relative z-10`.
- **Background Treatment**:
  - Sits on the global `#F1EDE5` background.
  - **Ambient Wash (`.hero-wash`)**: A subtle radial gradient overlay positioned behind the main text: `radial-gradient(50% 60% at 50% 40%, rgba(247, 197, 24, 0.08), transparent)` and a secondary soft blue/orange wash drifting slowly via keyframe animation (`landing-drift-1`, `22s infinite ease-in-out`).

### 3.2 Top Badge / Social Proof Chip
- **Anatomy**: A pill-shaped chip positioned directly above the main headline.
- **Margin Bottom**: `mb-6` (`24px`).
- **Container Styles**:
  - Background: `var(--surface)` (`#FFFFFF`).
  - Border: `1px solid var(--line)` (`#E5DFD3`).
  - Padding: `6px 14px` (`py-1.5 px-3.5`).
  - Shape: `rounded-full` (`9999px`).
  - Shadow: `0 1px 3px rgba(27, 26, 24, 0.06)` (`resting`).
  - Display: `inline-flex items-center gap-2.5 cursor-pointer`.
  - Hover Treatment: translateY(`-1px`), border changes to `#B9B1A4`, shadow elevates slightly to `0 4px 10px rgba(27, 26, 24, 0.1)`.
- **Internal Elements**:
  - **Pulsing Indicator Dot**: A circular dot, `8px x 8px`, `rounded-full`, color `#2E9C68` (Mint Green). Surrounded by a keyframe animation (`landing-pulse`, `3.5s infinite ease-out`) creating an expanding, fading ring (`box-shadow: 0 0 0 4px rgba(46, 156, 104, 0.2)`).
  - **Text Copy**: `"1,113 apps shipped this week"` (number updates dynamically).
  - **Typography**: `13px` font size, `500` weight, Hanken Grotesk. The number `"1,113"` is rendered in `700` weight (Bold) `#16130E`, while `"apps shipped this week"` is rendered in `#57514A` (`--ink-soft`).

### 3.3 Hero Headline & Subheadline
- **Main Headline (`<h1>`)**:
  - Text Copy: `"Build mobile apps with whacka"` (or variant `"Your idea is one sentence away from a real app."`).
  - Class: `.h-display`.
  - Typography: Size `clamp(32px, 4.2vw, 54px)`, weight `800` (Extrabold), leading `1.04`, letter spacing `-0.025em`, color `#16130E` (`--ink`).
  - Max Width constraints: `max-w-[760px] mx-auto`.
  - Alignment: Center aligned (`text-center`).
  - Margin Bottom: `mb-4` (`16px`).
- **Subheadline (`<p>`)**:
  - Text Copy: `"From an idea to a real product people use."` (or `"Describe your app in plain words. whacka writes it, hosts it, and puts it live in minutes."`).
  - Typography: Size `clamp(18px, 2.2vw, 22px)`, weight `400` (Normal), leading `1.45`, color `#57514A` (`--ink-soft`).
  - Max Width constraints: `max-w-[580px] mx-auto`.
  - Margin Bottom: `mb-10` (`40px`).

---

## 4. Hero Interactive Prompt Shell & Input Area

The centerpiece of the hero section is an interactive interactive prompt shell simulating an AI app builder interface.

### 4.1 Input Shell Container (`.landing-input-shell`)
- **Dimensions**: `w-full max-w-[680px] mx-auto`.
- **Background**: `var(--surface)` (`#FFFFFF`).
- **Border Treatment**: `1px solid var(--line-soft)` (`#EDE8DD`), wrapped in a subtle outer glow / shadow: `box-shadow: 0 12px 36px -8px rgba(22, 19, 14, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;`.
- **Corner Radius**: `rounded-3xl` (`24px` to `28px`).
- **Padding**: `16px` (`p-4 sm:p-5`).
- **Hover / Focus-Within State**: When the user clicks or focuses inside the shell, the outer border transitions (`200ms ease`) to `#16130E` (`--ink`), and the shadow expands to `0 16px 48px -12px rgba(22, 19, 14, 0.18), 0 0 0 3px rgba(247, 197, 24, 0.25)`.

### 4.2 Input Text Area & Rotating Placeholder
- **Anatomy**: A multi-line auto-expanding textarea or contenteditable div.
- **Min Height**: `80px` (`min-h-[80px]`).
- **Typography**: `16px` font size (prevents iOS auto-zoom on focus), `400` weight, Hanken Grotesk, leading `1.5`, color `#16130E`.
- **Placeholder Text Behavior**:
  - Color: `#B9B1A4` (`--ink-faint`).
  - Rotation Animation: The placeholder cycles through example prompts every `3.5 seconds` via a smooth fade-out (`150ms`, translateY `-4px`), text swap, and fade-in (`250ms`, translateY `0px`).
  - Sample Placeholders:
    - `"Wedding photographer site with portfolio, inquiry form, and date holds"`
    - `"Room in tonight's class?"`
    - `"Dog walking schedule and client tracker with SMS reminders"`
    - `"Inventory scanner for boutique plant shop with reorder alerts"`

### 4.3 Input Bottom Control Bar
- **Display**: `flex items-center justify-between pt-3 mt-2 border-t border-[var(--line-soft)]`.
- **Left Actions (Attachment & Voice Icons)**:
  - Display: `flex items-center gap-2`.
  - **Attachment Button (`<button>`)**: Circular icon button, `36px x 36px`, `rounded-full`, border `1px solid var(--line)`, background `transparent`. Contains paperclip SVG (`16px`, `#57514A`). Hover transitions background to `#F6F2EA` and border to `#B9B1A4`.
  - **Voice / Mic Button (`<button>`)**: Circular icon button, `36px x 36px`, `rounded-full`, border `1px solid var(--line)`, background `transparent`. Contains microphone SVG (`16px`, `#57514A`). Hover transitions background to `#F6F2EA`.
- **Right Action (Primary Submit CTA — "Build it")**:
  - Anatomy: A prominent pill button positioned at the bottom right of the input shell.
  - Background: `#16130E` (`--ink` / `--black`).
  - Text Color: `#FFFFFF` (`pure white`).
  - Typography: `15px`, weight `600`, `-0.005em` letter spacing.
  - Padding: `8px 20px` (`py-2 px-5`).
  - Shape: `rounded-full` (`999px`).
  - Display: `inline-flex items-center gap-2.5 cursor-pointer`.
  - **Right Arrow Badge**: Inside the black button, to the right of the text "Build it", sits a small circular yellow badge (`#F7C518`), `24px x 24px`, `rounded-full`, containing a right-pointing arrow SVG (`14px` width, `2px` stroke, `#16130E` color).
  - Hover Treatment: The black background lightens slightly to `#2C2A26`, while the yellow circle badge scales up slightly (`scale-105`, `150ms ease-out`) and shifts right by `2px` (`translate-x-0.5`).
  - Active / Pressed Treatment: Scale button down to `0.97`.

---

## 5. Suggestion Chips / Prompt Pills Below Input

Directly beneath the hero input shell is a horizontal wrapping list of quick-start suggestion chips.

### 5.1 Container & Layout
- **Display**: `flex flex-wrap items-center justify-center gap-2 pt-5`.
- **Max Width**: `max-w-[680px] mx-auto`.

### 5.2 Chip Anatomy (`.chip` / `<button>`)
- **Sample Labels**: `"yoga booking"`, `"dog walking"`, `"bedtime stories"`, `"personal finance"`, `"grocery list"`.
- **Typography**: `12.5px` font size, `500` weight, Hanken Grotesk, color `#57514A` (`--ink-soft`).
- **Background**: `#EAE6DC` (a slightly darker stone tint than `--bg`, providing tactile separation).
- **Border**: `1px solid rgba(22, 19, 14, 0.08)`.
- **Padding**: `6px 14px` (`py-1.5 px-3.5`).
- **Shape**: `rounded-full` (`999px`).
- **Hover State**: Background transitions (`150ms ease`) to `#DFDAD0`, text color darkens to `#16130E` (`--ink`), and button lifts with `translateY(-1px)`.
- **Click Behavior**: Clicking a suggestion chip populates the hero input shell's textarea with the full corresponding prompt text and sets focus to the input.

---

## 6. AI "Thinking" Reasoning Chip Specification

When an app generation or showcase demo is triggered, Whacka renders an AI reasoning step container (`.tpA-thought`) that visualizes step-by-step LLM execution.

### 6.1 Container & Geometry (`.tpA-thought`)
- **Width**: `w-full max-w-[85%]` on desktop, expanding to `w-full` (`100%`) on mobile viewports (`<= 480px`).
- **Background**: `var(--paper)` (`#FFFFFF`).
- **Border**: `1px solid var(--line)` (`#E5DFD3`).
- **Corner Radius**: `12px` (`rounded-[12px]`).
- **Overflow**: `hidden` (for smooth collapsible height animations).

### 6.2 Header / Toggle Bar (`.tpA-thought-head`)
- **Display**: `flex items-center gap-2 p-[8px_10px_8px_11px]` (mobile: `p-[10px_10px_10px_11px]`).
- **Typography**: Size `11.5px`, weight `500`, font-family `var(--font-geist-mono), ui-monospace, monospace`, color `var(--ink-soft)` (`#57514A`).
- **Interactive Role**: Rendered as a `<button type="button">` covering 100% width, cursor pointer, user-select none. Clicking toggles the collapse/expand state of the reasoning body.
- **Left Status Indicator (`.pulse`)**:
  - Active / Thinking State: `7px x 7px` circle (`rounded-full`), background `#16130E` (`--brand`), animation `tpA-pulse 1.4s ease-out infinite`.
  - Keyframe `tpA-pulse`: `0% { box-shadow: 0 0 0 0 rgba(22, 19, 14, 0.55); } 70% { box-shadow: 0 0 0 6px rgba(22, 19, 14, 0); } 100% { box-shadow: 0 0 0 0 rgba(22, 19, 14, 0); }`.
  - Done / Completed State (`.pulse.done`): Animation `none`, background `#8E867A` (`--ink-mute`), shadow `none`.
  - Paused State (`.tpA-thought.paused`): Background `#B97A22` (Warm Amber), animation `none`.
- **Center Label Text**:
  - Live state: `"Thinking…"` or `"Thought for <time> · <N> steps"`.
  - Elapsed timer string (`.elapsed`): Rendered in muted grey `#8E867A` (`--ink-mute`), e.g., `" · 4s"`.
- **Right Chevron Icon (`.chev`)**:
  - `11px x 11px` SVG polyline chevron, stroke width `2.5`, color `#8E867A`.
  - Transitions `transform 200ms ease`. Rotates `180deg` (`.chev.open`) when expanded.

### 6.3 Collapsible Body View (`.tpA-thought-view`)
- **Border Top**: `1px dashed var(--line-soft)` (`#EDE8DD`) separating header from logs.
- **Height Transition**: Uses CSS custom property `--tpA-h: 132px` (mobile: `110px`). Height animates via `transition: height 280ms cubic-bezier(.4, .2, .2, 1)`.
- **Completed State (`.tpA-thought-view.done`)**: Height switches to `auto !important`, max-height capped at `240px` with vertical overflow scrolling (`overflow-y: auto`).
- **Custom Scrollbar Styling**: Width `6px`, track `transparent`, thumb `rgba(0,0,0,0.14)` with `3px` border radius, hover thumb `rgba(0,0,0,0.22)`.
- **Body Text Content (`.tpA-thought-body`)**:
  - Padding: `10px 12px 12px 32px` (mobile: `padding-left: 28px; padding-right: 10px;`).
  - Typography: Size `12px`, line-height `1.6`, font-family `var(--font-geist-mono)`, color `#57514A` (`--ink-soft`).
  - Paragraph Margins: `margin: 0 0 6px;` (last child `margin-bottom: 0`).
- **Live Capped Gradient Mask (`.tpA-thought-view.live.capped::before`)**:
  - When live text exceeds view height, a top gradient mask renders: `height: 38px; background: linear-gradient(180deg, var(--paper, #FFFFFF), rgba(255,255,255,0)); z-index: 1; pointer-events: none;`.
- **Active Blinking Caret (`.caret`)**:
  - Rendered at the end of the active line during live generation: `display: inline-block; width: 6px; height: 13px; background: #16130E; vertical-align: -2px; margin-left: 2px;`.
  - Keyframe `tpA-blink`: `0%, 100% { opacity: 1; } 50% { opacity: 0; }` over `0.9s steps(2) infinite`.

---

## 7. Motion & Animation System (Hero Section)

### 7.1 Initial Page Load Sequence
When the user first lands on the homepage, elements enter sequentially to establish visual hierarchy without overwhelming the user:
1. **0ms (Immediate)**: Global background `#F1EDE5` and Ambient Wash gradient render. Navigation bar slides down from top (`opacity: 0 to 1`, `translateY(-10px) to 0`, duration `400ms ease-out`).
2. **150ms**: Top Badge / Social Proof chip fades in and pops slightly (`scale: 0.95 to 1`, `opacity: 0 to 1`, duration `350ms cubic-bezier(.2, 1.3, .4, 1)` bounce).
3. **250ms**: Hero Main Headline (`<h1>`) reveals upward (`translateY: 16px to 0`, `opacity: 0 to 1`, duration `450ms ease-out`).
4. **350ms**: Hero Subheadline (`<p>`) reveals upward (`translateY: 16px to 0`, `opacity: 0 to 1`, duration `450ms ease-out`).
5. **450ms**: Input Shell container scales in (`scale: 0.98 to 1`, `opacity: 0 to 1`, duration `500ms cubic-bezier(.16, 1, .3, 1)`).
6. **600ms**: Suggestion chips below the input stagger in sequentially (`40ms` delay between each chip, `translateY: 8px to 0`, `opacity: 0 to 1`).

### 7.2 Ambient Background Motion
To ensure the hero feels "alive" even when static, background blur orbs utilize infinite continuous loops:
- **Orb 1**: `22s` animation cycle, drifting diagonally `+30px` X and `-20px` Y.
- **Orb 2**: `26s` animation cycle, drifting `-25px` X and `+15px` Y.
- **Hover Micro-interactions**: Every clickable element (nav links, chips, buttons) responds instantly within `150ms–200ms`, providing immediate tactile feedback.

---

## 8. Recreation Checklist for Frontend Engineers

Follow this precise chronological order to rebuild the Whacka Home / Hero section 1:1:

1. [ ] **Design Tokens & Environment Setup**:
   - Configure Tailwind CSS v4 custom properties in `:root` (`--bg: #F1EDE5`, `--ink: #16130E`, `--yellow: #F7C518`, etc.).
   - Load fonts: `Hanken Grotesk` (Google Fonts/local), `Geist Mono`, and `Pacifico`.
   - Set base HTML background color to `#F1EDE5` and text smoothing to antialiased.

2. [ ] **Navigation Bar Component**:
   - Build sticky header shell with `9999px` border radius, `rgba(251, 247, 242, 0.95)` background, and `backdrop-blur(8px)`.
   - Implement left logo mark + bold wordmark.
   - Build center navigation links with hover color transitions and chevron dropdown icons.
   - Implement right action area: "Sign in" text link and yellow "Start building" pill button with hover lift.
   - Add responsive media queries (`md:hidden` for links, mobile hamburger trigger + frosted overlay drawer).

3. [ ] **Hero Layout & Typography**:
   - Create centered hero flex container with radial wash background overlay.
   - Build top social proof pill badge with `#2E9C68` green pulsing indicator dot (`tpA-pulse` keyframes).
   - Render exact `clamp()` typography for `h-display` headline (`800` weight, `-0.025em` tracking) and subheading (`400` weight, `#57514A`).

4. [ ] **Hero Input Shell & Controls**:
   - Build white container (`#FFFFFF`) with `24px` border radius, `#EDE8DD` border, and multi-layered shadow.
   - Add focus-within state that darkens border to `#16130E` and expands shadow glow.
   - Implement textarea with rotating placeholder animation (fade-out/in cycle every `3.5s`).
   - Build bottom control bar with paperclip/mic icon buttons on the left and primary black "Build it" pill CTA on the right (including the yellow arrow badge that shifts right on hover).

5. [ ] **Suggestion Chips & AI Reasoning Component**:
   - Create wrapping flex container below input with `#EAE6DC` pill chips. Add click handlers to populate textarea.
   - Implement the `.tpA-thought` AI reasoning component with collapsible header, status pulse dot, elapsed timer, chevron rotation, and blinking caret (`tpA-blink`) for live execution demos.

6. [ ] **Animation Sequencing & Polish**:
   - Apply page-load staggering animation classes (`opacity-0` to `opacity-100`, translateY reveals from 0ms to 600ms).
   - Verify mobile responsiveness at `375px` viewport width (ensure proper padding reductions, font scaling, and touch target sizing $\ge 44px$).
