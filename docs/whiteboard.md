# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase 1 — Foundation & Multi-Tenant Shell:** ✅ COMPLETE (8/8 tasks).
**Just finished:** Task 1.8 — Vercel deploy prep (`npm run build` passes; manual deploy steps below).
**Next up:** Phase 2, Task 2.1 — PayNow QR generation utility.

---

## Task 1.8 Summary

Build verified. Multi-tenant routing uses `NEXT_PUBLIC_ROOT_DOMAIN` — set to `nomi.store` on Vercel, `lvh.me` locally. No extra Vercel config file needed.

---

## 👉 YOUR MANUAL CHECK — Deploy to Vercel

### Part A — Push latest code to GitHub

Your local repo has uncommitted work. Before Vercel can deploy the full app:

1. Commit and push all changes to `origin/main` on GitHub (`doughyvibe/nomiv1`).
2. Or ask the agent: "commit and push my changes".

### Part B — Create Vercel project

3. Go to **https://vercel.com** → Log in → **Add New → Project**.
4. Import **`doughyvibe/nomiv1`** from GitHub.
5. Framework: **Next.js** (auto-detected). Click **Deploy** (first deploy may fail until env vars are set — that's OK).

### Part C — Set environment variables (Vercel → Project → Settings → Environment Variables)

Add these for **Production** (and Preview if you want):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | `nomi.store` |
| `NEXT_PUBLIC_SUPABASE_URL` | *(copy from your `.env.local`)* |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | *(copy from your `.env.local`)* |

6. **Redeploy** after adding env vars (Deployments → ⋯ → Redeploy).

### Part D — Custom domain (skip if you don't own `nomi.store` yet)

7. Vercel → Project → **Settings → Domains** → add:
   - `nomi.store`
   - `app.nomi.store`
   - `*.nomi.store` *(wildcard — required for seller storefronts)*
8. Vercel shows DNS instructions. At your domain registrar, point **nameservers** to Vercel DNS (or add the CNAME/A records Vercel provides).
9. Wait for DNS propagation (minutes to hours). Vercel will show green ✓ when ready.

**No domain yet?** The `*.vercel.app` URL only shows the marketing page. Full multi-tenant (app + storefront subdomains) needs `nomi.store`. Finish domains later.

### Part E — Supabase production auth URLs

10. Supabase → **Authentication → URL Configuration** — add (keep local URLs too):

| Setting | Production value |
|---|---|
| Site URL | `https://app.nomi.store` |
| Redirect URLs | `https://app.nomi.store/auth/callback` |

11. Save.

### Part F — Verify production

12. Open these URLs (after DNS is live):
    - **https://nomi.store** → Marketing page
    - **https://app.nomi.store** → Login (or dashboard if signed in)
    - **https://demo.nomi.store** → "Storefront for: demo"
13. Sign in with Google on **https://app.nomi.store** → should land on dashboard.
14. **https://nomi.store/api/health/supabase** → `"schema":true`

**Reply with:** `task 1.8 ✅` + your production URL, or paste errors.

---

## Suggested Next Step

**Phase 2, Task 2.1 — PayNow QR generation utility.** Say "start task 2.1" after deploy is verified (or if deferring domain, say "start task 2.1" anyway — PayNow spike is local).

---

## Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-02 | Google OAuth only for sellers (PRD §31) | Buyers stay anonymous |
| 2026-07-02 | Auth callback always redirects to `app.*` dashboard | Avoids landing on localhost/marketing after OAuth |
| 2026-07-02 | `allowedDevOrigins` for `*.lvh.me` in next.config | Next.js blocks client JS from non-localhost dev origins |
| 2026-07-02 | `NEXT_PUBLIC_ROOT_DOMAIN` switches dev/prod | `lvh.me` locally, `nomi.store` on Vercel |
| 2026-07-02 | Wildcard domain required for seller storefronts | `*.nomi.store` on Vercel DNS |

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| Code pushed to GitHub? | ⏳ Needed before Vercel deploy |
| `nomi.store` domain purchased + DNS pointed? | ❓ Required for full multi-tenant prod |
| Task 1.8 production verification | ⏳ Awaiting human (Part F) |

---
