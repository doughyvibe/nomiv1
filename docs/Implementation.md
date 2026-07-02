# Nomi — Implementation Plan (Living Document)

> **Last Updated:** 2026-07-02
> **Current Phase:** Not Started
> **Current Task:** None
> **Overall Progress:** 0 / 38 tasks complete

---

## Rules of Engagement

1. **One task at a time.** Complete and verify before moving on.
2. **Update this document** after every completed task (mark ✅, add notes, update file manifest).
3. **At the start of any new conversation**, read this document AND `docs/whiteboard.md` first to understand current state.
4. **Do not skip tasks.** Each task builds on the previous. (Exception: tasks explicitly marked as parallelizable.)
5. **Do not add features** not in the PRD. If tempted, add to Backlog and move on.
6. **Keep it simple.** If a task feels over-engineered, simplify.
7. **Test after every task.** The app should run without errors at each checkpoint.
8. **Tasks marked 👤 MANUAL** require the human to do something (create accounts, paste keys, test on a real phone). The AI must write clear step-by-step instructions in `docs/whiteboard.md` under "YOUR MANUAL CHECK".
9. **Update `docs/whiteboard.md`** after each task: summary, manual checklist, suggested next step, new decisions.

---

## Tech Stack Reference

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS (vibe design tokens via CSS variables) |
| UI Components | shadcn/ui (dashboard only; storefront is custom-styled per vibe) |
| Auth | Supabase Auth (Google OAuth, sellers only) |
| Database | Supabase Postgres (with Row Level Security) |
| Image Storage | Supabase Storage |
| Transactional Email | Resend |
| PayNow QR | Self-generated EMVCo/SGQR payload + QR rendering library |
| Hosting | Vercel (wildcard subdomain support via Vercel DNS) |
| DNS | Vercel DNS for `nomi.store` + `*.nomi.store` |

> **Deviation from PRD:** PRD suggested Cloudflare Pages/Workers. We use Vercel because wildcard subdomains + Next.js middleware are dramatically simpler there for a first-time builder. See Decision Log in whiteboard.md.

---

## Multi-Tenant Routing Model (read before any task)

One single Next.js app serves all three surfaces, switched by hostname in `middleware.ts`:

| Hostname | Surface | Internal route group |
|---|---|---|
| `nomi.store` / `www` | Marketing site | `app/(marketing)` |
| `app.nomi.store` | Seller dashboard | `app/(dashboard)` |
| `{slug}.nomi.store` | Public storefront | `app/(storefront)/s/[slug]` (middleware rewrite) |

Local development uses `lvh.me` (resolves to 127.0.0.1): `app.lvh.me:3000`, `demo.lvh.me:3000`, etc.

---

## File Manifest

> Updated after each task to track what files exist and their purpose.

| File | Purpose | Created in Task |
|---|---|---|
| *(empty — will be populated as we build)* | | |

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ⬜ | Not started |
| 🔄 | In progress |
| ✅ | Complete |
| ⏭️ | Skipped (with reason) |
| 🐛 | Has known issue |
| 👤 | Requires manual human action |

---

---

## PHASE 1: Foundation & Multi-Tenant Shell

> **Goal:** App runs locally with hostname-based routing (marketing / dashboard / storefront), Supabase connected, Google login works, deployed to Vercel.

---

### Task 1.1 — Initialize Next.js + TypeScript Project ⬜

**What:** Create the Next.js project with TypeScript and App Router in the repo root.

**Steps:**
1. Scaffold Next.js (TypeScript, App Router, Tailwind, ESLint) into the current directory
2. Verify `npm run dev` works
3. Clean out default boilerplate
4. Initialize git repo with a sensible `.gitignore`

**Definition of Done:**
- `npm run dev` shows a blank page with no errors
- `npm run build` succeeds
- Git repo initialized with first commit

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 1.2 — Tailwind Base Setup + Vibe Token Architecture ⬜

**What:** Configure Tailwind with a CSS-variable-based token system so vibes can later swap palettes/fonts without touching component code.

**Steps:**
1. Define neutral base tokens for dashboard/marketing (clean, light, simple)
2. Define the token *structure* for storefront vibes (`--color-bg`, `--color-primary`, `--color-secondary`, surface, text tokens) — actual vibe values come later
3. Set up font loading strategy (Inter as base; vibe display fonts loaded per-storefront later)
4. Verify tokens work with a test element

**Definition of Done:**
- Tailwind utilities reference CSS variables for vibe-able colors
- A test page renders correctly with base tokens

**Files Changed:** *(to be filled)*

**Notes:** This token architecture is the backbone of the whole vibe system — worth getting right early.

---

### Task 1.3 — Install shadcn/ui (Dashboard Only) ⬜

**What:** Set up shadcn/ui for dashboard and marketing surfaces.

**Steps:**
1. Initialize shadcn/ui
2. Install starter components (Button, Input, Card, Dialog, Label, Select)
3. Verify a Button renders correctly

**Definition of Done:**
- shadcn components render with neutral dashboard styling
- No dependency conflicts

**Files Changed:** *(to be filled)*

**Notes:** Public storefront components will be custom-built with vibe tokens, NOT shadcn.

---

### Task 1.4 — Multi-Tenant Middleware & Route Groups ⬜

**What:** Implement hostname-based routing: marketing, dashboard, and storefront surfaces from one app.

**Steps:**
1. Create `middleware.ts` that reads the hostname and rewrites:
   - root domain → `(marketing)` routes
   - `app.` subdomain → `(dashboard)` routes
   - any other subdomain → `/s/[slug]` storefront routes
2. Create placeholder pages for each surface ("Marketing", "Dashboard", "Storefront for: {slug}")
3. Support `lvh.me` for local dev and configure env var for the root domain
4. Test all three hostnames locally

**Definition of Done:**
- `lvh.me:3000` shows marketing placeholder
- `app.lvh.me:3000` shows dashboard placeholder
- `demo.lvh.me:3000` shows "Storefront for: demo"

**Files Changed:** *(to be filled)*

**Notes:** This is the most architecturally important task in Phase 1.

---

### Task 1.5 — Supabase Project Setup 👤⬜

**What:** Create Supabase project and wire client/server SDK into the app. **Config only — no schema yet.**

**Steps:**
1. 👤 MANUAL: Human creates a Supabase project (instructions will be provided in whiteboard)
2. Install `@supabase/supabase-js` + `@supabase/ssr`
3. Create browser + server Supabase client helpers
4. Create `.env.local` + `.env.example` with required variables
5. Verify connection with a trivial query

**Definition of Done:**
- Supabase initializes without errors
- No credentials hardcoded
- `.env.example` documents all required variables

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 1.6 — Database Schema v1 + Row Level Security ⬜

**What:** Create the core Postgres schema with RLS enforcing tenant isolation from day one.

**Tables:**
- `stores` — owner_id, name, slug (unique), status (draft/published/unpublished/suspended/deleted), vibe, hero fields (jsonb), fulfillment settings (jsonb), paynow settings (jsonb)
- `products` — store_id, name, price_cents, description, image_url, category (nullable text), archived
- `orders` — store_id, reference (e.g. ORD-8F3K2), status, customer fields, fulfillment method/address/notes, subtotal/fee/total cents, payment_expires_at
- `order_items` — order_id, product snapshot (name, price, qty)
- `reserved_slugs` — seeded with reserved names from PRD §7

**Steps:**
1. Write SQL migration for all tables + indexes
2. Enable RLS: sellers can only read/write rows for stores they own
3. Public (anon) can read `stores` + `products` only when store is published
4. Orders: created via server-side logic only; sellers read only their store's orders
5. Seed `reserved_slugs`
6. Apply migration to Supabase

**Definition of Done:**
- All tables exist with RLS enabled
- A second test user cannot read another store's data
- Reserved slugs seeded

**Files Changed:** *(to be filled)*

**Notes:** Prices stored as integer cents to avoid floating-point money bugs.

---

### Task 1.7 — Google OAuth Seller Login 👤⬜

**What:** Implement Google sign-in for sellers on the dashboard surface.

**Steps:**
1. 👤 MANUAL: Human configures Google OAuth credentials in Google Cloud Console + Supabase dashboard (step-by-step instructions provided)
2. Build login page at dashboard surface (`/login`) with "Continue with Google"
3. Handle auth callback, session management
4. Protect all dashboard routes — redirect to `/login` if unauthenticated
5. Logout button

**Definition of Done:**
- Seller can sign in with Google and reach the (placeholder) dashboard
- Session persists across refresh
- Dashboard routes are inaccessible logged out
- Storefront + marketing remain public

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 1.8 — Deploy Baseline to Vercel + Wildcard Domain 👤⬜

**What:** Deploy to Vercel and configure `nomi.store`, `app.nomi.store`, and `*.nomi.store`.

**Steps:**
1. Verify `npm run build` succeeds
2. 👤 MANUAL: Human creates Vercel project, connects git repo, sets env vars (instructions provided)
3. 👤 MANUAL: Human points `nomi.store` nameservers to Vercel DNS and adds `nomi.store`, `app.nomi.store`, `*.nomi.store` domains
4. Update Supabase auth redirect URLs for production
5. Verify all three surfaces resolve on production

**Definition of Done:**
- `nomi.store`, `app.nomi.store`, and `anything.nomi.store` all load the correct surface
- Google login works in production

**Files Changed:** *(to be filled)*

**Notes:** If domain isn't purchased yet, this task can run on `*.vercel.app` preview + be finished later. Flag in whiteboard.

---

**🏁 Phase 1 Checkpoint:** Multi-tenant shell live on Vercel. Hostname routing works. Google login works. Database with RLS ready.

---

---

## PHASE 2: PayNow QR Feasibility Spike

> **Goal:** Prove the core USP — a self-generated dynamic PayNow QR with amount + reference that real Singapore banking apps accept. **Do this before building anything else on top of it.**

---

### Task 2.1 — PayNow QR Generation Utility + Test Page ⬜

**What:** Build the EMVCo/SGQR PayNow payload generator and render it as a QR code.

**Steps:**
1. Implement/adapt a PayNow EMVCo payload builder (mobile + UEN proxy types, amount, editable=false, reference number, merchant name, expiry optional)
2. Render payload as QR with a QR library (SVG/canvas)
3. Build a hidden internal test page (`/dev/paynow-test`) with inputs: phone/UEN, amount, reference → live QR
4. Add unit tests for the payload builder (CRC checksum, field formats)

**Definition of Done:**
- Test page generates a QR from arbitrary inputs
- Payload passes CRC validation
- Unit tests pass

**Files Changed:** *(to be filled)*

**Notes:** Check Context7/docs for an existing maintained PayNow payload library before writing from scratch.

---

### Task 2.2 — Real-World Banking App Validation 👤⬜

**What:** Human tests the generated QR against real Singapore banking apps.

**Steps (👤 MANUAL — full checklist will be in whiteboard):**
1. Generate QR with own phone number, small amount (e.g. S$0.50), reference `TEST-001`
2. Scan with DBS/POSB, PayLah, and at least one of OCBC/UOB
3. Verify: recipient prefilled, exact amount prefilled, reference visible
4. Test the same-phone flow: save QR image → open banking app → import from gallery → pay
5. Verify reference appears in transaction history
6. Report results

**Definition of Done:**
- At least DBS/POSB + PayLah accept the QR with correct amount and reference
- Same-phone saved-image flow confirmed working
- Findings recorded in whiteboard Decision Log

**Files Changed:** *(none — validation task)*

**Notes:** If this fails, we stop and rethink payment approach before continuing. This is the project's biggest risk.

---

**🏁 Phase 2 Checkpoint:** Dynamic PayNow QR proven to work with real banking apps. Core USP de-risked.

---

---

## PHASE 3: Seller Onboarding Flow

> **Goal:** A new seller can go from signup to a fully configured draft store: slug → vibe → hero → product → fulfillment → PayNow → publish.

---

### Task 3.1 — Onboarding Shell & Progress State ⬜

**What:** Build the 7-step onboarding wizard shell with progress persistence.

**Steps:**
1. On first login with no store, redirect seller into `/onboarding`
2. Step indicator UI (1–7), mobile-first
3. Persist progress on the store record (draft store created at step 1 completion)
4. Sellers resuming later land on their next incomplete step

**Definition of Done:**
- New seller lands in onboarding automatically
- Refresh/resume returns to correct step
- Dashboard is reachable only after onboarding completes (or via explicit skip once store exists)

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 3.2 — Step 1: Store Name + Slug Claim ⬜

**What:** Store name input with live slug suggestion, availability check, and claim.

**Steps:**
1. Name input auto-generates slug (lowercase, hyphens, strip invalid chars)
2. Editable slug field with live validation: format rules, length, reserved list, uniqueness (debounced server check)
3. Live preview: `{slug}.nomi.store` with ✓ Available / ✗ Taken states
4. Suggest alternatives when taken (e.g. `-sg`, `official` suffixes)
5. On continue: create draft store row owned by the seller

**Definition of Done:**
- All slug rules from PRD §7 enforced (server-side too, not just client)
- Reserved slugs blocked
- Draft store created with claimed slug

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 3.3 — Vibe System Core + Step 2: Vibe Selection ⬜

**What:** Build the vibe token infrastructure and the vibe picker (Industrial fully designed; other three with provisional tokens).

**Steps:**
1. Define vibe registry: each vibe = token set (colors, fonts, radii, surface treatments, motion prefs)
2. Implement **Industrial** tokens fully per PRD §10 (bg `8 14 19`, teal primary, rust secondary, Oswald display + Inter body, metal-panel/rust-edge surfaces)
3. Create provisional token sets for Unicorn, Outback, Futuristic (sensible first-pass values per PRD §9 directions; refined in Phase 7)
4. Build carousel-style vibe picker with mini phone-frame storefront previews per vibe
5. Save selected vibe to store

**Definition of Done:**
- Seller can swipe/scroll through 4 vibe previews and select one
- Industrial preview visibly matches JigWave direction
- Selection persists

**Files Changed:** *(to be filled)*

**Notes:** Industrial is the quality bar; the other three get a refinement pass in Phase 7.

---

### Task 3.4 — Step 3: Hero Designer ⬜

**What:** Hero content editor: eyebrow, title, subheading, CTA text, image upload, block reordering.

**Steps:**
1. Form fields: eyebrow (optional), title, subheading, CTA text
2. Image upload to Supabase Storage (client-side downscale/compress before upload)
3. Block reordering with move up/down buttons (no drag-and-drop in MVP)
4. Live mobile preview of the hero rendered in the selected vibe
5. Save hero config (jsonb) to store

**Definition of Done:**
- All hero fields editable with live vibe-styled preview
- Image uploads and displays
- Reordering works and persists

**Files Changed:** *(to be filled)*

**Notes:** Drag-and-drop parked in Backlog per PRD fallback guidance.

---

### Task 3.5 — Step 4: Add First Product ⬜

**What:** First product form: name, price, image, description, optional category.

**Steps:**
1. Form with validation (price format S$, image upload with compression)
2. Optional free-text category field
3. Save to `products`; then show "Product added — [Add another] [Continue setup]"
4. Allow adding multiple products before continuing

**Definition of Done:**
- Product saved with image
- Can add multiple products
- Can continue with just one product

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 3.6 — Step 5: Configure Fulfillment ⬜

**What:** Self-pickup and/or local delivery configuration.

**Steps:**
1. Checkboxes: self-pickup, local delivery (at least one required)
2. Pickup → pickup instructions (+ optional location)
3. Delivery → delivery fee (S$) + delivery instructions
4. Save to store fulfillment jsonb

**Definition of Done:**
- Seller can enable either or both with conditional fields
- Validation: at least one method, fee required if delivery enabled

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 3.7 — Step 6: Configure PayNow Payment ⬜

**What:** PayNow recipient setup: mobile or UEN, recipient display name.

**Steps:**
1. Radio: mobile number / UEN, with format validation (SG mobile: 8/9-prefixed 8 digits; UEN format check)
2. Recipient display name field
3. Optional additional payment instruction field
4. Manual-verification explainer copy per PRD §16 Step 6
5. Live preview of a sample payment QR using their details (reuses Phase 2 utility)

**Definition of Done:**
- Valid PayNow details saved
- Sample QR preview renders with their recipient details

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 3.8 — Step 7: Preview & Publish ⬜

**What:** Full storefront preview + pre-publish checklist + publish action.

**Steps:**
1. Render full buyer storefront preview (hero, catalog, vibe) in a phone frame or new tab
2. Pre-publish checklist (name ✓ slug ✓ vibe ✓ hero ✓ product ✓ fulfillment ✓ PayNow ✓)
3. Publish button → store status `published`
4. Success screen: live link, Copy Link, Open Store, Share on WhatsApp, Go to Dashboard

**Definition of Done:**
- Publish only enabled when checklist complete
- Store becomes publicly reachable at its subdomain after publish
- Success screen actions work

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

**🏁 Phase 3 Checkpoint:** A seller can complete the full onboarding and publish a live store at their subdomain.

---

---

## PHASE 4: Public Buyer Storefront (Industrial-First)

> **Goal:** A buyer can browse a published store, add to cart, check out, and reach the PayNow QR payment page. Built Industrial-first to JigWave quality.

---

### Task 4.1 — Storefront Data Loading + 404/Unavailable States ⬜

**What:** Resolve subdomain → published store, load storefront data, handle missing/unpublished stores.

**Steps:**
1. Server-side store lookup by slug (published only for public access)
2. Apply the store's vibe tokens to the storefront layout (CSS variables + font loading)
3. Clean 404 page for nonexistent stores
4. Clean "store unavailable" page for unpublished/suspended stores

**Definition of Done:**
- Published store loads with correct vibe at its subdomain
- Nonexistent slug → 404; unpublished → unavailable page

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 4.2 — Hero + Product Catalog + Category Pills ⬜

**What:** The main storefront page: hero-led catalog with automatic category filter pills.

**Steps:**
1. Render hero blocks in seller-defined order, vibe-styled (Industrial: dark hero treatment, Oswald display, fade-up motion)
2. CTA scroll-to-catalog behavior
3. Two-column product card grid (vibe-styled: metal-panel cards for Industrial, stagger entrance, tap scale feedback)
4. Category pills: hidden if ≤1 category; "All" + categories if ≥2; teal active pill for Industrial
5. Client-side category filtering

**Definition of Done:**
- Storefront matches JigWave reference quality for Industrial vibe
- Pills logic follows PRD §13 exactly
- Mobile-first, no hover-dependent UI

**Files Changed:** *(to be filled)*

**Notes:** This is the design showcase task — take the time to polish it.

---

### Task 4.3 — Product Detail Page ⬜

**What:** Vibe-styled product detail: image, description, price, quantity, add to cart.

**Steps:**
1. Route + page: large image, name, price, description, category badge
2. Quantity selector
3. Add to cart action with feedback
4. Back navigation to catalog

**Definition of Done:**
- Buyer can view details and add N items to cart
- Styled per vibe

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 4.4 — Cart + Bottom Navigation ⬜

**What:** Cart page (vibe-styled) and Shop/Cart bottom nav with badge.

**Steps:**
1. Cart state in localStorage, scoped per store slug
2. Bottom nav: Shop / Cart, item count badge, active state in vibe primary, safe-area aware
3. Cart page: line items, quantity +/-, remove, subtotal, checkout CTA
4. Empty cart state (vibe-styled)

**Definition of Done:**
- Cart persists across refresh, scoped to the store
- Quantities/removal update totals correctly
- Bottom nav works site-wide on storefront

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 4.5 — Standardized Checkout ⬜

**What:** Guest checkout form per PRD §19 with accurate totals.

**Steps:**
1. Order summary (items, qty, subtotal)
2. Fulfillment method selection (only methods the seller enabled); delivery adds fee to total
3. Fields: name, phone, email (required); delivery address (conditional); order notes (optional)
4. Validation (SG phone, email format)
5. On submit: server-side order creation — generate order reference (e.g. `ORD-8F3K2`), snapshot items/prices, compute totals server-side, set status `payment_pending`, set `payment_expires_at` = now + 10 min
6. Redirect to payment page for that order

**Definition of Done:**
- Order row + items created with server-computed totals
- Buyer lands on payment page
- No account required

**Files Changed:** *(to be filled)*

**Notes:** Totals must be computed server-side from DB prices — never trust client cart prices.

---

### Task 4.6 — Payment Page: Dynamic QR, Countdown, Save QR ⬜

**What:** The PayNow payment page per PRD §21–22.

**Steps:**
1. Order-scoped payment page (tokenized URL so buyer can return to it)
2. Show: order reference, amount due, dynamic PayNow QR (Phase 2 utility with seller's recipient + exact amount + reference)
3. 10-minute countdown from `payment_expires_at` ("Complete payment within 10 minutes" wording per PRD §24)
4. "Save QR Code" → downloads composed image (store name, amount, reference, QR, instruction) named `paynow-{REF}.png`
5. 3-step payment instructions + screenshot hint
6. Expired state: "Payment window expired…" message per PRD §24

**Definition of Done:**
- QR encodes correct recipient, amount, reference
- Save QR downloads a complete branded payment image
- Countdown + expiry states work

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 4.7 — Notify Seller Flow + Buyer Waiting State ⬜

**What:** "Notify seller to verify payment" with confirmation modal per PRD §23.

**Steps:**
1. Button: "Notify seller to verify payment" (never "I have paid")
2. Confirmation modal: amount + reference, warning copy, required checkbox ("I have completed payment…"), confirm button enabled only when checked
3. On confirm: order status → `seller_verification_requested` (email sending wired in Phase 5)
4. Waiting screen: "Seller notified. Your order is now waiting for seller verification…"

**Definition of Done:**
- Modal behaves exactly per PRD §23
- Status transition persists
- Buyer returning to order URL sees the waiting state

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

**🏁 Phase 4 Checkpoint:** Full buyer journey works end-to-end: browse → cart → checkout → QR payment page → notify seller. (Emails come next.)

---

---

## PHASE 5: Orders, Verification & Emails

> **Goal:** Seller receives email on verification request, manages orders in dashboard, marks paid; buyer gets confirmation email only after seller verifies.

---

### Task 5.1 — Resend Integration + Seller Notification Email 👤⬜

**What:** Wire up Resend and send the seller email when buyer requests verification.

**Steps:**
1. 👤 MANUAL: Human creates Resend account + API key, verifies sending domain (instructions provided)
2. Server-side email helper + templates
3. Seller email per PRD §26: store name, reference, customer details, items, total, fulfillment, status, manual-check warning, dashboard link
4. Trigger on `seller_verification_requested` transition

**Definition of Done:**
- Real email arrives on notify-seller action
- Copy matches PRD requirements ("Please check your bank/PayLah app before marking this order as paid.")

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 5.2 — Dashboard Orders List & Detail ⬜

**What:** Orders section in the seller dashboard.

**Steps:**
1. Orders list: reference, customer name, total, status badge, date; sorted newest first; filterable by status
2. Order detail: customer contact, items, fulfillment method/address, notes, payment status, reference
3. Empty state when no orders

**Definition of Done:**
- Seller sees only their own store's orders (RLS-verified)
- Detail shows everything needed to fulfill

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 5.3 — Order Status Actions + Buyer Confirmation Email ⬜

**What:** Seller marks orders paid/completed/cancelled; buyer confirmation email sends on paid.

**Steps:**
1. "Mark as paid" with confirmation dialog + warning: "Only mark as paid after checking your bank/PayLah app."
2. Status transitions: `seller_confirmed_paid`, `completed`, `cancelled` (valid transitions only, server-enforced)
3. On `seller_confirmed_paid`: send buyer confirmation email per PRD §26 (reference, store, summary, total, fulfillment details)
4. Expiry handling: orders past `payment_expires_at` still in `payment_pending` display as `expired`

**Definition of Done:**
- Full status lifecycle works from dashboard
- Buyer email sends only after seller marks paid — never before
- Buyer's order page reflects confirmed state

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

**🏁 Phase 5 Checkpoint:** The complete core loop works: order → QR → notify → seller email → mark paid → buyer confirmation email.

---

---

## PHASE 6: Dashboard Completion

> **Goal:** Seller can manage everything post-onboarding: products, storefront, fulfillment, payment settings, store link.

---

### Task 6.1 — Dashboard Home ⬜

**What:** Dashboard landing page with store status, link tools, and order summary.

**Steps:**
1. Store status badge + public link with Copy / Open buttons
2. Order summary counts (awaiting verification, paid, total)
3. Empty state with next-action suggestions per PRD §17
4. Dashboard navigation (Home, Orders, Products, Storefront, Settings) — mobile-friendly

**Definition of Done:**
- Seller lands on a useful home after login
- Copy link works; nav works on mobile

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 6.2 — Products Management (CRUD) ⬜

**What:** Full product management: list, add, edit, archive/delete, categories.

**Steps:**
1. Products list with image thumbnails, price, category
2. Add/edit forms (reuse onboarding product form)
3. Archive/delete with confirmation
4. Category edits reflect in storefront pills automatically

**Definition of Done:**
- Full CRUD works; storefront reflects changes immediately

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 6.3 — Storefront Editor (Vibe + Hero) ⬜

**What:** Post-onboarding editing of vibe and hero.

**Steps:**
1. Vibe switcher (reuse Task 3.3 picker)
2. Hero editor (reuse Task 3.4)
3. Preview button to open live/preview storefront

**Definition of Done:**
- Vibe and hero changes persist and reflect on the public store

**Files Changed:** *(to be filled)*

**Notes:** Should be mostly reuse; if it isn't, we over-built onboarding.

---

### Task 6.4 — Fulfillment + Payment Settings & Store Status ⬜

**What:** Settings pages for fulfillment, PayNow, and publish/unpublish.

**Steps:**
1. Fulfillment settings (reuse Task 3.6 form)
2. PayNow settings (reuse Task 3.7 form) + QR preview + manual verification explainer
3. Publish/unpublish toggle with confirmation

**Definition of Done:**
- All settings editable post-onboarding
- Unpublished store immediately shows unavailable page publicly

**Files Changed:** *(to be filled)*

**Notes:** Basic analytics (PRD §17) parked in Backlog for post-MVP.

---

**🏁 Phase 6 Checkpoint:** Sellers can fully self-manage their store from the dashboard.

---

---

## PHASE 7: Remaining Vibes + Marketing Site

> **Goal:** All four vibes are polished and the marketing homepage converts visitors to signups.

---

### Task 7.1 — Unicorn Vibe Polish ⬜

**What:** Refine Unicorn tokens to production quality: soft, dreamy, pastel, playful.

**Steps:**
1. Finalize palette, display font, surfaces, pill/button/card styling, motion
2. Verify every storefront screen (hero → confirmation) in Unicorn
3. Update vibe picker preview

**Definition of Done:**
- A Unicorn store looks professionally designed end-to-end, distinct from Industrial

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 7.2 — Outback Vibe Polish ⬜

**What:** Refine Outback tokens: earthy, warm, rugged, organic.

**Steps:** Same checklist as 7.1.

**Definition of Done:** Same bar as 7.1.

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 7.3 — Futuristic Vibe Polish ⬜

**What:** Refine Futuristic tokens: sleek, sharp, neon, digital.

**Steps:** Same checklist as 7.1.

**Definition of Done:** Same bar as 7.1.

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 7.4 — Marketing Homepage ⬜

**What:** Build `nomi.store` homepage per PRD §15.1.

**Steps:**
1. Hero: "Turn your bio into a PayNow-ready storefront." + "Create my store" CTA
2. How-it-works, benefits for social sellers, PayNow QR explanation, mobile storefront mockup
3. Secondary CTA: "View demo store" → link to a seeded demo storefront (e.g. `jigwave.nomi.store`)
4. Singapore-local positioning; simple pricing/value note (free to start)

**Definition of Done:**
- Homepage is polished, mobile-first, and CTAs route to signup / demo store

**Files Changed:** *(to be filled)*

**Notes:** Requires a seeded demo store — create one using our own product flows.

---

**🏁 Phase 7 Checkpoint:** All 4 vibes production-quality. Marketing site live with demo store.

---

---

## PHASE 8: Polish, Hardening & Launch

> **Goal:** The app handles edge cases gracefully, is secure, and is smoke-tested end-to-end in production.

---

### Task 8.1 — Loading, Error & Empty States Pass ⬜

**What:** Every async operation gets loading states; every failure gets a friendly message; every empty screen gets proper empty-state copy.

**Locations:** login, onboarding saves, image uploads, slug check, storefront load, cart/checkout, order creation, notify seller, dashboard lists, status actions, emails.

**Definition of Done:**
- No blank flashes, no raw errors in UI, buttons disabled while pending
- All empty states polished (vibe-styled on storefront, neutral on dashboard)

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 8.2 — Security & Tenant Isolation Review ⬜

**What:** Systematic review of RLS policies, server actions, and public endpoints.

**Steps:**
1. Verify every dashboard query is store-scoped; attempt cross-tenant access with a second test account
2. Verify unpublished stores are not orderable (server-side check at order creation)
3. Verify order pages are tokenized/unguessable
4. Verify totals/prices always computed server-side
5. Rate-limit sensitive endpoints (slug check, order creation) at a basic level

**Definition of Done:**
- Cross-tenant access attempts fail
- All PRD §33 data isolation criteria pass

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 8.3 — Mobile UX Polish Pass ⬜

**What:** Final mobile polish across all surfaces.

**Steps:**
1. Test all flows at mobile viewports (and 👤 on a real phone)
2. Touch targets, no horizontal scroll, safe areas, bottom nav overlap
3. Image loading performance (sizes, lazy loading)
4. Typography and spacing check per vibe

**Definition of Done:**
- Feels app-like on a real phone; no layout breakage on common sizes

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

### Task 8.4 — Final Deploy & Full Production Smoke Test 👤⬜

**What:** Production deploy and complete end-to-end walkthrough on live domain.

**Steps (👤 with provided checklist):**
1. Fresh seller signup → full onboarding → publish
2. Real phone: browse store → cart → checkout → save QR → (real S$0.50 payment) → notify seller
3. Verify seller email → mark paid → verify buyer email
4. Test 404, unavailable store, expired payment window
5. Fix anything found; re-verify

**Definition of Done:**
- Entire PRD §34 core loop works on production with a real payment
- No console errors; acceptance criteria in PRD §33 pass

**Files Changed:** *(to be filled)*

**Notes:** *(to be filled)*

---

**🏁 Phase 8 Checkpoint:** MVP is live, hardened, and proven end-to-end. Ready for first real sellers.

---

---

## Backlog / Parking Lot

> Features or ideas noted during development that are **NOT** in MVP scope. Do not build these.

| Idea | Reason Parked |
|---|---|
| Drag-and-drop hero reordering | PRD allows move up/down fallback; simpler for MVP |
| Basic analytics (views, revenue) | PRD-optional; core loop first |
| Rename "All" pill label | PRD marks as optional later |
| `expired_verification_requested` status | PRD optional future status |
| Email/password, Apple, magic link auth | PRD §31: Google OAuth only for MVP |
| Custom domains, PWA, native apps | PRD out of scope |
| Automatic payment verification | PRD out of scope |
| Order tab in buyer bottom nav | PRD optional later |

---

## Known Issues Log

| Issue | Found in Task | Status | Resolution |
|---|---|---|---|
| *(empty)* | | | |

---

## Change Log

| Date | Change | Reason |
|---|---|---|
| 2026-07-02 | Plan created | Initial creation based on PRD |
| 2026-07-02 | Vercel instead of Cloudflare Pages/Workers | Simpler wildcard subdomains + Next.js hosting for first-time builder |
| 2026-07-02 | PayNow spike moved to Phase 2 (before feature build) | De-risk core USP as early as possible |
| 2026-07-02 | Industrial vibe built first; other 3 refined in Phase 7 | Industrial has a full design reference (JigWave); quality bar |

---
