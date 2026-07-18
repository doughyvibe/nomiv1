# Nomi Seller Onboarding — Current Implementation Audit

> **Purpose:** Definitive reference for the onboarding experience **as implemented in code today**.  
> **Scope:** Marketing entry → authentication → 7-step wizard → published storefront / dashboard.  
> **Rules for this doc:** Describe only what exists. No redesign proposals.  
> **Source of truth:** Application code under `app/`, `components/onboarding/`, `lib/stores/`, and related server actions.  
> **Surfaces:** Marketing = root domain · Seller app = `app.{root}` · Storefront = `{slug}.{root}`  
> **Audited:** 2026-07-16

---

# Part 1 — High Level Flow

## Bird's-eye overview

```
Marketing homepage (nomi.store / {root})
        │
        ├─ "Create my store" ──► Login (?intent=create)
        │                              │
        └─ "Sign in" ──────────► Login (?intent=login)
                                       │
                              Continue with Google
                                       │
                              Google OAuth (external)
                                       │
                              /auth/callback?next=/
                                       │
                              Session cookie set
                                       │
                              app.{root}/  (rewritten → /dashboard)
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
           No store / incomplete                  Onboarding "done"
           (deriveOnboardingStep ≠ done)          (status ≠ draft +
                    │                              all gates met)
                    ▼                                     ▼
           /onboarding                            Dashboard home (/)
           7-step wizard                                  │
                    │                              Public storefront
                    │                              {slug}.{root}
                    ▼
           Publish (status = published)
                    │
                    ▼
           Success UI → "Go to Dashboard"
                    │
                    ▼
           Dashboard + live storefront
```

## Progress model (not a stored step counter)

Onboarding progress is **derived from database state** every page load via `deriveOnboardingStep(store, productCount)` in `lib/stores/progress.ts`:

| Derived step | Condition |
|---|---|
| 1 | No store row for this user |
| 2 | Store exists, `vibe` is null |
| 3 | `hero.title` empty / incomplete |
| 4 | Zero non-archived products |
| 5 | Fulfillment incomplete |
| 6 | PayNow incomplete |
| 7 | All above complete AND `status === "draft"` |
| `"done"` | All gates complete AND status is **not** `draft` (`published`, `unpublished`, or `suspended`) |

There is **no** `onboarding_step` column. Resume after refresh always lands on the first incomplete step.

## Conditional branches

| Branch | Behavior |
|---|---|
| New user, no store | Step 1 (name + slug) |
| Store exists, missing vibe | Step 2 |
| …missing hero title | Step 3 |
| …no products | Step 4 |
| …fulfillment incomplete | Step 5 |
| …PayNow incomplete | Step 6 |
| …everything filled, still `draft` | Step 7 (must publish) |
| Status published / unpublished / suspended + complete | Redirect away from `/onboarding` to `/` |
| Authenticated user hits `/login` | Middleware redirects to `/` |
| Unauthenticated user hits private dashboard path | Middleware redirects to `/login` |
| Incomplete seller hits `/`, `/products`, `/settings`, etc. | `requireSellerStore()` redirects to `/onboarding` |
| Login `intent=create` vs `intent=login` | **Copy only** — same Google OAuth path |
| Trade hint on vibe step | Optional; does **not** gate progress |
| Logo / hero extras | Optional; only `hero.title` gates step 3 |
| Product image / category / description | Optional; name + price required to save |
| Pickup vs delivery | At least one complete method required |
| PayNow mobile vs UEN | Radio choice; validation differs by type |

## Skipped steps

**None.** There is no skip control. Sellers cannot leave the wizard until `publishStore` sets `status = 'published'` (or status otherwise leaves `draft` while all gates are complete).

Implementation notes mentioning “explicit skip” are **not implemented** in code.

## Redirects

| From | To | Trigger |
|---|---|---|
| Private dashboard path, no session | `/login` | Middleware |
| `/login`, already signed in | `/` | Middleware |
| OAuth success | `next` (default `/`) | `/auth/callback` |
| OAuth failure / missing code | `/login?error=auth` | `/auth/callback` |
| `/` or other seller pages, onboarding incomplete | `/onboarding` | `requireSellerStore()` |
| `/onboarding`, step derived as `"done"` | `/` | Onboarding page |
| `/onboarding`, no user | `/login` | Onboarding page |
| Sign out (wizard or elsewhere) | `/login` | `SignOutButton` |

## Optional paths

- Marketing menu → Terms / Privacy (leave funnel)
- Login → “← Back to Nomi” (marketing)
- Trade hint chips (step 2)
- Logo upload + size/style (step 3)
- Extra products before Continue (step 4)
- Both fulfillment methods (step 5)
- PayNow instructions (step 6)
- Post-publish: Copy / Open / WhatsApp before Dashboard (step 7 success)
- Revisit completed steps via progress bars (client override, target ≤ derived step)

## Completion states

| State | Meaning |
|---|---|
| `stores.status = 'draft'` | Incomplete or complete-but-unpublished; if all data gates met, wizard stays on step 7 |
| `status = 'published'` | Onboarding `"done"`; public storefront live; dashboard accessible |
| `status = 'unpublished'` | Still `"done"` for onboarding; dashboard OK; storefront unavailable to buyers |
| `status = 'suspended'` / `'deleted'` | Outside normal happy path; deleted stores excluded from seller queries |

**Important:** Unpublishing after publish does **not** send the seller back into onboarding.

---

# Part 2 — Screen Inventory

Hosts below use `{root}` = `NEXT_PUBLIC_ROOT_DOMAIN` (e.g. `nomi.store` or `lvh.me` in local dev). Dashboard middleware rewrites bare paths on `app.*` to `/dashboard/*` except `/login` and `/auth/*`.

---

## Screen: Marketing Homepage

**Purpose**  
Public landing page; primary acquisition entry into seller signup.

**Route / URL**  
`https://{root}/` → `app/(marketing)/page.tsx` / `components/marketing/marketing-home.tsx`

**When it appears**  
Anyone visiting the marketing host.

**When it is skipped**  
Returning sellers who bookmark `app.{root}` or open login directly.

**Required inputs**  
None.

**Buttons**  
- Primary: “Create my store” → `app.{root}/login?intent=create`  
- Secondary: “Sign in” → `app.{root}/login?intent=login`  
- Menu: Create my store, Sign in, Terms, Privacy  
- Spine link: “See What's Possible” → `#stores` (demo gallery)

**Links**  
Terms, Privacy, storefront demo section.

**Progress indicators**  
None.

**Validation / Loading / Empty / Error / Success**  
N/A for onboarding.

**Exit points**  
Create my store · Sign in · Terms · Privacy · scroll demos.

**Back / Forward navigation**  
Browser only.

**API / DB / Context / Session**  
None for CTA clicks.

**Feature flags**  
None.

**Hidden behaviour**  
`intent` only changes login headline/description.

---

## Screen: Login / Create Store (Auth)

**Purpose**  
Authenticate sellers with Google OAuth. Shared page for create vs return.

**Route / URL**  
`https://app.{root}/login`  
Query: `?intent=create` | `?intent=login` | `?error=auth`  
File: `app/(dashboard)/login/page.tsx`

**When it appears**  
- CTA from marketing  
- Middleware redirect when unauthenticated  
- After sign-out  
- OAuth failure (`error=auth`)

**When it is skipped**  
Already authenticated → middleware sends to `/`.

**Required inputs**  
None on-page (Google account externally).

**Buttons**  
- “Continue with Google” (loading: “Redirecting…”)  
- Wordmark → marketing home  
- “← Back to Nomi”

**Links**  
Terms of Service, Privacy Policy (marketing URLs).

**Progress indicators**  
None.

**Validation**  
None on form.

**Loading states**  
Button: “Redirecting…”; disabled while starting OAuth.

**Empty states**  
N/A.

**Error states**  
- `?error=auth`: “Sign-in failed. Please try again.”  
- Client OAuth errors: cancelled popup, network, missing URL, generic retry.

**Success states**  
Browser navigates to Google, then `/auth/callback`.

**Exit points**  
Back to Nomi · Terms · Privacy · abandon OAuth.

**Back navigation**  
“← Back to Nomi”.

**Forward navigation**  
Google → callback → `/` → onboarding or dashboard.

**API calls**  
`supabase.auth.signInWithOAuth({ provider: "google", redirectTo: app…/auth/callback?next=/ })`

**Database writes**  
None directly (Supabase Auth user/session).

**Context / Session updates**  
Session established in callback via `exchangeCodeForSession`.

**Feature flags**  
None. **Google only** (no magic link / Apple in code).

**Hidden behaviour**  
`skipBrowserRedirect: true` then `window.location.assign(data.url)`. Dashboard origin built from `NEXT_PUBLIC_ROOT_DOMAIN` + `app.` subdomain.

**Benefits list (always shown)**  
1. Set up your store in minutes  
2. Start selling across social media  
3. Manage orders and customers easily  

**Copy variants**

| Intent | Title | Description |
|---|---|---|
| `create` (default) | Create your store | Get started in minutes — no website required. |
| `login` | Welcome back | Manage your store, orders, and PayNow settings. |

---

## Screen: Auth Callback (not a UI screen)

**Purpose**  
Exchange OAuth `code` for session; redirect into app.

**Route / URL**  
`https://app.{root}/auth/callback?code=…&next=/`  
File: `app/auth/callback/route.ts`

**When it appears**  
After Google redirects back.

**Behaviour**  
- Valid code → `exchangeCodeForSession` → redirect `getDashboardUrl(next)` (default `/`)  
- Invalid / missing → `/login?error=auth`  
- `next` must start with `/` or is forced to `/`

---

## Screen: Onboarding Wizard Shell (shared chrome)

**Purpose**  
Branded container for all 7 steps; progress UI; sign-out.

**Route / URL**  
`https://app.{root}/onboarding`  
Files: `app/(dashboard)/dashboard/onboarding/page.tsx`, `components/onboarding/wizard.tsx`

**When it appears**  
Authenticated seller with derived step ≠ `"done"`.

**When it is skipped**  
Onboarding complete → redirect `/`.

**Chrome elements**  
- `data-brand` grain + orbs background  
- Wordmark + Sign out  
- Eyebrow: “Set up your store”  
- 7 clickable progress bars  
- “Step N of 7 — {label}”  
- Max width `max-w-xl`  
- **No** dashboard sidebar/nav (`DashboardShell` bypass when path includes `/onboarding`)

**Progress bar behaviour**  
- Completed (index < derived): dim primary, clickable → revisit  
- Current: full primary  
- Future (index > derived): border color, **disabled**  
- `stepOverride` client state; `advance()` clears override + `router.refresh()`

**Exit points**  
Sign out → `/login`. No “save and exit” / skip.

**Feature flags**  
None.

---

## Screen: Step 1 — Store Name + Slug

**Purpose**  
Create the seller’s store row and claim a unique subdomain.

**Route / URL**  
`/onboarding` (step 1)

**When it appears**  
`deriveOnboardingStep` returns 1 (no store).

**When it is skipped**  
Never if store already exists; user lands on later step.

**Required inputs**  
- Store name (trim, non-empty, ≤60)  
- Slug available (format + reserved + uniqueness)

**Buttons**  
- Continue (pending: “Claiming…”)  
- Suggestion chips when slug taken (e.g. `{slug}-sg`, `{slug}official`, `{slug}{year}`, `{slug}-shop`)

**Links**  
None.

**Progress indicators**  
Wizard bars; “Step 1 of 7 — Store name”.

**Validation**  
Client format via `validateSlugFormat`; debounced (400ms) `checkSlugAvailability`; server re-check in `createStore`.

**Loading states**  
“Checking…” under slug; “Claiming…” on continue.

**Empty states**  
Empty name/slug initially; Continue disabled.

**Error states**  
Format errors; reserved; taken + suggestions; rate limit; network check failure; already has store; unique race `23505`.

**Success states**  
`createStore` ok → `onDone` → refresh → step 2.

**Exit points**  
Sign out; abandon (draft never created until Continue succeeds).

**Back navigation**  
None within step (no previous onboarding step). Progress bar N/A for prior.

**Forward navigation**  
Continue → step 2.

**API calls**  
`checkSlugAvailability(slug)` · `createStore(name, slug)`

**Database writes**  
`INSERT stores { owner_id, name, slug }` — default `status='draft'`.

**Context / Session**  
None beyond auth user as owner.

**Feature flags**  
None.

**Hidden behaviour**  
Slug auto-fills from name via `slugify` until user edits slug (`slugEdited`). Rate limit: 30 slug checks / 60s / IP.

---

## Screen: Step 2 — Vibe (+ optional trade hint)

**Purpose**  
Choose public storefront visual theme; optionally set trade category hint.

**Route / URL**  
`/onboarding` (step 2)

**When it appears**  
Store exists, `vibe` null (or revisited via progress bar).

**When it is skipped**  
Never automatically; must save a vibe to advance.

**Required inputs**  
Vibe selected and saved (`stores.vibe`).

**Optional inputs**  
Trade hint: General shop · Food & drink · Handmade & retail · Services & digital · Plants & home.

**Buttons**  
- Per vibe card: “Use this vibe” / “Saving…” / “Saved” / “Current vibe”  
- Trade hint chips (toggle select)  
- “Continue setup” (disabled until vibe saved this session or already on store)

**Links**  
None.

**Progress indicators**  
Wizard; “Step 2 of 7 — Vibe”.

**Validation**  
Server: vibe ∈ 12 valid IDs; trade hint ∈ 5 valid IDs.

**Loading states**  
“Saving…” on selected card while pending.

**Empty states**  
Carousel with sample products (“Signature item”, etc.) because catalog empty.

**Error states**  
Save error text under picker.

**Success states**  
Vibe saved; seller stays on step until “Continue setup” (no auto-advance).

**Exit points**  
Sign out; progress back to step 1 if completed earlier.

**Back / Forward**  
Bars for ≤ derived; Continue setup → advance → step 3.

**API calls**  
`saveVibe(vibe)` · `saveTradeHint(hint)` (optional)

**Database writes**  
`UPDATE stores SET vibe` · optional `trade_hint`.

**Feature flags**  
None.

**Hidden behaviour**  
Trade hint is **not** a progress gate. Mobile hint: “Swipe sideways to browse vibes →”. Preview uses sample hero/products until real products exist. Onboarding does **not** pass real products into `VibePicker` (defaults to fallback samples).

**Vibe catalog (12)**  
Strada, Noir (`epicurean`), Atelier, Expedition, Cyberpunk, Candyland, Gallery, Market, Studio, Laura, Atlantic, Vows.

---

## Screen: Step 3 — Hero (“Introduce your shop”)

**Purpose**  
Configure storefront intro: logo, eyebrow, title, subheading; live mini preview.

**Route / URL**  
`/onboarding` (step 3)

**When it appears**  
Vibe set; `hero.title` incomplete.

**When it is skipped**  
Never if title missing; if title already saved, derive jumps past.

**Required inputs**  
Shop name (`hero.title`, trim non-empty, ≤80). Defaults to `store.name` in the form.

**Optional inputs**  
Logo (image upload), logo size (S/M/L), logo style (plain / soft corners / round frame), eyebrow (≤40), subheading (≤140).

**Buttons**  
- File input for logo  
- Remove logo  
- Size / style toggles (when logo present)  
- Continue (pending: “Saving…” / flash “Saved”)

**Links**  
None.

**Progress indicators**  
Wizard; “Step 3 of 7 — Hero”.

**Validation**  
Client: Continue disabled if title empty or uploading. Server: `heroIsComplete` (title required).

**Loading states**  
“Uploading…” · “Saving…”.

**Empty states**  
Preview requires vibe (always present at this step).

**Error states**  
Upload failure; “Hero title is required”; DB errors.

**Success states**  
Save → `onSuccess` → advance → step 4.

**Exit points**  
Sign out; revisit prior steps via bars.

**API calls**  
Client `uploadStoreImage` to storage · `saveHero(hero)`

**Database writes**  
`UPDATE stores.hero` JSON. Storage object for logo.

**Feature flags**  
None.

**Hidden behaviour**  
PRD fields CTA text, block reorder, cover/banner image are **not** in UI (types mark them deprecated). Title is independent of `stores.name`.

---

## Screen: Step 4 — First Product

**Purpose**  
Add at least one catalog product so the store can sell.

**Route / URL**  
`/onboarding` (step 4)

**When it appears**  
Hero complete; product count = 0 (or revisited; can add more).

**When it is skipped**  
Never with zero products.

**Required inputs**  
Product name; price (valid S$, ≥0, ≤ 1,000,000.00 → cents).

**Optional inputs**  
Image, category (suggestions from trade hint), description (≤300).

**Buttons**  
- Save product / Add another product (form submit)  
- “Continue setup” — **only if** `products.length > 0`

**Links**  
Optional “Preview store” toast link when category filters become live (≥2 categories).

**Progress indicators**  
Wizard; “Step 4 of 7 — Product”.

**Validation**  
Client + `validateProductInput` / `parsePriceToCents`.

**Loading states**  
Image uploading; save flash via `useSavedFlash`.

**Empty states**  
Headline “Add your first product”; no product list until one exists.

**Error states**  
Field errors for name/price; server errors.

**Success states**  
List of products; “Product added.” flash; Continue setup appears.

**Exit points**  
Sign out; cannot reach dashboard products CRUD until done.

**API calls**  
`addProductAction` (uses `ownedStoreContext` — allowed during onboarding)

**Database writes**  
`INSERT products`; if `featured_product_id` empty, set to first product id.

**Feature flags**  
None.

**Hidden behaviour**  
Update/archive product actions require onboarding `"done"` (`sellerContext`). Form fields are **not** cleared after successful add (seller must overwrite manually to add another). Headline switches to “Add another product” once any products exist.

---

## Screen: Step 5 — Fulfillment

**Purpose**  
Configure how buyers receive orders (pickup and/or delivery).

**Route / URL**  
`/onboarding` (step 5)

**When it appears**  
≥1 product; fulfillment incomplete.

**When it is skipped**  
Never if incomplete.

**Required inputs**  
At least one of:  
- Self-pickup enabled + pickup instructions, **or**  
- Local delivery enabled + fee + delivery instructions  

**Optional inputs**  
Pickup location; enabling both methods.

**Buttons**  
Continue (pending: “Saving…” / “Saved”).

**Links**  
None.

**Progress indicators**  
Wizard; “Step 5 of 7 — Fulfillment”.

**Validation**  
Client `valid` gate; server `fulfillmentIsComplete`.

**Loading / Error / Success**  
Standard save states; fee parse error; completeness error message.

**Exit points**  
Sign out; prior steps via bars.

**API calls**  
`saveFulfillment(config)`

**Database writes**  
`UPDATE stores.fulfillment` JSON (only enabled methods cleaned).

**Feature flags**  
None.

**Hidden behaviour**  
Meet-up / digital-only not offered. Delivery fee becomes part of buyer PayNow total later (checkout), not computed on this screen.

---

## Screen: Step 6 — PayNow

**Purpose**  
Configure seller PayNow proxy for dynamic QR generation per order.

**Route / URL**  
`/onboarding` (step 6)

**When it appears**  
Fulfillment complete; PayNow incomplete.

**When it is skipped**  
Never if incomplete.

**Required inputs**  
Proxy type (mobile | UEN); proxy value (format-valid); recipient name (defaults to store name, ≤50).

**Optional inputs**  
Additional payment instruction (≤200).

**Buttons**  
Continue.

**Links**  
None.

**Progress indicators**  
Wizard; “Step 6 of 7 — PayNow”.

**Validation**  
SG mobile: 8 digits starting with 8 or 9 · UEN format · recipient non-empty.

**Loading / Error / Success**  
Inline format hints; server errors; sample QR appears when proxy valid.

**Empty states**  
Sample QR hidden until proxy validates.

**Exit points**  
Sign out; prior steps.

**API calls**  
`savePayNow(config)`; client `buildPayNowPayload` for sample QR only.

**Database writes**  
`UPDATE stores.paynow` JSON.

**Feature flags**  
None.

**Hidden behaviour**  
Amber notice: payment is **not** automatically verified. Sample QR uses S$23.00 / reference `SAMPLE-001`. Completeness helper only checks type + value + recipient (not proxy format) for progress; save enforces format.

---

## Screen: Step 7 — Preview & Publish (+ Success)

**Purpose**  
Checklist + mini storefront preview; publish store; celebrate and exit.

**Route / URL**  
`/onboarding` (step 7)

**When it appears**  
All data gates met and `status === 'draft'`.

**When it is skipped**  
If somehow status already non-draft with complete data → page redirects to `/` (never shows step 7).

### Pre-publish UI

**Required inputs**  
None new — publish re-validates all gates server-side.

**Buttons**  
“Publish Store” / “Publishing…” (disabled if checklist incomplete or pending).

**Checklist items**  
1. Store name added  
2. Subdomain claimed  
3. Vibe selected  
4. Shop intro set up  
5. First product added  
6. Fulfillment configured  
7. PayNow payment configured  

**Preview**  
`MiniPreview` (hero + products + vibe) — **not** full cart/checkout/QR buyer flow.

**API**  
`publishStore()` → `UPDATE stores SET status = 'published'`

### Success UI (client state after publish)

**Buttons / links**  
- Copy Link  
- Open Store (new tab)  
- Share on WhatsApp (`wa.me` with store URL text)  
- Go to Dashboard → `/`

**Not present (vs older PRD)**  
“Add to Instagram Bio”.

**Error states**  
Publish failure; copy failure message.

**Exit points**  
Go to Dashboard; Open Store; abandon on success screen (refresh also lands on dashboard because status published).

**Hidden behaviour**  
Success view is local React state (`published`). Refresh after publish: server derives `"done"` → redirect `/`. Seller **cannot** reach dashboard without publishing while still `draft`.

---

## Screen: Dashboard Home (post-onboarding)

**Purpose**  
Seller home after onboarding completion.

**Route / URL**  
`https://app.{root}/` → `app/(dashboard)/dashboard/page.tsx`

**When it appears**  
`requireSellerStore` succeeds (onboarding done).

**Relation to onboarding**  
Shows store link, order summary, status; not part of the wizard but the terminal destination of the happy path.

---

## Related post-onboarding screens (editable later)

| Screen | URL | Editable vs onboarding data |
|---|---|---|
| Storefront editor | `/storefront` | Vibe, hero |
| Settings | `/settings` | Name, trade hint (slug **read-only**), fulfillment, PayNow, publish/unpublish, push |
| Products | `/products`, `/products/new`, `/products/[id]/edit` | Full CRUD |

---

# Part 3 — ASCII Mockups

## Marketing homepage (first viewport)

```
+------------------------------------------------------------------+
|                                                         [ ≡ ]    |
|                                                      (menu)      |
|                                                                  |
|                         [ NOMI LOGO ]                            |
|                                                                  |
|           Your business deserves a better storefront.            |
|                                                                  |
|     Create a beautiful storefront, showcase your products,       |
|     accept payments, and start selling.                          |
|                                                                  |
|                    [ Create my store ]                           |
|                         Sign in                                  |
|                                                                  |
|                   ↓ See What's Possible                          |
+------------------------------------------------------------------+
| Menu open:                                                       |
|   Create my store                                                |
|   Sign in                                                        |
|   Terms                                                          |
|   Privacy                                                        |
+------------------------------------------------------------------+
```

## Login (`intent=create`)

```
+------------------------------------------------------+
|              (brand grain / orbs bg)                 |
|  +------------------------------------------------+  |
|  |  nomi                                          |  |
|  |                                                |  |
|  |  Create your store                             |  |
|  |  Get started in minutes — no website required. |  |
|  |                                                |  |
|  |  [optional: Sign-in failed. Please try again.] |  |
|  |                                                |  |
|  |  [ G  Continue with Google ]                   |  |
|  |                                                |  |
|  |  ─────────── Why Nomi ───────────              |  |
|  |  [⚡] Set up your store in minutes             |  |
|  |  [↗] Start selling across social media         |  |
|  |  [☰] Manage orders and customers easily        |  |
|  |                                                |  |
|  |  By continuing, you agree to Nomi's            |  |
|  |  Terms of Service and Privacy Policy.          |  |
|  +------------------------------------------------+  |
|                                                      |
|                 ← Back to Nomi                       |
+------------------------------------------------------+
```

(`intent=login` swaps title to “Welcome back” and description to manage-store copy.)

## Onboarding shell (all steps 1–7)

```
+------------------------------------------------------+
|  nomi                              [ Sign out ]      |
|                                                      |
|  Set up your store                                   |
|  [====][====][====][    ][    ][    ][    ]          |
|   1     2     3     4     5     6     7              |
|  Step N of 7 — {label}                               |
|                                                      |
|  (step content below)                                |
+------------------------------------------------------+
```

## Step 1 — Name + slug

```
+------------------------------------------------------+
|  What is your store called?                          |
|  Your store name and link. You can change the name   |
|  later — the link is yours once claimed.             |
|                                                      |
|  Store name                                          |
|  [ Sarah Bakes________________________ ]             |
|                                                      |
|  Your store link                                     |
|  [ sarahbakes____________ ] .{root}                  |
|  ✓ sarahbakes.{root} is available                    |
|     (or Checking… / ✗ Already taken)                 |
|  [ sarahbakes-sg ] [ sarahbakesofficial ] …          |
|                                                      |
|  [error if any]                                      |
|                                                      |
|  [ Continue ] / [ Claiming… ]                        |
+------------------------------------------------------+
```

## Step 2 — Vibe

```
+------------------------------------------------------+
|  Choose your storefront vibe                         |
|  Swipe through styles… dashboard stays the same.     |
|                                                      |
|  ← swipe (mobile: "Swipe sideways…") →               |
|  +------------+ +------------+ +------------+        |
|  | [MiniPrev] | | [MiniPrev] | | [MiniPrev] | …     |
|  | Strada     | | Noir       | | Atelier    |        |
|  | tagline    | | tagline    | | …          |        |
|  | Best for:… | | Best for:… | |            |        |
|  |[Use vibe]  | |[Use vibe]  | |            |        |
|  +------------+ +------------+ +------------+        |
|                                                      |
|  ──────── What do you sell? ────────                 |
|  Optional — helps suggest product categories later.  |
|  [ General shop ] [ Food & drink ] [ Handmade… ] …   |
|                                                      |
|  [ Continue setup ]  (disabled until vibe saved)     |
+------------------------------------------------------+
```

## Step 3 — Hero

```
+------------------------------------------------------+
|  Introduce your shop                                 |
|  Add your logo, shop name, and a short line…         |
|                                                      |
|  +---------------------------+  +------------------+ |
|  | Your logo (optional)      |  | How it looks on  | |
|  | [file upload]             |  | your shop        | |
|  | [Remove logo]             |  | +--------------+ | |
|  | Size: [S][M][L]           |  | | MiniPreview  | | |
|  | Shape: [plain|round|…]    |  | | (vibe+hero)  | | |
|  |                           |  | +--------------+ | |
|  | Short line above… (opt)   |  +------------------+ |
|  | [ Handmade in Singapore ] |                       |
|  | Shop name                 |                       |
|  | [ Sarah Bakes___________] |                       |
|  | One-line description (opt)|                       |
|  | [ Fresh bakes…__________] |                       |
|  +---------------------------+                       |
|                                                      |
|  [ Continue ] / [ Saving… ]                          |
+------------------------------------------------------+
```

## Step 4 — Product

```
+------------------------------------------------------+
|  Add your first product                              |
|  You can publish with one product and add more…      |
|                                                      |
|  (after ≥1 product:)                                 |
|  +------------------------------------------------+  |
|  | 1 product so far / Product added.              |  |
|  | · Signature Cookie — S$9.50 · Desserts         |  |
|  +------------------------------------------------+  |
|                                                      |
|  Product name     [ ____________________ ]           |
|  Price (S$)       [ 9.50_______________ ]            |
|  Product image    [ file ]  (thumb if set)           |
|  Category         [ CategoryPicker / suggestions ]   |
|  Description      [ textarea ________________ ]      |
|                                                      |
|  [ Save product ] / [ Add another product ]          |
|                                                      |
|  [ Continue setup ]   ← only if products.length > 0  |
+------------------------------------------------------+
```

## Step 5 — Fulfillment

```
+------------------------------------------------------+
|  How will customers receive their orders?            |
|  Choose one or both. Delivery fee added to PayNow.   |
|                                                      |
|  +------------------------------------------------+  |
|  | [✓] Self-pickup                                |  |
|  | Pickup instructions [ _____________________ ]  |  |
|  | Pickup location (opt) [ __________________ ]  |  |
|  +------------------------------------------------+  |
|  +------------------------------------------------+  |
|  | [ ] Local delivery                             |  |
|  | Delivery fee (S$) [ 5.00 ]                     |  |
|  | Delivery instructions [ ________________ ]     |  |
|  +------------------------------------------------+  |
|                                                      |
|  [ Continue ]                                        |
+------------------------------------------------------+
```

## Step 6 — PayNow

```
+------------------------------------------------------+
|  Set up PayNow payment                               |
|  Your store will generate a PayNow QR for each…      |
|                                                      |
|  +------------------------------------------------+  |
|  | Payment is not automatically verified. Check   |  |
|  | your bank or PayLah app before marking paid.   |  |
|  +------------------------------------------------+  |
|                                                      |
|  PayNow type                                         |
|  (•) Mobile number   ( ) UEN                         |
|                                                      |
|  PayNow mobile number                                |
|  [ 91234567________________ ]                        |
|                                                      |
|  Payment recipient name                              |
|  [ Sarah Bakes_____________ ]                        |
|                                                      |
|  Additional payment instruction (optional)           |
|  [ ________________________ ]                        |
|                                                      |
|  +------------------+                                |
|  | Sample QR        |                                |
|  | (S$23 · SAMPLE)  |                                |
|  | [████████]       |                                |
|  +------------------+                                |
|                                                      |
|  [ Continue ]                                        |
+------------------------------------------------------+
```

## Step 7 — Preview & publish

```
+------------------------------------------------------+
|  Preview & publish                                   |
|  Your store link: sarahbakes.{root}                  |
|                                                      |
|  +------------------------+  +--------------------+  |
|  | ✓ Store name added     |  | Storefront preview |  |
|  | ✓ Subdomain claimed    |  | +----------------+ |  |
|  | ✓ Vibe selected        |  | | MiniPreview    | |  |
|  | ✓ Shop intro set up    |  | +----------------+ |  |
|  | ✓ First product added  |  +--------------------+  |
|  | ✓ Fulfillment config…  |                          |
|  | ✓ PayNow payment…      |                          |
|  |                        |                          |
|  | [ Publish Store ]      |                          |
|  +------------------------+                          |
+------------------------------------------------------+
```

## Step 7 — Success (after publish)

```
+------------------------------------------------------+
|                                                      |
|           Your store is live 🎉                      |
|           sarahbakes.{root}   (link)                 |
|                                                      |
|              [ Copy Link ]                           |
|              [ Open Store ]                          |
|              [ Share on WhatsApp ]                   |
|              [ Go to Dashboard ]                     |
|                                                      |
+------------------------------------------------------+
```

---

# Part 4 — User Journey

Walkthrough of the **first-time seller happy path**, including every transition.

1. **User lands on marketing homepage** (`{root}/`).  
   Sees logo, headline, “Create my store” / “Sign in”.

2. **Clicks “Create my store”.**  
   Navigates to `app.{root}/login?intent=create`.

3. **Sees “Create your store” login card.**  
   Benefits list + Terms/Privacy. Clicks **Continue with Google**.

4. **Button shows “Redirecting…”.**  
   Browser goes to Google OAuth consent.

5. **Google authenticates user.**  
   Redirects to `app.{root}/auth/callback?code=…&next=/`.

6. **Callback exchanges code for session.**  
   Redirects to `app.{root}/`.

7. **Middleware rewrites `/` → `/dashboard`.**  
   Dashboard page calls `requireSellerStore()`.

8. **No store yet → redirect `/onboarding`.**  
   Onboarding page loads; `deriveOnboardingStep` → **1**.

9. **Step 1:** User enters store name (slug auto-fills).  
   Sees availability check. Clicks **Continue** (“Claiming…”).  
   Server inserts `stores` row (`draft`). Refresh → step **2**.

10. **Step 2:** User swipes vibe carousel, clicks **Use this vibe**.  
    Optionally taps a trade hint. Clicks **Continue setup**. → step **3**.

11. **Step 3:** Title prefilled with store name.  
    Optionally uploads logo / fills eyebrow & subheading.  
    Clicks **Continue**. Hero JSON saved → step **4**.

12. **Step 4:** Fills product name + price (optional image/category/description).  
    Clicks **Save product**. Product listed; **Continue setup** appears.  
    (Optional: add more products.) Clicks **Continue setup** → step **5**.

13. **Step 5:** Enables pickup and/or delivery; fills required fields.  
    Clicks **Continue**. → step **6**.

14. **Step 6:** Chooses mobile or UEN; enters proxy + recipient.  
    Sample QR appears when valid. Clicks **Continue**. → step **7**.

15. **Step 7:** Reviews checklist + mini preview.  
    Clicks **Publish Store** (“Publishing…”).  
    `status` → `published`. Success UI appears.

16. **Success:** May copy / open / WhatsApp.  
    Clicks **Go to Dashboard** → `/`.

17. **Dashboard home** loads (shell with nav).  
    Storefront is live at `{slug}.{root}`.

### Alternate journeys

| Path | Flow |
|---|---|
| Returning incomplete seller | Login → `/` → redirect `/onboarding` at next incomplete step |
| Returning published seller | Login → `/` dashboard |
| “Sign in” from marketing | Same OAuth; `intent=login` copy only |
| Mid-wizard sign out | Session cleared → `/login`; data retained in DB; resume later |
| Refresh mid-wizard | Same URL; lands on derived incomplete step |
| Click earlier progress bar | Client shows that step; forward still requires completing current gates |
| Abandon at step 7 without publish | Remains trapped on `/onboarding` step 7 forever until publish |
| Publish then unpublish (Settings) | Still onboarding `"done"`; dashboard accessible |

---

# Part 5 — Data Collected

| Step | Data | Why (product intent) | Stored where | Editable later? | Required? | Defaults | Validation |
|---|---|---|---|---|---|---|---|
| Auth | Google identity / email (Supabase Auth) | Account ownership | Supabase Auth | Via Google/account | Yes | — | OAuth |
| 1 | Store name | Brand identity | `stores.name` | Yes (Settings) | Yes | — | trim, ≤60 |
| 1 | Slug | Public subdomain | `stores.slug` | **No** (Settings read-only) | Yes | auto from name | 3–40, `[a-z0-9-]`, unique, not reserved |
| 2 | Vibe | Storefront theme | `stores.vibe` | Yes (`/storefront`) | Yes | — | enum of 12 |
| 2 | Trade hint | Category suggestions | `stores.trade_hint` | Yes (Settings) | No | null | enum of 5 |
| 3 | Hero title | Buyer-facing shop name | `stores.hero.title` | Yes (`/storefront`) | Yes | form defaults to store name | trim, ≤80 |
| 3 | Eyebrow / subheading | Marketing copy | `stores.hero` | Yes | No | empty | ≤40 / ≤140 |
| 3 | Logo URL + size/style | Brand mark | `stores.hero` + Storage | Yes | No | size m, style plain | image upload |
| 4 | Product name, price | Catalog | `products` | Yes (after done) | Yes | — | name; price cents 0…10000000 |
| 4 | Description, image, category | Catalog richness | `products` | Yes | No | — | desc ≤300; category normalized |
| 4 | Featured product id | Storefront feature slot | `stores.featured_product_id` | Yes (products UI) | Auto | first product | set if empty |
| 5 | Pickup / delivery config | Checkout fulfillment | `stores.fulfillment` | Yes (Settings) | ≥1 method | none | instructions; delivery fee ≥0 |
| 6 | PayNow proxy + recipient | Payment QR | `stores.paynow` | Yes (Settings) | Yes | type mobile; recipient = store name | SG mobile / UEN; name ≤50 |
| 6 | PayNow instructions | Buyer guidance | `stores.paynow.instructions` | Yes | No | empty | ≤200 |
| 7 | Status published | Go live | `stores.status` | Yes (Settings publish/unpublish) | Yes to exit | `draft` | all gates re-checked |

---

# Part 6 — Business Logic

Reasoning as reflected in **PRD §16** and/or code structure. Where the codebase only implies convenience, that is stated.

### Why authentication first
Sellers need an `owner_id` before a store row can exist. Google OAuth is the only implemented provider.

### Why store name + slug before everything else (Step 1)
PRD: the store link is the core product; claiming a subdomain creates immediate ownership and makes the store “feel real.” Code enforces one store per user and unique slug before any other setup.

### Why vibe before hero/products (Step 2)
PRD: visual, preview-driven setup; vibe controls fonts/colors/atmosphere of the public storefront. Code: mini previews on later steps depend on `store.vibe`. Dashboard chrome is intentionally unaffected.

### Why trade hint sits on the vibe step
Implementation convenience + product polish: optional signal for category suggestions on the product form. **Not** a progress gate. Does not affect vibe CSS.

### Why hero before products (Step 3)
PRD: design the top of the storefront before catalog work. Code: `hero.title` is the completeness gate; logo/copy optional to reduce friction.

### Why first product before fulfillment/payment (Step 4)
PRD: kickstart the catalog; publish allowed with one product. Code: product count gate; first product auto-featured. Without products there is nothing to sell.

### Why fulfillment before PayNow (Step 5)
PRD: final PayNow QR amount depends on product subtotal **plus delivery fee**. Fulfillment must exist before payment config is meaningful for totals.

### Why PayNow before publish (Step 6)
Nomi checkout generates PayNow QRs; a store cannot take payment without proxy details. Manual verification notice sets seller expectation (no auto-capture).

### Why publish is a hard gate (Step 7)
Code: `deriveOnboardingStep` returns 7 while `status === 'draft'` even if all data is complete; `"done"` requires non-draft status. Dashboard routes use `requireSellerStore`, so incomplete/unpublished-draft sellers cannot use the app shell. This is **product policy implemented as a hard redirect**, not a soft checklist.

### Why progress is derived, not stored
Implementation: resume-safety and single source of truth — “the next incomplete step is always recomputed from what exists” (`lib/stores/progress.ts` comment).

### Why Google-only / no skip
Implementation reality vs older PRD/Implementation.md mentions: magic link, Apple, and explicit skip are **not** in the codebase.

---

# Part 7 — Technical Flow

## Cross-cutting

| Concern | Implementation |
|---|---|
| Host routing | `middleware.ts` + `lib/host.ts` `resolveSurface` |
| Auth session refresh | `getMiddlewareUser` in Supabase middleware helper |
| Onboarding page data | Server component: user → store → products → `deriveOnboardingStep` |
| Wizard advance | Client `advance()` → clear override → `router.refresh()` |
| Dashboard gate | `requireSellerStore()` → redirect `/onboarding` if not done |
| Shell | Path contains `/onboarding` → render children only (no nav) |

## Per-step technical sequence

### Auth
1. `signInWithOAuth` → Google  
2. Callback `exchangeCodeForSession`  
3. Redirect `/` → rewrite `/dashboard` → `requireSellerStore` or onboarding  

### Step 1
1. Name change → `slugify` (if not manually edited)  
2. Debounce 400ms → `checkSlugAvailability` (rate limit 30/min/IP)  
3. Queries `reserved_slugs` + `stores.slug`  
4. Continue → `createStore` → INSERT `stores`  
5. Refresh → step 2  

### Step 2
1. “Use this vibe” → `saveVibe` UPDATE  
2. Optional chip → `saveTradeHint` UPDATE + refresh  
3. Continue setup → client advance (no write)  

### Step 3
1. Optional logo → client upload to Storage → URL in state  
2. Continue → `saveHero` UPDATE `hero` JSON  
3. `onSuccess` → advance  

### Step 4
1. Optional image upload  
2. Save → `addProductAction` → INSERT `products`  
3. Maybe UPDATE `featured_product_id`  
4. `revalidatePath` products + storefront  
5. Client refresh list; Continue setup → advance  

### Step 5
1. Continue → `saveFulfillment` UPDATE `fulfillment`  
2. Advance  

### Step 6
1. Client builds sample QR payload when valid  
2. Continue → `savePayNow` UPDATE `paynow`  
3. Advance  

### Step 7
1. Publish → recount products + re-check all completeness helpers  
2. UPDATE `status='published'`  
3. Client sets `published=true` success UI  
4. Go to Dashboard → `/` (now passes `requireSellerStore`)  

### Asynchronous / loading
- OAuth redirect  
- Slug debounce checks  
- Image uploads (hero/product)  
- All server actions via `useTransition` pending flags  
- `router.refresh()` after most saves  

---

# Part 8 — Edge Cases (implemented)

| Case | Current behavior |
|---|---|
| Duplicate slug (already taken) | Availability error + suggestion chips |
| Duplicate slug race on insert | Postgres `23505` → “Already taken” |
| Reserved slug | “This name is reserved” (`www`, `app`, `nomi`, `login`, …) |
| Invalid slug format | Client + server format errors |
| Slug check spam | Rate limited 30/60s/IP |
| Slug check network failure | “Couldn't check availability. Try again.” |
| Second store for same user | `createStore` → “You already have a store” |
| Refresh mid-wizard | Resume at derived incomplete step |
| Browser back | Browser history; server state still authoritative on reload |
| Progress bar to future step | Disabled |
| Progress bar to past step | Allowed via `stepOverride` |
| Session expiry / not signed in | Redirect `/login`; actions throw/return not signed in |
| OAuth cancel / fail | Friendly client error or `/login?error=auth` |
| Signed-in user opens `/login` | Redirect `/` |
| Incomplete seller opens `/products` etc. | Redirect `/onboarding` |
| Complete seller opens `/onboarding` | Redirect `/` |
| Leave step 7 without publishing | Remains on onboarding (cannot access dashboard) |
| Publish then unpublish | Still `"done"`; dashboard OK |
| Suspended / unpublished storefront | Buyer-side unavailable; seller onboarding still done if non-draft + complete |
| Invalid PayNow on save | Format error; Continue disabled until valid |
| PayNow complete-but-malformed in DB | Progress may treat as complete (`paynowIsComplete` is presence-based); save path enforces format |
| Missing fulfillment details | Continue disabled / server rejects |
| Empty hero title | Continue disabled / server rejects |
| Product add during onboarding | Allowed |
| Product edit/archive during onboarding | Blocked (`Store not ready`) |
| Zero products at publish | Server rejects “Complete all onboarding steps first” |
| Copy link failure | “Copy failed — select and copy manually.” |
| Sign out mid-flow | Session cleared; store data kept; resume after login |
| Deleted store (`status=deleted`) | Excluded from seller queries → treated as no store → step 1 |
| Draft store with all fields filled | Stays step 7 until publish |
| Category filters toast during onboarding | May show “filters live” + preview link even while draft |

---

# Part 9 — Current Pain Points (Observation Only)

No solutions proposed — observations from the as-built flow:

1. **Must publish to escape onboarding** — a fully configured draft seller cannot open the dashboard, products list, or settings. Feels like a hard wall at step 7.
2. **Two “names”** — `stores.name` (step 1) and `hero.title` “Shop name” (step 3) are separate; easy to think they are the same field.
3. **Step 1 copy vs slug permanence** — copy says name can change later (true) and implies link permanence (true); slug is permanently read-only in Settings.
4. **Vibe requires two actions** — save vibe (“Use this vibe”) then separately “Continue setup”; intentional (no auto-advance) but adds a click.
5. **Trade hint placement** — optional chips appear after a long carousel; easy to miss; not required so some sellers never set it.
6. **Product form does not reset after add** — “Add another product” keeps prior field values; awkward overwrite UX.
7. **Continue setup on products only after save** — cannot proceed without at least one successful insert; obvious, but first-time sellers must discover the second button after save.
8. **Mini preview ≠ full buyer preview** — publish step does not walk cart/checkout/QR despite PRD language; expectation gap if sellers read older docs.
9. **Long horizontal vibe carousel** — 12 vibes; mobile swipe required; decision fatigue risk.
10. **Hero step can feel redundant** when title defaults to store name and logo is optional — still a full step.
11. **Google-only auth** — no email magic link; friction for users who avoid Google.
12. **No in-wizard “save & exit”** — only Sign out; incomplete work is in DB but UX exit is abrupt.
13. **Slug availability debounce** — brief “Checking…” waits; Continue stays disabled until check returns.
14. **Success screen vs refresh** — success is client state; refresh jumps to dashboard (fine) but Copy/WhatsApp moment can be skipped accidentally.
15. **Onboarding vs dashboard visual continuity** — wizard is branded but isolated (no nav); after publish, information architecture jumps to full shell.
16. **Manual PayNow verification warning** — correct for product, but adds cognitive load at a high-friction step.
17. **Returning to earlier steps** — allowed, but re-saving is the only way to change data; no dedicated “edit” framing.
18. **Filters-live toast during draft** — preview link goes to storefront that may not be publicly useful until publish.

---

# Part 10 — Final Summary

## Onboarding map

```
01. Marketing homepage
02. Authentication (Google OAuth via /login)
03. Create store — name + slug          [Step 1]
04. Select vibe (+ optional trade hint) [Step 2]
05. Configure hero / shop intro         [Step 3]
06. Add product(s)                      [Step 4]
07. Configure fulfillment               [Step 5]
08. Configure PayNow                    [Step 6]
09. Preview & publish                   [Step 7]
10. Success (live store)
11. Dashboard home + public storefront
```

## Estimates (first-time seller, happy path)

| Metric | Estimate |
|---|---|
| **Onboarding screens (wizard steps)** | **7** (+ login + marketing entry + success state) |
| **Distinct UI surfaces in the funnel** | **10** counting marketing, login, 7 steps, success, dashboard |
| **Clicks (minimum, excluding typing & Google UI)** | **~12–16** (Create → Google → Continue × steps → Use vibe → Continue setup → saves → Publish → Dashboard) |
| **Form fields touched (typical)** | **~12–18** required/commonly filled (name, slug, vibe, title, product name/price, fulfillment fields, PayNow fields); more if logo/optional copy/extra products |
| **Approximate completion time** | **8–15 minutes** for a careful first-time seller with one product and a logo; **~5–8 minutes** if skipping optionals and moving quickly |

## Key implementation facts (quick reference)

| Fact | Detail |
|---|---|
| Progress storage | Derived from DB (`deriveOnboardingStep`) |
| Skip | Not available |
| Auth providers | Google only |
| Feature flags | None |
| Exit criterion | `stores.status ≠ 'draft'` with all data gates met |
| Public URL shape | `{slug}.{root}` |
| Primary code entry | `components/onboarding/wizard.tsx`, `lib/stores/progress.ts`, `app/(dashboard)/dashboard/onboarding/actions.ts` |

---

*End of audit. This document is the baseline for the next redesign/polish phase.*
