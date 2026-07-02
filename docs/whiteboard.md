# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase 1 — Foundation & Multi-Tenant Shell:** 1/8 tasks complete.
**Just finished:** Task 1.1 — Next.js + TypeScript project initialized, boilerplate cleaned.
**Next up:** Task 1.2 — Tailwind base setup + vibe token architecture.

---

## Task 1.1 Summary

Scaffolded Next.js 16 (App Router, TypeScript, Tailwind 4, ESLint) into the repo root. Removed default create-next-app demo content (Geist fonts, Next/Vercel SVGs, starter copy). App now renders a blank page. `npm run build` and `npm run dev` both pass. Git repo initialized.

---

## 👉 YOUR MANUAL CHECK

1. Open Terminal and go to the project folder:
   ```bash
   cd ~/Desktop/nomiv1
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open **http://localhost:3000** in your browser.
4. You should see a **blank white page** with no errors.
5. Open the browser dev console (right-click → Inspect → Console). Confirm there are no red errors.
6. Stop the server with `Ctrl+C` when done.

**Optional:** run `npm run build` — it should finish with "Compiled successfully".

**Reply with:** `task 1.1 ✅` if it looks good, or paste any errors/screenshots if something fails.

---

## Suggested Next Step

**Task 1.2 — Tailwind base setup + vibe token architecture.** Say "start task 1.2" after confirming 1.1.

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
| 2026-07-02 | Next.js 16 + Tailwind 4 (latest scaffold) | create-next-app defaults; no reason to pin older versions |

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| Is `nomi.store` domain purchased? | ❓ Awaiting human answer |
| Task 1.1 manual verification | ⏳ Awaiting human confirmation |
| PayNow QR real-bank validation | ⏳ Scheduled as Task 2.2 |

---
