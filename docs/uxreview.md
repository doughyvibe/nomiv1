# Executive UX Review — Rethinking Nomi’s Onboarding

**Classification:** Internal product review  
**Audience:** Founders, product, design  
**Stance:** First principles. No loyalty to the current wizard.  
**Baseline facts:** [`docs/onboarding.md`](./onboarding.md) (as-built audit)  
**Date:** 2026-07-17  

---

### Opening judgment

Nomi currently sells a feeling — *“a link I can put in my bio”* — and then delivers a seven-step configuration gauntlet before that feeling is allowed to exist.

That is the wrong product.

What we have built is a **store completeness checklist**, not an onboarding experience. It is competent engineering. It is not inevitable design. It asks a home baker who has never used Shopify to behave like a merchant configuring an ecommerce stack.

**The central failure is sequencing.**

We ask for brand, theme, hero copy, catalog, logistics, and payment *before* the seller is permitted to feel ownership of a living link. The emotional outcome is postponed until the administrative outcome is complete. Apple does not do this. Conversion-optimized products do not do this. Cococart’s marketing does not do this — and their marketing is winning the expectation war even when their product is imperfect.

This review assumes one success metric:

> A first-time seller should say, within minutes:  
> **“I can’t believe my store is already live.”**

By that metric, the current onboarding fails — not because any single screen is ugly, but because the *shape* of the journey is wrong.

---

# Part 1 — First Impression

Walkthrough as a first-time Instagram seller. Never seen Nomi. Phone in hand. Tired. Hopeful.

---

### Marketing homepage

**Thinking:** “Okay… nicer than Shopify. Is this for people like me?”  
**Expecting:** A link. Fast. Simple.  
**Exciting:** Brand presence is strong. The promise is clear enough.  
**Hesitation:** Still abstract. I haven’t *felt* a store yet.  
**Abandon risk:** Low, if the CTA is immediate.

**Emotional note:** Curiosity. Not yet trust.

---

### Login — “Create your store” + Continue with Google

**Thinking:** “Wait — I have to sign in before I even see my store?”  
**Expecting:** Maybe a name field first. Or a preview. Instead: identity gate.  
**Confusing:** Why Google only? What if I don’t want Google tied to my side hustle?  
**Exciting:** Almost nothing. Auth is never exciting.  
**Momentum:** Stops cold.  
**Abandon risk:** Medium–High for privacy-anxious or Google-averse sellers.

**Emotional note:** Friction before romance. We collected a user before we earned delight.

---

### Redirect storm (callback → dashboard → onboarding)

**Thinking:** “Where am I? Did it work?”  
**Expecting:** Continuity.  
**Confusing:** Invisible redirects. No welcome. Suddenly a wizard.  
**Momentum:** Broken by architecture the seller never asked to understand.

**Emotional note:** Mild disorientation. Trust dips slightly.

---

### Step 1 — Store name + slug

**Thinking:** “Oh — *this* is what I came for. My link.”  
**Expecting:** Exactly this, ideally sooner.  
**Exciting:** Seeing `myname.nomi.store` appear is the first real spark.  
**Hesitation:** Slug permanence anxiety (“the link is yours once claimed”). Checking… waiting…  
**Abandon risk:** Low–Medium if the name is taken repeatedly.

**Emotional note:** First genuine moment of ownership — and it arrives *after* auth.

---

### Step 2 — Vibe carousel (12 themes) + trade hint

**Thinking:** “Am I designing a brand right now? I just wanted a link.”  
**Expecting:** Maybe one nice default. Not a design studio.  
**Confusing:** Twelve vibes. Sample products that aren’t mine. “Use this vibe” then *also* “Continue setup.”  
**Exciting:** Previews can be pretty — for sellers who enjoy aesthetics.  
**Momentum:** Slows hard. Decision fatigue enters.  
**Abandon risk:** High for non-designers; Medium for design-curious sellers.

**Emotional note:** We asked for taste before we asked for a product. That is backwards psychology.

---

### Step 3 — Hero / introduce your shop

**Thinking:** “I already gave you my store name… why am I naming the shop again?”  
**Expecting:** Maybe a logo. Not a second naming ceremony.  
**Confusing:** Eyebrow, title, subheading, logo size, logo shape — website vocabulary.  
**Exciting:** Live preview helps a little.  
**Momentum:** Drains. Feels like busywork when title defaults to store name.  
**Abandon risk:** Medium. Quiet quitters leave here without drama.

**Emotional note:** Redundancy. The product is asking me to re-confirm what I already said.

---

### Step 4 — Add first product

**Thinking:** “Okay. This I understand. I sell cookies.”  
**Expecting:** Name, price, photo.  
**Exciting:** Putting a real product in feels like progress again.  
**Confusing:** Category suggestions, description, two buttons after save (“Add another” vs “Continue setup”), form doesn’t clear.  
**Momentum:** Recovers — then stalls if photo upload is slow.  
**Abandon risk:** Medium (photo perfectionism, pricing anxiety).

**Emotional note:** This is the first step that matches the seller’s mental model of “having a shop.”

---

### Step 5 — Fulfillment

**Thinking:** “Pickup… delivery fee… instructions… this is getting real / heavy.”  
**Expecting:** Maybe later. Or one smart default (“Self-pickup, details later”).  
**Confusing:** Logistics language before they’ve even shared a link.  
**Exciting:** None.  
**Momentum:** Administrative.  
**Abandon risk:** Medium–High. “I’ll finish this tonight” — they don’t.

**Emotional note:** Operations anxiety. Side hustlers feel like they’re registering a business.

---

### Step 6 — PayNow

**Thinking:** “They’re asking for my phone number / UEN. Is this safe? Am I committing?”  
**Expecting:** Payment setup near first order — not before I’ve even published.  
**Confusing:** Manual verification warning. Sample QR. Proxy type.  
**Exciting:** Sample QR is clever, but arrives as pressure, not delight.  
**Momentum:** High friction. Highest trust demand of the whole funnel.  
**Abandon risk:** **Critical.** Sensitive data + incomplete confidence = leave and never return.

**Emotional note:** Vulnerability without payoff. We asked for money rails before the store felt real.

---

### Step 7 — Preview & publish

**Thinking:** “Finally. But also — I couldn’t leave until now?”  
**Expecting:** The big moment. A full experience of my shop.  
**Confusing:** Mini preview only. Checklist of things I already did.  
**Exciting:** Publish → “Your store is live” — genuine relief.  
**Hesitation:** Did I do enough? Is the mini preview trustworthy?  
**Abandon risk:** Low if they got here; Medium if checklist somehow fails.

**Emotional note:** Relief, not wow. The wow was delayed so long that publish feels like finishing homework.

---

### Success → Dashboard

**Thinking:** “Okay I’m in. Now what? Where’s the bio link ritual?”  
**Expecting:** A single obsessed CTA: copy link, put it in Instagram, done.  
**Confusing:** Full dashboard shell appears — orders, nav, settings gravity.  
**Momentum:** Diffuses into “app.”

**Emotional note:** We earned a celebration and immediately replaced it with software.

---

### First-impression summary

| Moment | Emotion |
|---|---|
| Marketing | Curious |
| Auth | Interrupted |
| Name + link | **Hope** |
| Vibe | Overwhelmed |
| Hero | Bored / confused |
| Product | Competent |
| Fulfillment | Anxious |
| PayNow | Exposed |
| Publish | Relieved |
| Dashboard | Lost again |

**The journey peaks early (link), crashes in the middle (aesthetics + logistics), and ends in relief rather than delight.**

That is not an Apple trajectory. Apple peaks at the moment the product becomes *yours*.

---

# Part 2 — Screen Importance Ranking

| Screen | Rank | Why it exists today | Customer problem | Business problem | If it disappeared tomorrow |
|---|---|---|---|---|---|
| Marketing home | **Important** | Acquisition | “Is this for me?” | Trust & conversion | Traffic has nowhere to land |
| Google auth | **Critical** (timing questionable) | Account ownership | Secure access | Identity / ownership | No accounts — but it need not be the *first* emotional beat |
| Step 1 Name + slug | **Critical** | Claim identity + URL | “I need a link” | Unique store namespace | Product ceases to exist |
| Step 2 Vibe | **Optional → Unnecessary in onboarding** | Differentiate storefronts | Taste / brand fit | Theming system needs a value | Default theme; edit later. Almost nothing breaks for first sale |
| Step 3 Hero | **Unnecessary in onboarding** | Storefront intro content | “Look professional” | Hero JSON completeness | Auto-fill from store name; polish later |
| Step 4 Product | **Critical** | Something to sell | “Customers need to buy a thing” | Catalog required for commerce | Store is an empty shell — link without purpose |
| Step 5 Fulfillment | **Important, but postponable** | Checkout needs a method | “How do they get it?” | Order ops | Soft default (e.g. pickup TBD) until first order config |
| Step 6 PayNow | **Critical for first *paid* order; not for first *wow*** | Payment QR | “How do I get paid?” | Monetization integrity | Can sell the dream earlier; cannot complete paid checkout without it |
| Step 7 Publish gate | **Unnecessary as a hard wall** | Completeness enforcement | “Make it live” | Prevent half-baked public stores | Auto-publish or publish-at-claim with progressive completeness |
| Success / share | **Critical** | Emotional payoff | “I have something to post” | Activation / retention | Sellers never ritualize the bio link |
| Dashboard (as exit) | **Helpful later; distracting as climax** | Ops home | Manage orders | Habit loop | Fine after celebration — wrong as the victory screen |

### Removals / postponements (executive)

| Item | Recommendation |
|---|---|
| Vibe step in onboarding | **Remove from onboarding.** Ship a strong default (Strada). Invite theme play *after* first product or after first share. |
| Hero step in onboarding | **Remove.** Infer title from store name. Logo/subheading = post-onboarding polish. |
| Trade hint | **Remove from onboarding** or infer later from first product/category. |
| Hard publish wall | **Remove.** Do not imprison sellers in a wizard until payment + fulfillment + theme are done. |
| Fulfillment as blocking step | **Postpone** with a safe default, or collapse into a 10-second choice. |
| PayNow as blocking before any “live” feeling | **Postpone the *feeling* of success before PayNow**, even if paid checkout stays gated. Or collect PayNow at the moment of first “share to Instagram” with one field. |
| 7-step progress chrome | **Collapse.** Seven dots announce: “This will take a while.” |

---

# Part 3 — Section Importance

Element-level audit across the funnel. Classifications: **Must Have · Nice To Have · Decorative · Redundant · Distracting**

---

### Marketing

| Element | Class | Why |
|---|---|---|
| Brand / logo as hero | Must Have | Trust + recognition |
| One clear promise | Must Have | Anchors emotional outcome |
| Primary CTA | Must Have | Conversion |
| Secondary Sign in | Nice To Have | Returning users |
| Demo / proof river | Nice To Have | Social proof; not required for CTA |
| Menu clutter (Terms mid-decision) | Distracting | Legal belongs at consent, not at desire |

---

### Login

| Element | Class | Why |
|---|---|---|
| Continue with Google | Must Have (given current auth) | Only door |
| Intent copy (Create / Welcome back) | Nice To Have | Sets tone |
| Benefits list | Decorative → borderline Distracting | Delays the only action; reads as brochure |
| Terms / Privacy | Must Have | Trust boundary |
| Back to Nomi | Nice To Have | Escape hatch |

---

### Wizard chrome

| Element | Class | Why |
|---|---|---|
| Wordmark | Must Have | Orientation |
| Sign out | Must Have | Control / safety |
| “Set up your store” | Nice To Have | Context |
| 7 progress bars | **Distracting** | Broadcasts length; invites anxiety |
| “Step N of 7 — label” | **Distracting** | Same; frames work as homework |
| Brand grain / orbs | Decorative | Fine if content is short; expensive if funnel is long |

---

### Step 1 — Name + slug

| Element | Class | Why |
|---|---|---|
| Headline “What is your store called?” | Must Have | Clear ask |
| Supporting copy about permanence | Must Have (honest) / refine tone | Trust about slug |
| Store name field | Must Have | Identity |
| Slug field | Must Have | The product |
| Live availability | Must Have | Confidence |
| Suggestion chips | Nice To Have | Recovery when taken |
| Auto-slugify | Must Have | Reduces typing |

---

### Step 2 — Vibe

| Element | Class | Why |
|---|---|---|
| Entire carousel of 12 | **Distracting** in onboarding | Premature aesthetic labor |
| MiniPreview per card | Nice To Have *later* | Powerful after you have *your* product |
| “Use this vibe” + “Continue setup” dual CTA | **Redundant / Distracting** | Two-phase confirmation for one decision |
| Trade hint chips | Optional → **Redundant** here | Solves categorization, not first value |
| “Best for:” microcopy | Nice To Have later | Helps choice when choice is intentional |

**Executive line:** This screen is a design tool wearing an onboarding badge.

---

### Step 3 — Hero

| Element | Class | Why |
|---|---|---|
| Shop name field | **Redundant** | Duplicates store name |
| Logo upload | Nice To Have later | Polish, not birth |
| Logo size / shape | **Distracting** | Pixel-level choices before first sale |
| Eyebrow / subheading | Nice To Have later | Copywriting under pressure fails |
| Mini preview | Nice To Have | Good pattern, wrong time |
| Continue | Must Have only if screen remains | — |

**Executive line:** If the only required field is a title that defaults to the store name, the screen should not exist.

---

### Step 4 — Product

| Element | Class | Why |
|---|---|---|
| Product name | Must Have | Commerce |
| Price | Must Have | Commerce |
| Image | Nice To Have for first publish / Must Have for conversion | Sellers without photos still need momentum |
| Category | Nice To Have | Filters are a later gift |
| Description | Nice To Have | Perfectionism trap |
| Product list after add | Must Have | Confirmation |
| Dual CTAs after save | Distracting | Interaction complexity |
| Uncleared form | Distracting | Feels broken |

---

### Step 5 — Fulfillment

| Element | Class | Why |
|---|---|---|
| Pickup / delivery choice | Important | Real ops |
| Long instruction fields as blockers | Distracting early | Forces essay writing |
| Delivery fee | Must Have *if* delivery enabled | Pricing honesty |
| Dual method complexity | Nice To Have later | One method is enough to start |

---

### Step 6 — PayNow

| Element | Class | Why |
|---|---|---|
| Proxy value | Must Have before paid orders | Money |
| Recipient name | Must Have | QR correctness |
| Manual verify warning | Must Have | Honest product; tone carefully |
| Sample QR | Nice To Have | Confidence theater — useful if not scary |
| Extra instructions | Nice To Have | Later |
| Type mobile/UEN | Must Have | Correct rails |

---

### Step 7 — Publish / success

| Element | Class | Why |
|---|---|---|
| Checklist of completed work | **Redundant** | Re-litigates the past |
| Mini preview | Nice To Have | Thin substitute for “open my shop” |
| Publish button | Must Have *if* publish is a concept | — |
| Copy / WhatsApp / Open | **Must Have** | This *is* the product ritual |
| Go to Dashboard as primary climax | Distracting | Ops ≠ celebration |
| Missing Instagram bio CTA | Gap | Matches emotional outcome we sell |

---

# Part 4 — Friction Analysis

| Friction | Severity | Why it exists | Principle to eliminate |
|---|---|---|---|
| Auth before any store feeling | High | Engineering ownership first | Earn identity after desire, or make auth feel like claiming |
| Google-only | Medium–High | Implementation scope | Meet people where accounts already are; reduce ideological refusal |
| Invisible redirects | Medium | Multi-host architecture | One continuous narrative; never dump into a shell mid-sentence |
| Seven locked steps | **Critical** | Completeness mindset | Progressive disclosure; value before compliance |
| Progress “Step N of 7” | High | Project-management UX | Hide the map when the journey should feel short |
| Premature vibe browsing | High | Differentiator anxiety | Default brilliantly; customize after love |
| Dual vibe confirmation | Medium | Bugfix / compare mode | One decision, one gesture |
| Duplicate naming (store vs hero) | High | Data model leaked into UX | One name until the seller asks for more |
| Logo geometry controls | Medium | Design system completeness | Remove until someone opens “Brand” |
| Product form dual buttons + stale fields | Medium | Feature accretion | One primary path; reset state |
| Fulfillment essays | High | Ops completeness | Defaults + “edit anytime” |
| PayNow before emotional ownership | **Critical** | Payment integrity treated as onboarding integrity | Separate *live link* from *ready to take payment* |
| Manual payment warning at peak anxiety | Medium | Honesty | Honesty without threat; place near first order |
| Cannot exit wizard without publish | **Critical** | Gatekeeping half-built stores | Trust + progressive publish; don’t hostage the dashboard |
| Dashboard as landing after joy | Medium | App gravity | Ritualize share first |
| Technical terms (hero, vibe, UEN, proxy) | Medium–High | Internal language | Speak seller: look, link, how they pay, how they get it |
| Waiting on slug checks / uploads | Low–Medium | Reality of networks | Skeleton confidence; never idle dread |
| Perfectionism traps (photo, copy, theme) | High | Optional fields that feel required | Make optionality *feel* optional |

**Meta-friction:** The funnel solves *our* fear of incomplete stores more than *their* fear of never starting.

---

# Part 5 — Bottleneck Analysis

| Bottleneck | Risk | Why they leave | Emotional state | How confidence returns |
|---|---|---|---|---|
| Google auth wall | High | Don’t want Google / glitch / fatigue | Guarded | Instant clarity of “what I get after”; alternate path |
| Vibe carousel | High | Too many taste decisions | Overwhelmed | One beautiful default + “change look later” |
| Hero redundancy | Medium | Feels pointless | Bored | Remove the screen |
| First product without photo pressure | Medium | “My photos aren’t ready” | Inadequate | Allow text-first product; celebrate ugly first version |
| Fulfillment | High | Ops unknown (“I haven’t decided delivery yet”) | Anxious | “Self-pickup — add details later” |
| **PayNow** | **Critical** | Sharing payment identity before trust / store pride | Vulnerable, exposed | Ask when sharing link or before first checkout; explain *why* in human terms |
| Forced publish completeness | High | “I’ll finish later” but later = trapped | Resentful | Let them hold a draft link; guide next best action |
| Post-success dashboard dump | Medium | Don’t know the one thing to do | Aimless | Single ritual: copy → Instagram |

**The kill zone is Steps 2 → 6**, with **PayNow as the sharpest edge**.

Sellers do not abandon because Nomi is hard to understand in the abstract. They abandon because Nomi asks for **commitment without catharsis**.

---

# Part 6 — Cognitive Load Audit

Scale: decisions / concepts / reading / visual complexity / interaction / confidence / **mental effort** (Low / Medium / High / Extreme)

| Screen | Decisions | Concepts | Reading | Visual | Interaction | Confidence | Mental effort |
|---|---|---|---|---|---|---|---|
| Marketing | 1 | 1–2 | Medium | Medium | Low | Rising | Low–Med |
| Login | 1 | Auth, Google, legal | Medium | Low | Low | Neutral | Medium |
| Name + slug | 2 | Identity, permanence | Low | Low | Medium | Rising | Medium |
| Vibe | **12+** | Theme, brand, trade | Medium | **High** | High | Unstable | **Extreme** |
| Hero | 5–8 | Brand systems | High | Medium | High | Flat | **High** |
| Product | 2–5 | Catalog | Medium | Medium | Medium | Rising | Medium |
| Fulfillment | 2–6 | Logistics | Medium | Medium | Medium | Falling | High |
| PayNow | 3–5 | Payments, compliance | High | Medium | Medium | Fragile | **Extreme** |
| Publish | 1 | Go-live | Low | Medium | Low | Relief | Low |

### Load-reduction principles (not implementations)

1. **One decision per screen** — Apple’s law. We violate it constantly.
2. **Defaults are a feature** — undecided is a valid state; the system should choose well.
3. **Never introduce a concept the seller cannot use in the next 60 seconds.**
4. **Hide the scoreboard** (7 steps) until the journey is actually long — or make the journey short.
5. **Separate taste from trade** — aesthetics after inventory, not before.
6. **Sensitive data last, after love** — PayNow after the seller would be sad to lose the store.

---

# Part 7 — Time to First Value

### What “value” means for this audience

Not “dashboard access.”  
Not “theme selected.”  

**Value = a link that feels like mine, that I can imagine putting in my Instagram bio.**

Secondary value = a product customers can understand.  
Tertiary value = paid order readiness.

### Current reality (from audit)

| Milestone | Approx. when |
|---|---|
| First spark (slug appears) | After auth + Step 1 (~1–3 min if smooth) |
| First “real shop” feeling (product saved) | After vibe + hero + product (~5–10 min) |
| First “live” permission | After fulfillment + PayNow + publish (~8–15 min) |
| Ritualized bio share | After success CTAs — if they notice |

**First wow is late, muted, and conditional.**

The earliest wow available in the current product — watching a personal subdomain become *available* — is buried behind Google and then immediately abandoned for a theme mall.

### Could wow happen in 60 seconds?

**Yes — if we redefine the contract.**

A 60-second wow looks like:

1. Name your store.  
2. See your link.  
3. See a living page open with a tasteful default and a placeholder product story.  
4. Feel: “This is already mine.”

Auth can happen adjacent to claim. Themes can wait. Hero can wait. PayNow can wait for “Share” or “Accept payments.”

**Why we don’t hit 60 seconds today:**  
We optimized for *merchant completeness* before *emotional ownership*. Completeness is a business fear. Ownership is a customer need.

### Unnecessary work before value

- Full OAuth before any preview of personal outcome  
- Theme selection among 12  
- Hero redesign of an already-chosen name  
- Trade taxonomy  
- Blocking logistics  
- Blocking PayNow  
- Explicit publish as a seventh boss fight  

---

# Part 8 — Cococart Competitive Review

### Sources & honesty bound

Cococart’s live signup UI at `get.cococart.co` was not fully instrumented in this review (fetch limits). Analysis below is grounded in **Cococart’s public positioning and documented setup narrative**, which is what shapes market expectations in Singapore:

Their marketed model is consistently:

1. **Choose a unique link for your shop**  
2. **Add products, delivery, and payment methods**  
3. **Share your URL on social and take orders**

Positioning claims: “1 minute,” “3 minutes,” “no design experience,” “link in bio,” free trial culture, 70k+ businesses social proof.

Treat this as **competitive expectation design**, not a pixel-perfect QA of their current wizard.

---

### Cococart’s information architecture (as marketed)

```
Promise: store in minutes
    → Claim unique link
    → Add products + delivery + payment (bundled mental step)
    → Share URL → orders
```

Themes exist in the product (preset themes + color), but **are not the hero of the acquisition story**. Design is demoted. Link + sell is promoted.

---

### Direct comparison

| Dimension | Cococart (marketed) | Nomi (as-built) | Why Cococart chose it | Advantage | Disadvantage | Fit for Nomi? |
|---|---|---|---|---|---|---|
| Story length | 3 steps | 7 locked steps | Reduce fear | Feels finishable | May hide real setup inside dashboard | **Yes — Nomi should market and feel like ≤3 beats** |
| First ask | Unique link | Auth, then link | Lead with the product | Instant relevance | Account creation still exists somewhere | **Yes** |
| Design / theme timing | Background / later | Step 2, 12 options | Avoid design intimidation | Faster activation | Less brand wow early | **Yes — Nomi’s vibes are a strength *after* love** |
| Products | Core, early | Step 4 (after design) | Selling > styling | Matches seller brain | Empty aesthetic preview less magical | **Yes — product before vibe** |
| Delivery + payment | Bundled in “setup” | Separate blocking steps 5–6 | One chore cluster | Mentally simple | Can still be heavy in UI | **Partially — one “getting paid & delivering” chapter** |
| Time-to-publish narrative | Minutes | 8–15 min careful path | Conversion copy | Sets expectation bar | Overpromise risk | **Nomi must beat or match the *feeling*, not the slogan** |
| Progressive disclosure | Strong in messaging | Weak in product (everything gated) | Momentum | Higher completion | Incomplete stores possible | **Nomi over-corrects toward completeness** |
| Defaults | “Impossible to mess up” rhetoric | Many explicit choices | Novice safety | Confidence | Less distinctiveness | **Nomi should default harder** |
| Trust building | Social proof, free trial | Benefits list on login | Volume proof | Reduces risk | Generic SaaS tone | **Nomi can win with taste + SG PayNow honesty** |
| Motivation | Bio link → orders | Completeness → publish | Outcome-led | Emotional clarity | May underplay craft | **Nomi’s craft is a leapfrog *after* outcome** |

---

### What Cococart gets right (that Nomi currently violates)

1. **The link is the protagonist.**  
2. **Design is not the gatekeeper.**  
3. **The story is short enough to believe.**  
4. **Share is the climax, not dashboard.**  

### What Cococart leaves on the table (Nomi’s opening)

1. **Taste.** Nomi’s vibe system can be *magical* if timed after ownership.  
2. **PayNow-native honesty** for Singapore social sellers — if framed as confidence, not compliance.  
3. **Preview-driven craft** — MiniPreview is a differentiator when it shows *your* cookie, not “Signature item.”  
4. **A calmer, more premium emotional register** than “free trial SaaS.”

**Do not copy Cococart’s breadth** (POS, QR menus, loyalty). Copy their *courage to demote everything that isn’t the link.*

---

# Part 9 — Apple Philosophy Review

| Principle | Nomi onboarding grade | Notes |
|---|---|---|
| **Clarity** | C | Individual screens often clear; the journey is not. Seven steps muddy the promise. |
| **Deference** | D | UI chrome and progress bars compete with content. Dashboard hijacks the victory. |
| **Depth** | C | Previews suggest depth; publish preview is shallow vs promise. |
| **Consistency** | B− | Brand shell improved; still a cliff from wizard → app shell. |
| **Progressive disclosure** | **F** | We disclose *everything* before value. Inverse of progressive disclosure. |
| **Reduction** | **F** | Hero, trade hint, 12 vibes, logo geometry — unreduced. |
| **Focus** | D | Each screen tries to be complete, not singular. |
| **Predictability** | C | Derived steps are technically predictable; emotionally, PayNow feels like a jump scare. |
| **Delight** | D+ | Link availability delights; then we change the subject. Publish is relief. |
| **Forgiveness** | D | No skip; hostage until publish; slug permanence without enough ceremony. |
| **Direct manipulation** | C | Previews help; dual CTAs and stale forms hurt. |

### Would Apple remove anything?

Yes:

- The hero step as a mandatory screen  
- Trade hint from birth  
- Twelve-theme browsing before a product exists  
- “Step 4 of 7” scorekeeping  
- Publish-as-prison  

### Would Apple merge anything?

Yes:

- Name + immediate live default storefront  
- Product as the second and only “work” beat before share  
- Payment + delivery into a single “Ready to receive orders” moment *after* the link is loved  

### Would Apple delay anything?

Yes — almost everything aesthetic and operational:

- Theme exploration  
- Logo craft  
- Subheading copywriting  
- Category taxonomy  
- Delivery fee philosophy  
- PayNow UEN vs mobile nuance  

### Does every screen feel inevitable?

**No.**  
Inevitable would be: *Name → See it live → Add what you sell → Share → Get paid.*  
Current feels like: *Authenticate → Configure a store platform → You may leave.*

### Does every click feel intentional?

**No.**  
“Use this vibe” then “Continue setup” is the emblematic unintentional click.

---

# Part 10 — How Nomi Can Become Better Than Cococart

Not by cloning their three bullets. By beating them on *inevitability* and *craft timed correctly*.

### Leapfrog opportunities

1. **The 30-second claim**  
   Name → instant personal URL → instantly openable storefront with a gorgeous default. Cococart talks “minutes.” Nomi can make the first heartbeat feel like seconds.

2. **Default taste that feels designed, not empty**  
   Strada (or a single opinionated default) should feel like a finished product, not a temporary skin. Cococart is “simple.” Nomi can be “simple and beautiful without asking.”

3. **Product-first magic preview**  
   The moment the first product is saved, the mini preview should mutate from generic samples to *their* product. That is a wow Cococart’s messaging doesn’t own.

4. **Theme as play, not homework**  
   After first product or after first share: “Want a different look? Swipe.” Curiosity > obligation. Twelve vibes become a toy, not a test.

5. **Honest Singapore money, humanely**  
   PayNow + manual verify can be a trust *advantage* if introduced as:  
   “Buyers pay you directly. You confirm. No middleman taking a cut.”  
   That is a sharper story than generic “add payment methods.”

6. **One ritual climax: Bio**  
   Obsess over the post-create ceremony: copy link, open Instagram, confetti-level focus. Cococart tells you to share. Nomi can *stage* sharing.

7. **Forgiving incompleteness**  
   Let a store be “live enough to show friends” before it is “ready to take paid orders.” Two states beat one prison. Sellers feel progress; Nomi still protects checkout integrity.

8. **Language of the seller**  
   Kill “hero,” “vibe” as required vocabulary, “proxy.” Speak: look, link, product, pickup, PayNow.

9. **Fewer questions than anyone in the category**  
   If Cococart is three steps in the mind, Nomi should feel like **two decisions** before joy: *What are you called?* *What do you sell?* Everything else is invited, not extracted.

10. **Momentum copy**  
    Replace completeness checklists with forward energy: “Your shop exists. Next, make it sellable.” Checklists feel like audits. Momentum feels like coaching.

**The sentence we want in WhatsApp groups:**

> “I tried Nomi — my link was ready before I even finished my coffee. Then it looked expensive.”

That sentence is unavailable today. It is available if we reorder courage ahead of configuration.

---

# Part 11 — The Ideal Onboarding

Ignore the current wizard. Ignore engineering constraints. Design for the emotional outcome.

---

### Guiding philosophy

1. **Ownership before configuration.**  
2. **One triumphant object: the link.**  
3. **Defaults are hospitality.**  
4. **Taste is a playground, not a gate.**  
5. **Money rails are sacred — and late enough to be willing.**  
6. **Onboarding ends at the ritual of sharing, not at dashboard arrival.**  
7. **Incomplete is allowed; unclear is not.**

---

### Ideal flow (screen-by-screen)

```
0. Marketing
   Promise: Your shop link — ready for your bio.
        ↓
1. Claim
   “What’s your shop called?”
   → Live link appears as you type
   → Soft auth if needed (Google) as part of claiming, not as a prior wall
        ↓
2. Instant ownership (WOW)
   Store opens in a beautiful default theme
   Store name already in the hero
   Placeholder: “Add your first product — takes a minute”
   Primary CTA: Add what you sell
   Secondary: Preview / Copy link (even if checkout not ready — with honest status)
        ↓
3. First product
   Name, price, optional photo
   Preview becomes *theirs*
        ↓
4. Ready to receive orders (single combined beat)
   How do they get it? (one tap default: Pickup — details editable)
   How do they pay? (PayNow mobile — one field + confirm name)
   Plain-language trust line about manual confirm
        ↓
5. Share ritual (CLIMAX)
   “Your shop is ready for your bio.”
   Copy link · Open shop · Share WhatsApp · Add to Instagram
   Explicit: checkout is ready / or “payments on — you’re good”
        ↓
6. Quiet home
   Dashboard appears only after the ritual, as a calm next place
```

---

### Purpose of each screen

| Screen | Purpose |
|---|---|
| Claim | Create the object they came for |
| Instant ownership | Deliver wow before chores |
| First product | Make the object commercially real |
| Ready to receive orders | Unlock paid reality in one breath |
| Share ritual | Convert setup into social action |
| Quiet home | Ongoing ops — not the applause |

---

### Why this sequence

- Matches the seller’s brain: **identity → proof → logistics → announce**  
- Puts irreversible or scary asks after attachment  
- Uses Nomi’s design strength as reward, not tollbooth  
- Makes “live” a feeling that can arrive early, with honesty about what buyers can do

---

### Intentionally omitted from onboarding

| Omitted | Where it goes instead |
|---|---|
| 12-vibe carousel | Post-share “Play with looks” or Storefront |
| Hero eyebrow/subheading/logo geometry | Storefront polish |
| Trade hint | Inferred or asked when adding categories |
| Multiple fulfillment methods | Settings when they need delivery too |
| Category systems / filters | Naturally after 2+ products |
| Dashboard navigation literacy | After first share |
| Perfect photography | Optional always; never blocking pride |
| Explicit “Step 4 of 7” | Nowhere |

---

### What happens after onboarding instead

- Theme exploration as delight  
- Logo and brand copy  
- Delivery fees and multi-method logistics  
- Push notifications, order ops depth  
- Featured product tuning  
- Second and third products  
- Unpublish / polish loops  

Onboarding’s job is **activation energy**.  
The product’s job after that is **depth**.

---

### Ideal north-star metrics (product sense, not analytics plan)

- Time to personal URL visible: **< 60 seconds**  
- Time to first product: **< 3 minutes**  
- Time to share ritual: **< 5 minutes**  
- % who copy/share before visiting settings: **high**  
- Theme changes in first session: **optional spike after share**, not before  

---

### Closing verdict

The current onboarding is a well-built **merchant provisioning pipeline**.

It is not yet a **human experience of getting a shop**.

Nomi does not need a prettier seven-step wizard.

Nomi needs the courage to let a seller fall in love with a link before we ask them to behave like a business.

If we do that — and only then invite taste, logistics, and payment — we will not merely match Cococart’s simplicity narrative. We will surpass it with something they cannot easily copy:

**Instant ownership, expensive-looking defaults, and a share ritual that feels inevitable.**

That is the product review recommendation.

**Ship less onboarding. Deliver the link sooner. Earn the right to ask for everything else.**

---

*End of executive UX review.*
