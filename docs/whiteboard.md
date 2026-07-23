# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.

---

## Buyer fulfilment UX (cart-forward) — shipped 2026-07-23 · polish 2026-07-24

- **Cart** collects method + date (4 earliest cards + Calendar “More dates”) + window when needed
- Order Summary collapsible (collapsed by default when fulfilment step shown)
- Sticky bar hidden on `/cart` — single in-page Continue → checkout
- Selection = vibe primary fill; draft in `localStorage`; Checkout recap + Edit → cart
- Calendar dialog: vibe portal (no brand chrome / no RDP blue). Days after cutoff = **28-day horizon** (`DEFAULT_FULFILMENT_HORIZON_DAYS`), not a picker bug.

---

## Current focus — Manual QA (Product + Fulfilment Phases 0–9)

**Status:** Phases 0–9 done · apply `20260722110000_drop_compare_at_and_draft.sql` · **re-test after mobile trim**  
**Plan SoT:** `docs/PRODUCT_FULFILMENT_IMPLEMENTATION_PLAN.md`  
**Boundaries:** Product ≠ Fulfilment ≠ Checkout (`docs/SYSTEM_BOUNDARIES.md`)

**Trim note:** No product draft, compare-at, or duplicate. Status = live \| removed (archived). Delete forever only if never ordered.

Work through the scripts below in order. For each step: do the action → check **Expected** → if wrong, note the step ID (e.g. `T4.3`) and what you saw.

### Before you start

1. Run the app locally (`npm run dev`) and open the dashboard logged in as your seller.
2. Have your public shop URL ready: `/s/{your-slug}`.
3. Use **two browsers** (or one normal + one private/incognito) for stock and capacity races.
4. Keep a notepad for fails: step ID · what you did · what you expected · what happened.
5. After Live mode tests, always click **End Live** so the shop returns to normal calendar.

---

### T1 — Live / remove products

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T1.1 | Dashboard → Products → New | Create product, save | Appears on **Shop** list and public store |
| T1.2 | Edit product | **Remove from shop** | Hidden on public shop; listed under **Removed** |
| T1.3 | Edit removed product | **Put back on shop** | Live again on shop |
| T1.4 | Unused product (never ordered) | **Delete forever** | Gone from list |
| T1.5 | Product that appeared on an order | Try delete | Blocked — “Sold before — remove instead” |

**Fail if:** Removed product still sells, or delete works on a sold product.

---

### T2 — Choices (variants) + honest Quick Add

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T2.1 | Edit a simple product (no Choices) | Leave Choices off | Shop: **one-tap Quick Add** still works |
| T2.2 | New/edit product | Turn **Choices** on → e.g. Flavour (Chocolate / Vanilla), save & live | Catalog/featured **Choose options** opens **PDP** (not a sheet) |
| T2.3 | Shop | Tap add → pick Flavour → add to cart → checkout → place order | Cart/checkout show the flavour; **seller order detail** shows the choice |

**Fail if:** Product with required choices adds with one tap and no picker, or order loses the variant text.

---

### T3 — Customisations (messages / add-ons)

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T3.1 | Edit product | Add **Ask customer** required text field (e.g. “Cake message”), save | Shop → Choose options goes to **PDP**; message required before add |
| T3.2 | Shop → order | Enter “Happy Birthday”, complete order | **Dashboard order** shows “Happy Birthday” |
| T3.3 | Optional | Add a priced add-on; select it | Line total / order total includes add-on price |

**Fail if:** Required message can be skipped, or message never appears on the seller order.

---

### T4 — Stock / sold-out

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T4.1 | Edit a thrift-style product | **Stock** on, qty **1**, policy **Show as sold out**, live | Shop shows product (not hidden) |
| T4.2 | Browser A + B | Both add to cart and **place** orders (do not confirm paid yet) | Both orders can be created (no soft-hold on stock) |
| T4.3 | Dashboard → Orders | Confirm **paid** on order A | Stock goes to **0**; product shows sold-out / add disabled |
| T4.4 | Dashboard | Confirm **paid** on order B | **Fails** with not-enough-stock (or clear error) |
| T4.5 | Optional | Cancel order A from **paid** | Stock restores to **1** |

**Fail if:** Second paid confirm succeeds, stock never decrements, or cancel-from-paid does not restore.

---

### T5 — Prep time (lead days)

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T5.1 | Edit product | **Prep** on, **3** days, save | Shop/PDP shows prep copy (needs ~3 days) |
| T5.2 | Product page | Look for a date picker on the **product** | **No** product-level calendar / pickup dates |

**Fail if:** Buyer picks dates on the product page, or prep copy never shows.

---

### T6 — Fulfilment dates at checkout

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T6.1 | Settings → Fulfillment | Enable **Ask for a date**, weekdays e.g. Mon–Sat, save | Preview list looks right |
| T6.2 | Cart with prep **3** days | Open checkout on a **Monday** (or pretend via allowed list) | Too-soon dates blocked; first OK date is after lead (e.g. Thu if Tue/Wed not allowed) |
| T6.3 | Calendar **off**, all products prep **0** | Checkout | **No** date field (method-only) |
| T6.4 | Calendar **off**, any product prep **> 0** | Checkout | Date field **still appears** |
| T6.5 | Place order with a date | Seller order + buyer receipt | Selected **date** shown |

**Fail if:** Buyer can pick an impossible early date, or date missing on order when it was required.

---

### T7 — Blackouts, windows, capacity

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T7.1 | Settings → Fulfillment | Add a **blackout** date, save | That date **gone** from checkout |
| T7.2 | Settings | Enable **AM / PM** (or two named windows), save | Checkout shows window picker when both open |
| T7.3 | Settings | Set a busy day (e.g. Saturday) **daily capacity = 2** | — |
| T7.4 | Shop | Place **2** orders for that Saturday (complete checkout) | Both succeed; window/date on orders |
| T7.5 | Shop | Third checkout for same Saturday | **Blocked** — “fully booked” / clear message |
| T7.6 | Dashboard | Cancel one of the first two | Slot frees; third attempt can succeed |
| T7.7 | Order views | Open seller order + buyer receipt | **Date + window label** visible |

**Fail if:** Blackout still selectable, third order sneaks through, or window missing on order.

---

### T8 — Live mode (TikTok-style)

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T8.1 | Settings → Fulfillment | Ensure **Delivery** is enabled | — |
| T8.2 | Settings → **Live mode** | **Go Live — tomorrow delivery 1–5pm** | Storefront shows **Live banner** |
| T8.3 | Checkout (simple product, prep 0) | Open checkout | **Delivery only**; tomorrow + **1–5pm** locked/preselected; pickup hidden |
| T8.4 | Cart with prep **3** days product | Try checkout while Live | Clear error/warning (not a blank silent picker) |
| T8.5 | Settings | **End Live** (or wait past auto-expire) | Banner gone; normal methods/dates return |
| T8.6 | Optional | Start Live while catalog has a 3-day product | Dashboard **warns**; you can still Go Live anyway |

**Fail if:** Pickup still available during Live, date not locked, or expired Live silently bricks the shop with no merchant signal.

---

### T9 — Publish readiness (no draft / compare-at / duplicate)

| Step | Where | Do this | Expected |
|------|-------|---------|----------|
| T9.1 | Product form | Look for Draft, Compare-at, Duplicate | **Not present** |
| T9.2 | Publish / readiness | Check publish checklist | Still only needs fulfilment **methods** (+ usual PayNow/vibe/product) — **not** variants or calendar |

**Fail if:** Draft/compare-at/duplicate UI is back, or publish forces calendar/variants.

---

### Smoke path (always run last)

1. Simple live product → Quick Add → cart → checkout → PayNow QR with reference.  
2. Confirm paid in dashboard → order status updates.  
3. Confirm no leftover **Live mode** and capacity still makes sense for tomorrow’s real selling day.

---

### Issue log (fill while testing)

| Step ID | What happened | Severity (blocker / annoying / niggle) |
|---------|---------------|----------------------------------------|
| | | |
| | | |
| | | |

---

## Product north star (short)

**Nomi** = SG social sellers → one shop link → dynamic **PayNow** (exact amount + reference).  
Build free → pay when you publish. Product ≠ Fulfilment ≠ Checkout.

---

## Decision Log (recent)

| Date | Decision | Why |
|---|---|---|
| 2026-07-22 | Mobile trim: drop draft, compare-at, duplicate; Remove + Delete-if-never-ordered; slash helper copy on new product/fulfilment UI | Phone-first clutter |
| 2026-07-22 | Product + Fulfilment Phases 0–9 shipped; whiteboard → founder manual QA scripts | Migrations applied; need structured smoke/regression pass |
| 2026-07-21 | Store Control card (hybrid B+C) on Home | Post-publish: status → share tools |
| 2026-07-21 | Pause: propose UX-only over `unpublished` first | Holiday need; avoid schema until gates differ |
