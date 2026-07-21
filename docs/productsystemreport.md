# Product Strategy Research: Designing Nomi's Product System

> Internal product strategy document for redesigning Nomi's product architecture.
> Audience: Founder, product, engineering.
> Status: **Revised** — Product vs Fulfilment vs Checkout boundaries locked.
> Original research: 2026-07-21 · Architecture revision: 2026-07-21
> Grounding: Current Nomi schema (`products`: name, price_cents, description, image_url, category, archived); storefront Quick Add on catalog/featured; PayNow checkout; PRD MVP exclusions; Shopify & Cococart product models.

---

## Executive summary

Nomi is a **PayNow-native storefront for Singapore social sellers** — not a Shopify clone. Today's product model can *display* an item. It cannot *operate* many real businesses that need flavour/size choices, sold-out truth, or cake messages.

**Critical architectural refinement:**

| System | Owns | Does not own |
|--------|------|--------------|
| **Product** | What is sold: identity, price, choices, customisations, stock truth, lead-time *constraint* | Pickup/delivery dates, slots, methods |
| **Fulfilment** | How/when the order can leave the merchant: methods, windows, capacity, blackouts | Flavour, size, cake message |
| **Checkout** | Collecting the buyer's choices *for this order*: cart line config + fulfilment selection + PayNow | Permanent product catalog definition |

**North star:**

> A Product describes the offer. Fulfilment describes store operations. Checkout assembles one legal order from both — never inventing rules that belong in neither.

**Build-now spine:**

1. Core Product (name, price, **single** image, description, category, draft/live/archive).
2. Simple variants (≤2 options) — opt-in.
3. Optional inventory + sold-out policy.
4. Order-time customisations (notes / priced add-ons).
5. Product **lead time (days)** as a fulfilment constraint — not a date picker.
6. Fulfilment System (store-level): methods, allowed dates/windows, capacity — **separate roadmap track**.
7. Progressive disclosure on the product form; Quick Add rules that respect required choices.
8. **Defer** multi-image gallery.

**Deliberately never (or not for years):** multi-location inventory, Markets, barcode/cost accounting, selling-plan subscriptions, metafield CMS, 3-axis variant matrices, gift cards, SEO field farms, ERP import.

---

## How to read this document

| Part | Purpose |
|------|---------|
| 0 | System boundaries (read first) |
| 1–2 | Merchants & journeys (with Product vs Fulfilment split) |
| 3 | Capability matrix |
| 4–6 | Shopify, Cococart, decision table |
| 7 | Nomi architecture (three systems) |
| 7b–7d | Quick Add, variants UX, lead time → fulfilment |
| 7e–7f | Live-selling & edge-case thought experiments |
| 8–9 | Progressive disclosure & MVP |
| 10 | The Nomi Product Philosophy |

Every recommendation answers: **What real merchant problem does this solve?** and **Which system owns the truth?**

---

# Part 0 — System Boundaries (source of truth)

```
┌─────────────────────────────────────────────────────────────┐
│ PRODUCT SYSTEM                                              │
│ Permanent catalog truth                                     │
│ name · price · photo · description · category · status      │
│ variants (choices) · customisations · inventory             │
│ lead_time_days (constraint only)                            │
└────────────────────────────┬────────────────────────────────┘
                             │ exposes constraints
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ FULFILMENT SYSTEM                                           │
│ Store operations truth                                      │
│ methods (pickup / delivery / mail / digital)                │
│ calendars · windows · blackouts · daily capacity            │
│ campaign overrides ("tomorrow 1–5pm only")                  │
│ reads max(lead_time) across cart → earliest allowed date    │
└────────────────────────────┬────────────────────────────────┘
                             │ offers valid options
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT SYSTEM                                             │
│ Per-order collection                                        │
│ line items (variant + customisation snapshot)               │
│ qty · fulfilment method · date/slot (chosen from allowed)   │
│ contact · PayNow amount+reference                           │
└─────────────────────────────────────────────────────────────┘
```

### One source of truth rules

1. **Product never stores "available pickup dates."** It may store `lead_time_days = 3`.
2. **Fulfilment never stores "Chocolate vs Vanilla."** That is a product variant.
3. **Checkout never invents business rules.** It only presents options Fulfilment computed and snapshots what the buyer picked.
4. **Cart may contain multiple products.** Fulfilment earliest date = max lead time among items that require fulfilment (digital may skip).

### Same-day delivery (preview — full answer in §7f)

Same-day is **not a Product flag**. It **emerges** when Fulfilment allows a date equal to "today" *and* Product lead times allow it (lead_time_days = 0). Merchant settings / Fulfilment config create the window; Checkout merely offers it.

---

# Part 1 — Merchant Research

Thirty-two personas that can realistically use Nomi. (Unchanged in substance; fulfilment pain is now attributed to the Fulfilment system, not Product fields.)

### Food & beverage (home / cloud kitchen)

| # | Persona | Sells | Operates | Order size | Fulfilment | Expectations | Pain |
|---|---------|-------|----------|------------|------------|--------------|------|
| 1 | Home baker | Cakes, cookies, pastries | IG/TikTok DMs → PayNow → kitchen calendar | S$15–80; cakes S$45–180 | Self-collection; some delivery | Flavour, size, date, message | Overselling; flavour chaos in DMs |
| 2 | Cake shop (HBB) | Celebration cakes | Pre-order batches; weekend peaks | S$60–250 | Pickup window | Design notes, date certainty | Capacity limits per day |
| 3 | Cookie / bite-sized | Boxes, sets | Batch bake; limited drops | S$12–45 | Mail / pickup | Flavour mix, sold-out clarity | Counting boxes by hand |
| 4 | Meal prep | Weekly sets | Menu rotates weekly | S$35–90/week | Delivery rounds | Dietary options, cut-off | Cut-off enforcement |
| 5 | Pet treats | Homemade treats | Small batches | S$10–40 | Mail / meetup | Ingredients, weight | Stock of perishables |
| 6 | Coffee beans | Bags of beans | Roast/pack; mail-heavy | S$18–45 | Mail | Grind size, weight | Variant price diffs |
| 7 | Specialty drinks (bottled) | Cold brew, kombucha | Weekly bottles | S$6–12 | Pickup | Flavour, cold chain | Expiry / sell-through |

### Plants, florals, home

| # | Persona | Sells | Operates | Order size | Fulfilment | Expectations | Pain |
|---|---------|-------|----------|------------|------------|--------------|------|
| 8 | Florist | Bouquets, arrangements | Same-day / next-day | S$45–180 | Delivery slots | Occasion note, date | Slot capacity |
| 9 | Plant nursery / succulents | Potted plants | Catalog + rare drops | S$25–320 | Pickup / delivery | Care notes, size | Unique one-offs |
| 10 | Candle maker | Candles, sets | Batch pour | S$18–65 | Mail | Scent, size | Scent × size matrix |
| 11 | Home fragrance / soap | Bars, sets | Batch | S$8–40 | Mail | Scent packs | Bundle deals |

### Fashion & thrift

| # | Persona | Sells | Operates | Order size | Fulfilment | Expectations | Pain |
|---|---------|-------|----------|------------|------------|--------------|------|
| 12 | Thrift clothing | Unique pieces | One-of-one listings | S$15–80 | Mail / meetup | Size truth, photos | Double-sell |
| 13 | Sneaker reseller | Limited pairs | Source → list → ship | S$120–800 | Mail / meetup | Size, authenticity | Inventory discipline |
| 14 | Handmade jewellery | Earrings, rings | Made-to-order / stock | S$15–120 | Mail | Metal, size | Custom sizing |
| 15 | Crochet / knitwear | Soft goods | Made-to-order | S$25–150 | Mail | Colour, size, lead time | Lead time promises |
| 16 | Phone accessories | Cases, chargers | Stocked SKUs | S$8–45 | Mail / meetup | Model fit | Many model variants |

### Craft, art, gifts

| # | Persona | Sells | Operates | Order size | Fulfilment | Expectations | Pain |
|---|---------|-------|----------|------------|------------|--------------|------|
| 17 | Custom gifts / engraving | Personalised items | Order → make → ship | S$25–120 | Mail | Text input | Missing text |
| 18 | Art commissions | Custom art | Deposit → brief → deliver | S$80–500 | Digital / physical | Brief fields | Scope creep via DM |
| 19 | Print-on-demand merch | Tees, totes | Design catalog | S$25–60 | Print partner | Size/colour | POD matrix |
| 20 | Seasonal / festive | CNY, Deepavali, Christmas drops | Burst campaigns | S$15–80 | Pickup / mail | Pre-order windows | Launch/close dates |
| 21 | Subscription box (small) | Monthly curated box | Recurring shortlist | S$35–90/mo | Mail | Plan clarity | Recurring ops load |

### Digital & services (edge of Nomi)

| # | Persona | Sells | Operates | Order size | Fulfilment | Expectations | Pain |
|---|---------|-------|----------|------------|------------|--------------|------|
| 22 | Digital downloads | Presets, PDFs, packs | File delivery | S$9–67 | Instant file | Instant access | File hosting |
| 23 | Tuition / coaching | Sessions | Calendar booking | S$40–150 | Online / in-person | Slot pick | Calendar tools |
| 24 | Workshops | Class seats | Limited seats | S$45–200 | Venue | Date/time, seats | Seat inventory |
| 25 | Event tickets | Entry | Ticket count | S$15–80 | QR / door | Date, ticket type | Overselling seats |
| 26 | Photography packages | Sessions / albums | Book → shoot | S$150–800 | Studio / location | Package choice | Deposits |
| 27 | Fitness coach | Programs / sessions | Hybrid | S$50–300 | Digital / gym | Package | Booking |
| 28 | Printing services | Cards, banners | Quote-ish → order | S$20–200 | Pickup | Specs, file upload | Spec chaos |

### Resale & misc SG social

| # | Persona | Sells | Operates | Order size | Fulfilment | Expectations | Pain |
|---|---------|-------|----------|------------|------------|--------------|------|
| 29 | Telegram group seller | Mixed catalog | Broadcast → form | S$10–100 | Meetup / mail | Fast checkout | Trust + payment proof |
| 30 | WhatsApp catalogue seller | Everyday goods | Chat sales | S$10–80 | Delivery | Simple cart | Screenshot payments |
| 31 | First-time side hustle | 1–5 SKUs | Learning | S$15–50 | Meetup | Dead-simple | Fear of "website" |
| 32 | Pre-order drop seller | Limited drops | Announce → close | S$20–150 | Batch ship | Countdown / sold-out | Fair allocation |

### Cross-cutting insight

~70% of Nomi-fit merchants need **at most**: one photo, a price, optional 1–2 choices, optional stock, optional note — plus **store-level** fulfilment rules.

~20% need **real Fulfilment calendars** (bakers, florists, live drops, meal prep).

~10% need digital/booking systems — defer or partner; do not fold into Product.

---

# Part 2 — Customer Journey Analysis

Journeys split: **[P]** Product configuration · **[F]** Fulfilment · **[C]** Checkout collection.

| # | Persona | Journey |
|---|---------|---------|
| 1 | Home baker | Browse → **[P]** flavour → **[P]** size → **[P]** cake message → cart → **[F/C]** pickup date (respects lead time) → PayNow → collect |
| 2 | Cake shop | Browse → **[P]** design/flavour/size/message → **[F/C]** date+window vs capacity → pay → collect |
| 3 | Cookies | Browse → **[P]** box/mix → qty → **[F/C]** mail or pickup → pay |
| 4 | Meal prep | Browse → **[P]** dietary option → **[F/C]** cutoff-aware delivery round → pay |
| 5 | Pet treats | Browse → **[P]** flavour/size → **[F/C]** mail → pay |
| 6 | Coffee | Browse → **[P]** weight/grind → **[F/C]** mail → pay |
| 7 | Bottled drinks | Browse → **[P]** flavour + stock → **[F/C]** cold pickup → pay |
| 8 | Florist | Browse → **[P]** bouquet + card message → **[F/C]** delivery slot → pay |
| 9 | Plants | Browse → **[P]** plant (±size) → **[F/C]** pickup → pay |
| 10 | Candles | Browse → **[P]** scent/size → **[F/C]** mail → pay |
| 11 | Soap | Browse → **[P]** scent set → **[F/C]** mail → pay |
| 12 | Thrift | Browse unique → pay → **[P]** listing depletes stock → **[F/C]** ship |
| 13 | Sneakers | Browse → **[P]** size → **[F/C]** ship → pay |
| 14 | Jewellery | Browse → **[P]** metal/size ± engrave → **[F/C]** ship (after lead time) → pay |
| 15 | Crochet | Browse → **[P]** colour/size → **[F/C]** date ≥ lead time → pay → make → ship |
| 16 | Phone accessories | Browse → **[P]** model → **[F/C]** ship → pay |
| 17 | Custom gifts | Browse → **[P]** personalisation text → **[F/C]** ship → pay |
| 18 | Art commission | Browse package → **[P]** brief → deposit → create → deliver |
| 19 | POD merch | Browse → **[P]** size/colour → **[F/C]** print partner ship → pay |
| 20 | Seasonal | Browse drop → **[F]** pre-order window → pay → batch fulfil |
| 21 | Sub box | Browse plan → recurring* → ship (*defer true subscriptions) |
| 22 | Digital | Browse → pay → **[F]** instant download (no date) |
| 23 | Tuition | Browse → **[F]** date/time booking → pay |
| 24 | Workshop | Browse → **[P]** seat as inventory → **[F]** class datetime → pay |
| 25 | Tickets | Browse → **[P]** ticket type/qty → **[F]** event datetime → pay |
| 26 | Photography | Browse package → **[F]** session date → deposit |
| 27 | Fitness | Browse program → pay → access |
| 28 | Printing | Browse → **[P]** specs → **[F/C]** pickup → pay |
| 29–32 | Social/drop | Link → cart (**[P]** choices if any) → **[F/C]** method → PayNow |

**Configuration clusters:**

1. Choices → **Product variants**  
2. Notes / add-ons → **Product customisations** (collected at add-to-cart / PDP)  
3. Scarcity → **Product inventory**  
4. When/how it arrives → **Fulfilment** (constrained by product lead time)  
5. Payment proof → **Checkout / PayNow** (already Nomi core)

---

# Part 3 — Product Capability Matrix

Legend: **E** Essential · **U** Useful later · **A** Advanced · **N** Not for Nomi · **F** Belongs to Fulfilment (not Product) · **D** Deferred intentionally

| Capability | Rating | System | Why |
|------------|--------|--------|-----|
| Variants (1–2 options) | **E** | Product | Unlocks bakers/fashion without DM chaos |
| Variants (3+ axes) | **N** | — | Overwhelm |
| Inventory qty (optional) | **E** | Product | Stop overselling |
| Unlimited / don't track | **E** | Product | Default for MTO |
| SKU optional | **U** | Product | Ops hygiene |
| Barcode | **N** | — | Retail POS |
| Categories | **E** | Product | Already shipped |
| Collections | **U** | Product/merch | Later |
| Add-ons / modifiers | **E** | Product | Upsell without variant explosion |
| Custom notes / personalisation | **E** | Product | Cake message, engraving |
| Lead time (days) | **E** | Product → constrains F | Constraint only — no buyer date UI on product |
| Pickup/delivery date picker | **E** | **F**/Checkout | Not a product field |
| Time slots / windows | **U** | **F** | Florists, live drops |
| Capacity / blackouts | **U** | **F** | Baker weekends |
| Pre-order windows | **U** | **F** (+ product availability) | Seasonal |
| Campaign fulfilment override | **U** | **F** | TikTok Live "tomorrow only" |
| Booking appointments | **A** | **F**/separate | Don't dilute storefront |
| Digital download | **A** | Product + F | Later |
| Subscriptions | **N** | — | Wrong wedge |
| Bundles | **U** | Product | Later |
| Min/max qty | **U** | Product | Drops |
| Draft/live/archive | **E** | Product | Safe editing |
| Badges/labels | **U** | Product | Merchandising |
| Compare-at price | **U** | Product | Sale story |
| Cost/profit | **N** | — | Accounting |
| Out of stock handling | **E** | Product | Hide vs sold out |
| **Image gallery (multi)** | **D** | Product | Valuable; **defer MVP** — keep single image |
| Single product image | **E** | Product | Already shipped |
| Video | **A** | Product | Later |
| Ingredients/care (text) | **U** | Product | Free text, not FDA schema |
| SEO suite | **A** | Product | Social-first |
| Metafields builder | **N** | — | CMS trap |
| Multi-location inventory | **N** | — | Warehouse |
| Markets / multi-currency | **N** | — | SG SGD |
| Same-day as product toggle | **N** | — | Emerges from F + lead time |

---

# Part 4 — Shopify Deep Analysis

Shopify's product system is a **global commerce OS**: Product → Options → Variants → InventoryItem → Location; plus metafields, collections, selling plans, channels.

| Shopify concept | Why it exists | Overwhelm Nomi? | Nomi stance |
|-----------------|---------------|-----------------|-------------|
| Options + variants | SKU combinatorial | Matrix UI yes | **Adopt simplified** (≤2, opt-in) |
| Inventory locations | Warehouses | Yes | **Ignore** |
| Collections | Merchandising | Mild | **Later** manual |
| Metafields | App ecosystem | Yes | **Ignore** — typed customisations |
| Selling plans | Subscriptions | Yes | **Ignore** |
| Shipping profiles / delivery | Logistics | Mid | **Fulfilment system** (Nomi-shaped), not Shopify copy |
| Draft/publish | Channels | Mild | **Adopt** draft/live |
| Multi-image / video | Conversion | Mild | **Single image now**; gallery deferred |
| Cost / barcode / vendor | ERP | Yes | **Ignore** |

**Lesson:** Shopify conflates catalog and logistics in merchant mental models via apps. Nomi must keep **Product ≠ Fulfilment** explicit.

---

# Part 5 — Cococart Deep Analysis

Cococart is the closer peer: variants + additional info, optional inventory, **calendar/cutoff**, labels, bundles.

**Adopt:** variants ≠ customisations; optional stock; calendar *thinking*; labels; enable/disable.

**Do not copy:** expanding into POS/loyalty/email suite; bookings as peer to products before storefront excellence.

**Refine vs our prior draft:** Cococart often mixes calendar onto products. Nomi should learn the *problem* (lead times, cutoffs) but place **dates/windows in Fulfilment**, with Product contributing **lead_time_days** only.

---

# Part 6 — Competitive Comparison (decision table)

| Capability | Merchant problem | Shopify | Cococart | Nomi | Reasoning |
|------------|------------------|---------|----------|------|-----------|
| Core fields + single image | List offer | Yes | Yes | **Keep** | MVP |
| Multi-image gallery | Trust | Yes | Yes | **Defer** | Not essential to operate |
| Variants | Choices without new listings | Deep | Yes | **Yes — simplify, opt-in** | Highest leverage |
| Inventory | Overselling | Locations | Optional | **Optional qty** | Default off |
| Customisations | Messages / add-ons | Apps | Native | **Native types** | Social DNA |
| Lead time days | Prep constraint | Apps | Calendar | **On Product** | Constrains F |
| Pickup/delivery date | Coordinate handoff | Apps | Calendar | **Fulfilment + Checkout** | Not Product |
| Live campaign windows | "Only tomorrow 1–5" | Apps | Calendar | **Fulfilment override** | Ops truth |
| Same-day | Urgency | Shipping | Config | **Emergent from F** | No product toggle |
| Bundles / collections / SEO / CSV | Growth | Yes | Mixed | **Later** | After PMF |
| Metafields / locations / subscriptions | Platform gravity | Core | Minimal | **No** | Philosophy |

---

# Part 7 — Designing Nomi's Three Systems

## 7.1 Product System — what permanently belongs to a product

A **Product** is the sellable offer:

| Field | Notes |
|-------|-------|
| name, description, category | Buyer-facing |
| price_cents | Or derived from variants |
| image_url | **Single image** (gallery deferred) |
| status | draft \| live \| archived |
| lead_time_days | Integer ≥ 0; default 0; **constraint only** |
| track_inventory | bool default false |
| stock_qty | if tracking (or per variant) |
| options + variants | Opt-in; ≤2 dimensions; ≤50 variants |
| customisations | text / select / add-on definitions |

**Product does not store:** pickup dates, delivery slots, allowed methods, campaign windows, "same-day eligible" flags.

## 7.2 Fulfilment System — store operations truth

Owned at **store** (with optional campaign overrides), not on each product:

| Concern | Examples |
|---------|----------|
| Methods enabled | Pickup, delivery, mail, digital |
| Method rules | Address needed? Fee? |
| Calendar | Allowed dates, blackouts, open weekdays |
| Windows / slots | 1pm–5pm, AM/PM |
| Capacity | Max orders per day / per slot |
| Campaign mode | "Force delivery tomorrow 13:00–17:00 only" |
| Cutoffs | Order by 9pm for tomorrow |

**Computation:**  
`earliest_fulfilment_date = today + max(lead_time_days of physical items in cart)`  
then intersect with Fulfilment allowed dates/windows.

## 7.3 Checkout System — collected only when ordering

| Collected | Source of options |
|-----------|-------------------|
| Line: variant + customisation answers + qty | Product |
| Fulfilment method | Fulfilment (enabled methods) |
| Date / slot | Fulfilment ∩ lead-time constraints |
| Contact / address if needed | Checkout forms |
| PayNow | Payments |

Snapshots onto the order; later product edits must not rewrite paid orders.

## 7.4 Variant model

- Variants are **optional**. Default product = no options = one implicit offer.  
- Merchant **explicitly enables** "This product has choices."  
- Cap: 2 option groups, plain-language UI ("Flavour", "Size") — never "option matrix."

## 7.5 Inventory model

Optional track; decrement on paid order; at 0 → hide or sold-out. No locations.

## 7.6 Customisation model

Typed prompts on the product; answers captured when adding to cart (PDP or sheet); snapshotted on line item.

## 7.7 Media model (revised)

- **MVP: single image** (`image_url`).  
- Gallery (3–8) = **Build Later**.

## 7.8 Conceptual schema sketch

```
products (+ status, lead_time_days, track_inventory, stock_qty, compare_at?)
product_options / product_option_values / product_variants
product_customisations
store_fulfilment_settings (methods, calendar, capacity, cutoffs)
store_fulfilment_campaigns (optional overrides)
orders / order_items (variant_id, customisation_snapshot, fulfilment_method, fulfilment_date, slot)
```

---

# Part 7b — Quick Add To Cart (catalog)

Nomi today supports **Quick Add** from the catalog without opening the PDP (`product-catalog`, `featured-product`). That must remain fast for simple goods.

### When the product has required configuration

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Hide Quick Add | Honest | Feels broken; slower path always | Only if zero good alternative |
| Always go to PDP | Clear | Extra navigation; kills "fast store" | Acceptable fallback |
| Bottom sheet on Quick Add | Stays on catalog; completes config | Sheet UX cost; must be excellent | **Recommended** |
| Inline expand on card | No overlay | Layout jump; messy on mobile | Reject |

### Recommended policy

```
if product has no variants AND no required customisations:
  Quick Add → add default offer (qty 1) immediately  // today's behaviour

else:
  Quick Add label → "Choose options" (or keep + icon)
  on tap → bottom sheet:
    - required variant pickers
    - required customisation fields
    - optional add-ons
    - primary CTA "Add to cart"
  sheet success → toast / cart badge (same as today)
```

Optional: sheet includes link "View full details" → PDP for description/long content.

**Lead time and fulfilment dates never appear in Quick Add.** They appear only in Checkout (Fulfilment step).

### Why this wins

- Preserves **speed** for thrift, candles-without-choices, single-SKU drops.  
- Prevents **invalid carts** (no flavour selected).  
- Avoids teaching two conflicting mental models (sometimes Quick Add lies).

---

# Part 7c — Variant philosophy & storefront UX

### Should variants always be optional?

**Yes.** Most Nomi merchants start with one offer. Forcing option UI is Shopify trauma.

### Should merchants explicitly enable variants?

**Yes.** Product form: toggle **"This product has choices"** → then add Flavour/Size. Untoggled = no variant tables in DB UI.

### How the storefront should change

| State | Catalog card | Quick Add | PDP |
|-------|--------------|-----------|-----|
| No variants, no required custom | Price + Quick Add | Instant add | Add to cart |
| Has variants and/or required custom | Price + "From S$X" if prices differ; CTA "Choose options" | Opens sheet | Full pickers |
| Sold out | Badge; CTA disabled | Disabled | Disabled |

### Helping buyers understand without confusion

1. **Same verb family:** "Add" vs "Choose options" — never silent failure.  
2. **Price range** on card when variant prices differ (`From S$12`).  
3. **Sheet mirrors PDP controls** (same components) so learning transfers.  
4. **Never auto-pick a random variant** on Quick Add — that creates wrong orders and refunds.

---

# Part 7d — Lead Time × Fulfilment × Checkout

### Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Product** | Declares `lead_time_days` (e.g. Brownies = 3). May show buyer-facing copy: "Needs 3 days to prepare." |
| **Fulfilment** | Owns calendar. Computes allowed dates: exclude anything before `today + lead_time` (per cart max). Apply blackouts, windows, campaign locks. |
| **Checkout** | Renders only allowed dates/slots. Buyer cannot select impossible dates. Validates again server-side on submit. |

### Interaction (Brownies, lead time 3)

```
Day 0 (Mon) buyer checks out
Product.lead_time_days = 3
Fulfilment.earliest = Thu
Date picker: Mon–Wed disabled; Thu+ enabled (∩ store calendar)
```

### What Lead Time is not

- Not a date field on the product.  
- Not a substitute for Fulfilment campaign windows.  
- Not collected as a buyer input.

---

# Part 7e — Thought experiment: TikTok Live "Delivery ONLY tomorrow 1–5pm"

### Confusion points

| Actor | Failure mode |
|-------|----------------|
| Buyer | Picks today |
| Buyer | Picks next week |
| Buyer | Picks pickup (merchant said delivery only) |
| Buyer | Never sees the rule until payment fails |
| Merchant | Forgets to turn campaign off next day → stuck calendar |
| Merchant | Sets campaign but products have lead_time 3 → empty date picker (conflict) |

### Ideal experience

1. **Fulfilment Campaign** (store ops):  
   - Methods: Delivery only (pickup/mail disabled).  
   - Dates: tomorrow only.  
   - Window: 13:00–17:00.  
   - Optional: auto-expire after tomorrow.

2. **Storefront communication before checkout:**  
   - Banner on catalog/cart: "Live drop: delivery tomorrow 1–5pm only."  
   - Not buried solely in checkout.

3. **Checkout:**  
   - Method pre-selected / only Delivery.  
   - Date pre-selected tomorrow (only choice).  
   - Slot pre-selected or single window shown.  
   - No other dates visible (not merely greyed if only one exists — reduce noise).

4. **Conflict with lead time:**  
   - If any cart item has lead_time that makes tomorrow impossible → show clear error: "Brownies need 3 days — remove them or end the live window." Merchant must not be able to publish a campaign that yields zero valid dates without warning in dashboard.

5. **Default answer to "pre-select tomorrow?"**  
   - **Yes**, when campaign leaves exactly one valid date/window.  
   - When multiple remain, pre-select earliest valid.

---

# Part 7f — Fulfilment edge cases (Product vs F vs Checkout)

| Scenario | Product | Fulfilment | Checkout |
|----------|---------|------------|----------|
| Home baker, 3-day prep | lead_time=3; variants; message | Normal calendar | Date ≥ +3 |
| Same-day cookies | lead_time=0 | Allow today + windows | May offer today |
| Valentine's flowers only | optional available_until on product **or** F blackout except Feb 14 | Prefer **F seasonal calendar** for shop-wide; product availability if only some SKUs | Only allowed dates |
| Weekend-only pickup | — | Sat–Sun pickup enabled | Date picker weekends only |
| Monday delivery only | — | Delivery Mondays | Mondays only |
| Friday collection only | — | Pickup Fridays | Fridays only |
| Daily limited production | inventory **or** F daily capacity | Capacity preferred for "3 cakes/day" across SKUs | Block when full |
| Custom cakes | variants + text customisation; lead_time high | Calendar + capacity | Date ≥ lead time |
| Pre-orders | status/live; optional available_from | Pre-order window / ship-from date | Show window copy; date rules |
| Live-selling campaign | unchanged catalog | Campaign override | Locked method/date |
| Flash sale | price/compare-at; inventory | Optional short F window | Standard |
| Meal prep | weekly products | Cutoff + delivery rounds | Round selection |
| Subscription boxes | defer subscriptions | — | — |
| Digital products | type=digital (later) | method=digital (no date) | Skip date |

### Same-day delivery — architecture answer

**Should Nomi "support same-day"?**  
Yes — **as an outcome of configuration**, not as a Product feature checkbox.

| Question | Answer |
|----------|--------|
| Product flag `same_day`? | **No** |
| Fulfilment allows today? | **Yes, if configured** |
| Checkout shows today? | **Only if** F allows today **and** cart lead times allow |
| Merchant settings? | Fulfilment settings / campaign — **yes** |

Avoid feature-first "Same Day Delivery™". Model: **allowed dates ∩ lead times ∩ method**.

---

# Part 8 — Progressive Disclosure

### Basic (default)

Name, price, **single photo**, description, category, publish/archive.

### Offer options (opt-in)

"This product has choices" → variants.  
"Ask the customer something" → customisations.

### Stock (opt-in)

Track quantity → sold-out behaviour.

### Prep (opt-in)

Lead time days + buyer-facing prep copy.  
(**No** date picker here.)

### Merchandising later

Badges, compare-at, duplicate, **gallery**, collections.

### Fulfilment settings (separate surface — Store settings)

Methods, calendar, capacity, campaigns.  
Not inside Add Product.

---

# Part 9 — MVP Recommendation

## Build Now (Product track)

| Item | Problem |
|------|---------|
| Keep core + single image + category + archive | Baseline |
| Draft vs live | Safe editing |
| Opt-in variants (≤2) | Kill DM choice chaos |
| Optional inventory + sold-out | Stop double-sell |
| Customisations (text + add-ons) | Messages / upsells |
| Lead time days + storefront copy | Honest prep constraint |
| Quick Add policy + options bottom sheet | Fast catalog without invalid carts |
| Progressive disclosure on product form | Protect first-timers |
| Duplicate product | Speed |

## Build Now / parallel (Fulfilment track — may ship in phases)

| Item | Problem |
|------|---------|
| Store fulfilment methods | Pickup vs delivery vs mail |
| Date availability engine using lead times | Impossible dates |
| Simple windows + blackouts | Baker/florist ops |
| Campaign override ("tomorrow only") | Live selling |
| Checkout fulfilment step | Collect method/date |

## Build Later

Multi-image gallery · pre-order windows polish · collections · bundles · min/max qty · low-stock alerts · digital downloads · CSV · soft SEO · delivery-zone sophistication.

## Never / not core

Multi-location · metafields · selling plans · gift cards · barcode/cost · Markets · backorders · 3+ option matrices · Product-level pickup date fields · Product-level "same-day" toggle.

---

# Part 10 — The Nomi Opinion

## What Nomi must not become

Not Shopify. Not a warehouse OS. Not a metafield CMS. Not a calendar app that forgot it was a storefront.

## Boundaries we will defend

1. **Product = offer.** Choices, stock, prep time.  
2. **Fulfilment = operations.** When/how handoff happens.  
3. **Checkout = assembly.** Snapshot + PayNow.

## Principles

1. Name the pain or reject the feature.  
2. Default to absent; complexity is opt-in.  
3. One source of truth per fact.  
4. Snapshot buyer choices onto orders.  
5. Quick Add must never create ambiguous line items.  
6. Lead time constrains dates; it does not ask for them.  
7. Same-day emerges; it is not a badge toggled on brownies.  
8. Campaign fulfilment saves live sellers — store ops, not SKU fields.  
9. Defer gallery until operating basics work.  
10. Simplicity is the brand.

---

# The Nomi Product Philosophy

**Nomi builds the smallest product system that lets Singapore social sellers run a real shop — without teaching them retail enterprise software — and keeps fulfilment rules in an operations layer that checkout can trust.**

We believe:

1. **Most merchants sell offers, not SKU graphs.** Start with a photo and a price. Enable choices deliberately.

2. **The enemy is the DM thread** — and also the impossible order. Product kills clarifying questions; Fulfilment kills "I picked a date you can't meet."

3. **PayNow is the centre of gravity.** Catalog and calendar exist to produce clean paid orders.

4. **Progressive disclosure is a requirement.** Empty advanced forms are bugs. Quick Add staying honest is part of that.

5. **Typed beats generic.** Variants, customisations, and lead time are products. Dates and slots are fulfilment. Metafields are refused.

6. **Scarcity must be honest.** Stock tracking implies storefront truth.

7. **Time has two faces.** Lead time is a product promise. Calendars are an operations tool. Checkout only offers the intersection.

8. **Say no to platform gravity.** Locations, markets, subscriptions, and ERP fields slow us down.

9. **Live selling is a fulfilment campaign**, not a new product type.

10. **If a home baker needs a tutorial to separate "Chocolate" from "Saturday pickup," we failed the architecture.**

---

## Appendix A — Current Nomi baseline

| Layer | State |
|-------|-------|
| DB products | name, price_cents, description, image_url, category, archived |
| Quick Add | Catalog/featured instant add (no variant awareness yet) |
| Fulfilment dates | Not a first-class system |
| Variants / inventory / customisations / lead time | Absent |

## Appendix B — Suggested tracks (not implementation detail)

**Product track:** status → variants + sheet Quick Add → customisations → inventory → lead time.  
**Fulfilment track:** methods → date engine (lead-time aware) → windows/capacity → campaigns → checkout step.

## Appendix C — Open questions for founder

1. Fulfilment MVP: date-only first, or date+AM/PM windows in v1?  
2. Campaign UI: merchant-facing "Live mode" toggle vs raw calendar rules?  
3. When lead time conflicts with an active campaign, block publish or warn + allow?  
4. Digital products: in or out of next two quarters?

---

*End of revised document.*
