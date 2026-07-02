# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase 1 — Foundation:** ✅ COMPLETE (8/8)
**Phase 2 — PayNow QR Spike:** ✅ COMPLETE (2/2)
**Phase 3 — Seller Onboarding:** ✅ CODE COMPLETE (8/8) — 👤 **awaiting your manual walkthrough below**
**Next up:** Phase 4, Task 4.1 — public buyer storefront (data loading + vibe rendering).

---

## 👉 YOUR MANUAL CHECK — Phase 3: full onboarding walkthrough

### Part A — Apply the storage migration (REQUIRED before testing image uploads)

1. Open Supabase Dashboard → **SQL Editor**.
2. Paste and run the contents of:
   `supabase/migrations/20260702120000_storage_store_images.sql`
3. Expect "Success". This creates the public `store-images` bucket (hero + product photos) with per-user upload permissions.

### Part B — Walk through onboarding as a new seller

4. `npm run dev`, then open **http://app.lvh.me:3000** and sign in with Google.
5. You should be **redirected to `/onboarding` automatically** (your account has no store yet).
6. **Step 1 — Store name:** type a name (e.g. `Sarah Bakes`) → watch the slug auto-generate → confirm "✓ available". Try `nomi` or `admin` → should show "reserved". Try editing the slug to `Bad--Slug` → format error. Continue.
7. **Step 2 — Vibe:** swipe/scroll the 4 phone previews. Industrial should look dark teal/rust with condensed uppercase type. Pick any vibe.
8. **Step 3 — Hero:** fill in title/subheading/CTA, upload a photo (any image — it's compressed client-side), reorder blocks with ↑/↓ and watch the live preview update. Continue.
9. **Step 4 — Product:** add one product with price + image. Try "Add another product", then "Continue setup".
10. **Step 5 — Fulfillment:** enable pickup and/or delivery. Confirm "Continue" stays disabled until required fields are filled.
11. **Step 6 — PayNow:** enter your real PayNow mobile (or UEN) + recipient name. A **sample QR** should render — optionally scan it with your banking app to confirm recipient. Continue.
12. **Step 7 — Publish:** all 7 checklist items should be ✓. Hit **Publish Store** → success screen. Test **Copy Link** and **Open Store** (opens `{slug}.lvh.me:3000` — currently the Phase 1 placeholder page; the real storefront is Phase 4).
13. **Resume check:** sign out mid-onboarding at any earlier step (or refresh) → sign back in → you should land on the same incomplete step.
14. **Dashboard check:** after publishing, `app.lvh.me:3000` should show your store card (not the wizard).

**Reply with:** `phase 3 ✅` or paste what broke (step + error).

---

## Known limitations (by design, not bugs)

- Published storefront subdomain still shows the **Phase 1 placeholder** — real buyer storefront is Phase 4 (Tasks 4.1–4.2).
- Unicorn/Outback/Futuristic vibes use **provisional tokens** — refined in Phase 7. Industrial is the reference.
- Hero block **drag-and-drop** parked in Backlog (move up/down buttons per PRD fallback).
- One store per seller (enforced in `createStore`).

---

## Suggested Next Step

**Phase 4, Task 4.1 — Storefront data loading + 404/unavailable states.** Say "start task 4.1" (or "start phase 4") after the walkthrough passes.

---

## Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-02 | Deploy to Cloudflare Workers (OpenNext), not Vercel | OpenNext supports Next 16; keeps all app code |
| 2026-07-02 | Domain purchase deferred until pre-launch | `NEXT_PUBLIC_ROOT_DOMAIN` env-driven; lvh.me for dev |
| 2026-07-02 | PayNow payload built in-house (`lib/paynow/`) | No maintained npm lib; validated in real banking apps (Task 2.2 ✅) |
| 2026-07-02 | Onboarding progress **derived from store data**, no step counter column | Zero schema change; resume correct by construction |
| 2026-07-02 | Server actions for all onboarding mutations, RLS as enforcement layer | No API routes needed; owner checks in DB policies |
| 2026-07-02 | Images: client-side webp compression → `store-images/{user_id}/` | 5 MB bucket cap; per-user folder RLS; public read |
| 2026-07-02 | Vibe tokens on `[data-vibe]` attribute; Industrial fully designed, other 3 provisional | One preview component renders all vibes; Phase 7 refines |
| 2026-07-02 | Publish gated client-side (checklist) + server-side (`publishStore` re-checks) | Never trust the client on the money path |

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| Storage migration applied? | ⏳ **Part A — required for image uploads** |
| Phase 3 manual walkthrough | ⏳ Part B — awaiting human |
| Custom domain for production | ⏸️ Deferred until pre-launch |

---
