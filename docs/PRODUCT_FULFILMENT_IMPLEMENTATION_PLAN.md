# Product + Fulfilment Implementation Plan

> **Status:** Source-of-truth backlog  
> **Created:** 2026-07-22  
> **Strategy SoT:** [`docs/productsystemreport.md`](./productsystemreport.md)  
> **This document:** Phases → epics → tasks for coding agents. **Do not invent a fourth system.**

---

## Executive summary (phase sequence)

| Phase | Title | Outcome |
|-------|-------|---------|
| **0** | Contracts & foundations | Shared types, cart line identity, boundary rules — no buyer-facing behaviour change |
| **1** | Product status + form shell | Draft / live / archive + progressive-disclosure product form (still flat offers) |
| **2** | Variants + honest Quick Add | Opt-in ≤2 options; bottom sheet / PDP pickers; cart & order snapshots; simple products stay one-tap |
| **3** | Customisations | Text / select / priced add-ons collected at add-to-cart; snapshotted on lines |
| **4** | Inventory + sold-out | Optional stock; hide or sold-out; decrement on paid order |
| **5** | Lead time (constraint only) | `lead_time_days` + buyer prep copy; **no** product date picker |
| **6** | Fulfilment dates + checkout step | Store calendar ∩ cart max lead time; checkout collects method + date |
| **7** | Windows, blackouts, capacity | AM/PM or named windows; blackout days; daily/slot capacity |
| **8** | Live campaigns | “Tomorrow 1–5 delivery only” override + storefront banner + checkout lock |
| **9** | Merchant UX polish | Duplicate product, price-range cards, conflict warnings, readiness copy |

**Spine rule:** Ship **Product honesty** (variants → customisations → inventory → lead-time *copy*) before full calendar ops. Never put pickup dates on products. Same-day emerges from Fulfilment ∩ lead times — never a product flag.

---

## 1. Purpose & scope

### Covers

- Redesign of the **Product system** (offer identity, choices, stock, prep constraint)
- Introduction of a first-class **Fulfilment system** (store ops: methods, calendar, capacity, campaigns)
- **Checkout / cart / storefront** integration so buyers can only place legal orders
- **Merchant UX** progressive disclosure on product and fulfilment settings surfaces

### Does not cover

- Marketing site, auth, PayNow payload math, billing/subscriptions, PWA install (already separate)
- Theme / vibe redesign (architecture stays fixed — see `NOMI_STOREFRONT_ARCHITECTURE.md`)
- Automated payment verification, email platform work, native apps

### Strategy SoT

All boundary and MVP calls defer to **`docs/productsystemreport.md`**.  
When this plan and older docs disagree, order of authority is:

1. Locked decisions in `productsystemreport.md` (and § Locked decisions below)  
2. This plan’s task acceptance criteria  
3. Live code  
4. `PRD.md` / `Implementation.md` (historical MVP — many “later” items are now Build Now)

### Explicit out of scope (Never + Deferred)

| Item | Class |
|------|--------|
| Multi-image gallery | Deferred |
| Bundles, collections, CSV import | Deferred |
| Digital downloads, bookings, tickets | Deferred / partner |
| Multi-location inventory, Markets, metafields | Never |
| Selling-plan subscriptions, gift cards | Never |
| Barcode / cost / vendor / ERP fields | Never |
| 3+ option variant matrices | Never |
| Product-level pickup/delivery date fields | Never |
| Product-level “same-day” toggle | Never |

---

## 2. Current-state audit

### What exists today (code, 2026-07-22)

| Layer | State | Key paths |
|-------|--------|-----------|
| **Products DB** | `name`, `price_cents`, `description`, `image_url`, `category`, `archived` only | `supabase/migrations/20260702100000_initial_schema.sql` |
| **Product type** | Flat `Product`; no status enum, lead time, stock, variants | `lib/stores/types.ts` |
| **Merchant form** | Name, price, image, category, description | `components/dashboard/product-form.tsx` |
| **Product actions** | Add / update / archive (no unarchive); create = immediately live | `app/(dashboard)/dashboard/products/actions.ts` |
| **Quick Add** | Always `addToCart(id, 1)` from catalog + featured | `product-catalog.tsx`, `featured-product.tsx` |
| **Cart** | `{ productId, quantity }[]` in localStorage | `lib/cart/types.ts` |
| **order_items** | `product_name`, `price_cents`, `quantity` — no `product_id`, no option snapshot | initial schema + `lib/orders/types.ts` |
| **Store fulfilment** | JSON: pickup / delivery enable + instructions + delivery fee | `FulfillmentConfig` in `lib/stores/types.ts` |
| **Checkout** | Method + contact + address; **no date/slot** | `checkout-form.tsx`, `createOrderAction` |
| **Fulfilment calendar / campaigns / capacity** | Absent | — |

### Gaps vs strategy

Variants, customisations, inventory, `lead_time_days`, product draft/live, options bottom sheet, date engine, campaign overrides, order fulfilment date/slot snapshots — **all missing**.

### Doc ↔ code discrepancies (do not silently “fix”)

| Topic | Docs say | Code does | Plan stance |
|-------|----------|-----------|-------------|
| Quick Add gate | Architecture §4: Quick Add only if description ≤100 chars | Catalog/featured always show Quick Add | **Strategy wins:** gate on required variants/customisations, not description length. Reconcile architecture in a docs task. |
| Variants / inventory / prep | PRD §13 / §17: “optional later”; onboarding must not ask | Absent (matches PRD age) | **Strategy Build Now** with progressive disclosure; onboarding stays basic fields only |
| Fulfilment | PRD: pickup + delivery methods | Methods only — no calendar | Extend into Fulfilment system; keep method JSON as v0 base |
| Featured CTA | Architecture: Featured CTA always “Add to cart” | Featured uses add / can open PDP | Phase 2: label becomes “Choose options” when required config exists |
| `Implementation.md` | Near-complete Phase 8 launch plan | Still accurate for PayNow loop | This plan is a **new** backlog track; do not rewrite old task IDs |

---

## 3. Target architecture (implementation-facing)

### Responsibilities

```
PRODUCT                         FULFILMENT                      CHECKOUT
────────                        ──────────                      ────────
Offer identity                  Methods (pickup/delivery/mail)  Line config snapshot
Price / variant prices          Calendar, blackouts             Qty
Single image                    Windows / slots                 Fulfilment method
Description, category           Capacity                        Date / slot (from allowed)
Status draft|live|archived      Cutoffs                         Contact / address
Opt-in options ≤2               Campaign overrides              PayNow amount + ref
Customisation definitions       Computes allowed dates          Server re-validation
Optional inventory              using max(cart lead times)      Never invents rules
lead_time_days (constraint)
```

### Cross-system rule (canonical)

```
earliest_date = today + max(lead_time_days of physical lines in cart)
allowed_dates = Fulfilment.calendar ∩ [earliest_date …) ∩ ¬blackouts ∩ campaign ∩ capacity
Checkout renders only allowed_dates (and windows). Server rejects anything else.
```

Same-day is offered **iff** Fulfilment allows today **and** `max(lead_time_days) = 0`.

### Conceptual data ownership

| Entity | Owner | Notes |
|--------|-------|-------|
| `products` | Product | + `status`, `lead_time_days`, `track_inventory`, `stock_qty` (or per-variant) |
| `product_options` / `product_option_values` / `product_variants` | Product | Opt-in; ≤2 dims; hard cap ≤50 variants |
| `product_customisations` | Product | Typed prompts; answers at cart time |
| `stores.fulfillment` → evolve to settings + related tables | Fulfilment | Methods remain; add calendar/campaigns |
| `store_fulfilment_campaigns` | Fulfilment | Optional live overrides |
| Cart (client) | Checkout | Line key = product + variant + customisation answers |
| `orders` / `order_items` | Checkout | Snapshots: variant label/price, customisations JSON, fulfilment method/date/slot |

### Order / line snapshot requirements

Every paid (and pending) line must retain enough to fulfil without re-reading live catalog:

- Product name (as sold)
- Unit price (after variant / add-ons)
- Quantity
- Variant identity + human labels (if any)
- Customisation answers (if any)
- Prefer retaining `product_id` / `variant_id` for ops — **immutable snapshot fields still required**

Order header must snapshot fulfilment method, fee, address (as today) **plus** fulfilment date and slot/window when Phase 6+.

---

## 4. Workstreams (parallel tracks)

| Track | Focus | Typical surfaces |
|-------|--------|------------------|
| **A — Product** | Schema, variants, customisations, inventory, lead time | migrations, `lib/products/*`, product form |
| **B — Fulfilment** | Methods, calendar engine, windows, capacity, campaigns | settings, `lib/fulfilment/*`, store JSON/tables |
| **C — Checkout / cart / storefront** | Cart identity, Quick Add sheet, PDP, checkout step, order snapshots | storefront components, cart, `createOrderAction` |
| **D — Merchant UX** | Progressive disclosure, copy, warnings, duplicate, readiness | dashboard forms, onboarding (keep simple) |

### Dependency sketch

```
A0/A1 (types, status) ──► A2 variants ──► A3 customisations ──► A4 inventory ──► A5 lead time
         │                     │                │                                    │
         │                     ▼                ▼                                    ▼
         │              C2 sheet + cart   C3 custom in sheet                   C6 uses lead time
         │                     │                │                                    │
         └─────────────────────┴────────────────┴──► B6 date engine ◄── A5 ──────────┘
                                                          │
                                                          ▼
                                                    B7 windows/capacity
                                                          │
                                                          ▼
                                                    B8 campaigns + C8 banner/lock
```

**Can parallelize:** Track D form shell work with early A schema; B method UX polish with A2–A4 (calendar still waits on A5).  
**Must wait:** Date picker in checkout (C6) waits on A5 + B6. Campaigns (B8) wait on B6–B7. Inventory decrement on paid waits on clear paid transition (already exists).

---

## 5. Phased roadmap

---

### Phase 0 — Contracts & foundations

**Goal:** Engineers share one vocabulary and cart/order extension points before behaviour changes.

**In scope:** Types, docs alignment notes, cart line identity design, inventory of touchpoints.  
**Out of scope:** Migrations that change buyer UX; variants UI.

**Dependencies:** None.

#### Epic P0-A — Shared contracts

| ID | Description | Area | Acceptance criteria | Notes / risks |
|----|-------------|------|---------------------|---------------|
| **P0-A-01** | Document Product / Fulfilment / Checkout ownership in `lib/` README or `docs/` pointer (short) | docs | New or updated short “boundaries” note links to strategy Parts 0 + 7; lists Never list | Do not duplicate full strategy |
| **P0-A-02** | Define TypeScript contracts for future `ProductStatus`, `LeadTimeDays`, cart `CartLine` (productId, variantId?, customisations?, quantity, lineKey) | db/API types | Types compile; cart still uses legacy shape via adapter **or** types marked `@future` without breaking build | Prefer additive types in `lib/cart/types.ts` / `lib/products/types.ts` |
| **P0-A-03** | Inventory call sites: list every `addToCart`, `CartItem`, `order_items` insert, product form field | docs | Checklist table in this plan §6 or appendix updated with paths | Feeds Phase 2 |

#### Epic P0-C — Architecture reconciliation note

| ID | Description | Area | Acceptance criteria | Notes |
|----|-------------|------|---------------------|-------|
| **P0-C-01** | Flag architecture Quick Add ≤100-char rule as superseded by variant/customisation policy | docs | Note in `NOMI_STOREFRONT_ARCHITECTURE.md` or plan discrepancy log; no storefront code change yet | Prevents agents “fixing” description gate |

**Definition of Done:** Types/docs only; storefront + dashboard behaviour unchanged; `npm`/tests green.

**Verification:** Smoke existing create product → Quick Add → checkout → PayNow path.

---

### Phase 1 — Product status + progressive disclosure shell

**Goal:** Merchants can safely draft products; first-timers still see a short form.

**In scope:** `status` draft \| live \| archived (migrate from `archived` bool); form sections collapsed by default; onboarding still name/price/(optional image/category/description).  
**Out of scope:** Variants, inventory UI, lead time fields (section stubs OK if hidden).

**Dependencies:** P0.

#### Epic P1-A — Status model

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P1-A-01** | Migration: add `status` (or map `archived` → status); backfill live/archived; storefront loads **live** only | db | Existing archived products not on storefront; live products unchanged; RLS unchanged in spirit |
| **P1-A-02** | Update `Product` type, loaders, validate, actions (create default `live` or `draft` — **decide in P1-A-01 notes**; recommend **live** for parity with today, draft via explicit save) | API | Create/update/archive/unarchive or set status; cannot edit archived without restore |
| **P1-A-03** | Dashboard list: filter/badge by status; archive/restore flows | dashboard | Merchant can draft→live→archive without data loss |

#### Epic P1-D — Progressive disclosure shell

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P1-D-01** | Restructure `product-form.tsx` into Basic (always) + collapsed “Choices / Ask customer / Stock / Prep” placeholders (disabled or “Coming soon” **only if** not shipping next phase immediately — prefer empty opt-in toggles wired in P2+) | dashboard | First-time form still ≤ basic fields; no new required fields; onboarding step unaffected |
| **P1-D-02** | Copy pass: no Shopify jargon (“options matrix”, “SKU graph”) | dashboard | Labels match strategy plain language |

**DoD:** Simple Quick Add path unchanged; unpublished drafts never appear on public storefront.

**Verification:** Draft product hidden on `{slug}`; live product still Quick Adds.

---

### Phase 2 — Variants + honest Quick Add *(first vertical slice)*

**Goal:** Kill DM flavour/size chaos without slowing simple catalogs.

**In scope:** Opt-in ≤2 option dimensions; variant rows with optional price override; Quick Add policy + bottom sheet; PDP pickers; cart line identity; order_item snapshot.  
**Out of scope:** Customisations, inventory, lead time, fulfilment dates.  
**Hard caps:** 2 dimensions; ≤50 generated variants; never auto-pick a random variant.

**Dependencies:** P1 (status/form shell helpful); P0 cart contracts.

#### Epic P2-A — Variant data model

| ID | Description | Area | Acceptance criteria | Notes |
|----|-------------|------|---------------------|-------|
| **P2-A-01** | Tables: options, option values, variants (product_id, combination, price_cents nullable → fall back to product price) | db | Merchant can enable choices and save; products without choices have zero variant rows (implicit offer) | |
| **P2-A-02** | Server validation: ≤2 options; combinatorial cap; unique value names | API | Reject illegal matrices with friendly errors | |
| **P2-A-03** | Product form: toggle “This product has choices” → Flavour/Size-style editors | dashboard | Untoggled = no variant UI; toggled requires ≥1 complete variant sellable | |

#### Epic P2-C — Storefront + cart + orders

| ID | Description | Area | Acceptance criteria | Notes |
|----|-------------|------|---------------------|-------|
| **P2-C-01** | Cart `CartLine` includes `variantId` + stable `lineKey`; merge rules for identical lines | storefront | Two different variants = two lines; same variant merges qty | Breaking localStorage: version key or migrate empty |
| **P2-C-02** | Shared picker UI used by PDP and sheet | storefront | Same controls; required before add | |
| **P2-C-03** | Quick Add policy: no required config → instant add; else CTA “Choose options” → bottom sheet → Add to cart | storefront | Never silent random variant; simple products one-tap | Featured + catalog |
| **P2-C-04** | Catalog card: show “From S$X” when variant prices differ | storefront | Matches strategy 7c | |
| **P2-C-05** | `createOrderAction` + `order_items`: snapshot variant labels + unit price; reject unknown/missing variant | checkout | Paid order readable in seller dashboard without live variant | Migration for new columns |
| **P2-C-06** | Seller order detail shows variant choices | dashboard | Clear human-readable labels | |

**DoD:** Simple product Quick Add regression-free; configured product cannot enter cart without choices; orders show what was bought.

**Verification scenarios:**
1. Candle, no choices → one-tap Quick Add → checkout.  
2. Cake, Flavour+Size → Choose options sheet → cart shows both → order detail shows both.  
3. Attempt API add without variant → rejected.

---

### Phase 3 — Customisations

**Goal:** Cake messages / engraving / priced add-ons without variant explosion.

**In scope:** Typed customisations (text, select, priced add-on); required vs optional; sheet + PDP; snapshots.  
**Out of scope:** File upload customisations; metafields.

**Dependencies:** P2 (sheet + cart line identity).

#### Epic P3-A — Customisation model

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P3-A-01** | `product_customisations` definitions on product | db | CRUD with types; required flag; add-on price_cents optional |
| **P3-A-02** | Form section “Ask the customer something” | dashboard | Progressive disclosure; plain labels |

#### Epic P3-C — Collect & snapshot

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P3-C-01** | Sheet + PDP render customisation fields; required blocks Add | storefront | Optional fields may be blank |
| **P3-C-02** | Line price = base/variant + add-ons; cart + checkout totals correct | storefront / checkout | Server recomputes; client display matches |
| **P3-C-03** | Snapshot answers JSON on `order_items` | checkout | Seller sees message text on order |

**DoD:** Required customisation prevents Quick Add instant path (uses sheet); optional does not force sheet if no variants.

**Verification:** Brownie + “Happy Birthday” message appears on seller order.

---

### Phase 4 — Inventory + sold-out

**Goal:** Stop double-sell for thrift / limited drops.

**In scope:** Opt-in track inventory (product or per-variant); sold-out vs hide policy; decrement on `seller_confirmed_paid` (or earlier — **see open question**); storefront badges/disabled CTAs.  
**Out of scope:** Multi-location; backorders; low-stock email.

**Dependencies:** P2 if per-variant stock; else can follow P1 for product-level only — **prefer after P2**.

#### Epic P4-A — Stock model

| ID | Description | Area | Acceptance criteria | Notes |
|----|-------------|------|---------------------|-------|
| **P4-A-01** | `track_inventory` + qty fields; variant-level qty when variants exist | db | Default track=false (unlimited) | |
| **P4-A-02** | Sold-out policy: hide \| show sold out | db / dashboard | Storefront respects policy | |
| **P4-A-03** | Decrement + restore rules on paid / cancel | API | No negative stock; concurrent order safety (transaction or conditional update) | Risk: race conditions |

#### Epic P4-C — Storefront truth

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P4-C-01** | Sold-out badge; disable Quick Add / PDP add; sheet disables OOS variants | storefront | Cannot add OOS to cart |
| **P4-C-02** | Checkout rejects OOS / oversell | checkout | Friendly error |

**DoD:** Unlimited products unchanged; tracked product at 0 cannot sell.

**Verification:** Qty 1 thrift item → two browsers → only one paid success (or second fails at checkout).

---

### Phase 5 — Lead time (constraint only)

**Goal:** Honest prep promises without teaching merchants a product calendar.

**In scope:** `lead_time_days` ≥ 0; optional buyer-facing prep copy; show on PDP (and sheet footnote OK).  
**Out of scope:** Any buyer date picker on product/catalog; fulfilment engine (Phase 6).

**Dependencies:** P1 form shell.

#### Epic P5-A — Lead time on product

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P5-A-01** | Column + validate integer ≥ 0 default 0 | db / API | |
| **P5-A-02** | Form “Prep” opt-in: days + copy | dashboard | No date controls |
| **P5-A-03** | PDP / card copy when days > 0 (“Needs 3 days to prepare”) | storefront | No date UI |

**DoD:** Lead time never collected as buyer input; Quick Add for simple products unchanged.

**Verification:** Baker sets 3 days → buyer sees copy; checkout still has no date until P6.

---

### Phase 6 — Fulfilment dates + checkout step

**Goal:** Buyers cannot pick impossible handoff dates.

**In scope:** Store-level allowed dates (weekday pattern or simple open calendar); compute `earliest = today + max(lead_time)`; checkout method + **date**; persist on order; server validate. Evolve beyond today’s method-only JSON.  
**Out of scope:** Windows/slots, capacity, campaigns (P7–P8). Mail/digital methods optional stub.

**Dependencies:** P5 (lead times); existing pickup/delivery methods.

#### Epic P6-B — Date engine

| ID | Description | Area | Acceptance criteria | Notes |
|----|-------------|------|---------------------|-------|
| **P6-B-01** | Fulfilment settings: enable date collection; default allowed weekdays | dashboard / db | Merchant can save; methods still required | Open Q: date-only vs windows in v1 — see §8 |
| **P6-B-02** | Pure function `allowedFulfilmentDates(cart, store, today)` + tests | API | Correct max(lead_time); empty cart edge; all-digital skip later | Self-check tests mandatory |
| **P6-B-03** | Merchant preview of next N allowed dates in settings | dashboard | Sanity for bakers | |

#### Epic P6-C — Checkout collection

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P6-C-01** | Checkout UI: date control listing only allowed dates | checkout | Impossible dates not selectable |
| **P6-C-02** | `orders.fulfilment_date` (+ snapshot lead rule version optional) | db / checkout | Seller order detail shows date |
| **P6-C-03** | Server rejects mismatched date/method | checkout | Tampered POST fails |

**DoD:** Method-only stores that disable date collection can keep today’s behaviour **or** all stores get dates once P6 ships — **founder call in §8**. Prefer: date step required when any cart line has `lead_time_days > 0` **or** merchant enabled calendar.

**Verification:** Mon + lead 3 → Tue/Wed disabled; Thu selectable. Cart with max lead 0 may allow today if calendar allows.

---

### Phase 7 — Windows, blackouts, capacity

**Goal:** Florist/baker ops beyond bare dates.

**In scope:** Blackout dates; per-method windows (e.g. 13:00–17:00 or AM/PM); daily or per-window capacity.  
**Out of scope:** Per-SKU capacity matrices; delivery zones polygons.

**Dependencies:** P6.

#### Epic P7-B — Ops calendar

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P7-B-01** | Blackouts CRUD | dashboard / db | Dates excluded from engine |
| **P7-B-02** | Windows on allowed dates | dashboard / db | Checkout shows window/slot when >1 |
| **P7-B-03** | Capacity counters; block when full | API / checkout | Concurrent-safe enough for SG social volume |
| **P7-B-04** | Engine + tests extended | API | Blackout ∩ window ∩ capacity |

**DoD:** Capacity exhaustion surfaces clear buyer + merchant messaging.

**Verification:** Cap 2 orders Saturday → third checkout blocked.

---

### Phase 8 — Live campaigns

**Goal:** TikTok Live “delivery tomorrow 1–5 only” without SKU hacks.

**In scope:** Campaign override (methods, date, window); storefront banner; checkout preselect/lock; conflict warning when lead times make campaign empty; auto-expire.  
**Out of scope:** New product type; influencer tooling.

**Dependencies:** P6–P7.

#### Epic P8-B — Campaign engine

| ID | Description | Area | Acceptance criteria | Notes |
|----|-------------|------|---------------------|-------|
| **P8-B-01** | Campaign model + merchant “Live mode” or equivalent UI | dashboard | Can start/stop; auto-expire | Founder UI preference §8 |
| **P8-B-02** | Engine prefers campaign ∩ lead times; detect empty set | API | Dashboard warns before publish/enable | |
| **P8-B-03** | Storefront banner while campaign active | storefront | Visible on catalog/cart before checkout | |
| **P8-B-04** | Checkout locks method/date/window; preselect when single option | checkout | Buyer cannot pick outside campaign | |

**DoD:** Campaign off restores normal calendar; forgotten campaign cannot silently brick store without merchant signal.

**Verification:** Live tomorrow 1–5 delivery only; pickup hidden; date preselected; cart item lead_time=3 → clear error.

---

### Phase 9 — Merchant UX polish

**Goal:** Speed and clarity after core systems work.

**In scope:** Duplicate product; readiness checklist copy for variants/fulfilment; compare-at optional; conflict warnings polish; architecture doc Quick Add update.  
**Out of scope:** Gallery, collections, CSV, digital.

**Dependencies:** P2+ minimum; best after P6.

#### Epic P9-D — Polish

| ID | Description | Area | Acceptance criteria |
|----|-------------|------|---------------------|
| **P9-D-01** | Duplicate product action | dashboard | Copies offer + options defs; resets stock as specified |
| **P9-D-02** | Update store readiness / publish gates if needed for fulfilment calendar | dashboard | Does not force variants |
| **P9-D-03** | Reconcile `NOMI_STOREFRONT_ARCHITECTURE.md` Quick Add rules with P2 policy | docs | Docs match code |
| **P9-D-04** | Optional compare-at price | Product | Merchandising only; not required |

**DoD:** No regression to simple Quick Add; docs aligned.

---

## 6. Backlog table (machine-friendly)

| ID | Phase | Track | Status | Summary |
|----|-------|-------|--------|---------|
| P0-A-01 | 0 | A/docs | todo | Boundary docs pointer |
| P0-A-02 | 0 | A | todo | Future TS contracts / CartLine |
| P0-A-03 | 0 | A/docs | todo | Call-site inventory |
| P0-C-01 | 0 | C/docs | todo | Architecture Quick Add discrepancy note |
| P1-A-01 | 1 | A | todo | Status migration |
| P1-A-02 | 1 | A | todo | Types + actions for status |
| P1-A-03 | 1 | D | todo | List badges / archive UX |
| P1-D-01 | 1 | D | todo | Progressive disclosure form shell |
| P1-D-02 | 1 | D | todo | Plain-language copy pass |
| P2-A-01 | 2 | A | todo | Variant tables |
| P2-A-02 | 2 | A | todo | Variant validation caps |
| P2-A-03 | 2 | D | todo | Choices toggle UI |
| P2-C-01 | 2 | C | todo | Cart line identity |
| P2-C-02 | 2 | C | todo | Shared pickers |
| P2-C-03 | 2 | C | todo | Quick Add / Choose options sheet |
| P2-C-04 | 2 | C | todo | From S$ price on cards |
| P2-C-05 | 2 | C | todo | Order item variant snapshot |
| P2-C-06 | 2 | D | todo | Seller order shows variants |
| P3-A-01 | 3 | A | todo | Customisation definitions |
| P3-A-02 | 3 | D | todo | Ask-customer form section |
| P3-C-01 | 3 | C | todo | Sheet/PDP custom fields |
| P3-C-02 | 3 | C | todo | Add-on pricing in totals |
| P3-C-03 | 3 | C | todo | Customisation snapshots |
| P4-A-01 | 4 | A | todo | Inventory fields |
| P4-A-02 | 4 | A/D | todo | Sold-out policy |
| P4-A-03 | 4 | A | todo | Decrement / concurrency |
| P4-C-01 | 4 | C | todo | Storefront OOS UI |
| P4-C-02 | 4 | C | todo | Checkout OOS reject |
| P5-A-01 | 5 | A | todo | lead_time_days column |
| P5-A-02 | 5 | D | todo | Prep form section |
| P5-A-03 | 5 | C | todo | Prep copy on storefront |
| P6-B-01 | 6 | B | todo | Calendar settings |
| P6-B-02 | 6 | B | todo | allowedFulfilmentDates engine |
| P6-B-03 | 6 | D | todo | Merchant date preview |
| P6-C-01 | 6 | C | todo | Checkout date UI |
| P6-C-02 | 6 | C | todo | Order fulfilment_date |
| P6-C-03 | 6 | C | todo | Server date validation |
| P7-B-01 | 7 | B | todo | Blackouts |
| P7-B-02 | 7 | B | todo | Windows/slots |
| P7-B-03 | 7 | B | todo | Capacity |
| P7-B-04 | 7 | B | todo | Engine extension + tests |
| P8-B-01 | 8 | B/D | todo | Campaign model + UI |
| P8-B-02 | 8 | B | todo | Empty-set conflict detection |
| P8-B-03 | 8 | C | todo | Storefront campaign banner |
| P8-B-04 | 8 | C | todo | Checkout lock / preselect |
| P9-D-01 | 9 | D | todo | Duplicate product |
| P9-D-02 | 9 | D | todo | Readiness / publish gates |
| P9-D-03 | 9 | docs | todo | Architecture Quick Add reconcile |
| P9-D-04 | 9 | A | todo | Optional compare-at |

---

## 7. Non-goals & explicit deferrals

Do **not** schedule into Phases 0–9:

- Multi-image gallery, video, SEO field farms  
- Bundles, collections, CSV, min/max qty (except as later backlog)  
- Digital downloads, bookings, tickets, subscriptions  
- Multi-location inventory, Markets, metafield CMS  
- Gift cards, barcode/cost/vendor  
- 3+ option matrices  
- Product-level pickup dates or same-day toggles  
- Delivery-zone GIS, carrier integrations  
- Shopify-parity admin (locations, channels, selling plans)

If a coding agent “needs” any of the above to finish a task ID — **stop and flag**; the task is mis-scoped.

---

## 8. Open questions for founder *(sequencing / schema blockers only)*

1. **Fulfilment MVP shape:** Date-only in Phase 6, or date + AM/PM windows in the same phase? (Strategy appendix leans either; windows are Phase 7 if we keep slices thin.)
2. **When must buyers pick a date?** Always once calendar ships, or only when `max(lead_time) > 0` / merchant toggles “ask for date”?
3. **Campaign UI:** Friendly “Live mode” toggle vs raw rule editor for v1?
4. **Lead time × campaign conflict:** Block enabling campaign, or warn + allow?
5. **Inventory decrement timing:** On `seller_confirmed_paid` only, or also soft-hold at order create?
6. **New product default status:** `live` (today’s behaviour) or `draft`?
7. **Digital products:** In or out of next two quarters? (Affects whether Fulfilment must model “no date” early.)

Locked decisions **not** reopened: three-system split; single image; ≤2 variant dims; Quick Add honesty; lead time ≠ date picker; same-day emergent; live selling = fulfilment campaign.

---

## 9. Execution protocol for future coding agents

1. **Before coding:** Read this plan + `docs/productsystemreport.md` Part 0, 7–7f, 8–9, Philosophy. Spot-check live code for the task’s files.  
2. **One task ID at a time** (e.g. `P2-C-03`). Do not pull in the next epic “while you’re there.”  
3. **Update status** in §6 (`todo` → `doing` → `done`) or note completion in `docs/whiteboard.md`.  
4. **Respect boundaries:** Product never stores pickup dates; Fulfilment never stores flavour; Checkout never invents rules.  
5. **Preserve simple Quick Add** for products with no required config — every Product/Checkout phase DoD includes this regression.  
6. **If code conflicts with this plan:** Stop; flag discrepancy; do not invent a fourth system or Shopify-shaped shortcut.  
7. **Tests:** Non-trivial engine logic (date allow-list, variant caps, stock races) leaves a small runnable check (`*.check.ts` or unit test) per ponytail rules.  
8. **Migrations:** One concern per migration; backfill carefully; never rewrite paid `order_items` snapshots.  
9. **Onboarding:** Keep first-product step basic; advanced Product features live in dashboard form via progressive disclosure.  
10. **PRD / Implementation.md:** Historical. Do not resurrect bottom nav, email-MVP, or “variants later” as blockers.

---

## Appendix — Suggested manual QA matrix (cumulative)

| # | Scenario | Earliest phase |
|---|----------|----------------|
| 1 | Simple SKU Quick Add → PayNow | regression always |
| 2 | Flavour + size via sheet → order shows choices | P2 |
| 3 | Required cake message | P3 |
| 4 | Thrift qty 1 → second buyer blocked | P4 |
| 5 | Lead time copy on PDP; no date on product | P5 |
| 6 | Baker lead 3 → early dates disabled at checkout | P6 |
| 7 | Same-day cookies (lead 0 + today allowed) | P6 |
| 8 | Saturday capacity full | P7 |
| 9 | Live campaign tomorrow 1–5 delivery only | P8 |
| 10 | Campaign vs lead_time 3 conflict messaging | P8 |

---

*End of implementation plan. Strategy SoT remains `docs/productsystemreport.md`.*
