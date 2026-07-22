# System Boundaries (Product · Fulfilment · Checkout)

> Short pointer for coding agents. **Strategy SoT:** [`productsystemreport.md`](./productsystemreport.md) **Parts 0** and **7** (incl. 7b–7f).  
> Implementation backlog: [`PRODUCT_FULFILMENT_IMPLEMENTATION_PLAN.md`](./PRODUCT_FULFILMENT_IMPLEMENTATION_PLAN.md).

Do not invent a fourth system. Do not duplicate the full strategy here.

---

## Ownership

| System | Owns | Does not own |
|--------|------|--------------|
| **Product** | Offer identity: name, price, single image, description, category, status (`live` \| `archived`); opt-in variants (≤2 dims); customisation *definitions*; optional inventory; `lead_time_days` (constraint only) | Pickup/delivery dates, slots, methods, capacity, campaigns, “same-day” flags; compare-at; draft; duplicate |
| **Fulfilment** | Store ops: methods, calendar, windows/slots, blackouts, capacity, cutoffs, campaign overrides; computes allowed dates using `max(cart lead times)` | Flavour/size/message; permanent catalog fields |
| **Checkout** | Per-order collection: line config snapshot (variant + customisation answers + qty); fulfilment method + date/slot *from allowed set*; contact/address; PayNow | Inventing business rules; rewriting paid order snapshots |

**North star:** Product describes the offer. Fulfilment describes store operations. Checkout assembles one legal order from both.

```
earliest_date = today + max(lead_time_days of physical lines)
allowed_dates = Fulfilment.calendar ∩ [earliest_date …) ∩ ¬blackouts ∩ campaign ∩ capacity
```

Same-day emerges iff Fulfilment allows today **and** `max(lead_time_days) = 0` — never a product toggle.

---

## Never / Deferred

| Item | Class |
|------|--------|
| Multi-image gallery | **Deferred** |
| Product draft status | **Removed** (live \| archived only) |
| Compare-at / was-price | **Removed** |
| Duplicate product | **Removed** |
| Bundles, collections, CSV import | **Deferred** |
| Digital downloads, bookings, tickets | **Deferred** / partner |
| Multi-location inventory, Markets, metafields | **Never** |
| Selling-plan subscriptions, gift cards | **Never** |
| Barcode / cost / vendor / ERP fields | **Never** |
| 3+ option variant matrices | **Never** |
| Product-level pickup/delivery date fields | **Never** |
| Product-level “same-day” toggle | **Never** |

---

## Agent rules (minimum)

1. Product never stores available pickup dates — only `lead_time_days`.
2. Fulfilment never stores Chocolate vs Vanilla.
3. Checkout never invents rules; it presents Fulfilment options and snapshots choices.
4. Quick Add must stay one-tap for products with no required config (see Part 7b).
