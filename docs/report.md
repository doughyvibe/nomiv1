# Nomi — Product Refinement Report

> **Phase:** Product Refinement & Polish (post feature-complete)  
> **Date:** 2026-07-14  
> **Scope:** Full product surfaces — marketing, auth, onboarding, dashboard, storefront buyer journey  
> **Out of scope for this phase:** New features, new vibes, PayNow/cart/order/RLS redesigns unless required to fix a polish/trust gap named below  
> **Status:** Audit only — no implementation yet

---

## 1. Executive summary

Nomi is **functionally complete end-to-end**: a seller can onboard, publish, manage products and orders; a buyer can browse, checkout, pay via PayNow QR, and notify the seller. Storefront vibes are shipped. The product is ready for a **quality phase**, not a feature phase.

What separates “works” from “feels production-ready” is concentrated in four places:

1. **Buyer trust at the money moment** — checkout pricing transparency, post-payment contact, order page survival if the store is unpublished.
2. **Merchant setup friction** — onboarding vibe auto-advance, missing post-onboarding store identity edits, onboarding visually disconnected from brand.
3. **Platform consistency** — two CTA languages, uneven success/error feedback, missing error/404 boundaries, broken legal links on login.
4. **Mobile conversion continuity** — sticky cart only on shop home; highest-stakes screens (PDP → cart → checkout → pay) lose the primary cart affordance.

This report groups findings into **refinement initiatives** (roadmap units), then lists supporting observations. Priorities:

| Priority | Meaning |
|----------|---------|
| **Critical** | Blocks trust or launch credibility; fix before inviting real buyers/sellers |
| **High** | Material UX friction or conversion risk; fix in first polish sprints |
| **Medium** | Consistency / polish; improves perceived quality |
| **Low** | Nice-to-have cleanup, docs, dead code |

---

## 2. Guiding principle for this phase

Before proposing any new feature, ask:

> Does improving quality, usability, consistency, or trust of what already exists create more value than adding something new?

Default answer for the next stretch of work: **yes — polish first.**

---

## 3. Refinement initiatives (roadmap units)

Work should be sequenced by initiative, not by random tickets. Each initiative below groups related observations.

### Initiative A — Buyer checkout & payment trust
**Goal:** Make the pay path feel clear, fair, and recoverable.  
**Priority:** Critical → High  
**Surfaces:** Checkout, order/payment status, sticky bar, cart stale-state  
**Why first:** Money moments define whether Nomi feels safe. Functional PayNow is not enough if totals surprise buyers or they cannot recover after paying.

### Initiative B — Mobile cart continuity
**Goal:** Cart/checkout always reachable in one tap on buyer mobile.  
**Priority:** High  
**Surfaces:** `storefront-shell`, sticky bar, PDP post-add path  
**Why:** Architecture intent (“one tap from any page”) is violated today; sticky bar is home-only.

### Initiative C — Merchant onboarding & settings completeness
**Goal:** Setup feels branded, controllable, and editable after publish.  
**Priority:** High  
**Surfaces:** Onboarding wizard, vibe picker, settings, storefront editor  
**Why:** First-run experience sets retention; gaps here create “unfinished product” feeling for sellers.

### Initiative D — Platform UI system consistency
**Goal:** One visual/feedback language across marketing, login, dashboard, onboarding.  
**Priority:** High → Medium  
**Surfaces:** Brand tokens, CTAs, forms, empty/loading/error states  
**Why:** Same product currently speaks two design dialects (Warm Tactile pills vs shadcn rounded-lg).

### Initiative E — Marketing trust, SEO & legal baseline
**Goal:** Landing and auth entry feel launch-ready and legally complete.  
**Priority:** Critical (legal links) → Medium (SEO/copy)  
**Surfaces:** Marketing home, login, metadata, PWA manifest  
**Why:** Login already links to `/terms` and `/privacy` that do not exist — launch liability.

### Initiative F — Resilience boundaries
**Goal:** Branded recovery when things fail (404, server error, loading).  
**Priority:** High  
**Surfaces:** Dashboard + marketing + storefront route boundaries  
**Why:** Zero `error.tsx` anywhere; dashboard has no `not-found.tsx`. Failures look broken, not handled.

### Initiative G — Accessibility & form quality
**Goal:** Keyboard, labels, invalid states, and touch targets meet a basic launch bar.  
**Priority:** Medium → High for marketing focus rings  
**Surfaces:** Forms, marketing CTAs, onboarding steps, filters  
**Why:** Several patterns work for mouse users and fail quietly for keyboard/AT users.

### Initiative H — Doc / code hygiene (supporting)
**Goal:** Align docs with shipped product; clear stale flags and dead code.  
**Priority:** Low → Medium  
**Surfaces:** Docs, `vows.provisional`, unused components, legacy teal tokens  
**Why:** Reduces agent/human confusion; does not change user-facing quality by itself.

---

## 4. Detailed observations

Observations are numbered for reference. Related items point to their initiative.

---

### A. Buyer checkout & payment trust

#### A1. Checkout shows subtotal only — delivery fee not in a “Total due”
- **Where:** `components/storefront/checkout-form.tsx` (summary shows Subtotal; delivery fee appears only as radio label)
- **Why it matters:** Buyers may place an order believing one amount, then see a higher locked PayNow QR.
- **User impact:** Surprise at payment → abandoned PayNow, disputes, loss of trust in Nomi and the seller.
- **Recommended approach:** Always show Subtotal + Delivery (if selected) + **Total due** before submit. Mirror the payment-page amount.
- **Priority:** Critical
- **Dependencies:** Fulfillment method selection state; keep PayNow payload amount as source of truth for the QR.
- **Initiative:** A

#### A2. No seller contact channel on payment / status pages
- **Where:** `components/storefront/order-status-page.tsx` — copy says “contact {store.name}” with no phone/WhatsApp/email
- **Why it matters:** Manual PayNow verification depends on human recovery paths when QR fails, payment is ambiguous, or order expires.
- **User impact:** Paid-or-confused buyers have no way to reach the seller from the page they were told to bookmark.
- **Recommended approach:** Surface at least one seller-reachable channel if available (e.g. WhatsApp from PayNow mobile / store contact field). If none exists, add a clear “seller has not shared contact” state and strengthen bookmark + reference copy. Prefer collecting/displaying a contact during seller setup rather than inventing a new messaging system.
- **Priority:** Critical
- **Dependencies:** May need a minimal store contact field (settings) — keep YAGNI: reuse PayNow mobile if that is the intended channel.
- **Initiative:** A

#### A3. Order payment page 404s if store is unpublished
- **Where:** `lib/orders/load-order.ts` — requires `store.status === "published"`
- **Why it matters:** Seller unpublishing (or soft-suspend) bricks existing buyers mid-payment or post-payment status checks.
- **User impact:** Buyer who already has a reference loses the only status/QR page — severe trust failure.
- **Recommended approach:** Allow order lookup for existing references even when store is unpublished (read-only payment/status). Optionally show a banner: “This store is temporarily unavailable; your order still exists.”
- **Priority:** Critical
- **Dependencies:** Confirm RLS/public read paths still allow order fetch; do not re-open catalog browse for unpublished stores.
- **Initiative:** A

#### A4. Orders can be created when PayNow QR cannot be generated
- **Where:** Checkout `actions.ts` + payment page QR unavailable fallback
- **Why it matters:** Buyer completes checkout friction then hits a dead end.
- **User impact:** Wasted effort; seller gets an unpaid order that cannot be paid via the designed path.
- **Recommended approach:** Gate “Place order” on PayNow readiness (same checks as publish readiness for PayNow). If edge-case failure still occurs, explain *why* QR is unavailable and show seller contact + reference.
- **Priority:** High
- **Dependencies:** Reuse `storePublishReadiness` / PayNow validation helpers — do not duplicate rules.
- **Initiative:** A

#### A5. Expired payment is a dead end
- **Where:** Order status expired variant
- **Why it matters:** 10-minute window is intentional; recovery path is not.
- **User impact:** Buyer who was interrupted cannot easily retry without rebuilding the cart.
- **Recommended approach:** Add “Start a new order” / “Back to shop” primary CTA; optionally prefill cart from expired order line items (nice-to-have, not required for v1 polish).
- **Priority:** High
- **Dependencies:** Cart hydration from order lines if prefill is chosen.
- **Initiative:** A

#### A6. Stale cart items: silent on cart, warning only on checkout; sticky count can disagree with subtotal
- **Where:** `cart-page.tsx`, `checkout-form.tsx`, `sticky-checkout-bar.tsx`, `lib/cart/storage.ts`
- **Why it matters:** Archived/deleted products lingering in localStorage create confusing totals and counts.
- **User impact:** “2 items” with wrong money; surprise amber warning only at checkout.
- **Recommended approach:** Detect missing products on cart load; show inline notice + auto-prune or “Remove unavailable”; make sticky bar count and subtotal use the same filtered lines.
- **Priority:** High
- **Dependencies:** Shared cart-line resolution helper used by cart, sticky bar, checkout.
- **Initiative:** A / B

#### A7. Delivery address always visible when delivery is enabled (even if pickup selected)
- **Where:** `checkout-form.tsx`
- **Why it matters:** Extra fields increase cognitive load and look like the form is broken/stateful incorrectly.
- **User impact:** Confusion; more scroll on mobile; address filled “just in case.”
- **Recommended approach:** Show address only when delivery method is selected; keep server validation as backstop.
- **Priority:** High
- **Dependencies:** None
- **Initiative:** A

#### A8. Checkout errors appear at the bottom of a long form
- **Where:** `checkout-form.tsx`
- **Why it matters:** After submit, users may not see the error without scrolling.
- **User impact:** Repeated failed submits; belief that the button “does nothing.”
- **Recommended approach:** Scroll/focus first error or sticky error summary at top of form on failure; keep `role="alert"`.
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** A / G

#### A9. Weak empty checkout vs rich empty cart
- **Where:** Checkout empty state vs `cart-page.tsx` empty state
- **Why it matters:** Inconsistent quality signals “unfinished” on a critical path.
- **User impact:** Low, but undermines polish.
- **Recommended approach:** Reuse cart empty-state pattern (Continue shopping CTA).
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** A / D

#### A10. Manual PayNow model not primed before “Place order & pay”
- **Where:** Checkout CTA / copy
- **Why it matters:** Buyers may expect instant card checkout; Nomi’s model is QR + seller verify.
- **User impact:** Expectation mismatch → drop-off or confused “notify seller” step.
- **Recommended approach:** One short line before submit: “Next: PayNow QR → notify seller to verify.” Do not build a new payment method.
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** A

#### A11. No live status updates when seller confirms payment
- **Where:** Order status page
- **Why it matters:** Buyer must manually refresh; easy to miss confirmation.
- **User impact:** Unnecessary anxiety; duplicate “notify” attempts.
- **Recommended approach:** Lightweight polling while status is awaiting verification (YAGNI: interval fetch, no websockets). Respect reduced motion / battery with modest interval.
- **Priority:** Medium
- **Dependencies:** Existing order load endpoint; rate-limit awareness.
- **Initiative:** A

#### A12. Buyer email collected but no buyer-facing confirmation in-flow
- **Where:** Checkout + order creation
- **Why it matters:** Email implies communication; silence feels broken.
- **User impact:** “Did it work?” anxiety; bookmark becomes the only receipt.
- **Recommended approach:** For polish phase, either (a) set expectation copy (“Seller may contact you at …”) or (b) send a minimal order-received email if email infra already exists. Prefer (a) if email sending is not already wired — do not build a mail stack just for this.
- **Priority:** Medium
- **Dependencies:** Confirm whether Resend/CF Email (or similar) exists; if not, copy-only.
- **Initiative:** A

---

### B. Mobile cart continuity

#### B1. Sticky checkout bar only on shop home
- **Where:** `components/storefront/storefront-shell.tsx` — `isShopHome && <StickyCheckoutBar />`
- **Why it matters:** Product locks / architecture expect cart one tap away; PDP and other pages lose it.
- **User impact:** After add-to-cart on PDP, path to checkout is unclear; conversion friction on mobile.
- **Recommended approach:** Show sticky bar on shop home + PDP (and optionally cart). Hide on checkout/order to avoid CTA overlap (existing decision). Ensure bottom padding matches.
- **Priority:** High
- **Dependencies:** Avoid overlapping checkout/payment CTAs; preserve vibe-scoped sticky styles.
- **Initiative:** B

#### B2. PDP has no clear post-add path to cart/checkout
- **Where:** `components/storefront/product-detail.tsx`
- **Why it matters:** Brief “Added to cart” feedback without navigation affordance.
- **User impact:** Users add then bounce; don’t complete purchase.
- **Recommended approach:** After add, keep feedback and ensure sticky bar (B1) or temporary “View cart” link appears.
- **Priority:** High
- **Dependencies:** B1
- **Initiative:** B

#### B3. Architecture doc still describes old sticky/cart rules
- **Where:** `docs/NOMI_STOREFRONT_ARCHITECTURE.md` vs whiteboard product locks
- **Why it matters:** Agents and humans optimize against stale specs.
- **User impact:** Indirect — wrong “fixes” and reopened vibe work.
- **Recommended approach:** Reconcile architecture §4–5 with current locks (sticky scope decision after B1).
- **Priority:** Low
- **Dependencies:** After B1 decision
- **Initiative:** H

---

### C. Merchant onboarding & settings

#### C1. Vibe step auto-advances on “Use this vibe”
- **Where:** `components/onboarding/step-vibe.tsx` passes `onSuccess={onDone}` into `VibePicker`
- **Why it matters:** Merchants cannot compare vibes or set trade hint calmly; onboarding vs `/storefront` behavior differs.
- **User impact:** Accidental vibe lock-in; skipped trade hint; frustration on first run.
- **Recommended approach:** Save vibe without auto-advance; require explicit Continue. Keep trade hint on the same step with clearer optional labeling.
- **Priority:** High
- **Dependencies:** None; do not change vibe CSS.
- **Initiative:** C

#### C2. Store name / slug / trade hint not editable in Settings after onboarding
- **Where:** Settings page covers publish, fulfillment, PayNow, push — not identity
- **Why it matters:** Onboarding copy implies name can change later; it cannot. Trade hint is orphaned.
- **User impact:** Sellers stuck with typos; support burden; feeling of a prototype settings page.
- **Recommended approach:** Add a Store identity panel: editable name, read-only slug (with “contact support to change” or deliberate locked copy), editable trade hint. Link to `/storefront` for vibe/hero.
- **Priority:** High
- **Dependencies:** Server actions for name/trade hint; slug change is higher risk — keep locked unless explicitly requested.
- **Initiative:** C

#### C3. Onboarding lacks brand shell, sign-out, and Warm Tactile chrome
- **Where:** `components/onboarding/wizard.tsx`; dashboard shell bypasses onboarding
- **Why it matters:** Login/marketing/dashboard feel like Nomi; onboarding feels like a default form.
- **User impact:** Drop-off; brand discontinuity at the most important seller moment.
- **Recommended approach:** Wrap onboarding in `[data-brand]` with Wordmark + sign-out; replace teal `dashboard-primary` step dots with brand yellow tokens.
- **Priority:** High
- **Dependencies:** Token cleanup of legacy teal (D5)
- **Initiative:** C / D

#### C4. Onboarding step indicators are tiny and hard to use
- **Where:** Wizard step dots/bars
- **Why it matters:** Completed steps are tappable but look like progress decoration.
- **User impact:** Hard to go back; poor touch targets; a11y weakness.
- **Recommended approach:** Larger hit targets, clearer completed/current/future states, visible focus rings.
- **Priority:** Medium
- **Dependencies:** C3
- **Initiative:** C / G

#### C5. Vibe picker: long horizontal scroll, unused `suitableFor` / swatches, fishing placeholder products
- **Where:** `components/dashboard/vibe-picker.tsx`, `lib/vibes.ts`
- **Why it matters:** 12 vibes without guidance; placeholders skew perception during empty-store onboarding.
- **User impact:** Choice paralysis; “is this an outdoor app?” confusion.
- **Recommended approach:** Show `suitableFor` under tagline; add subtle scroll affordance; use neutral sample products when store has none. Clear `vows.provisional` when touching picker copy.
- **Priority:** Medium
- **Dependencies:** Optional cleanup of provisional flag
- **Initiative:** C

#### C6. Featured product: no unset path; star toggle lacks error feedback
- **Where:** Products list featured star control
- **Why it matters:** Merchants cannot clear featured; failures fail silently.
- **User impact:** Stuck featured product; lost trust in controls.
- **Recommended approach:** Allow unfeature; surface error with `role="alert"`.
- **Priority:** Medium
- **Dependencies:** Existing `setFeaturedProductAction`
- **Initiative:** C

#### C7. Publish readiness issues are terse and not linked to fix locations
- **Where:** Settings store status / publish checklist
- **Why it matters:** “Complete hero title” without a link to `/storefront` slows sellers.
- **User impact:** Frustration loop between Settings and Storefront.
- **Recommended approach:** Deep-link each issue to the fixing route/section.
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** C

#### C8. Product form success feedback inconsistent with other editors
- **Where:** `product-form.tsx` vs Hero/PayNow/Fulfillment “Saved” patterns
- **Why it matters:** Same mental model should produce same feedback.
- **User impact:** Uncertainty whether edit saved (especially when staying on page).
- **Recommended approach:** Unify on one pattern (button “Saved” flash or shared toast) across dashboard forms.
- **Priority:** Medium
- **Dependencies:** Initiative D toast/feedback decision
- **Initiative:** C / D

---

### D. Platform UI system consistency

#### D1. Two CTA languages (brand pills vs shadcn `Button`)
- **Where:** Marketing/login custom pills; dashboard forms use shadcn `Button`; unused `BrandCta` helpers in `dashboard-ui.tsx`
- **Why it matters:** Product feels like two apps glued together.
- **User impact:** Subtle but constant “prototype” signal.
- **Recommended approach:** Adopt one primary CTA component for platform surfaces; wire or delete `BrandCta`. Leave storefront vibe buttons alone.
- **Priority:** High
- **Dependencies:** Avoid large drive-by refactors — migrate high-traffic surfaces first (dashboard headers, settings primary actions).
- **Initiative:** D

#### D2. No shared toast / success system
- **Where:** Ad-hoc green `<p>` in product form; button text flashes elsewhere; copy actions often silent
- **Why it matters:** Feedback quality varies per screen.
- **User impact:** Missed confirmations; inconsistent confidence.
- **Recommended approach:** Pick the lightest existing pattern (prefer button flash + `role="status"` over new toast dependency unless already installed).
- **Priority:** Medium
- **Dependencies:** YAGNI — no new dep if avoidable
- **Initiative:** D

#### D3. Empty states are text-only
- **Where:** `DashboardEmptyState`
- **Why it matters:** Empty products/orders are common for new sellers; text-only feels sparse.
- **User impact:** Low motivation to take the next action (even when CTA exists).
- **Recommended approach:** Keep simple — one illustration or icon treatment + existing CTA; do not build an empty-state framework.
- **Priority:** Low
- **Dependencies:** None
- **Initiative:** D

#### D4. Success color split (`green-600` vs `emerald-*`) and mixed radii
- **Where:** Slug checks, badges, toasts, inner form cards (`rounded-md`) vs panels (`rounded-2xl`)
- **Why it matters:** Visual noise without meaning.
- **User impact:** Minor polish debt.
- **Recommended approach:** Standardize on brand-aligned success/warning tokens; align inner card radius with panels where cheap.
- **Priority:** Low
- **Dependencies:** None
- **Initiative:** D

#### D5. Legacy teal dashboard tokens + PWA `theme_color: #0d9488`
- **Where:** `styles/tokens.css` `:root` dashboard teal; `public/manifest.webmanifest`; onboarding step dots
- **Why it matters:** Brand v2 is Warm Tactile yellow; teal is v1 residue.
- **User impact:** Installed PWA chrome looks off-brand; onboarding dots wrong color.
- **Recommended approach:** Align manifest + onboarding indicators to `#F7C518` / warm ink; deprecate unused teal vars if nothing else depends on them.
- **Priority:** Medium
- **Dependencies:** Grep for `dashboard-primary` usages before deleting tokens.
- **Initiative:** D

#### D6. Dead / unused UI code
- **Where:** Unused `components/ui/card.tsx`, unused `BrandCta*`, unused `onYellow` prop, `data-surface="dashboard"` with no CSS, orphan `animate-brand-pulse` if social-proof chip never shipped
- **Why it matters:** Noise for future polish work.
- **User impact:** None directly.
- **Recommended approach:** Delete or wire in a focused hygiene PR.
- **Priority:** Low
- **Dependencies:** None
- **Initiative:** H / D

---

### E. Marketing trust, SEO & legal

#### E1. Login links to `/terms` and `/privacy` that do not exist
- **Where:** `app/(dashboard)/login/page.tsx` → `getMarketingUrl("/terms")`, `.../privacy`
- **Why it matters:** Sign-up consent links 404 — legal and trust failure at the front door.
- **User impact:** Cannot read terms before Google OAuth; looks unprofessional/risky.
- **Recommended approach:** Ship minimal Terms + Privacy pages under marketing host (even short MVP pages), or remove links until ready. Shipping pages is strongly preferred for launch.
- **Priority:** Critical
- **Dependencies:** Founder legal review of copy; keep pages boring and accurate.
- **Initiative:** E

#### E2. Marketing landing gaps vs earlier Warm Tactile intent
- **Where:** `components/marketing/marketing-home.tsx` — no hero subcopy; FAQ/stats/social-proof described in older docs but absent
- **Why it matters:** Cold traffic gets headline → CTAs with little persuasion/trust layering.
- **User impact:** Lower sign-up conversion; weaker differentiation beyond PayNow section.
- **Recommended approach:** Add one supporting sentence under H1; optionally a short FAQ (native `<details>`) for PayNow/fees/SG focus. Do not rebuild a marketing site — one composition, brand-first, per design rules.
- **Priority:** Medium
- **Dependencies:** Copy from founder; avoid purple-gradient / cream-serif AI clichés (existing Warm Tactile is correct direction).
- **Initiative:** E

#### E3. No Open Graph / Twitter / robots / sitemap
- **Where:** Marketing + root layouts
- **Why it matters:** Shared links look generic; crawl hygiene missing for launch domain.
- **User impact:** Weak social preview; SEO baseline absent.
- **Recommended approach:** Add OG title/description/image for marketing layout; `robots.txt` + simple `sitemap.xml` for marketing host only.
- **Priority:** Medium
- **Dependencies:** Brand share image asset or code-drawn OG strategy.
- **Initiative:** E

#### E4. Marketing CTA keyboard focus styles missing
- **Where:** Pill CTAs in `marketing-home.tsx`
- **Why it matters:** Keyboard users get poor/default focus affordance.
- **User impact:** Accessibility gap on primary conversion controls.
- **Recommended approach:** Add visible `focus-visible` rings matching brand; wrap page in `<main>`; consider skip link.
- **Priority:** High (a11y launch bar)
- **Dependencies:** None
- **Initiative:** E / G

#### E5. Small “Sign in” touch target in marketing nav
- **Where:** Marketing nav
- **Why it matters:** Mobile tap reliability.
- **User impact:** Mis-taps; frustration.
- **Recommended approach:** Increase hit area to ≥44px without changing composition.
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** E

#### E6. Platform brand vs default storefront (Strada) aesthetic mismatch
- **Where:** Marketing uses Warm Tactile; demo MiniPreview uses Strada B&W
- **Why it matters:** Sellers may expect stores to “look like Nomi yellow.”
- **User impact:** Mild expectation mismatch — not a bug.
- **Recommended approach:** One line of copy near preview: “Your storefront vibe is separate from the Nomi dashboard.” Optional: cycle preview vibes — only if it stays one composition and doesn’t reopen vibe work.
- **Priority:** Low
- **Dependencies:** Copy only preferred
- **Initiative:** E

---

### F. Resilience boundaries

#### F1. No `error.tsx` anywhere in the app
- **Where:** App Router tree
- **Why it matters:** Runtime/server failures fall to generic Next error UI.
- **User impact:** Feels crashed; no recovery path.
- **Recommended approach:** Add branded `error.tsx` for dashboard and storefront (and simple marketing). Include retry + home link.
- **Priority:** High
- **Dependencies:** Keep storefront vibe-safe (neutral error chrome OK).
- **Initiative:** F

#### F2. Dashboard missing `not-found.tsx`
- **Where:** `(dashboard)` segment — product/order `notFound()` calls
- **Why it matters:** Bad IDs look like a broken app.
- **User impact:** Confusion; bounce.
- **Recommended approach:** Branded 404 with links to Products / Orders / Home.
- **Priority:** High
- **Dependencies:** None
- **Initiative:** F

#### F3. Loading skeletons only on dashboard root and storefront home
- **Where:** `dashboard/loading.tsx`, `s/[slug]/loading.tsx` — no per-route for order detail, product edit, checkout, etc.
- **Why it matters:** Navigations can flash empty layouts.
- **User impact:** Perceived sluggishness/unreliability.
- **Recommended approach:** Add skeletons for highest-latency routes only (order detail, product edit, checkout/order). Avoid skeleton sprawl.
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** F

#### F4. Silent assumption that Supabase page queries succeed
- **Where:** Many dashboard server pages destructure `{ data }` without error UI
- **Why it matters:** Partial outages look like empty stores/orders.
- **User impact:** False empty states → wrong seller actions.
- **Recommended approach:** Distinguish empty vs error using existing `friendlyDbError`; show retry. Pair with F1.
- **Priority:** Medium
- **Dependencies:** F1
- **Initiative:** F

---

### G. Accessibility & form quality

#### G1. `aria-invalid` / `aria-describedby` largely unused despite Input support
- **Where:** Dashboard/onboarding/checkout forms
- **Why it matters:** Screen reader and error association gaps.
- **User impact:** Harder form completion for AT users.
- **Recommended approach:** Wire invalid state on validated fields (PayNow, slug, product price, checkout phone/email).
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** G

#### G2. Category picker uses raw `<input>` without proper label association
- **Where:** `category-picker.tsx` / product form
- **Why it matters:** Inconsistent with Label/Input system.
- **User impact:** Minor a11y + visual inconsistency.
- **Recommended approach:** Use shared `Input` + `htmlFor`.
- **Priority:** Low
- **Dependencies:** None
- **Initiative:** G

#### G3. Nested interactive controls (quick-add button inside product `Link`)
- **Where:** `product-catalog.tsx`, `featured-product.tsx`
- **Why it matters:** Fragile for keyboard/AT; accidental navigation risk.
- **User impact:** Occasional mis-clicks; a11y lint debt.
- **Recommended approach:** Restructure to sibling controls (card container with link for title/image, separate add button) without changing layout intent.
- **Priority:** Medium
- **Dependencies:** Careful vibe class preservation — do not reopen theme aesthetics.
- **Initiative:** G / B

#### G4. Orders filter pills easy to miss off-screen on mobile
- **Where:** Orders list filters
- **Why it matters:** Pending/paid filters may be unreachable discovery-wise.
- **User impact:** Missed orders management.
- **Recommended approach:** Scroll affordance or wrap; ensure active filter always visible.
- **Priority:** Medium
- **Dependencies:** None
- **Initiative:** G / C

#### G5. Mobile sign-out only via Settings (or desktop sidebar)
- **Where:** `dashboard-shell.tsx`
- **Why it matters:** Shared-device / account-switch friction.
- **User impact:** Sellers can’t find sign-out.
- **Recommended approach:** Add sign-out to mobile overflow/menu or keep but label Settings footer more obviously (“Account”).
- **Priority:** Low
- **Dependencies:** None
- **Initiative:** C

#### G6. Marketing landmarks / skip link absent
- **Where:** Marketing home
- **Why it matters:** AT navigation baseline.
- **User impact:** Harder page navigation for screen reader users.
- **Recommended approach:** `<main>`, skip-to-content link.
- **Priority:** Medium
- **Dependencies:** E4
- **Initiative:** G / E

---

### H. Hygiene, docs, and unfinished flags

#### H1. `vows.provisional` still true though visuals shipped
- **Where:** `lib/vibes.ts`
- **Why it matters:** Picker shows “Preview” badge — undermines confidence in a finished vibe.
- **User impact:** Sellers avoid Vows unnecessarily.
- **Recommended approach:** Clear flag when picker copy is touched (Initiative C5).
- **Priority:** Low
- **Dependencies:** C5
- **Initiative:** H

#### H2. Docs drift (`Implementation.md` manifesto, missing `whackaDesignToken.md`, architecture vs locks)
- **Where:** `docs/Implementation.md`, whiteboard references, `NOMI_STOREFRONT_ARCHITECTURE.md`
- **Why it matters:** Future sessions optimize against stale truth.
- **User impact:** Indirect rework cost.
- **Recommended approach:** Update Implementation current-task section; point brand token source of truth to `styles/tokens.css` `[data-brand]`; reconcile architecture with whiteboard locks.
- **Priority:** Medium (for team velocity)
- **Dependencies:** None
- **Initiative:** H

#### H3. Design reference `docs/*_storefront` packs
- **Where:** Docs folders (reference only; app does not import)
- **Why it matters:** Repo noise; whiteboard already marks disposable.
- **User impact:** None
- **Recommended approach:** Delete when founder confirms (human choice).
- **Priority:** Low
- **Dependencies:** Founder OK
- **Initiative:** H

#### H4. Phase 8.4 production deploy + real payment smoke still open
- **Where:** `docs/Implementation.md` Task 8.4; whiteboard open questions
- **Why it matters:** Polish without production proof still leaves launch risk.
- **User impact:** Real-world breakage undiscovered.
- **Recommended approach:** **Deferred by founder (2026-07-14).** Real PayNow already verified. Hold production deploy and domain purchase until polish is complete and confidence is high. Not a current sprint item.
- **Priority:** Critical (launch gate) — operational, deferred
- **Dependencies:** Founder sign-off after polish
- **Initiative:** Launch gate (post-polish)
- **Status:** ⏸️ Deferred — PayNow ✅ tested; deploy later

#### H5. Incomplete vibe branching on shared cart/checkout/PDP for some vibes (e.g. Vows falls through; Noir cart back-link gap)
- **Where:** Shared storefront components with many `isXVibe` flags
- **Why it matters:** Hand-off said do not reopen vibe themes unless asked — but functional gaps (missing back link) are UX bugs, not aesthetic rework.
- **User impact:** Uneven navigation chrome across vibes.
- **Recommended approach:** Fix functional gaps only (back links, missing structural classes) without redesigning tokens. Track aesthetic incompleteness separately and only touch if founder requests.
- **Priority:** Medium for functional gaps; Low for pure aesthetic parity
- **Dependencies:** Explicit founder permission before token/`[data-vibe]` block edits
- **Initiative:** H (guardrailed)

#### H6. No inventory / sold-out model
- **Where:** Product + storefront
- **Why it matters:** Unlimited qty is fine for MVP; “sold out” is a feature, not polish.
- **User impact:** Over-selling risk for some sellers.
- **Recommended approach:** **Do not build in this phase** unless a specific seller need appears. Document as post-polish feature candidate.
- **Priority:** Low (explicit non-goal)
- **Dependencies:** Future feature phase
- **Initiative:** Non-goal

---

## 5. Cross-cutting themes (how the product “feels”)

| Theme | Verdict |
|-------|---------|
| End-to-end capability | Strong — journeys close |
| Visual intentionality (storefront) | Strong — vibes shipped |
| Visual intentionality (platform) | Mixed — Warm Tactile present but not universal |
| Trust at payment | Weakest link relative to importance |
| Empty / loading / error craft | Partial — empties OK; errors/boundaries thin |
| Consistency of interaction patterns | Weak — success feedback & CTAs vary |
| Mobile buyer conversion path | Incomplete off home |
| Merchant first-run | Functional but friction-heavy (vibe step, brand gap) |
| Legal / SEO launch baseline | Incomplete |

---

## 6. Recommended sequencing

Suggested order for implementation sprints (still subject to founder pick):

| Sprint | Focus | Initiatives | Outcome |
|--------|-------|-------------|---------|
| **0** | Launch blockers | E1, A1, A2, A3 ✅ (2026-07-14) | Legal pages; checkout total; order page survival; seller contact. **H4 deploy deferred** — PayNow already verified; domain/deploy after polish confidence |
| **1** | Buyer conversion | B1, B2, A4, A5, A6, A7 ✅ (2026-07-14) | Sticky on browse paths; PDP view cart; PayNow gate; expired → shop; stale cart prune; delivery address conditional |
| **2** | Seller setup quality | C1, C2, C3, D5 ✅ (2026-07-14) | Vibe Continue (no auto-advance); Settings identity; branded onboarding; PWA/dashboard primary → yellow |
| **3** | Platform resilience & consistency | F1, F2, D1, D2, E4, G1 ✅ (2026-07-14) | error/404 boundaries; BrandLink; useSavedFlash; marketing focus/skip/main; form aria-invalid |
| **4** | Marketing & polish tail | C5–C7, A8–A12, G2/G4/G5, H1 ✅ (2026-07-14); **E2/E3 deferred** | Seller/buyer polish; landing redesign owned by founder later |

Do not start Sprint 4 landing items (E2/E3) until the founder’s marketing redesign. **Do not production-deploy until founder signs off post-polish.**

---

## 7. Explicit non-goals (this phase)

Unless the founder explicitly requests otherwise:

- New storefront vibes or vibe aesthetic overhauls
- New payment methods / PayNow protocol redesign
- Inventory, discounts, coupons, subscriptions, multi-currency
- Native apps, complex analytics, CRM, email marketing suite
- Rewriting the storefront into per-vibe codebases
- Large design-system extraction beyond what’s needed for CTA/feedback consistency
- Building toast libraries if a one-line status pattern suffices

---

## 8. How to use this report

1. Founder picks the next initiative (recommended: **Sprint 0** items).
2. Agent proposes a **short plan** (3–5 concrete diffs) before coding.
3. Implement with minimal diffs; run `npm run build` after meaningful changes.
4. Spot-check Strada + one other vibe **only if** shared storefront components change.
5. Mark items done in this doc or move them into whiteboard Decision Log when resolved.
6. Before any new feature request: re-read §2 and check whether a remaining Critical/High item delivers more value.

---

## 9. Observation index (quick lookup)

| ID | Priority | Initiative | One-liner |
|----|----------|------------|-----------|
| A1 | Critical | A | Checkout missing total due (delivery) |
| A2 | Critical | A | No seller contact on payment/status |
| A3 | Critical | A | Unpublished store 404s existing orders |
| A4 | High | A | Order create without PayNow readiness |
| A5 | High | A | Expired payment dead end |
| A6 | High | A/B | Stale cart honesty |
| A7 | High | A | Delivery address visibility |
| A8 | Medium | A/G | Checkout errors at bottom |
| A9 | Medium | A/D | Weak checkout empty state |
| A10 | Medium | A | PayNow expectation priming |
| A11 | Medium | A | Status polling |
| A12 | Medium | A | Email expectation vs silence |
| B1 | High | B | Sticky bar home-only |
| B2 | High | B | PDP post-add path |
| B3 | Low | H | Architecture doc drift |
| C1 | High | C | Vibe auto-advance |
| C2 | High | C | No identity settings |
| C3 | High | C/D | Onboarding unbranded |
| C4 | Medium | C/G | Tiny step indicators |
| C5 | Medium | C | Vibe picker guidance |
| C6 | Medium | C | Featured unset + errors |
| C7 | Medium | C | Publish issues unlinked |
| C8 | Medium | C/D | Product save feedback |
| D1 | High | D | Dual CTA systems |
| D2 | Medium | D | No shared success pattern |
| D3 | Low | D | Sparse empty states |
| D4 | Low | D | Color/radius drift |
| D5 | Medium | D | Teal/PWA legacy |
| D6 | Low | D/H | Dead UI code |
| E1 | Critical | E | Broken terms/privacy links |
| E2 | Medium | E | Landing persuasion gaps |
| E3 | Medium | E | OG/SEO baseline |
| E4 | High | E/G | Marketing focus styles |
| E5 | Medium | E | Sign-in touch target |
| E6 | Low | E | Brand vs Strada expectation |
| F1 | High | F | No error.tsx |
| F2 | High | F | No dashboard not-found |
| F3 | Medium | F | Sparse loading skeletons |
| F4 | Medium | F | Silent query failures |
| G1 | Medium | G | aria-invalid unused |
| G2 | Low | G | Category input labeling |
| G3 | Medium | G/B | Button-inside-link cards |
| G4 | Medium | G/C | Orders filter overflow |
| G5 | Low | C | Mobile sign-out discoverability |
| G6 | Medium | G/E | Marketing landmarks |
| H1 | Low | H | vows.provisional flag |
| H2 | Medium | H | Docs drift |
| H3 | Low | H | Disposable mockup packs |
| H4 | Critical* | Launch | Production smoke (ops) |
| H5 | Medium/Low | H | Functional vibe branch gaps |
| H6 | — | Non-goal | Inventory / sold-out |

\*H4 is a launch operational gate, not a UI implementation ticket.

---

## 10. Bottom line

Nomi’s core loop is real. The refinement phase should treat **trust, continuity, consistency, and recovery** as the product — not more features. Start with Sprint 0 (legal pages, checkout total, order-page survival, seller contact, production smoke), then buyer mobile continuity, then seller setup quality. Everything else is polish that compounds once the money path feels intentional.
)
