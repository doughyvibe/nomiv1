# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## What Nomi is (product north star)

**Nomi** is a Singapore-first storefront builder for sellers who sell via social (IG / TikTok / WhatsApp).

| Layer | Claim |
|-------|--------|
| **Outcome** | A beautiful shop buyers can browse and order from — one link |
| **USP** | Dynamic **PayNow**: exact amount + order reference on every checkout QR |
| **Model** | Build free → pay when you publish (go live) |
| **Not** | Generic “link in bio” (Linktree already owns that sentence) |

Sellers: signup → onboarding → build (products, vibe, fulfillment, PayNow) → publish (gated by readiness + billing) → take orders → manually verify PayNow payments.

Buyers: open store link → browse/cart → PayNow QR → seller confirms paid.

**Brand (marketing / dashboard chrome):** Warm Tactile — sand / warm ink / yellow `#F7C518`, Hanken. Storefront look is per-**vibe** (Strada default + curated themes).

---

## Phase Status

**Phase 7 — Vibes + Marketing:** ✅ COMPLETE  
**Phase 8 — Polish, Hardening & Launch:** in progress → **Product Refinement**  
**Just finished:** Marketing landing + carousel polish; publish/billing gate; storefront coming-soon  
**Next up:** **Dashboard visual redesign** — start with Home (`components/dashboard/dashboard-home.tsx`)

**Launch note:** Real PayNow verified. Production deploy + domain deferred until polish confidence.

---

## Current work — Dashboard visual redesign

> **Status:** 🟡 Starting  
> **Surface:** Dashboard **Home** first (then other dashboard pages as we go)  
> **Code entry:** `app/(dashboard)/dashboard/page.tsx` → `components/dashboard/dashboard-home.tsx`  
> **Shared chrome:** `components/dashboard/dashboard-shell.tsx`, `dashboard-ui.tsx`

### Home today (as-built inventory)

Vertical stack, top → bottom:

1. **Header** — `👋 Welcome Back`
2. **Readiness checklist** — progress %, featured next step, collapsible list (publish step = Mark done only; no duplicate Publish CTA)
3. **Publish CTA** — only if unpublished/draft; “Ready when you are” invite copy
4. **Store Control card** — status → URL+Copy → Share → QR · Preview (hybrid B+C)

**Removed from Home:** Orders stats · Quick actions · Tips · old Store Link utility panel

### Redesign notes

- Hierarchy locked: Welcome → Checklist → Publish → Store Control
- Checklist last step (“Publish with confidence”) has no Publish button — dedicated section below
- Checklist open rule (soft): incomplete always expands on load (mid-session collapse OK, not persisted); 100% defaults collapsed and remembers preference
- Publish CTA copy: “Ready when you are” / invite, not urgency — does not compete with checklist
- **Store Control card** shipped (hybrid): Live/Paused/Not live yet + URL/Copy + Share (native) + QR dialog + Preview
- **Pause (product):** proposal below — not built yet

### Pause store — product note (open)

Holiday / restock need is real. Today `unpublished` already takes the shop offline (public → “Store closed”); Settings has Unpublish; billing lapse also → `unpublished`.

| Approach | Idea | Verdict |
|----------|------|---------|
| A. UX-only | Relabel Unpublish→Pause, resume via Publish if sub active | **v1 pick** — no schema |
| B. New `paused` status | Distinct from billing unpublished | Defer until we need different gates |
| C. Soft pause | Stay `published`, block checkout only | Different product (browse-but-closed); later |

**Affects if we deepen Pause:** storefront gate, Settings copy, Home status, resume vs paywall, orders still reachable, optional public “temporarily closed” page, billing-lapse vs intentional pause distinction.

---

### Decision needed

| # | Item | Status |
|---|------|--------|
| 1 | Store Control card layout | ✅ Hybrid B+C shipped |
| 2 | Pause v1 = relabel `unpublished` (no new status)? | ⏳ Open |
| 3 | Visual direction for rest of dashboard Home | ⏳ Open |
| 4 | Scope: Home only vs shell + nav in same pass | ⏳ Open |

---

## Durable locks (still true)

| Lock | Detail |
|------|--------|
| Storefront default vibe | **Strada** (`strada`) — white/`#111`, Inter, solid black CTAs |
| Marketing claim↔proof | Hero = better storefront; Exact PayNow = later chapter |
| Docs reading order | `whiteboard.md` → architecture → `Implementation.md` → code. `PRD.md` = intent only (as-built banner) |
| Guardrails | Don’t reopen vibe theme CSS unless asked; minimal diffs; PayNow/cart/RLS only when asked |

---

## Decision Log (recent)

| Date | Decision | Why |
|---|---|---|
| 2026-07-21 | Store Control card (hybrid B+C) replaces Store Link on Home | Post-publish: status → share tools |
| 2026-07-21 | Pause: propose UX-only over `unpublished` first; no new status yet | Holiday need real; avoid schema until gates differ |
| 2026-07-21 | Checklist open: incomplete always expands on load (session-only collapse); 100% defaults closed + persists preference | Soft variant — coach stays visible until done |
| 2026-07-21 | Home hierarchy: Welcome → Checklist → Publish → Store link; drop Orders / Quick actions / Tips; checklist publish step has no Publish CTA | Founder: avoid duplicate publish; Home = setup + share |
| 2026-07-21 | Whiteboard reset for **dashboard visual redesign**; archive completed marketing/carousel scratch | Founder: prior whiteboard work done; next surface = dashboard |
| 2026-07-17 | Landing carousel v2: CSS phone + peeks + Embla | DaisyUI-inspired; founder approved |
| 2026-07-15 | Landing v3.1 shipped (Warm Tactile, logo monument, dual CTA, demos, PayNow chapter) | Claim↔proof fix |
| 2026-07-14 | Sprints 0–4 (non-marketing polish) done; H4 deploy deferred | PayNow live-tested; deploy after polish confidence |
| 2026-07-14 | Strada = system default | Strict B&W + Inter |

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| Dashboard Home visual redesign | 🟡 In progress (this chat) |
| Real-phone mobile verification (8.3) | 👤 Checklist |
| Production deploy + domain (8.4) | ⏸️ Deferred |
| Delete `docs/*_storefront` mockup packs | Safe — human choice |

---
