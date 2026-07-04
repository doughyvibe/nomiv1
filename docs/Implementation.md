# Nomi — Implementation Plan (Living Document)

> **Last Updated:** 2026-07-03
> **Current Phase:** Phase 8 — Polish, Hardening & Launch
> **Current Task:** Task 8.4 — Final Deploy & Full Production Smoke Test 👤 (next)
> **Overall Progress:** 41 / 42 tasks complete

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
| Seller Alerts | Web Push (PWA push notifications, VAPID) — optional per seller |
| Buyer Comms | Manual seller actions (WhatsApp deep link / `mailto:` draft / copy message) |
| Transactional Email | Resend — **Backlog / Optional Later** (not in MVP path; see Backlog) |
| PayNow QR | Self-generated EMVCo/SGQR payload + QR rendering library |
| Hosting | Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`) |
| DNS | Cloudflare DNS for `nomi.store`, `app.nomi.store`, `*.nomi.store` |

> **Deployment target:** Cloudflare Workers via the OpenNext adapter (`@opennextjs/cloudflare`), aligned with the PRD. This runs the Next.js app on the Cloudflare Workers Node.js runtime. Deploy with `opennextjs-cloudflare deploy` (Workers) — **never** Cloudflare Pages Git builds (they pin an old wrangler that miscompiles OpenNext workers). Custom domains + wildcard `*.nomi.store` are added as Worker Custom Domains / routes in the Cloudflare dashboard. See Decision Log in whiteboard.md.
>
> **Runtime note:** the middleware (`middleware.ts`) uses only Web-standard `NextRequest`/`NextResponse` APIs — no Node.js middleware features (unsupported by OpenNext), so it runs unchanged on Workers.

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
| `package.json` | Project scripts and dependencies (Next.js 16, React 19, Tailwind 4) | 1.1 |
| `next.config.ts` | Next.js configuration | 1.1 |
| `tsconfig.json` | TypeScript config with `@/*` path alias | 1.1 |
| `postcss.config.mjs` | PostCSS + Tailwind pipeline | 1.1 |
| `eslint.config.mjs` | ESLint config (Next.js defaults) | 1.1 |
| `app/layout.tsx` | Root layout, Nomi metadata | 1.1 |
| `app/page.tsx` | Minimal blank home page | 1.1 |
| `app/globals.css` | Tailwind import only | 1.1 |
| `lib/fonts.ts` | Inter + vibe display fonts (Oswald, Archivo Black, Syne, Bebas Neue) | 7.1–7.3 |
| `components.json` | shadcn/ui project config | 1.3 |
| `lib/utils.ts` | `cn()` helper for shadcn | 1.3 |
| `components/ui/button.tsx` | shadcn Button | 1.3 |
| `components/ui/input.tsx` | shadcn Input | 1.3 |
| `components/ui/card.tsx` | shadcn Card | 1.3 |
| `components/ui/dialog.tsx` | shadcn Dialog | 1.3 |
| `components/ui/label.tsx` | shadcn Label | 1.3 |
| `components/ui/select.tsx` | shadcn Select | 1.3 |
| `lib/host.ts` | Hostname → surface/slug resolver | 1.4 |
| `middleware.ts` | Rewrites by subdomain to route groups | 1.4 |
| `app/(marketing)/page.tsx` | Marketing homepage (renders `MarketingHome`) | 7.4 |
| `app/(marketing)/layout.tsx` | Marketing layout + page metadata | 7.4 |
| `components/marketing/marketing-home.tsx` | Landing page: pill nav, hero scene, marquee, feature panels, stats, FAQ, CTA band ("Warm Tactile" redesign 2026-07-04) | 7.4 |
| `components/marketing/paynow-qr-card.tsx` | Marketing mock of the dynamic PayNow QR payment card | UI overhaul |
| `components/marketing/reveal.tsx` | IntersectionObserver scroll-reveal wrapper (client) | UI overhaul |
| `lib/errors/friendly-db.ts` | Map Supabase errors to user-safe messages | 8.1 |
| `lib/errors/friendly-db.test.ts` | friendlyDbError unit tests | 8.1 |
| `lib/rate-limit.ts` | In-memory IP rate limiter for server actions | 8.2 |
| `app/(dashboard)/dashboard/loading.tsx` | Dashboard route loading skeleton | 8.1 |
| `app/(storefront)/s/[slug]/loading.tsx` | Storefront route loading skeleton | 8.1 |
| `app/(dashboard)/dashboard/page.tsx` | Dashboard home: store link, order summary | 6.1 |
| `app/(storefront)/s/[slug]/page.tsx` | Storefront placeholder | 1.4 |
| `lib/supabase/env.ts` | Env validation + `isSupabaseConfigured()` | 1.5 |
| `lib/supabase/client.ts` | Browser Supabase client | 1.5 |
| `lib/supabase/server.ts` | Server Supabase client (cookies) | 1.5 |
| `lib/supabase/middleware.ts` | Session refresh + auth user in middleware | 1.7 |
| `components/auth/google-sign-in-button.tsx` | Google OAuth sign-in (client) | 1.7 |
| `components/auth/sign-out-button.tsx` | Sign out (client) | 1.7 |
| `app/(dashboard)/login/page.tsx` | Seller login page | 1.7 |
| `app/auth/callback/route.ts` | OAuth PKCE code exchange | 1.7 |
| `open-next.config.ts` | OpenNext Cloudflare adapter config | 1.8 |
| `wrangler.jsonc` | Cloudflare Worker config (name, compat flags, assets) | 1.8 |
| `lib/paynow/build-payload.ts` | EMVCo PayNow payload builder (mobile + UEN) | 2.1 |
| `lib/paynow/crc16.ts` | CRC-16/CCITT-FALSE for EMVCo QR | 2.1 |
| `lib/paynow/tlv.ts` | TLV field formatter | 2.1 |
| `lib/paynow/validate-payload.ts` | CRC validation helper | 2.1 |
| `lib/paynow/build-payload.test.ts` | Unit tests (CRC, TLV, field formats) | 2.1 |
| `components/dev/paynow-test-form.tsx` | Internal PayNow QR test UI | 2.1 |
| `app/dev/paynow-test/page.tsx` | Hidden dev test page (`/dev/paynow-test`) | 2.1 |
| `lib/stores/types.ts` | Store/Product types + jsonb shapes + completeness checks | 3.1 |
| `lib/stores/progress.ts` | Derived onboarding step logic | 3.1 |
| `app/(dashboard)/dashboard/onboarding/page.tsx` | Onboarding server loader | 3.1 |
| `app/(dashboard)/dashboard/onboarding/actions.ts` | All onboarding server actions | 3.1–3.8 |
| `components/onboarding/wizard.tsx` | Wizard shell + step indicator | 3.1 |
| `lib/slug.ts` + `lib/slug.test.ts` | Slug rules (PRD §7) + tests | 3.2 |
| `components/onboarding/step-name-slug.tsx` | Step 1: name + slug claim | 3.2 |
| `lib/vibes.ts` | Vibe registry metadata | 3.3 |
| `components/storefront/mini-preview.tsx` | Phone-frame vibe preview | 3.3 |
| `components/onboarding/step-vibe.tsx` | Step 2: vibe carousel | 3.3 |
| `lib/images/compress.ts` | Client image compression + storage upload | 3.4 |
| `supabase/migrations/20260702120000_storage_store_images.sql` | store-images bucket + RLS | 3.4 |
| `components/onboarding/step-hero.tsx` | Step 3: hero designer | 3.4 |
| `components/onboarding/step-product.tsx` | Step 4: first product | 3.5 |
| `components/onboarding/step-fulfillment.tsx` | Step 5: fulfillment | 3.6 |
| `lib/paynow/validate-input.ts` | SG mobile / UEN validation | 3.7 |
| `components/onboarding/step-paynow.tsx` | Step 6: PayNow setup | 3.7 |
| `components/onboarding/step-publish.tsx` | Step 7: checklist + publish + success | 3.8 |
| `lib/stores/load-storefront.ts` | Storefront gate + published store loader | 4.1 |
| `app/(storefront)/s/[slug]/layout.tsx` | Slug layout: gate, vibe, context | 4.1 |
| `app/(storefront)/s/[slug]/not-found.tsx` | Buyer 404 page | 4.1 |
| `components/storefront/store-unavailable.tsx` | Unpublished store page | 4.1 |
| `components/storefront/storefront-context.tsx` | Store + products React context | 4.1 |
| `supabase/migrations/20260703120000_storefront_slug_resolver.sql` | RPC for slug gate | 4.1 |
| `components/storefront/storefront-hero.tsx` | Hero blocks in seller order, fade-up motion | 4.2 |
| `components/storefront/product-card.tsx` | Vibe-styled product card | 4.2 |
| `components/storefront/product-catalog.tsx` | Category pills + client filter | 4.2 |
| `app/(storefront)/s/[slug]/product/[id]/page.tsx` | Product detail route | 4.3 |
| `components/storefront/product-detail.tsx` | Product detail UI + add to cart | 4.3 |
| `lib/cart/types.ts` + `lib/cart/storage.ts` | localStorage cart per slug | 4.4 |
| `components/storefront/cart-context.tsx` | Cart React context | 4.4 |
| `components/storefront/bottom-nav.tsx` | Shop/Cart bottom nav + badge | 4.4 |
| `components/storefront/storefront-shell.tsx` | Cart provider + nav wrapper | 4.4 |
| `components/storefront/cart-page.tsx` | Cart page UI | 4.4 |
| `app/(storefront)/s/[slug]/cart/page.tsx` | Cart route | 4.4 |
| `lib/money.ts` | `formatPrice()` helper | 4.4 |
| `lib/supabase/admin.ts` | Service-role client for order writes | 4.5 |
| `lib/validation/customer.ts` | SG phone + email validation | 4.5 |
| `lib/orders/reference.ts` | Order reference generator | 4.5 |
| `app/(storefront)/s/[slug]/checkout/page.tsx` | Checkout route | 4.5 |
| `components/storefront/checkout-form.tsx` | Guest checkout form | 4.5 |
| `app/(storefront)/s/[slug]/actions.ts` | `createOrderAction` + `notifySellerAction` | 4.5–4.7 |
| `lib/orders/load-order.ts` | Load order by reference (admin) | 4.6 |
| `lib/paynow/format-expiry.ts` | PayNow QR expiry formatter | 4.6 |
| `lib/paynow/download-qr-image.ts` | Save QR PNG (canvas compose) | 4.6 |
| `app/(storefront)/s/[slug]/order/[reference]/page.tsx` | Payment page route | 4.6 |
| `components/storefront/payment-page.tsx` | QR, countdown, save, notify modal, waiting | 4.6–4.7 |
| `lib/orders/types.ts` | Shared order + order_item types | 5.1 |
| `lib/orders/status.ts` | Display status labels + filter options | 5.1 |
| `lib/orders/contact-buyer.ts` | WhatsApp/mailto/copy helpers | 5.1 |
| `lib/orders/contact-buyer.test.ts` | Contact helper unit tests | 5.1 |
| `lib/orders/load-seller-orders.ts` | RLS-scoped seller order queries | 5.1 |
| `lib/stores/require-seller.ts` | Auth + onboarding guard for dashboard | 5.1 |
| `app/(dashboard)/dashboard/layout.tsx` | Dashboard nav + pending badge | 5.1 |
| `app/(dashboard)/dashboard/orders/page.tsx` | Orders list route | 5.1 |
| `app/(dashboard)/dashboard/orders/[reference]/page.tsx` | Order detail route | 5.1 |
| `components/dashboard/dashboard-nav.tsx` | Home/Orders/Products/Storefront/Settings nav + badge | 6.1 |
| `components/dashboard/orders-list.tsx` | Orders list UI + empty state | 5.1 |
| `components/dashboard/orders-status-filter.tsx` | Status filter pills | 5.1 |
| `components/dashboard/order-status-badge.tsx` | Status badge component | 5.1 |
| `components/dashboard/contact-buyer-actions.tsx` | Contact buyer action buttons | 5.1 |
| `components/storefront/order-receipt.tsx` | Buyer order summary/receipt block | 5.2 |
| `components/storefront/order-status-page.tsx` | All buyer order status states | 5.2 |
| `lib/orders/status.test.ts` | `buyerOrderView` unit tests | 5.2 |
| `supabase/migrations/20260703180000_push_subscriptions.sql` | Push subscription storage + RLS | 5.3 |
| `public/push-sw.js` | Service worker (push + notification click) | 5.3 |
| `public/manifest.webmanifest` | Dashboard PWA manifest | 5.3 |
| `lib/push/vapid.ts` | VAPID public key helper | 5.3 |
| `lib/push/client.ts` | Browser push subscribe/unsubscribe | 5.3 |
| `lib/push/subscriptions.ts` | List subscriptions (server) | 5.3 |
| `app/(dashboard)/dashboard/settings/page.tsx` | Settings: status, fulfillment, PayNow, push | 6.4 |
| `app/(dashboard)/dashboard/settings/actions.ts` | Save/remove subscription actions | 5.3 |
| `components/dashboard/push-alerts-settings.tsx` | Opt-in UI | 5.3 |
| `lib/orders/order-summary.ts` | Order count queries (awaiting, paid, total) | 6.1 |
| `components/dashboard/dashboard-home.tsx` | Dashboard home: store link, order summary, empty state | 6.1 |
| `components/dashboard/store-status-badge.tsx` | Published/draft/unpublished badge | 6.1 |
| `components/dashboard/copy-store-link-button.tsx` | Copy storefront URL to clipboard | 6.1 |
| `app/(dashboard)/dashboard/products/page.tsx` | Products list + archived toggle | 6.2 |
| `app/(dashboard)/dashboard/storefront/page.tsx` | Storefront editor route | 6.3 |
| `lib/products/validate.ts` + `.test.ts` | Product input validation + price parse | 6.2 |
| `app/(dashboard)/dashboard/products/actions.ts` | Add, update, archive product server actions | 6.2 |
| `components/dashboard/product-form.tsx` | Shared product form (onboarding + dashboard) | 6.2 |
| `components/dashboard/products-list.tsx` | Products list with thumbnails | 6.2 |
| `components/dashboard/new-product-form.tsx` | Add product client wrapper | 6.2 |
| `components/dashboard/edit-product-form.tsx` | Edit product client wrapper | 6.2 |
| `components/dashboard/archive-product-button.tsx` | Archive confirmation dialog | 6.2 |
| `app/(dashboard)/dashboard/products/new/page.tsx` | Add product route | 6.2 |
| `app/(dashboard)/dashboard/products/[id]/edit/page.tsx` | Edit/archive product route | 6.2 |
| `lib/clipboard/copy-text.ts` | Clipboard with HTTP dev fallback | 6.1 fix |
| `lib/stores/revalidate.ts` | Storefront path revalidation helper | 6.3 |
| `app/(dashboard)/dashboard/storefront/actions.ts` | Save vibe/hero + revalidate | 6.3 |
| `components/dashboard/vibe-picker.tsx` | Vibe carousel (onboarding + dashboard) | 6.3 |
| `components/dashboard/hero-editor.tsx` | Hero form + live preview | 6.3 |
| `components/dashboard/storefront-editor.tsx` | Storefront settings shell | 6.3 |
| `app/(dashboard)/dashboard/storefront/page.tsx` | Storefront editor route | 6.3 |
| `components/dashboard/fulfillment-form.tsx` | Fulfillment settings form | 6.4 |
| `components/dashboard/paynow-form.tsx` | PayNow settings + sample QR | 6.4 |
| `components/dashboard/store-status-settings.tsx` | Publish/unpublish toggle | 6.4 |
| `lib/stores/publish-readiness.ts` | Publish checklist helper | 6.4 |
| `app/(dashboard)/dashboard/settings/actions.ts` | Fulfillment, PayNow, publish, push actions | 6.4 |

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

> **Goal:** App runs locally with hostname-based routing (marketing / dashboard / storefront), Supabase connected, Google login works, deployed to Cloudflare Workers (OpenNext).

---

### Task 1.1 — Initialize Next.js + TypeScript Project ✅

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

**Files Changed:**
- `package.json`, `package-lock.json` — Next.js 16.2.10, React 19, Tailwind CSS 4, TypeScript, ESLint
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs` — scaffold config
- `app/layout.tsx` — stripped Geist fonts; Nomi metadata
- `app/page.tsx` — minimal blank `<main>`
- `app/globals.css` — Tailwind import only
- `.gitignore` — from create-next-app (covers node_modules, .next, .env*)
- Removed default `public/*.svg` boilerplate assets

**Notes:** Git initialized by create-next-app (`Initial commit from Create Next App`). Boilerplate cleanup committed separately. Build and dev both pass. Harmless Turbopack warning about a parent-directory lockfile at `/Users/therealdoughy/package-lock.json` — not blocking; can silence later with `turbopack.root` in next.config if needed.

---

### Task 1.2 — Tailwind Base Setup + Vibe Token Architecture ✅

**What:** Configure Tailwind with a CSS-variable-based token system so vibes can later swap palettes/fonts without touching component code.

**Steps:**
1. Define neutral base tokens for dashboard/marketing (clean, light, simple)
2. Define the token *structure* for storefront vibes (`--color-bg`, `--color-primary`, `--color-secondary`, surface, text tokens) — actual vibe values come later
3. Set up font loading strategy (Inter as base; vibe display fonts loaded per-storefront later)
4. Verify tokens work with a test element

**Definition of Done:**
- Tailwind utilities reference CSS variables for vibe-able colors
- A test page renders correctly with base tokens

**Files Changed:**
- `styles/tokens.css` — platform tokens on `:root`; storefront vibe structure on `[data-surface="storefront"]`; industrial placeholder values for dev
- `app/globals.css` — `@theme inline` maps tokens to Tailwind utilities (`bg-dashboard-*`, `bg-bg`, `bg-primary`, etc.)
- `lib/fonts.ts` — Inter via `next/font/google` as `--font-inter`
- `app/layout.tsx` — applies Inter variable; `font-body` on body
- `app/page.tsx` — temporary token test page (platform swatches + industrial storefront scope)

**Notes:** Storefront colors inherit from the nearest `[data-surface="storefront"]` wrapper, so vibes swap by changing `data-vibe` + CSS var values — no component edits needed. Display fonts (e.g. Oswald for Industrial) deferred to Phase 3 per-storefront loading. Token test page stays until Task 1.4 splits route groups.

---

### Task 1.3 — Install shadcn/ui (Dashboard Only) ✅

**What:** Set up shadcn/ui for dashboard and marketing surfaces.

**Steps:**
1. Initialize shadcn/ui
2. Install starter components (Button, Input, Card, Dialog, Label, Select)
3. Verify a Button renders correctly

**Definition of Done:**
- shadcn components render with neutral dashboard styling
- No dependency conflicts

**Files Changed:**
- `components.json` — shadcn config (base-nova style, CSS variables)
- `lib/utils.ts` — `cn()` helper
- `components/ui/{button,input,card,dialog,label,select}.tsx` — starter components
- `app/globals.css` — merged shadcn theme vars + tw-animate-css; kept Nomi vibe tokens
- `package.json` — added `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `shadcn`, `tw-animate-css`
- `app/layout.tsx` — kept Inter only (removed shadcn-init Geist font)

**Notes:** shadcn CSS vars (`--background`, `--primary`, etc.) are separate from storefront vibe tokens (`--color-bg`, etc.) — no conflict. Dashboard page (Task 1.4) verifies Button + Card render.

---

### Task 1.4 — Multi-Tenant Middleware & Route Groups ✅

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

**Files Changed:**
- `middleware.ts` — rewrites `app.*` → `/dashboard/*`, `{slug}.*` → `/s/{slug}/*`
- `lib/host.ts` — `resolveSurface()` parses host against `NEXT_PUBLIC_ROOT_DOMAIN` (default `lvh.me`)
- `app/(marketing)/{layout,page}.tsx` — marketing placeholder at `/`
- `app/(dashboard)/{layout,dashboard/page}.tsx` — dashboard with shadcn Card + Button
- `app/(storefront)/{layout,s/[slug]/page}.tsx` — vibe-scoped storefront placeholder
- `.env.example` — documents `NEXT_PUBLIC_ROOT_DOMAIN`
- Removed `app/page.tsx` (token test page; replaced by surface-specific pages)

**Notes:** Verified via curl with `Host` headers — all three surfaces resolve correctly. `localhost:3000` falls back to marketing. Next.js 16 logs a deprecation notice for `middleware.ts` in favor of `proxy` — ignored for now; middleware works. Use `lvh.me` URLs in browser for manual check (not `localhost`).

---

### Task 1.5 — Supabase Project Setup 👤 ✅

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

**Files Changed:**
- `package.json` — added `@supabase/supabase-js`, `@supabase/ssr`
- `lib/supabase/env.ts` — `getSupabaseEnv()`, `isSupabaseConfigured()`
- `lib/supabase/client.ts` — `createBrowserClient` for client components
- `lib/supabase/server.ts` — `createServerClient` with Next.js cookies
- `app/api/health/supabase/route.ts` — GET returns `{ ok: true, connected: true }` when configured
- `.env.example` — added `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Notes:** Code side complete. Human must create Supabase project + paste keys into `.env.local` (see whiteboard). Health check uses `auth.getSession()` as a no-schema connectivity probe. Session cookie refresh in middleware deferred to Task 1.7. Without `.env.local`, `/api/health/supabase` returns 503 with a clear message — verified at build time.

---

### Task 1.6 — Database Schema v1 + Row Level Security 👤 ✅

**What:** Create the core Postgres schema with RLS enforcing tenant isolation from day one.

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

**Files Changed:**
- `supabase/migrations/20260702100000_initial_schema.sql` — enums, 5 tables, indexes, `updated_at` triggers, 25 reserved slugs, RLS policies
- `app/api/health/supabase/route.ts` — extended to verify schema (`reserved_slugs` count)

**Notes:** Migration must be applied manually via Supabase SQL Editor (see whiteboard). Orders/order_items have no public INSERT policies — buyer checkout will use secret key server-side in Phase 4. Cross-tenant isolation test deferred to manual check after migration + second auth user in Task 1.7. Prices stored as integer cents.

---

### Task 1.7 — Google OAuth Seller Login 👤 ✅

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

**Files Changed:**
- `middleware.ts` — dashboard auth gate + session cookie refresh; `/login` and `/auth/*` public
- `lib/supabase/middleware.ts` — `getMiddlewareUser()`, `isPublicDashboardPath()`
- `app/(dashboard)/login/page.tsx` — login UI with Google button
- `app/auth/callback/route.ts` — PKCE `exchangeCodeForSession`, redirect to dashboard
- `components/auth/google-sign-in-button.tsx` — `signInWithOAuth({ provider: 'google' })`
- `components/auth/sign-out-button.tsx` — sign out + redirect to `/login`
- `app/(dashboard)/dashboard/page.tsx` — shows signed-in email + sign out

**Notes:** OAuth only on dashboard surface (`app.lvh.me/login`). Marketing + storefront unchanged. Human must configure Google Cloud + Supabase Auth (see whiteboard) before sign-in works. Redirect URL: `http://app.lvh.me:3000/auth/callback`.

---

### Task 1.8 — Deploy Baseline to Cloudflare Workers (OpenNext) + Wildcard Domain 👤 ✅

**What:** Add the OpenNext-for-Cloudflare adapter, deploy the app to Cloudflare Workers, and serve production hostnames (`nomi.store`, `app.nomi.store`, `*.nomi.store` — or whatever domain is chosen at launch).

**Why OpenNext + Workers (not Pages):** OpenNext runs the full Next.js app (App Router, middleware, RSC, SSR) on the Cloudflare Workers Node.js runtime. Next.js 16 is supported. **Deploy via Workers only** (`opennextjs-cloudflare deploy` / Workers Builds) — Cloudflare Pages Git builds pin an outdated wrangler that miscompiles OpenNext workers into boot-time 500s.

**Steps (agent — scaffold):** ✅ Part A complete
1. ✅ `npm i -D @opennextjs/cloudflare wrangler` (wrangler 4.106.0).
2. ✅ Add `open-next.config.ts`: `defineCloudflareConfig()`.
3. ✅ Add `wrangler.jsonc` (`name: "nomi"`, `compatibility_date: "2026-07-02"`, `nodejs_compat`, assets + self-reference service).
4. ✅ `next.config.ts`: `initOpenNextCloudflareForDev()` (keeps `allowedDevOrigins` + `turbopack.root`).
5. ✅ `package.json` scripts: `preview`, `deploy`, `upload`, `cf-typegen`.
6. ✅ `.gitignore`: `.open-next/`, `.wrangler/`.
7. ✅ Verified `npm run build` + `opennextjs-cloudflare build` + local preview (`http://localhost:8787` → 200 on `/` and `/api/health/supabase`).

**Steps (human — 👤 MANUAL, see whiteboard):**
8. Create a Cloudflare account; `npx wrangler login`.
9. `npm run deploy` (or connect the GitHub repo as a Cloudflare **Workers** build — not Pages).
10. Set production env as Worker vars: `NEXT_PUBLIC_ROOT_DOMAIN=<your-domain>`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. **Domain can be chosen later** — defer until pre-launch (see Notes).
11. When domain is purchased: add zone in Cloudflare DNS; attach Worker Custom Domains for apex, `app.`, and `*.` wildcard.
12. Add Supabase production auth URLs for `https://app.<your-domain>/auth/callback` (keep local lvh.me URLs for dev).
13. Verify all three surfaces + Google login in production.

**Definition of Done:**
- Worker deploys successfully to Cloudflare (smoke test on `*.workers.dev` OK before custom domain)
- When domain is attached: apex, `app.`, and `*.` subdomains load the correct surface
- Google login works in production
- `/api/health/supabase` returns `"schema":true`

**Files Changed:**
- `open-next.config.ts`, `wrangler.jsonc` (new)
- `next.config.ts` (add `initOpenNextCloudflareForDev`)
- `package.json` (preview/deploy/upload/cf-typegen scripts; `@opennextjs/cloudflare`, `wrangler` devDeps)
- `.gitignore`, `.env.example`, `package-lock.json`

**Notes:** No Next.js app/route code changes — multi-tenant routing stays env-driven via `NEXT_PUBLIC_ROOT_DOMAIN`. **Domain purchase is not blocking:** keep building locally on `lvh.me`; deploy to `*.workers.dev` anytime for a deploy smoke test (single host → marketing only). Buy + attach a custom domain with wildcard only when ready to go live. `nomi.store` in docs is a working placeholder, not a locked-in choice — any domain works; set `NEXT_PUBLIC_ROOT_DOMAIN` to match.

---

**🏁 Phase 1 Checkpoint:** Multi-tenant shell live on Cloudflare Workers (OpenNext). Hostname routing works. Google login works. Database with RLS ready.

---

---

## PHASE 2: PayNow QR Feasibility Spike

> **Goal:** Prove the core USP — a self-generated dynamic PayNow QR with amount + reference that real Singapore banking apps accept. **Do this before building anything else on top of it.**

---

### Task 2.1 — PayNow QR Generation Utility + Test Page ✅

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

**Files Changed:**
- `lib/paynow/` — payload builder, CRC, TLV helpers, validation, unit tests
- `components/dev/paynow-test-form.tsx`, `app/dev/paynow-test/page.tsx`
- `middleware.ts` — block `/dev/*` in production
- `package.json` — `react-qr-code`, `tsx`, `test:paynow` script

**Notes:** Implemented from scratch (no external PayNow lib — Context7 had no maintained npm match; algorithm aligned with EMVCo SGQR spec). Checked against sgqr-code CRC approach during dev. Test page at **http://lvh.me:3000/dev/paynow-test** (404 in production). Run `npm run test:paynow` for unit tests.

---

### Task 2.2 — Real-World Banking App Validation 👤 ✅

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

**Notes:** Human confirmed `task 2.2 ✅` (2026-07-02). Dynamic PayNow QR accepted by real banking apps — core USP de-risked. Proceed to Phase 3.

---

**🏁 Phase 2 Checkpoint:** Dynamic PayNow QR proven to work with real banking apps. Core USP de-risked.

---

---

## PHASE 3: Seller Onboarding Flow

> **Goal:** A new seller can go from signup to a fully configured draft store: slug → vibe → hero → product → fulfillment → PayNow → publish.

---

### Task 3.1 — Onboarding Shell & Progress State ✅

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

**Files Changed:**
- `lib/stores/types.ts` — Store/Product types + hero/fulfillment/paynow jsonb shapes + completeness checks
- `lib/stores/progress.ts` — `deriveOnboardingStep()` + step registry
- `app/(dashboard)/dashboard/onboarding/page.tsx` — server loader (store + products → derived step)
- `components/onboarding/wizard.tsx` — client shell, tappable step indicator, back-nav to completed steps
- `app/(dashboard)/dashboard/page.tsx` — redirects to `/onboarding` until onboarding is done; shows store card after

**Notes:** Progress is **derived from data**, not a stored step counter — no schema change needed and resume is correct by construction (no vibe → step 2, no hero title → step 3, no products → step 4, etc.). Completed steps can be revisited via the step indicator; the server-derived step is authority after each save (`router.refresh()`).

---

### Task 3.2 — Step 1: Store Name + Slug Claim ✅

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

**Files Changed:**
- `lib/slug.ts` — `slugify()`, `validateSlugFormat()` (PRD §7 rules), `suggestAlternatives()`
- `lib/slug.test.ts` — unit tests (run with `npx tsx --test lib/slug.test.ts`)
- `app/(dashboard)/dashboard/onboarding/actions.ts` — `checkSlugAvailability` (format + reserved + uniqueness) and `createStore` server actions
- `components/onboarding/step-name-slug.tsx` — name → auto-slug, debounced availability, ✓/✗ states, taken-slug suggestion chips

**Notes:** Validation runs three times: client format check (instant), debounced server availability check, and again inside `createStore` before insert. A unique-violation on insert (slug race) maps to "Already taken". Suggestions follow PRD §7 examples (`-sg`, `official`, year).

---

### Task 3.3 — Vibe System Core + Step 2: Vibe Selection ✅

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

**Files Changed:**
- `lib/vibes.ts` — vibe registry (name, tagline, suitable-for, swatches, provisional flag)
- `styles/tokens.css` — full Industrial tokens per PRD §10 (bg `8 14 19`, teal `45 212 191`, rust `168 106 58`, `metal-panel` + `rust-edge` surface classes, Oswald display) + provisional Unicorn/Outback/Futuristic token sets; vibe vars scoped to `[data-vibe]`
- `lib/fonts.ts`, `app/layout.tsx` — Oswald display font loaded via `next/font`
- `components/storefront/mini-preview.tsx` — phone-frame storefront preview (hero + category pills + product grid) rendered with real vibe tokens
- `components/onboarding/step-vibe.tsx` — snap-scroll carousel with JigWave sample data, "Use this vibe" CTA

**Notes:** Industrial is the quality bar; the other three get a refinement pass in Phase 7. `[data-vibe]` attribute drives tokens so the same `MiniPreview` renders all four vibes — it's reused by the hero designer (live preview) and publish step (real data).

---

### Task 3.4 — Step 3: Hero Designer 👤 ✅

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

**Files Changed:**
- `components/onboarding/step-hero.tsx` — fields, image upload, ↑/↓ block reordering, live `MiniPreview`
- `lib/images/compress.ts` — canvas-based client downscale (max 1600px, webp q0.82) + `uploadStoreImage()` to Supabase Storage
- `supabase/migrations/20260702120000_storage_store_images.sql` — `store-images` public bucket (5 MB cap) + per-user-folder RLS policies **(👤 must be applied in SQL Editor)**
- `app/(dashboard)/dashboard/onboarding/actions.ts` — `saveHero` (validates title + block order server-side)

**Notes:** Drag-and-drop parked in Backlog per PRD fallback guidance. Uploads go to `store-images/{user_id}/hero-*.webp`; RLS restricts writes to the owner's folder, reads are public (storefront content).

---

### Task 3.5 — Step 4: Add First Product ✅

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

**Files Changed:**
- `components/onboarding/step-product.tsx` — form (name, S$ price, image, description, optional category), "Product added — Add another / Continue setup" flow, list of added products
- `app/(dashboard)/dashboard/onboarding/actions.ts` — `addProduct` (server-side name/price validation, price stored as integer cents)

**Notes:** Prices entered in dollars, stored as `price_cents` (matches schema). Image upload reuses the Task 3.4 compression + storage path (`product-*.webp`). Category free-text feeds the storefront filter pills later.

---

### Task 3.6 — Step 5: Configure Fulfillment ✅

**What:** Self-pickup and/or local delivery configuration.

**Steps:**
1. Checkboxes: self-pickup, local delivery (at least one required)
2. Pickup → pickup instructions (+ optional location)
3. Delivery → delivery fee (S$) + delivery instructions
4. Save to store fulfillment jsonb

**Definition of Done:**
- Seller can enable either or both with conditional fields
- Validation: at least one method, fee required if delivery enabled

**Files Changed:**
- `components/onboarding/step-fulfillment.tsx` — pickup/delivery checkboxes with conditional fields per PRD §16 Step 5
- `app/(dashboard)/dashboard/onboarding/actions.ts` — `saveFulfillment` (server re-validates "at least one method complete")
- `lib/stores/types.ts` — `FulfillmentConfig` jsonb shape + `fulfillmentIsComplete()`

**Notes:** Delivery fee stored as integer cents in the store's `fulfillment` jsonb — checkout (Phase 4) adds it to the PayNow total.

---

### Task 3.7 — Step 6: Configure PayNow Payment ✅

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

**Files Changed:**
- `lib/paynow/validate-input.ts` — `isValidSgMobile` (8/9-prefixed 8 digits) + `isValidUen` (3 UEN formats); exported from `lib/paynow`
- `components/onboarding/step-paynow.tsx` — mobile/UEN radio, live format validation, manual-verification explainer, live sample QR (S$23.00 / SAMPLE-001) via Phase 2 `buildPayNowPayload`
- `app/(dashboard)/dashboard/onboarding/actions.ts` — `savePayNow` (server re-validates mobile/UEN format)

**Notes:** Sample QR uses the seller's real proxy so they can scan it themselves to sanity-check recipient before publishing — same code path the buyer payment page will use in Phase 4.

---

### Task 3.8 — Step 7: Preview & Publish ✅

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

**Files Changed:**
- `components/onboarding/step-publish.tsx` — 7-item pre-publish checklist, phone-frame preview with real store data, publish action, success screen (Copy Link / Open Store / Share on WhatsApp / Go to Dashboard)
- `app/(dashboard)/dashboard/onboarding/actions.ts` — `publishStore` (server re-checks all completeness gates before setting `status='published'`)
- `lib/host.ts` — `getStorefrontUrl(slug)` helper

**Notes:** Publish is gated client-side (checklist) **and** server-side (`publishStore` re-verifies). After publish, RLS `stores_public_read_published` makes the store publicly readable; the subdomain currently serves the Phase 1 placeholder — the real buyer storefront is Task 4.1/4.2. "Add to Instagram Bio" from PRD copy omitted (no deep-link exists; Copy Link covers it).

---

**🏁 Phase 3 Checkpoint:** A seller can complete the full onboarding and publish a live store at their subdomain. ✅ Verified 2026-07-03.

---

---

## PHASE 4: Public Buyer Storefront (Industrial-First)

> **Goal:** A buyer can browse a published store, add to cart, check out, and reach the PayNow QR payment page. Built Industrial-first to JigWave quality.

---

### Task 4.1 — Storefront Data Loading + 404/Unavailable States ✅

**What:** Resolve subdomain → published store, load storefront data, handle missing/unpublished stores.

**Steps:**
1. Server-side store lookup by slug (published only for public access)
2. Apply the store's vibe tokens to the storefront layout (CSS variables + font loading)
3. Clean 404 page for nonexistent stores
4. Clean "store unavailable" page for unpublished/suspended stores

**Definition of Done:**
- Published store loads with correct vibe at its subdomain
- Nonexistent slug → 404; unpublished → unavailable page

**Files Changed:**
- `supabase/migrations/20260703120000_storefront_slug_resolver.sql` — `resolve_storefront_slug()` RPC (SECURITY DEFINER) to distinguish not_found vs unavailable despite RLS **(👤 apply in SQL Editor)**
- `lib/stores/load-storefront.ts` — `resolveStorefrontGate()` + `getPublishedStorefront()` (React `cache` dedupes layout + page)
- `app/(storefront)/s/[slug]/layout.tsx` — gate check, `data-vibe` from store, `StorefrontProvider`
- `app/(storefront)/layout.tsx` — passthrough (vibe scoped per slug)
- `app/(storefront)/s/[slug]/page.tsx` — proof-of-load page (store name, vibe, product count)
- `app/(storefront)/s/[slug]/not-found.tsx` — buyer-facing 404
- `components/storefront/store-unavailable.tsx` — unpublished/suspended message
- `components/storefront/storefront-context.tsx` — React context for store + products (Task 4.2+)
- `lib/host.ts` — `getMarketingUrl()`

**Notes:** RLS only exposes `published` rows to anon, so a SECURITY DEFINER RPC is required to show "unavailable" instead of 404 for draft/unpublished stores. Fallback if migration not applied: treats non-published as not_found. Oswald already loaded globally; Industrial sets `--font-display` via `[data-vibe="industrial"]`. Hero + catalog UI is Task 4.2.

---

### Task 4.2 — Hero + Product Catalog + Category Pills ✅

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

**Files Changed:**
- `app/(storefront)/s/[slug]/page.tsx` — hero + catalog home page
- `components/storefront/storefront-hero.tsx` — ordered hero blocks, CTA scroll to `#catalog`, fade-up
- `components/storefront/product-card.tsx` — metal-panel cards, stagger animation, tap scale
- `components/storefront/product-catalog.tsx` — category pills (hidden ≤1 category), client filter
- `app/globals.css` — `fade-up` keyframes + `--color-vibe-primary-fg` theme token

**Notes:** Category pill bar uses horizontal scroll on narrow screens. Pills hidden when all products share one category or have none.

---

### Task 4.3 — Product Detail Page ✅

**What:** Vibe-styled product detail: image, description, price, quantity, add to cart.

**Steps:**
1. Route + page: large image, name, price, description, category badge
2. Quantity selector
3. Add to cart action with feedback
4. Back navigation to catalog

**Definition of Done:**
- Buyer can view details and add N items to cart
- Styled per vibe

**Files Changed:**
- `app/(storefront)/s/[slug]/product/[id]/page.tsx` — product detail route
- `components/storefront/product-detail.tsx` — image, badge, qty selector, add-to-cart feedback

**Notes:** Links use `/product/[id]` (middleware rewrites from slug subdomain). Invalid product ID → 404.

---

### Task 4.4 — Cart + Bottom Navigation ✅

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

**Files Changed:**
- `lib/cart/types.ts` + `lib/cart/storage.ts` — localStorage cart keyed by slug
- `components/storefront/cart-context.tsx` — cart state provider
- `components/storefront/bottom-nav.tsx` — Shop/Cart nav, badge, safe-area padding
- `components/storefront/storefront-shell.tsx` — wraps pages with cart + bottom nav
- `components/storefront/cart-page.tsx` — line items, qty controls, subtotal, checkout CTA
- `app/(storefront)/s/[slug]/cart/page.tsx` — cart route
- `app/(storefront)/s/[slug]/layout.tsx` — adds `StorefrontShell`
- `lib/money.ts` — `formatPrice()`

**Notes:** Stale product IDs in cart are silently dropped on render (product removed/archived). Cart cleared after successful checkout.

---

### Task 4.5 — Standardized Checkout ✅

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

**Files Changed:**
- `lib/supabase/admin.ts` — service-role Supabase client (server-only)
- `lib/validation/customer.ts` — SG mobile + email validation
- `lib/orders/reference.ts` — `ORD-XXXXX` reference generator
- `app/(storefront)/s/[slug]/actions.ts` — `createOrderAction` (prices from DB, 10-min expiry)
- `app/(storefront)/s/[slug]/checkout/page.tsx` — checkout route
- `components/storefront/checkout-form.tsx` — fulfillment, customer fields, order summary
- `.env.example` — documents `SUPABASE_SECRET_KEY` requirement

**Notes:** Totals computed server-side from DB product prices — client sends only product IDs + quantities. Requires `SUPABASE_SECRET_KEY` in `.env.local` (orders have no public INSERT RLS). Reference uniqueness retried up to 8 times.

---

### Task 4.6 — Payment Page: Dynamic QR, Countdown, Save QR ✅

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

**Files Changed:**
- `lib/orders/load-order.ts` — load order + items by reference (admin, slug-scoped)
- `lib/paynow/format-expiry.ts` — ISO → PayNow TLV expiry
- `lib/paynow/download-qr-image.ts` — canvas PNG compose for Save QR
- `app/(storefront)/s/[slug]/order/[reference]/page.tsx` — server builds PayNow payload
- `components/storefront/payment-page.tsx` — QR display, live countdown, save, instructions, expiry

**Notes:** Order `reference` acts as URL token (unique, unguessable). QR built server-side with `payment_expires_at` encoded as PayNow expiry. Buyer can bookmark `/order/{reference}` to return.

---

### Task 4.7 — Notify Seller Flow + Buyer Waiting State ✅

**What:** "Notify seller to verify payment" with confirmation modal per PRD §23.

**Steps:**
1. Button: "Notify seller to verify payment" (never "I have paid")
2. Confirmation modal: amount + reference, warning copy, required checkbox ("I have completed payment…"), confirm button enabled only when checked
3. On confirm: order status → `seller_verification_requested` (seller push alert wired in Phase 5)
4. Waiting screen: "Seller notified. Your order is now waiting for seller verification…"

**Definition of Done:**
- Modal behaves exactly per PRD §23
- Status transition persists
- Buyer returning to order URL sees the waiting state

**Files Changed:**
- `app/(storefront)/s/[slug]/actions.ts` — `notifySellerAction` (status transition, expiry guard)
- `components/storefront/payment-page.tsx` — notify modal, checkbox gate, waiting screen

**Notes:** Seller alert (push) deferred to Phase 5. Notify blocked after payment window expires. Re-visiting order URL shows waiting state from DB status.

---

**🏁 Phase 4 Checkpoint:** Full buyer journey works end-to-end: browse → cart → checkout → QR payment page → notify seller. (Seller-side management + optional push alerts come next.)

---

---

## PHASE 5: Orders, Verification, Push Alerts & Manual Buyer Communication

> **Goal:** Seller can manage orders, receive **optional** PWA push alerts for new verification requests, verify payment manually, update the buyer-facing order status page, and manually send buyer confirmation through WhatsApp / email draft / copy message. **Nomi is the source of truth for order status; the seller sends all external buyer communication manually.**
>
> **Rescoped 2026-07-03:** Resend / automated transactional email was removed from the MVP path (see Backlog). Rationale: keep MVP low-cost, avoid per-order email quota dependency, let sellers choose their own channel (some want WhatsApp immediacy, some want an email record), and make the buyer order status page — not an email — the core buyer confirmation mechanism.

### Product rules preserved across Phase 5

1. **Payment truth:** Buyer action ≠ confirmed payment. An order never becomes paid because the buyer says so. Only the seller can mark payment verified after manually checking bank/PayLah.
2. **No automated buyer email in MVP:** After the seller marks payment verified, Nomi does **not** auto-email the buyer. It offers manual communication actions instead.
3. **Push is optional & not source of truth:** Push only alerts the seller that a verification request arrived. The dashboard + buyer order status page remain the source of truth. The full flow must work even if push is never enabled or fails.
4. **Honest wording for manual comms:** Nomi only opens a prefilled draft/link — the seller sends it. Use "Open WhatsApp message", "Open email draft", "Copy message". Never "Send WhatsApp" / "Send email".
5. **Support both channels:** Offer WhatsApp *and* email — do not force one.
6. **Contact actions beyond confirmation:** The order detail page exposes general "Contact buyer" actions (WhatsApp / email / copy details) for operational issues (address unclear, amount mismatch, pickup timing, item unavailable, payment not found) — not only after payment confirmation.

---

### Task 5.1 — Seller Orders List, Order Detail & Pending Badge ✅

**What:** The dashboard order-management experience.

**Steps:**
1. Orders list: reference, customer name, total, status badge, date; sorted newest first; filterable by status
2. **Pending verification badge/count** (orders in `seller_verification_requested`) surfaced on the list + dashboard nav
3. Order detail page: customer contact details, ordered items, fulfillment method/address, order notes, payment status, order reference
4. **General "Contact buyer" actions** (available regardless of status, for operational issues):
   - Open WhatsApp buyer (deep link `https://wa.me/{intl_phone}` — normalize SG `+65`)
   - Open email buyer (`mailto:` with buyer email)
   - Copy buyer details (name, phone, email)
5. Empty state when no orders

**Definition of Done:**
- Seller sees only their own store's orders (RLS-verified; no admin client on the read path)
- Pending verification count is visible at a glance
- Detail shows everything needed to fulfill + working contact actions
- Contact wording follows Rule 4 ("Open…" / "Copy…", never "Send…")

**Files Changed:**
- `lib/orders/types.ts` — shared `OrderRow` / `OrderItemRow` types (also used by storefront loader)
- `lib/orders/status.ts` — display labels, expired derivation, filter options
- `lib/orders/contact-buyer.ts` + `lib/orders/contact-buyer.test.ts` — WhatsApp/mailto/copy helpers
- `lib/orders/load-seller-orders.ts` — RLS-scoped list, detail, pending count
- `lib/stores/require-seller.ts` — auth + onboarding guard (reused by dashboard pages)
- `app/(dashboard)/dashboard/layout.tsx` — nav shell with pending badge
- `app/(dashboard)/dashboard/orders/page.tsx` — orders list (`app.lvh.me/orders`)
- `app/(dashboard)/dashboard/orders/[reference]/page.tsx` — order detail
- `components/dashboard/*` — nav, list, filter, status badge, contact actions
- `app/(dashboard)/dashboard/page.tsx` — home links to orders + pending count

**Notes:** Reads use the seller session client only (RLS owner policies). Expired is derived client-side from `payment_pending` + past `payment_expires_at`. Contact helpers shared with Task 5.5.

---

### Task 5.2 — Buyer Order Status Page ✅

**What:** The tokenized buyer-facing order status page — **this replaces the buyer confirmation email as the core MVP confirmation mechanism.**

**Steps:**
1. Reuse the existing tokenized order route (`/order/[reference]`) as the buyer's durable status view
2. Render clear status states:
   - Payment pending (QR + countdown — existing behaviour)
   - Awaiting seller verification
   - Payment verified / order confirmed
   - Cancelled
   - Expired
3. Confirmed state shows: reference, store name, order summary, total paid, fulfillment details (buyer's receipt)
4. Buyer can return to the URL any time to see current status (source of truth = DB)

**Definition of Done:**
- Each status renders a distinct, correct, vibe-styled state
- A buyer who bookmarks `/order/{reference}` always sees live status without any email
- No wording implies payment is confirmed before the seller verifies

**Files Changed:**
- `lib/orders/status.ts` — added `buyerOrderView()` helper
- `lib/orders/status.test.ts` — unit tests for view mapping + expiry derivation
- `components/storefront/order-receipt.tsx` — shared receipt/summary block
- `components/storefront/order-status-page.tsx` — all five buyer status screens
- `components/storefront/payment-page.tsx` — re-exports for backwards compat
- `app/(storefront)/s/[slug]/order/[reference]/page.tsx` — uses `OrderStatusPageContent`

**Notes:** Removed email confirmation copy from awaiting-verification state. Confirmed covers `seller_confirmed_paid` and `completed`. To test confirmed/cancelled before Task 5.5, update order status manually in Supabase Table Editor.

---

### Task 5.3 — Seller PWA Notification Setup (Optional Opt-In) 👤 ✅

**What:** Let sellers explicitly opt in to browser/PWA push order alerts from the dashboard.

**Steps:**
1. 👤 MANUAL: Generate a VAPID key pair; store public key in env (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`) and private key server-only (`VAPID_PRIVATE_KEY`) — instructions in whiteboard
2. Add a service worker + web app manifest (minimal PWA surface for the dashboard)
3. Settings UI: "Enable order alerts" → request notification permission → subscribe via `PushManager` → save subscription server-side
4. Persist push subscriptions (new `push_subscriptions` table, RLS-scoped to owner; migration required)
5. Show clear enabled/disabled state + a way to disable/unsubscribe

**Definition of Done:**
- A seller can opt in and see "alerts enabled"; a seller who declines is unaffected
- Subscription is stored and retrievable server-side for Task 5.4
- Nothing about the core order flow depends on this being enabled

**Files Changed:**
- `supabase/migrations/20260703180000_push_subscriptions.sql` — `push_subscriptions` table + owner RLS
- `public/push-sw.js`, `public/manifest.webmanifest`, `public/icon.svg` — minimal PWA surface
- `lib/push/vapid.ts`, `lib/push/client.ts`, `lib/push/subscriptions.ts`
- `app/(dashboard)/dashboard/settings/page.tsx` + `settings/actions.ts`
- `components/dashboard/push-alerts-settings.tsx` — opt-in/out UI
- `components/dashboard/dashboard-nav.tsx` — Settings link
- `app/(dashboard)/dashboard/layout.tsx` — manifest metadata
- `.env.example`, `package.json` (`generate:vapid` script)

**Notes:** No `web-push` dependency yet (added in Task 5.4 for server send). Push requires a secure context (HTTPS or localhost). Settings page shows a friendly message if VAPID keys are missing. Core order flow unaffected if push disabled.

---

### Task 5.4 — Push Notification on Verification Request ✅

**What:** Send the seller a push alert when a buyer requests verification — best-effort, non-blocking.

**Steps:**
1. On the existing `seller_verification_requested` transition (Task 4.7 `notifySellerAction`), after the status update succeeds, look up the store owner's active push subscription(s)
2. If present, send a Web Push notification: title "New order awaiting verification", body with order reference + total amount
3. Notification click opens the relevant dashboard order detail page (deep link)
4. Push send is wrapped so any failure (no subscription, expired subscription, send error) is swallowed — **the buyer's notify action always succeeds regardless**
5. Prune subscriptions that return 404/410 (gone)

**Definition of Done:**
- Opted-in seller receives a push within seconds of a buyer requesting verification
- Tapping it lands on the order detail page
- With push disabled/failing, the order still transitions and the buyer still sees the waiting state (Rule 3)

**Files Changed:**
- `lib/push/send-verification-alert.ts` — `sendVerificationRequestPush()` via `web-push`
- `lib/push/vapid.ts` — private key + subject helpers
- `app/(storefront)/s/[slug]/actions.ts` — fire-and-forget push after status update
- `public/push-sw.js` — notification click navigates to order detail URL
- `package.json` — `web-push`, `@types/web-push`
- `.env.example` — `VAPID_SUBJECT` documented

**Notes:** Push never blocks or rolls back buyer notify. Stale subscriptions pruned on 404/410. Requires `VAPID_PRIVATE_KEY` server-side. Uses `getDashboardUrl(/orders/{ref})` for click target.

---

### Task 5.5 — Mark Payment Verified + Manual Buyer Confirmation Actions ✅

**What:** Seller verifies payment; buyer status page flips to confirmed; seller gets manual confirmation-comms actions.

**Steps:**
1. On order detail: "Mark payment verified" button with a confirmation warning: "Only continue after checking your bank/PayLah app."
2. Server-enforced transition to `seller_confirmed_paid` (valid transitions only); also support `completed` / `cancelled`
3. Buyer's tokenized order status page (Task 5.2) reflects confirmed status
4. After verification, show **confirmation-specific manual actions** (distinct from the general contact actions in 5.1):
   - Open WhatsApp confirmation (deep link, prefilled with the WhatsApp template)
   - Open email confirmation draft (`mailto:` with subject + body from the email template)
   - Copy confirmation message
5. Expiry handling: orders past `payment_expires_at` still in `payment_pending` display as `expired`
6. **Nomi does not send the confirmation automatically** — every action opens a draft the seller reviews and sends

**Definition of Done:**
- Payment only becomes verified via explicit seller action after the warning (Rule 1)
- Buyer status page updates with no email involved (Rule 2)
- All three manual confirmation actions produce correct prefilled content and use honest "Open…/Copy…" wording (Rule 4)

**Files Changed:**
- `lib/orders/status-transitions.ts` + `.test.ts` — valid transition guards
- `lib/orders/confirmation-message.ts` + `.test.ts` — WhatsApp/email/copy templates
- `app/(dashboard)/dashboard/orders/actions.ts` — verify / complete / cancel server actions
- `components/dashboard/order-status-actions.tsx` — verify dialog + complete/cancel
- `components/dashboard/confirmation-buyer-actions.tsx` — post-verify manual comms
- `app/(dashboard)/dashboard/orders/[reference]/page.tsx` — wires actions into detail page

**Notes:** Verify allowed from `payment_pending` or `seller_verification_requested`. Revalidates buyer order URL on status change. Confirmation section hidden until payment verified.

---

**🏁 Phase 5 Checkpoint:** Complete low-cost core loop: order → QR → buyer requests verification → (optional) seller push → seller verifies payment → buyer order status page confirmed → seller sends confirmation manually via WhatsApp/email/copy. No automated buyer email.

---

### Message Templates (reference — implemented in `lib/orders/confirmation-message.ts`)

Placeholders: `{customer_name}`, `{order_reference}`, `{store_name}`, `{order_items}`, `{total_amount}`, `{fulfillment_summary}`.

**WhatsApp confirmation**

```
Hi {customer_name}, your order {order_reference} from {store_name} has been confirmed ✅
We've verified your payment and your order is now being prepared.

Order summary:
{order_items}

Total paid: S${total_amount}

Fulfillment:
{fulfillment_summary}

Thank you!
```

**Email confirmation**

Subject:

```
Your order is confirmed — {order_reference}
```

Body:

```
Hi {customer_name},

Your order {order_reference} from {store_name} has been confirmed.
We have verified your payment and your order is now being prepared.

Order summary:
{order_items}

Total paid:
S${total_amount}

Fulfillment:
{fulfillment_summary}

Thank you,
{store_name}
```

---

## PHASE 6: Dashboard Completion

> **Goal:** Seller can manage everything post-onboarding: products, storefront, fulfillment, payment settings, store link.

---

### Task 6.1 — Dashboard Home ✅

**What:** Dashboard landing page with store status, link tools, and order summary.

**Steps:**
1. Store status badge + public link with Copy / Open buttons
2. Order summary counts (awaiting verification, paid, total)
3. Empty state with next-action suggestions per PRD §17
4. Dashboard navigation (Home, Orders, Products, Storefront, Settings) — mobile-friendly

**Definition of Done:**
- Seller lands on a useful home after login
- Copy link works; nav works on mobile

**Files Changed:**
- `app/(dashboard)/dashboard/page.tsx` — rebuilt as dashboard home (replaces placeholder)
- `components/dashboard/dashboard-home.tsx` — store link card, order summary grid, empty-state tips
- `lib/orders/order-summary.ts` — parallel count queries via RLS session
- `components/dashboard/store-status-badge.tsx` — Live/Draft/Unpublished badge
- `components/dashboard/copy-store-link-button.tsx` — clipboard copy with feedback
- `components/dashboard/dashboard-nav.tsx` — expanded nav: Home, Orders, Products, Storefront, Settings
- `app/(dashboard)/dashboard/products/page.tsx` — placeholder for Task 6.2
- `app/(dashboard)/dashboard/storefront/page.tsx` — placeholder for Task 6.3

**Notes:** Paid count includes `seller_confirmed_paid` + `completed`; paid tile links to `?status=seller_confirmed_paid` filter. Store URL from `getStorefrontUrl(slug)`. Order summary tiles link to filtered orders list.

---

### Task 6.2 — Products Management (CRUD) ✅

**What:** Full product management: list, add, edit, archive/delete, categories.

**Steps:**
1. Products list with image thumbnails, price, category
2. Add/edit forms (reuse onboarding product form)
3. Archive/delete with confirmation
4. Category edits reflect in storefront pills automatically

**Definition of Done:**
- Full CRUD works; storefront reflects changes immediately

**Files Changed:**
- `lib/products/validate.ts` + `.test.ts` — shared validation
- `app/(dashboard)/dashboard/products/actions.ts` — add, update, archive + storefront revalidation
- `components/dashboard/product-form.tsx` — shared form (refactored from onboarding step)
- `components/onboarding/step-product.tsx` — now uses shared `ProductForm`
- `components/dashboard/products-list.tsx` — list with thumbnails + archived toggle
- `components/dashboard/new-product-form.tsx`, `edit-product-form.tsx`, `archive-product-button.tsx`
- `app/(dashboard)/dashboard/products/page.tsx` — list route
- `app/(dashboard)/dashboard/products/new/page.tsx` — add route
- `app/(dashboard)/dashboard/products/[id]/edit/page.tsx` — edit + archive route
- `app/(dashboard)/dashboard/onboarding/actions.ts` — `addProduct` delegates to shared action

**Notes:** Archive is soft-delete (`archived=true`); storefront already filters archived products. Category changes appear in storefront pills on next load (no cache beyond revalidatePath). `addProductAction` works during onboarding via `ownedStoreContext`; update/archive require onboarding complete.

---

### Task 6.3 — Storefront Editor (Vibe + Hero) ✅

**What:** Post-onboarding editing of vibe and hero.

**Steps:**
1. Vibe switcher (reuse Task 3.3 picker)
2. Hero editor (reuse Task 3.4)
3. Preview button to open live/preview storefront

**Definition of Done:**
- Vibe and hero changes persist and reflect on the public store

**Files Changed:**
- `components/dashboard/vibe-picker.tsx`, `hero-editor.tsx`, `storefront-editor.tsx`
- `app/(dashboard)/dashboard/storefront/page.tsx` — editor + Open storefront button
- `app/(dashboard)/dashboard/storefront/actions.ts` — save with storefront revalidation
- `lib/stores/revalidate.ts` — shared revalidate helper
- Onboarding `step-vibe.tsx`, `step-hero.tsx` — thin wrappers over shared components

**Notes:** Vibe picker uses seller's real products in preview when available. Saves show brief "Saved" feedback without leaving the page.

---

### Task 6.4 — Fulfillment + Payment Settings & Store Status ✅

**What:** Settings pages for fulfillment, PayNow, and publish/unpublish.

**Steps:**
1. Fulfillment settings (reuse Task 3.6 form)
2. PayNow settings (reuse Task 3.7 form) + QR preview + manual verification explainer
3. Publish/unpublish toggle with confirmation

**Definition of Done:**
- All settings editable post-onboarding
- Unpublished store immediately shows unavailable page publicly

**Files Changed:**
- `components/dashboard/fulfillment-form.tsx`, `paynow-form.tsx`, `store-status-settings.tsx`
- `app/(dashboard)/dashboard/settings/page.tsx` — expanded with all settings sections
- `app/(dashboard)/dashboard/settings/actions.ts` — fulfillment, PayNow, publish/unpublish (+ restored push actions)
- `lib/stores/publish-readiness.ts` — publish gate checklist
- Onboarding `step-fulfillment.tsx`, `step-paynow.tsx` — thin wrappers

**Notes:** Unpublish sets `status=unpublished`; storefront gate shows unavailable immediately. Publish reuses onboarding completeness check. Push subscription actions preserved in same actions file.

---

**🏁 Phase 6 Checkpoint:** Sellers can fully self-manage their store from the dashboard — products, storefront look, fulfillment, PayNow, publish status, orders, and push alerts.

---

---

## PHASE 7: Remaining Vibes + Marketing Site

> **Goal:** All four vibes are polished and the marketing homepage converts visitors to signups.

---

### Task 7.1 — Unicorn Vibe Polish ✅

**What:** Refine Unicorn tokens to production quality: soft, dreamy, pastel, playful.

**Steps:**
1. Finalize palette, display font, surfaces, pill/button/card styling, motion
2. Verify every storefront screen (hero → confirmation) in Unicorn
3. Update vibe picker preview

**Definition of Done:**
- A Unicorn store looks professionally designed end-to-end, distinct from Industrial

**Files Changed:**
- `styles/tokens.css` — lavender gradient canvas, lime CTAs + purple text, white/lavender cards, Archivo Black display
- `lib/fonts.ts`, `app/layout.tsx` — Archivo Black loaded
- `lib/vibes.ts` — updated swatches, `provisional: false`

**Notes:** Guided by `docs/unicorn/lavenderTheme.md`. Existing `metal-panel` / `rust-edge` / `vibe-display` classes styled per-vibe — no storefront JSX changes needed. Product card footers get lavender tint via CSS.

---

### Task 7.2 — Outback Vibe Polish ✅

**What:** Refine Outback tokens: earthy, warm, rugged, organic.

**Steps:** Same checklist as 7.1.

**Definition of Done:** Same bar as 7.1.

**Files Changed:**
- `styles/tokens.css` — warm paper gradient, terracotta/olive palette, Syne display, earthy panel shadows
- `lib/fonts.ts`, `app/layout.tsx` — Syne loaded
- `lib/vibes.ts` — `provisional: false`

**Notes:** Guided by `docs/outback/orangeTheme.md` (earthy light variant, not dark orange glass).

---

### Task 7.3 — Futuristic Vibe Polish ✅

**What:** Refine Futuristic tokens: sleek, sharp, neon, digital.

**Steps:** Same checklist as 7.1.

**Definition of Done:** Same bar as 7.1.

**Files Changed:**
- `styles/tokens.css` — charcoal grid + purple radial glow, cyan primary / purple accents, glass neon panels, Bebas Neue display
- `lib/fonts.ts`, `app/layout.tsx` — Bebas Neue loaded
- `lib/vibes.ts` — `provisional: false`

**Notes:** Guided by `docs/futuristic/neonTheme.md`. Sharp `--vibe-radius: 0.25rem` for digital feel.

---

### Task 7.4 — Marketing Homepage ✅

**What:** Build `nomi.store` homepage per PRD §15.1.

**Steps:**
1. Hero: "Turn your bio into a PayNow-ready storefront." + "Create my store" CTA
2. How-it-works, benefits for social sellers, PayNow QR explanation, mobile storefront mockup
3. Secondary CTA: "View demo store" → link to a seeded demo storefront (e.g. `jigwave.nomi.store`)
4. Singapore-local positioning; simple pricing/value note (free to start)

**Definition of Done:**
- Homepage is polished, mobile-first, and CTAs route to signup / demo store

**Files Changed:**
- `components/marketing/marketing-home.tsx` — full homepage: sticky header, hero + `MiniPreview` mockup, 3-step how-it-works, PayNow + benefits, bottom CTA, footer
- `app/(marketing)/page.tsx` — renders `MarketingHome`
- `app/(marketing)/layout.tsx` — marketing metadata (title/description)
- `lib/marketing/demo-store.ts` — `getDemoStoreSlug()` (default `jigwave`, env override)
- `.env.example` — `NEXT_PUBLIC_DEMO_STORE_SLUG` documented

**Notes:** CTAs use `getDashboardUrl('/login')` and `getStorefrontUrl(slug)` so links work on `lvh.me` and production. Demo store must be **published** at the configured slug (or set env to your test slug). Phone mockup reuses `MiniPreview` with Industrial/JigWave sample data — no screenshot asset needed.

---

**🏁 Phase 7 Checkpoint:** All 4 vibes production-quality. Marketing site live with demo store.

---

---

## PHASE 8: Polish, Hardening & Launch

> **Goal:** The app handles edge cases gracefully, is secure, and is smoke-tested end-to-end in production.

---

### Task 8.1 — Loading, Error & Empty States Pass ✅

**What:** Every async operation gets loading states; every failure gets a friendly message; every empty screen gets proper empty-state copy.

**Definition of Done:**
- No blank flashes, no raw errors in UI, buttons disabled while pending
- All empty states polished (vibe-styled on storefront, neutral on dashboard)

**Files Changed:**
- `lib/errors/friendly-db.ts` — central DB error mapper; wired into onboarding, products, settings actions
- `app/(dashboard)/dashboard/loading.tsx`, `app/(storefront)/s/[slug]/loading.tsx` — route loading skeletons
- `components/onboarding/step-name-slug.tsx` — slug check network failure handling
- `components/storefront/cart-context.tsx` — lazy init from localStorage (no empty flash)
- `app/(storefront)/s/[slug]/page.tsx` — `notFound()` instead of null
- `components/storefront/order-status-page.tsx` — notify/save-QR pending + errors
- `components/dashboard/hero-editor.tsx`, `order-status-actions.tsx` — disable while pending/uploading
- `components/storefront/product-catalog.tsx` — vibe-styled empty + category filter empty
- `components/dashboard/orders-list.tsx`, `products-list.tsx` — empty-state CTAs
- Clipboard buttons — copy failure feedback (store link, buyer details, confirmation, publish)
- `components/dashboard/push-alerts-settings.tsx`, `components/auth/google-sign-in-button.tsx` — friendly errors
- `lib/images/compress.ts` — friendly upload error
- `components/storefront/checkout-form.tsx` — stale cart warning

**Notes:** Dashboard/storefront `loading.tsx` covers SSR navigation blank flashes. Raw Supabase messages no longer reach UI from server actions.

---

### Task 8.2 — Security & Tenant Isolation Review ✅

**What:** Systematic review of RLS policies, server actions, and public endpoints.

**Definition of Done:**
- Cross-tenant access attempts fail (RLS + app scoping verified by code review)
- All PRD §33 data isolation criteria pass
- Rate-limit sensitive endpoints

**Files Changed:**
- `lib/rate-limit.ts` — IP-keyed in-memory limiter (ponytail: per-isolate; upgrade to KV at scale)
- `app/(storefront)/s/[slug]/actions.ts` — rate limits on `createOrderAction` (10/min/slug) and `notifySellerAction` (5/min/ref); reject invalid cart lines; cap qty at 99
- `app/(dashboard)/dashboard/onboarding/actions.ts` — auth required + rate limit (30/min) on `checkSlugAvailability`
- `lib/orders/reference.ts` — `crypto.getRandomValues`, 6-char suffix (~1B combos)

**Notes:** RLS + store-scoped dashboard queries were already solid (audit confirmed). Manual two-account cross-tenant test still recommended before launch (Task 8.4). Optional hardening deferred: column-restricted `orders_owner_update` RLS, public stores view without `owner_id`.

---

### Task 8.3 — Mobile UX Polish Pass ✅

**What:** Final mobile polish across all surfaces.

**Definition of Done:**
- Feels app-like on mobile; no layout breakage on common sizes
- Touch targets, safe areas, bottom nav overlap, image loading addressed in code

**Files Changed:**
- `app/layout.tsx` — `viewportFit: 'cover'` unlocks safe-area insets on iPhone
- `app/globals.css` — `overflow-x-clip` on body
- `app/(dashboard)/dashboard/layout.tsx` — bottom safe-area padding
- `components/dashboard/dashboard-nav.tsx` — top safe-area + `min-h-11` nav tabs
- `components/dashboard/orders-status-filter.tsx` — `min-h-11` filter pills
- `components/storefront/storefront-shell.tsx` — hide bottom nav on checkout/order routes; dynamic content padding
- `components/storefront/bottom-nav.tsx` — `min-h-11` touch targets
- `components/storefront/cart-page.tsx`, `product-detail.tsx` — 44px qty buttons; lazy/eager images
- `components/storefront/product-card.tsx` — `loading="lazy"`, responsive title size
- `components/storefront/storefront-hero.tsx` — LCP image priority; smaller mobile title
- `components/storefront/checkout-form.tsx` — `text-base` inputs (prevents iOS zoom)
- `components/storefront/order-receipt.tsx`, order detail page — `break-all` on references

**Notes:** 👤 Real-phone verification still required in Task 8.4. Per-vibe scroll performance (unicorn gradient, futuristic grid) — spot-check on device.

---

### Task 8.4 — Final Deploy & Full Production Smoke Test 👤⬜

**What:** Production deploy and complete end-to-end walkthrough on live domain.

**Steps (👤 with provided checklist):**
1. Fresh seller signup → full onboarding → publish
2. Real phone: browse store → cart → checkout → save QR → (real S$0.50 payment) → request verification
3. (If push enabled) confirm seller push alert → open order → mark payment verified → confirm buyer order status page shows confirmed → open a manual WhatsApp/email confirmation draft
4. Test 404, unavailable store, expired payment window, push-disabled path (flow still works)
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
| **Optional automated email notifications via Resend** (seller alert email on verification request; buyer confirmation email on paid) | Core MVP uses the seller dashboard, buyer order status page, optional PWA seller push alerts, and manual seller communication actions (WhatsApp/email draft/copy). Automated transactional email can be added later as a paid/polished feature. Removed as a blocking Phase 5 dependency 2026-07-03. PRD §26 templates remain valid if/when built. |
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
| 2026-07-02 | **Reversed: Cloudflare Workers (OpenNext) instead of Vercel** | New deployment direction. OpenNext supports Next.js 16; keeps all existing app code. Deploy via Workers (not Pages). Cloudflare DNS for wildcard `*.nomi.store`. |
| 2026-07-02 | PayNow spike moved to Phase 2 (before feature build) | De-risk core USP as early as possible |
| 2026-07-02 | Phase 3 built: onboarding progress derived from data (no step column); server actions + RLS; store-images bucket added | Simplest resume-safe design; second storage migration required |
| 2026-07-02 | Industrial vibe built first; other 3 refined in Phase 7 | Industrial has a full design reference (JigWave); quality bar |
| 2026-07-04 | **UI overhaul part 1 — marketing landing page redesign.** `[data-brand]` token layer in `styles/tokens.css` overrides shadcn vars; `marketing-home.tsx` rebuilt with new hero copy, composed phone scene, 0%-fees USP + QR card mock (`paynow-qr-card.tsx`). Visual only — all links and behavior unchanged. v1 shipped as "Warm Editorial Craft" (cream/teal/Fraunces). | Landing page felt generic; brand layer reusable for dashboard restyle later |
| 2026-07-04 | **Brand v2 — "Warm Tactile" (whacka-inspired).** Human picked whacka.app's aesthetic (`docs/whackaDesignToken.md`, `docs/whackaUIspec.md`). Tokens re-cut: sand `#F1EDE5` bg, warm ink `#16130E`, yellow `#F7C518` primary, purple/mint support accents, Hanken Grotesk (replaces Fraunces + Inter on brand surfaces), 1rem radius + pill geometry. Landing rebuilt: floating pill nav with wordmark, centered hero with pulsing social-proof chip + marker-highlighted headline + black pill CTA with yellow arrow badge, drifting orbs, ink marquee strip, three numbered feature panels (purple/yellow/mint) with mock visuals, stats row, native-`details` FAQ, full-bleed yellow CTA band. Scroll reveals via new `reveal.tsx` (IntersectionObserver) — no GSAP/magicui dependencies added. | Human preferred whacka fonts/colors over v1 teal/serif pairing |
| 2026-07-03 | **Phase 5 rescoped:** Resend/automated email moved to Backlog; new focus = seller order mgmt, buyer order status page, seller payment verification, optional PWA push seller alerts, manual buyer comms (WhatsApp/email draft/copy). Phase 5 tasks 3→5; total 38→40. | Keep MVP low-cost, avoid per-order email quota dependency, let sellers choose channel, make buyer order status page the core confirmation mechanism instead of email. |

---
