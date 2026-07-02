# Nomi

Mobile-first, PayNow-ready storefront platform for Singapore social sellers.

One Next.js app serves three surfaces by hostname (see `docs/Implementation.md`):

| Hostname | Surface |
|---|---|
| `nomi.store` | Marketing site |
| `app.nomi.store` | Seller dashboard |
| `{slug}.nomi.store` | Public storefront |

## Getting Started

```bash
npm install
npm run dev
```

Multi-tenant routing needs a wildcard-friendly local host, so use **`lvh.me`** (resolves to 127.0.0.1), not `localhost`:

- Marketing: http://lvh.me:3000
- Dashboard: http://app.lvh.me:3000
- Storefront: http://demo.lvh.me:3000

Copy `.env.example` to `.env.local` and fill in the Supabase values.

## Docs

- `docs/PRD.md` — product requirements
- `docs/Implementation.md` — living task-by-task plan (source of truth)
- `docs/whiteboard.md` — current state, decisions, manual checklists

## Deploy

Nomi deploys to **Cloudflare Workers** via the OpenNext adapter (`@opennextjs/cloudflare`):

```bash
npm run preview   # build with OpenNext + run the Worker locally
npm run deploy    # build + upload to Cloudflare Workers
```

Deploy via **Workers** only — not Cloudflare Pages Git builds (they pin an old wrangler that miscompiles OpenNext). See Task 1.8 in `docs/Implementation.md` and the manual checklist in `docs/whiteboard.md`.
