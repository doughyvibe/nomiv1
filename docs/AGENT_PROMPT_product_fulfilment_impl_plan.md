# Prompt: Produce Nomi Product + Fulfilment Implementation Plan

Copy everything below the line into a high-level coding agent that has access to this repo.

---

## Role

You are a senior product engineer / tech lead working in the **Nomi** monorepo (`nomiv1`).

Your job is **not** to write feature code yet.

Your job is to produce a **high-level Implementation Plan** that will become our **source of truth backlog**: phases → epics → tasks, ordered so we can build systematically without context drift.

Write the plan as a new markdown file:

**`docs/PRODUCT_FULFILMENT_IMPLEMENTATION_PLAN.md`**

Do not modify application code, migrations, or UI in this pass unless a tiny clarifying note in docs is required.

---

## Mandatory reading (in this order)

Read these thoroughly before drafting. Prefer docs over assumptions; verify against the live codebase when docs and code disagree — **note the discrepancy in the plan**.

1. **`docs/productsystemreport.md`** (primary strategy SoT)  
   Especially: Part 0 system boundaries, Part 7–7f architecture, Part 8 progressive disclosure, Part 9 MVP / Later / Never, Philosophy.

2. **`docs/PRD.md`** — current product MVP definitions and explicit non-goals.

3. **`docs/NOMI_STOREFRONT_ARCHITECTURE.md`** — storefront structure.

4. **`docs/Implementation.md`** — existing orchestration / phase notes if relevant.

5. **`docs/uxreview.md`** / **`docs/onboarding.md`** — only sections that touch products, cart, checkout, or first-product friction.

6. **Codebase (spot-check, do not redesign blindly):**
   - Product schema / types: Supabase migrations for `products`, `lib/stores/types.ts`, `lib/products/*`
   - Merchant product UI: `components/dashboard/product-form.tsx`, product actions
   - Storefront: `components/storefront/product-catalog.tsx`, `featured-product.tsx`, `product-detail.tsx`, cart context
   - Checkout / orders: checkout routes, `order_items` shape, PayNow flow
   - Onboarding product step if present

---

## Locked product decisions (do not reopen)

Treat these as **non-negotiable** unless you find a hard technical contradiction (then flag it; do not silently reverse):

### Three systems — one source of truth each

| System | Owns | Does **not** own |
|--------|------|------------------|
| **Product** | Offer identity, price, single image, description, category, status, **opt-in variants**, customisations, optional inventory, **`lead_time_days` as constraint only** | Pickup/delivery dates, slots, methods, campaign windows |
| **Fulfilment** | Store methods, calendars, windows, blackouts, capacity, live/campaign overrides; computes allowed dates using cart lead times | Flavour/size/cake message |
| **Checkout** | Collects line config + fulfilment choice + PayNow; snapshots; validates server-side | Permanent catalog definition; inventing business rules |

### Explicit MVP product calls

- **Single product image** — multi-image gallery **deferred**
- **Variants** — optional, merchant opt-in, ≤2 option dimensions, hard cap on generated variants
- **Quick Add** — instant only if no required variants/customisations; otherwise **“Choose options” → bottom sheet** (same controls as PDP). Never auto-pick a random variant.
- **Lead time** — on Product; **never** a buyer date picker on the product. Fulfilment date UI disables impossible dates.
- **Same-day** — not a product flag; **emerges** from Fulfilment allowing today ∩ lead times allowing today
- **TikTok Live-style “tomorrow 1–5 delivery only”** — Fulfilment **campaign override**, with storefront banner + locked checkout options
- **Never (core):** multi-location inventory, metafield CMS, selling-plan subscriptions, gift cards, barcode/cost/vendor, Markets, 3+ option matrices, Product-level pickup date fields

### Philosophy

Nomi is **not** Shopify. Prefer the smallest system that stops DM chaos and impossible orders. Progressive disclosure: complexity is opt-in.

---

## What to produce

Create **`docs/PRODUCT_FULFILMENT_IMPLEMENTATION_PLAN.md`** with this structure:

### 1. Purpose & scope
- What this plan covers / does not cover
- Link to `docs/productsystemreport.md` as strategy SoT
- Explicit out-of-scope list (Never + Deferred gallery, etc.)

### 2. Current-state audit
Short, accurate snapshot of **what exists today** in code (products fields, Quick Add behaviour, cart/order line shape, checkout, fulfilment absence). Call out gaps vs the strategy doc.

### 3. Target architecture (implementation-facing)
- Product / Fulfilment / Checkout responsibilities (diagram or crisp tables)
- Data ownership sketch (tables/entities at **conceptual** level — not full SQL yet unless helpful)
- Cross-system rules: e.g. `earliest_date = today + max(lead_time_days)` ∩ fulfilment calendar
- Order/line-item snapshot requirements (variant, customisations, fulfilment)

### 4. Workstreams (parallel tracks)
Separate clearly:
- **Track A — Product system**
- **Track B — Fulfilment system**
- **Track C — Checkout / cart / storefront integration**
- **Track D — Merchant UX** (progressive disclosure, forms, settings surfaces)

Show dependencies between tracks (what can parallelize vs what must wait).

### 5. Phased roadmap
Break into **Phases** (e.g. Phase 0 foundation → Phase 1 …). Each phase must include:

- **Goal** (merchant/buyer outcome in one sentence)
- **In scope / out of scope** for that phase
- **Dependencies** (prior phases, track blockers)
- **Epics** under the phase
- **Tasks** under each epic, each with:
  - Stable ID (`P1-A-03` style)
  - Description (what to build)
  - Primary area (db / API / dashboard / storefront / checkout / docs)
  - Acceptance criteria (testable bullets)
  - Notes / risks / open questions
- **Definition of Done** for the phase (including “no regression to simple Quick Add for simple products”)
- **Suggested verification** (manual QA scenarios from the strategy doc: baker with lead time, live campaign, sold-out, etc.)

Phases should let us ship **vertical slices** where possible (e.g. variants + Quick Add sheet before full fulfilment calendar), without violating system boundaries.

### 6. Backlog table (machine-friendly)
A single consolidated table or checklist of all task IDs in order, with phase, track, status=`todo`, so we can execute **task-by-task** later.

### 7. Non-goals & explicit deferrals
Mirror strategy: gallery, bundles, collections, CSV, digital, bookings, etc. — so future agents do not “helpfully” sneak them into early phases.

### 8. Open questions for founder
Only questions that **block sequencing or schema**. Do not reopen locked decisions.

### 9. Execution protocol for future coding agents
Write a short “how to use this plan” section, e.g.:
- Always read this plan + `productsystemreport.md` before coding
- Implement **one task ID at a time**
- Do not expand scope mid-task
- Update task status in the plan (or note) when done
- If code conflicts with the plan, stop and flag — do not invent a fourth system

---

## Quality bar

The plan must be:

- **Actionable** — a coding agent can pick `P2-B-01` and know what to do
- **Boundary-safe** — Product vs Fulfilment vs Checkout never blurred
- **Sequenced** — dependencies explicit; no “do inventory and campaigns and metafields” blob
- **Grounded** — reflects actual Nomi files/patterns, not generic ecommerce boilerplate
- **Opinionated** — prefer the strategy’s Build Now spine; do not re-litigate Shopify parity
- **Phased for learning** — early phases should reduce DM chaos (variants/customisations/Quick Add honesty) even if full Fulfilment calendar ships slightly later, **as long as** lead time is not falsely implemented as a product date picker

Avoid:
- Writing migrations or React components in this pass
- Huge optional “Phase 9: everything Shopify”
- Vague tasks like “improve UX” without acceptance criteria

---

## Deliverable format

- One markdown file at **`docs/PRODUCT_FULFILMENT_IMPLEMENTATION_PLAN.md`**
- Clear headings, stable task IDs, scannable tables
- Start with a 10–15 line executive summary of the phase sequence

When finished, reply with:
1. Path to the plan file
2. Phase list (titles only)
3. Any blocking open questions
4. Any doc↔code discrepancies you found

---
