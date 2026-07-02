# Nomi — Whiteboard

> Scratch space for orchestration, decisions, and "where are we" notes.
> Read this + `docs/Implementation.md` at the start of every session.

---

## Phase Status

**Phase 1 — Foundation & Multi-Tenant Shell:** 7/8 tasks done.
**Current:** Task 1.8 — Deploy to **Cloudflare Workers (OpenNext)**. Part A (scaffold) ✅ done. Part B–G (Cloudflare account + deploy + domain) pending.
**Next up:** Phase 2, Task 2.1 — PayNow QR generation utility (can start without a domain).

---

## Domain decision — defer until pre-launch ✅

**You do not need to buy a domain now.**

| When | What |
|---|---|
| **Now (building)** | Local dev on `lvh.me` — full multi-tenant (marketing / app / storefront). |
| **Anytime (optional)** | `npm run deploy` → smoke test on `nomi.<account>.workers.dev` (single host, marketing page only). Confirms deploy pipeline works. |
| **Pre-launch (required)** | Buy domain → set `NEXT_PUBLIC_ROOT_DOMAIN=<domain>` on Worker → attach apex + `app.` + `*.` wildcard in Cloudflare → update Supabase OAuth URLs. |

`nomi.store` in docs is a **placeholder**, not a locked choice. Any domain works — routing is one env var (`NEXT_PUBLIC_ROOT_DOMAIN`). If `nomi.store` is taken, pick another (e.g. `getnomi.com`, `shopnomi.sg`) and update env + Supabase redirects once.

---

## Deployment direction (changed 2026-07-02)

Nomi deploys to **Cloudflare Workers** via the **OpenNext adapter** (`@opennextjs/cloudflare`), not Vercel.

- OpenNext supports Next.js 16 (our version, 16.2.10) on both Turbopack and webpack.
- **Deploy via Workers only** (`opennextjs-cloudflare deploy` or Cloudflare **Workers** Builds). Do **NOT** use Cloudflare Pages Git builds — they pin an old wrangler (3.114.17) that miscompiles OpenNext workers → boot-time 500s. Need wrangler ≥ 4.33.
- Middleware uses only Web APIs → runs on Workers unchanged.
- Wildcard `*.nomi.store` handled by Cloudflare DNS + Worker Custom Domains/routes.
- No Next.js app/route code changes — routing stays env-driven via `NEXT_PUBLIC_ROOT_DOMAIN`.

---

## 👉 YOUR MANUAL CHECK — Deploy to Cloudflare Workers

### Part A — Agent scaffolds OpenNext ✅ DONE

Added `@opennextjs/cloudflare`, `wrangler.jsonc`, `open-next.config.ts`, package scripts, dev hook in `next.config.ts`. Verified:
- `npm run build` ✅
- `opennextjs-cloudflare build` ✅
- `npm run preview` → `http://localhost:8787` returns 200 ✅

### Part B — Push latest code to GitHub

Your local repo has uncommitted work. Push all changes to `origin/main` (`doughyvibe/nomiv1`), or ask the agent: "commit and push my changes".

### Part C — Cloudflare account + first deploy

1. Create a Cloudflare account at **https://dash.cloudflare.com**.
2. In the project: `npx wrangler login` (opens browser to authorize).
3. `npm run deploy` — this builds with OpenNext and uploads the Worker.
   - Alternative: connect the GitHub repo as a Cloudflare **Workers** build (Workers & Pages → Create → Workers → connect repo). NOT a Pages project.

### Part D — Environment variables (Cloudflare dashboard → your Worker → Settings → Variables)

Add for Production:

| Variable | Value | Type |
|---|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | `<your-domain>` *(set when domain purchased; skip for workers.dev smoke test)* | Plaintext var |
| `NEXT_PUBLIC_SUPABASE_URL` | *(from `.env.local`)* | Plaintext var |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | *(from `.env.local`)* | Plaintext var |

(These are `NEXT_PUBLIC_*` so they are not secret. A future server-only `SUPABASE_SECRET_KEY` will be added as an encrypted **Secret**.) Re-deploy after adding.

### Part E — Custom domain + wildcard (defer until pre-launch)

**Skip this until you own a domain and are ready to go live.**

4. Cloudflare dashboard → add **your domain** as a zone. Point registrar nameservers to Cloudflare.
5. Attach the Worker to: apex (`yourdomain.com`), `app.yourdomain.com`, `*.yourdomain.com` (wildcard for storefronts).
6. Set `NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com` on the Worker and redeploy.

**Before domain:** `*.workers.dev` URL works for deploy smoke test (marketing page only — no subdomain routing).

### Part F — Supabase production auth URLs

7. Supabase → **Authentication → URL Configuration** — add (keep local lvh.me URLs too):

| Setting | Production value |
|---|---|
| Site URL | `https://app.<your-domain>` |
| Redirect URLs | `https://app.<your-domain>/auth/callback` |

### Part G — Verify production

8. After DNS is live, open:
   - **https://nomi.store** → Marketing page
   - **https://app.nomi.store** → Login (or dashboard if signed in)
   - **https://demo.nomi.store** → "Storefront for: demo"
9. Sign in with Google on **https://app.nomi.store** → should land on dashboard.
10. **https://nomi.store/api/health/supabase** → `"schema":true`

**Reply with:** `task 1.8 ✅` + your production URL, or paste errors.

---

## Suggested Next Step

**Phase 2, Task 2.1 — PayNow QR generation utility.** This is local/code-only, so it can start even before the domain DNS is finished. Say "start task 2.1".

---

## Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-07-02 | Google OAuth only for sellers (PRD §31) | Buyers stay anonymous |
| 2026-07-02 | Auth callback always redirects to `app.*` dashboard | Avoids landing on localhost/marketing after OAuth |
| 2026-07-02 | `allowedDevOrigins` for `*.lvh.me` in next.config | Next.js blocks client JS from non-localhost dev origins |
| 2026-07-02 | `NEXT_PUBLIC_ROOT_DOMAIN` switches dev/prod | `lvh.me` locally, `nomi.store` in prod |
| 2026-07-02 | **Deploy to Cloudflare Workers (OpenNext), not Vercel** | New direction; OpenNext supports Next 16, keeps all app code |
| 2026-07-02 | Workers deploy, never Cloudflare Pages Git builds | Pages pins old wrangler → OpenNext boot 500s; need wrangler ≥ 4.33 |
| 2026-07-02 | Wildcard `*.nomi.store` via Cloudflare DNS + Worker routes | Required for seller storefronts |

---

## Open Questions / Blockers

| Item | Status |
|---|---|
| OpenNext scaffolded (wrangler.jsonc, adapter, scripts)? | ✅ Part A done |
| Code pushed to GitHub? | ⏳ Needed before repo-connected deploy |
| Cloudflare account + `npm run deploy` smoke test? | ⏳ Optional now; required before launch |
| Domain purchased + wildcard DNS? | ⏸️ Defer until pre-launch |
| Task 1.8 production verification (3 surfaces + OAuth) | ⏳ After domain attached |

---
