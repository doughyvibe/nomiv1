# Founder build guide — Product + Fulfilment

> You are non-technical. This page is your map while the coding agent builds the plan.
> Strategy: `docs/productsystemreport.md` · Backlog: `docs/PRODUCT_FULFILMENT_IMPLEMENTATION_PLAN.md`

---

## How we are building

**Orchestrator (this chat):** plans, locks decisions, assigns work, verifies builds, only asks you when a product choice is needed.

**Worker agents:** implement phases in order. Phases 0–9 product/fulfilment backlog are **done**.

---

## Decisions locked

| Topic | Default |
|-------|---------|
| New products | Always **live** on save |
| Off shop | **Remove from shop** (archive). **Delete forever** only if never ordered |
| Draft / compare-at / duplicate | **Removed** (mobile trim) |
| Multi photos | **Later** — still one photo |
| Date at checkout | When “ask for date” is on **or** cart has prep days |
| Time windows | Settings → Fulfillment |
| TikTok Live | Settings → Live mode |
| Stock | Decrements when you mark paid |

---

## Quick checks

| Area | Check |
|------|--------|
| Product | Add → shows on shop. Remove → hidden. Put back → live again. Delete forever works only if never sold. |
| Choices | Simple = one-tap. With choices = must pick. |
| Custom | Required message shows on order. |
| Stock | Qty 1 → second paid confirm fails. |
| Prep | Prep days show on product; no product calendar. |
| Dates | Checkout blocks too-soon / blackout dates. |
| Capacity | Daily cap 2 → third blocked. |
| Live | Banner + tomorrow delivery only; End Live restores. |

---

## Status board

| Phase | Status |
|-------|--------|
| 0–9 Product + Fulfilment | **Done** |
| Mobile trim (no draft / compare-at / duplicate) | Apply migration `20260722110000_drop_compare_at_and_draft.sql` |

Updated as work completes.
