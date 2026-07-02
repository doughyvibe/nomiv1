# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase:** Not started — 0/38 tasks complete.
**Next up:** Phase 1, Task 1.1 (initialize Next.js project).
Plan lives in `docs/Implementation.md` (8 phases, 38 tasks).

---

## Orchestrator's Assessment: Can it be done?

**Yes — this is very buildable, even with zero coding experience.** The PRD is unusually well-scoped: no payment gateway integration, no automatic verification, standardized checkout, only 4 fixed vibes, manual seller workflows. Those choices remove the hardest 80% of e-commerce complexity. What remains is a well-trodden path (Next.js + Supabase + Vercel) that AI coding agents handle very well.

**Realistic effort:** working sessions across ~3–6 weeks part-time. Phases 1–5 give you the full core loop; Phases 6–8 make it launchable.

### The 3 real risks (in order)

1. **PayNow QR acceptance by real banking apps.** This is the entire USP. That's why the plan puts the QR spike at **Phase 2**, before any feature work. If DBS/PayLah reject our generated QR, we stop and rethink — having lost only ~1 week.
2. **Wildcard subdomains (`*.nomi.store`).** Multi-tenant routing is the trickiest architecture piece. We de-risk it in Task 1.4 with `lvh.me` locally and Vercel DNS in production. This is a solved problem, just fiddly.
3. **Design quality across 4 vibes.** "Professionally designed, not generic" is the success bar. Strategy: build **Industrial first** (it has a full reference — JigWave), nail it, then apply the same component system to the other 3 vibes in Phase 7. Never build 4 mediocre vibes in parallel.

### My suggestions for successful execution

1. **Follow the plan one task at a time.** Say "start task X.Y", I implement + verify, update both docs, give you a manual check, you confirm ✅, then we proceed. Never let a session freestyle across multiple tasks.
2. **Do the manual (👤) tasks promptly** — Supabase account, Google OAuth keys, Vercel + domain, Resend, and especially the real-phone QR test with a S$0.50 payment. I'll give you exact click-by-click instructions each time.
3. **Buy `nomi.store` early** (or accept a temporary `.vercel.app` URL until you do). Domain + wildcard DNS is needed by Task 1.8.
4. **Resist scope creep ruthlessly.** Anything tempting goes in the Backlog table in Implementation.md. The PRD's own "out of scope" list is your friend.
5. **Ship at Phase 5, polish after.** Once the core loop works (order → QR → notify → verify → confirm), you can already demo to friendly sellers on the Industrial vibe while we finish the rest.
6. **Use git commits at every task boundary** so we can always roll back a bad step. I'll handle this; you just need a GitHub account.

### Deviations I made from the PRD (flag now, not later)

- **Vercel instead of Cloudflare Pages/Workers** — much simpler wildcard-subdomain + Next.js story for a first-time builder.
- **PayNow spike promoted to Phase 2** — PRD lists it as §35; I moved it before feature build to fail fast.
- **Industrial-first vibe strategy** — other 3 vibes get provisional tokens in onboarding, full polish in Phase 7.
- **Supabase Storage for images** (instead of adding Cloudflare R2) — one less account/service to manage; can migrate later if costs demand.

---

## 👉 YOUR MANUAL CHECK

Nothing to verify yet. Before we start Task 1.1, please confirm/prepare:

1. **Node.js installed?** Open Terminal, run `node -v`. If you see v20+ we're good; if not, tell me and I'll walk you through installing it.
2. **GitHub account** — create one at github.com if you don't have it (free).
3. **Domain** — have you purchased `nomi.store`? (Not blocking until Task 1.8, but good to know.)

**Reply with:** answers to the 3 items above + "start task 1.1" when ready.

---

## Suggested Next Step

**Task 1.1 — Initialize Next.js + TypeScript project.** Say "start task 1.1".

---

## Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-02 | Next.js + Supabase + Vercel + Resend stack | Best-supported path for multi-tenant subdomains; minimal services to manage |
| 2026-07-02 | Vercel over Cloudflare Pages/Workers (PRD deviation) | Simpler wildcard subdomain + Next.js hosting |
| 2026-07-02 | PayNow QR spike = Phase 2, before feature build | Core USP must be de-risked first |
| 2026-07-02 | Industrial vibe first; Unicorn/Outback/Futuristic polished in Phase 7 | JigWave reference sets the quality bar |
| 2026-07-02 | Supabase Storage instead of Cloudflare R2 | Fewer accounts/services for the human to manage |
| 2026-07-02 | Prices stored as integer cents | Avoid floating-point money bugs |
| 2026-07-02 | `lvh.me` for local subdomain testing | Resolves to 127.0.0.1, no /etc/hosts editing |

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| Is `nomi.store` domain purchased? | ❓ Awaiting human answer |
| Node.js + GitHub ready on human's machine? | ❓ Awaiting human answer |
| PayNow QR real-bank validation | ⏳ Scheduled as Task 2.2 |

---
