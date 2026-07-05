PRD: Nomi — Subdomain Storefront Platform for Singapore Social Sellers

1. Product Summary

Build Nomi, a mobile-first web platform that allows Singapore-based social sellers to create a polished storefront link, share it in their social media bio, accept customer orders, and guide buyers through a self-generated dynamic PayNow QR payment flow.

Nomi is not a Shopify clone and not a full website builder. It is a lightweight, localized storefront platform for sellers who currently sell through Instagram, TikTok, WhatsApp, Telegram, or word of mouth.

Nomi helps small businesses sell online without needing to build a website.

The product should help sellers create a beautiful, mobile-first storefront without requiring web design skills.

Core product promise:

Turn your bio into a PayNow-ready storefront.

Nomi should support:

* Seller subdomain storefronts
* Storefront vibe presets
* Hero-led storefront design
* Product catalog with optional category filter pills
* Standardized checkout
* Self-generated dynamic PayNow QR
* Save/screenshot QR buyer payment flow
* Manual seller payment verification

The app does not need automatic payment verification in MVP.

⸻

2. Product Name and Domain

Product name:

Nomi

Primary domain:

nomi.store

Public Marketing Website

nomi.store

Used for:

* Landing page
* Product explanation
* Pricing
* Demo storefronts
* Signup CTA

Seller App / Dashboard

app.nomi.store

Used for:

* Seller signup
* Seller login
* Seller onboarding
* Dashboard
* Orders
* Products
* Storefront editor
* Fulfillment settings
* Payment settings
* Analytics

Example routes:

app.nomi.store/login
app.nomi.store/dashboard
app.nomi.store/orders
app.nomi.store/products
app.nomi.store/settings

Public Seller Storefronts

[storeSlug].nomi.store

Examples:

sarahbakes.nomi.store
amyflowers.nomi.store
jigwave.nomi.store

Each seller receives a subdomain storefront. This is the link they can put in their Instagram bio, TikTok profile, WhatsApp status, or customer messages.

⸻

3. Target User

Primary User: Singapore Social Seller

The primary user is a small seller in Singapore who sells through social media and direct messaging.

Example seller types:

* Home-based bakers
* Florists
* Gift sellers
* Handmade craft sellers
* Thrift/fashion sellers
* Beauty/nail service sellers
* Preorder/drop-based sellers
* Outdoor/gear sellers
* Small event-based merchants
* Custom order sellers

They usually:

* Do not have web design skills
* Do not want to set up Shopify
* Do not want high monthly fees
* May not have a corporate bank account
* Are familiar with PayNow/PayLah-style payments
* Want a simple storefront link for their Instagram/TikTok bio
* Need basic order management without complex e-commerce infrastructure
* Want their store to look good without manually designing a full website

Secondary User: Buyer

The buyer is a customer who clicks the seller’s Nomi storefront link from social media.

They should be able to:

* Open the seller’s storefront on mobile
* Browse products
* Filter by category if available
* Add items to cart
* Checkout without creating an account
* Save or screenshot a PayNow QR
* Complete payment using their banking app / PayLah-supported scan flow
* Return to the order page
* Notify the seller to verify payment
* Receive final confirmation after seller verification

⸻

4. Product Positioning

Nomi should feel like:

A beautiful, PayNow-ready storefront link for Singapore social sellers.

It should not feel like:

* A full website builder
* A drag-and-drop design tool
* A Shopify clone
* A complicated commerce backend
* A generic international e-commerce platform
* A payment gateway-first product

Nomi bridges the gap between:

* Messy DM ordering
* Expensive/complex e-commerce tools

The seller’s ideal outcome:

“I can put my Nomi link in my bio today and customers can order properly.”

Suggested marketing tagline:

Turn your bio into a PayNow-ready storefront.

Alternative tagline:

Create a beautiful store link with PayNow checkout.

⸻

5. Platform Direction

Build Nomi as a mobile-first responsive web platform.

The buyer storefront should work well from:

* Instagram bio link
* TikTok profile link
* WhatsApp message
* Telegram message
* QR code
* Mobile browser

The seller dashboard should be mobile-friendly and desktop-compatible.

Native iOS/Android apps are out of scope for MVP.

PWA functionality is optional for future improvement but not required for the initial build.

⸻

6. Domain and URL Strategy

The MVP should use subdomain-first storefronts.

Marketing Website

nomi.store

Used for Nomi’s public-facing brand and acquisition pages.

Seller App / Dashboard

app.nomi.store

Used for all private seller-facing product flows.

Public Seller Storefront

[storeSlug].nomi.store

Examples:

sarahbakes.nomi.store
amyflowers.nomi.store
jigwave.nomi.store

The public storefront should be loaded based on the subdomain.

The platform should be designed as a multi-tenant platform from the start. Each seller storefront is not a separate deployed app. It is a store record served through the same platform.

⸻

7. Store Slug Requirements

Each seller must claim a unique store slug that becomes their Nomi subdomain.

Example:

Store name: Sarah Bakes
Store slug: sarahbakes
Public link: sarahbakes.nomi.store

Slug requirements:

* Must be unique
* Must be lowercase
* Can contain letters, numbers, and hyphens
* Cannot contain spaces
* Cannot contain emojis
* Cannot contain special symbols
* Cannot start or end with a hyphen
* Should not contain consecutive hyphens
* Must not be a reserved subdomain

If a slug is taken, suggest alternatives.

Example:

Sorry, sarahbakes is already taken.
Try:
sarahbakes-sg
sarahbakesofficial
sarah-bakes
sarahbakes2026

Reserved Subdomains

The system must prevent reserved platform names from being claimed as store slugs.

Reserved examples:

* www
* app
* admin
* api
* help
* support
* status
* docs
* blog
* mail
* email
* cdn
* assets
* static
* billing
* dashboard
* login
* signup
* security
* pricing
* settings
* orders
* products
* analytics
* nomi

Reserved slugs should be maintainable and should not rely only on memory.

⸻

8. Core Product Goals

The seller should be able to:

1. Create an account
2. Enter a store name
3. Preview and claim a Nomi subdomain
4. Choose a storefront vibe
5. Design a storefront hero
6. Add their first product
7. Optionally assign a product category
8. Configure fulfillment
9. Configure PayNow payment details
10. Preview the storefront
11. Publish the store
12. Share the Nomi store link
13. Receive buyer orders
14. Manually verify payment
15. Mark orders as paid/completed

The buyer should be able to:

1. Visit a seller’s Nomi subdomain storefront
2. View the storefront hero
3. Browse products
4. Filter by category if categories exist
5. View product details
6. Add products to cart
7. Checkout without an account
8. See final amount
9. See a self-generated dynamic PayNow QR
10. Save or screenshot the QR
11. Pay outside the app using a banking app / PayLah-supported scan flow
12. Return to the app
13. Notify the seller to verify payment
14. Receive final confirmation after seller verification

⸻

9. Storefront Vibe System

The MVP should include a storefront-only vibe system.

A vibe is not a full theme builder. A vibe is a professionally designed buyer-facing visual preset that controls the public storefront experience while keeping the layout structure mostly fixed.

A vibe controls:

* Color palette
* Font direction
* Button styling
* Product card styling
* Category pill styling
* Cart styling
* Checkout styling
* Payment page styling
* Empty state styling
* Motion/tap feedback
* General storefront atmosphere

The seller customizes content. The vibe controls the visual system.

The selected vibe applies only to:

* Public storefront
* Storefront hero
* Product catalog
* Product detail page
* Cart
* Checkout
* Payment page
* Order confirmation page
* Public preview mode

The selected vibe must not affect:

* Nomi marketing homepage
* Seller login/signup
* Seller dashboard
* Platform admin panel
* Billing/settings pages
* Internal product management screens

The seller dashboard should remain neutral, clean, and consistent.

MVP Vibe Options

The MVP should include 4 vibe options:

Unicorn
Outback
Futuristic
Industrial

Unicorn

General direction:

* Soft
* Dreamy
* Playful
* Pastel
* Friendly

Likely suitable for:

* Bakes
* Gifts
* Crafts
* Cute products
* Florals
* Handmade items

Design tokens will be provided later.

Outback

General direction:

* Earthy
* Warm
* Rugged
* Organic
* Grounded

Likely suitable for:

* Natural products
* Outdoor-inspired brands
* Food
* Coffee
* Leather
* Plants
* Handmade goods

Design tokens will be provided later.

Futuristic

General direction:

* Sleek
* Sharp
* Digital
* Neon
* Modern

Likely suitable for:

* Tech goods
* Streetwear
* Gaming
* Digital-style brands
* Modern accessories

Design tokens will be provided later.

Industrial

The Industrial vibe should be designed according to the JigWave reference.

General direction:

* Rugged
* Marine/industrial
* Dark
* Premium gear packaging
* Forged metal at night
* Teal-and-rust accents
* Bold condensed display type

Likely suitable for:

* Outdoor gear
* Fishing/tackle
* Tools
* Hardware
* Performance products
* Masculine/premium product brands

Industrial should use the JigWave design system as the quality bar.

⸻

10. Industrial Vibe Reference: JigWave

The Industrial vibe should be based on the provided JigWave visual reference.

Concept and Tone

Sample storefront:

JigWave — an online tackle storefront for realistic metal fishing jigs and premium assist hooks.

Aesthetic:

Rugged, marine/industrial, forged metal at night on a boat deck.
Dark, moody, teal-and-rust accents, bold condensed display type.
Premium tackle gear packaging.

It should not feel:

* Playful
* Corporate
* Soft
* Generic
* Flat

Industrial Color Tokens

Use the following base tokens:

--color-bg: 8 14 19
--color-primary: 45 212 191
--color-secondary: 168 106 58

Usage:

* Background is always deep near-black teal.
* Primary teal is used for CTAs, active nav, selected category pill, price highlights, badges, and focus rings.
* Secondary rust/bronze is used sparingly for borders and edge accents.
* Avoid pure white backgrounds.
* Use muted slate tones for secondary/inactive text.

Industrial Typography

Display font:

Oswald

Use for:

* Store name
* Product names
* Section labels
* Nav labels
* Buttons
* Category pills

Style:

* Uppercase
* Condensed
* Bold
* Slight letter spacing

Body font:

Inter

Use for:

* Descriptions
* Body copy
* Prices
* Supporting text

Industrial Surface Tokens

Core panel style:

metal-panel

Used for:

* Product cards
* Filter/category bar
* Cart item cards
* Checkout panels
* Detail panels

Suggested visual direction:

* Dark brushed metal feel
* Subtle radial highlight
* Dark gradient surface
* Thin low-opacity cool border

Rust edge treatment:

rust-edge

Used as:

* Subtle inset border
* Rust/bronze accent around panels
* Never as a large fill color

Industrial Motion

Recommended:

* Fade-up entrance for product cards
* Stagger product card animations
* Tactile tap scale-down on cards/buttons
* No hover-dependent UI
* Mobile-first motion behavior

Industrial Storefront Pattern

The Industrial vibe should support:

* Hero-led catalog page
* Dark hero image treatment
* Floating category filter bar
* Two-column product grid
* Strong product cards
* Bottom mobile nav
* Polished cart page
* Empty cart state
* Product detail page
* Dynamic QR payment page styled consistently

⸻

11. Storefront Page Structure

The public storefront should be a hero-led storefront, not a separate full-screen splash page.

The structure should be:

Storefront Hero
→ Optional Category Filter Pills
→ Product Catalog
→ Cart
→ Checkout
→ Payment
→ Confirmation

The JigWave reference is best described as:

Hero-led catalog page

not a pure full-screen landing page.

The hero should be visually strong but integrated into the shopping page so buyers can quickly proceed to products.

⸻

12. Storefront Hero Requirements

The storefront hero is the top visual section of the public store.

It should support:

* Optional eyebrow text
* Hero title
* Subheading
* CTA button text
* Hero image / background image
* Optional custom logo or graphic
* Controlled element ordering

Example:

Eyebrow:
Since the Deep
Hero title:
JigWave
Subheading:
Realistic metal jigs & premium assist hooks, forged for the deep bite.
CTA:
Shop now

The CTA should scroll the buyer to the product catalog section.

Hero Customization Rules

Sellers can customize:

* Eyebrow text, optional
* Hero title
* Subheading
* CTA text
* Hero image/background/custom graphic
* Order of predefined hero elements

Sellers should not customize:

* Exact colors
* Exact fonts
* Pixel-level positioning
* Button radius
* Section padding
* Navigation layout
* Product card design
* Checkout layout

The selected vibe controls the design system.

Hero Element Reordering

Sellers should be able to reorder predefined hero blocks:

Eyebrow
Image/logo/graphic
Hero title
Subheading
CTA button

Preferred UX:

* Drag-and-drop if feasible
* Move up / move down controls as fallback, especially for mobile

Important rule:

Flexible order, fixed design system.

⸻

13. Product Catalog and Category Filter Pills

The product catalog displays seller products.

Each product should support:

* Product name
* Price
* Product image
* Product description
* Optional category

The MVP should not require:

* Availability status during onboarding
* Preparation time during onboarding
* Advanced inventory
* Complex variants

Category Field

When adding a product, category should be optional.

Example:

Product name: Black Gold Slayer
Category: Metal Jigs

The category field helps generate storefront category filter pills.

Category Filter Pill Logic

The storefront should automatically create category filter pills when product categories exist.

Rules:

* If 0 or 1 category exists, hide category filter pills.
* If 2 or more categories exist, show category filter pills.
* Always include an “All” pill first when category filters are shown.

Example:

All
Metal Jigs
Assist Hooks

For stores like JigWave, the label could be:

All Gear
Metal Jigs
Assist Hooks

For MVP, default to:

All
[Category 1]
[Category 2]

Optional later:

* Allow seller to rename the “All” label to “All Gear,” “Shop All,” or “All Items.”

Category Filter Styling

The seller should not manually design category pills.

The selected vibe controls:

* Pill shape
* Active state
* Inactive state
* Filter bar styling
* Spacing
* Surface treatment

For Industrial:

* Floating dark segmented control
* Teal active pill
* Rust-edge panel treatment

For Unicorn, Outback, and Futuristic:

* Use their respective design tokens once provided.

⸻

14. Buyer Navigation Pattern

The public storefront should feel mobile-app-like.

A bottom navigation is recommended for the buyer storefront.

MVP bottom nav:

Shop
Cart

Optional later:

Shop
Cart
Order

The selected vibe should style the bottom nav.

Requirements:

* Cart tab shows item count when cart has items.
* Active tab uses vibe primary styling.
* Inactive tab uses muted styling.
* Bottom nav should be mobile-safe-area aware if implemented.

⸻

15. MVP Scope

15.1 Nomi Marketing Homepage

Create a clear marketing homepage at:

nomi.store

The homepage should include:

* Simple hero message
* Primary CTA: “Create my store” or similar
* Secondary CTA: “View demo store” or similar
* Explanation of how Nomi works
* Benefits for social sellers
* Mention of dynamic PayNow QR checkout
* Mobile storefront preview/mockup
* Local Singapore positioning
* Simple pricing/value positioning

The homepage should communicate:

* No web design required
* Built for Singapore social sellers
* Beautiful storefront link
* PayNow-first checkout
* Easy to start
* Manual seller verification for payment

Suggested homepage headline:

Turn your bio into a PayNow-ready storefront.

⸻

15.2 Seller Authentication

Allow sellers to:

* Sign up
* Log in
* Log out
* Access protected dashboard routes

The seller dashboard must not be visible to public buyers.

Minimum authentication:

* Email/password

Optional:

* Google login
* Magic link
* Apple login

⸻

15.3 Seller Onboarding Flow

After signup, the seller should enter a guided onboarding flow.

Locked onboarding sequence:

1. Store Name + Claim Subdomain
2. Choose Storefront Vibe
3. Design Storefront Hero
4. Add First Product
5. Configure Fulfillment
6. Configure PayNow Payment
7. Preview & Publish

The onboarding should feel lightweight, visual, and preview-driven.

The store should remain in draft/unpublished state until required setup is complete.

⸻

16. Detailed Seller Onboarding Requirements

Step 1: Store Name + Claim Subdomain

This is the first screen after signup.

Only ask for:

* Store name
* Store subdomain/slug

Do not ask for:

* Store category
* Store description
* Logo/profile image

The screen should let the seller enter a store name and immediately preview their public Nomi link.

Example:

What is your store called?
[ Sarah Bakes ]
Your store link:
[ sarahbakes ].nomi.store
✓ Available
[Continue]

As the seller types the store name, the app should auto-suggest a slug.

Example:

Store name: Sarah Bakes
Suggested link: sarahbakes.nomi.store

The seller should be able to edit the slug manually before continuing.

The system must validate:

* Unique subdomain
* Reserved names
* Allowed characters
* Minimum and maximum length
* Invalid formatting

Why this step comes first:

* The store link is the core product.
* It gives the seller immediate ownership.
* It makes the store feel real quickly.

⸻

Step 2: Choose Storefront Vibe

The seller chooses one of four vibes:

Unicorn
Outback
Futuristic
Industrial

This should be a carousel-style visual selection experience.

The seller should be able to swipe or scroll through phone UI previews of each vibe.

Each carousel preview should look like a mobile storefront preview and include:

* Storefront hero preview
* Product offering preview
* Category/filter styling if applicable
* Color theme/vibe
* Button styling
* Product card styling
* General storefront atmosphere

The goal is to give the seller a visual understanding of how their storefront could look with the selected vibe.

Screen copy:

Choose your storefront vibe
Swipe through styles and pick the one that matches your brand.
This only affects your public storefront. Your dashboard stays the same.

Each vibe card should have a CTA:

Use this vibe

The selected vibe should be saved to the store.

⸻

Step 3: Design Storefront Hero

The seller designs the top hero section of their storefront.

This is not a full page builder.

The seller can customize:

* Eyebrow text, optional
* Hero title
* Subheading
* CTA button text
* Hero image / background / custom graphic
* Element order

Suggested fields:

Eyebrow, optional
[ Since the Deep ]
Hero title
[ JigWave ]
Subheading
[ Realistic metal jigs & premium assist hooks, forged for the deep bite. ]
CTA button text
[ Shop now ]
Hero image / graphic
[ Upload image ]

The CTA should scroll the buyer down to the product catalog section.

Element Ordering

Seller should be able to reorder these predefined blocks:

Eyebrow
Image/logo/graphic
Hero title
Subheading
CTA button

Preferred UX:

* Drag-and-drop if feasible
* Move up / move down controls as fallback

The selected vibe controls:

* Font
* Color
* Background behavior
* Spacing
* Image framing
* Button style
* Animation behavior

The seller should not control pixel-level design details.

⸻

Step 4: Add First Product

This step kickstarts the seller’s catalog.

Ask for:

* Product name
* Price
* Product image
* Product description
* Category, optional

Do not ask for:

* Availability status
* Preparation time

Example:

Add your first product
Product name
[ Black Gold Slayer ]
Price
[ S$9.50 ]
Product image
[ Upload image ]
Description
[ Matte black/gold jig for a wide erratic fall. ]
Category, optional
[ Metal Jigs ]
[Save product]

After saving:

Product added.
[Add another product]
[Continue setup]

The seller should be able to publish with one product.

If the seller adds multiple products with different categories, the store preview can show automatic category filter pills.

⸻

Step 5: Configure Fulfillment

Allow sellers to configure how customers receive orders.

MVP fulfillment methods:

* Self-pickup
* Local delivery

Remove from MVP onboarding:

* Meet-up
* Digital/no delivery required

Seller can choose one or both.

Screen:

How will customers receive their orders?
[ ] Self-pickup
[ ] Local delivery

If Self-pickup is selected, ask:

Pickup instructions
[ Example: Pickup at Tanjong Pagar MRT after confirmation. ]

Optional:

Pickup location
[ Optional ]

If Local delivery is selected, ask:

Delivery fee
[ S$5.00 ]
Delivery instructions
[ Example: Delivery within 2–3 days after payment confirmation. ]

The fulfillment fee must be included in the checkout total.

Why fulfillment comes before payment:

* The final PayNow QR amount depends on product subtotal plus delivery fee.

⸻

Step 6: Configure PayNow Payment

The seller configures payment details for self-generated dynamic PayNow QR.

Supported setup:

* PayNow mobile number
* PayNow UEN
* Payment recipient display name

Screen copy:

Set up PayNow payment
Your store will generate a PayNow QR for each order with the exact amount and order reference.
Payment is not automatically verified. You must check your bank/PayLah app before marking an order as paid.

Fields:

PayNow type
( ) Mobile number
( ) UEN
PayNow mobile / UEN
[             ]
Payment recipient name
[ Sarah Bakes / Sarah Tan ]

Optional fallback field:

Additional payment instruction
[ Optional ]

Important seller-facing reminder:

The buyer will notify you after payment. Please verify manually before confirming the order.

⸻

Step 7: Preview & Publish

The seller previews the full buyer experience before publishing.

Preview should include:

* Storefront hero
* Product catalog
* Category filter pills if categories exist
* Product detail
* Cart
* Checkout
* PayNow QR payment page
* Confirmation states

The preview should clearly show the selected vibe.

The seller should see:

Your store link:
sarahbakes.nomi.store

Pre-publish checklist:

✓ Store name added
✓ Subdomain claimed
✓ Vibe selected
✓ Hero created
✓ First product added
✓ Fulfillment configured
✓ PayNow payment configured

CTA:

Publish Store

After publishing:

Your store is live 🎉
sarahbakes.nomi.store
[Copy Link]
[Open Store]
[Share on WhatsApp]
[Add to Instagram Bio]
[Go to Dashboard]

⸻

17. Seller Dashboard Requirements

Create a protected dashboard at:

app.nomi.store

Dashboard Home

Show:

* Store status
* Public storefront link
* Copy link button
* Open storefront button
* Basic order summary
* Empty-state guidance if no orders yet

Example empty state:

No orders yet.
Share your Nomi store link to start receiving orders.

Suggested next actions:

* Copy store link
* Add to Instagram bio
* Add more products
* Test checkout
* View public store

⸻

Storefront Section

Seller should be able to edit:

* Storefront vibe
* Hero eyebrow
* Hero title
* Hero subheading
* CTA text
* Hero image/graphic
* Hero element order
* Store preview

The selected vibe should only affect public-facing pages.

⸻

Products Section

Seller should be able to:

* View products
* Add product
* Edit product
* Delete/archive product
* Upload/change image
* Update price
* Update description
* Add/edit category

Optional later:

* Availability status
* Inventory
* Variants
* Preparation time

⸻

Fulfillment Section

Seller should be able to:

* Enable/disable self-pickup
* Enable/disable local delivery
* Edit delivery fee
* Edit pickup instructions
* Edit delivery instructions

⸻

Payment Section

Seller should be able to:

* View current PayNow setup
* Edit PayNow mobile/UEN
* Edit payment recipient display name
* View explanation of manual payment verification
* Preview dynamic QR payment screen

⸻

Orders Section

Seller should be able to:

* View all orders
* View order details
* See customer details
* See ordered items
* See fulfillment method
* See payment status
* See order reference
* Mark payment as verified/paid
* Mark order as preparing/completed/cancelled

The seller must be clearly warned:

Only mark as paid after checking your bank/PayLah app.

⸻

Basic Analytics

For MVP, analytics can be simple.

Possible metrics:

* Store views
* Product views
* Orders created
* Orders awaiting verification
* Orders marked paid
* Revenue from seller-confirmed paid orders

Revenue should only count orders marked as paid by the seller.

⸻

18. Buyer Storefront Requirements

The public storefront is available at:

[storeSlug].nomi.store

Example:

sarahbakes.nomi.store

Public Store Page

Show:

* Storefront hero
* Category filter pills if applicable
* Product catalog
* Bottom nav: Shop / Cart

If store does not exist:

* Show clean 404 page

If store is unpublished/suspended:

* Show clean unavailable page

⸻

Product Cards

Each product card should show:

* Product image
* Product name
* Price
* Short description or subtitle
* Category badge if appropriate
* CTA or tap-through behavior

The selected vibe controls the visual style of the product cards.

⸻

Product Detail Page

Buyer should be able to:

* View product image
* View description
* View price
* Select quantity
* Add item to cart

⸻

Cart

Buyer should be able to:

* Review selected items
* Change quantities
* Remove items
* See subtotal
* Proceed to checkout
* See empty cart state if cart is empty

The selected vibe controls cart styling.

⸻

19. Standardized Checkout

Checkout should be standardized in MVP.

Sellers should not configure checkout fields during onboarding.

The standard checkout should collect:

Required:

* Customer name
* Phone number
* Email

Conditional:

* Fulfillment method
* Delivery address if local delivery is selected

Optional:

* Order notes

Checkout should show:

* Items
* Quantity
* Subtotal
* Fulfillment fee
* Final total

Example checkout:

Checkout
Your order
Brownie Box x 1
S$18.00
Fulfillment
( ) Self-pickup
( ) Local delivery +S$5.00
Your details
Name
[          ]
Phone number
[          ]
Email
[          ]
Delivery address
[ shown only if delivery selected ]
Order notes, optional
[          ]
Total
S$23.00
[Continue to PayNow QR]

Why checkout is standardized:

* Reduces seller decision fatigue
* Avoids onboarding complexity
* Keeps buyer experience consistent
* Supports email confirmation flow
* Keeps MVP focused

⸻

20. Dynamic PayNow QR Payment Flow

The MVP uses:

Self-generated dynamic PayNow QR with manual seller verification.

The QR should be generated per order and should aim to include:

* Seller PayNow recipient details
* Exact order amount
* Unique order reference

The app does not perform automatic payment verification.

The app should not claim that payment is successful until the seller manually marks the order as paid.

⸻

21. Buyer Payment Page Requirements

After checkout, buyer lands on a payment page.

The page should show:

* Order reference
* Amount due
* Countdown timer
* Dynamic PayNow QR
* Save QR Code button
* Instructions for same-phone payment
* Notify seller to verify payment button

Recommended copy:

Your order is waiting for payment.
Please complete payment within 10 minutes.
Your order is not confirmed until the seller verifies payment.

Payment steps:

Step 1: Save or screenshot this QR code.
Step 2: Open your banking app or PayLah and scan/import the saved QR from your gallery.
Step 3: After payment is completed, return here and notify the seller to verify payment.

Buttons:

[Save QR Code]
[Notify seller to verify payment]

The app should not disable the notify button based on whether the buyer tapped “Save QR Code,” because the buyer may use a screenshot instead.

⸻

22. Save QR Code Feature

The payment page must include a visible “Save QR Code” feature.

When buyer taps:

Save QR Code

the app should save/download a payment image.

The saved image should ideally include:

* Store name
* Payment amount
* Order reference
* QR code
* Short instruction

Example image content:

Sarah Bakes
PayNow Payment
Amount: S$23.00
Order: ORD-8F3K2
[QR CODE]
After payment, return to the order page and notify seller.

Recommended filename:

paynow-ORD-8F3K2.png

The buyer should also be told they may screenshot the QR if saving is difficult.

⸻

23. Notify Seller Verification Flow

The buyer-facing button should be:

Notify seller to verify payment

Do not use:

* I have paid
* Payment done
* Confirm payment

When buyer taps the button, show a confirmation modal before notifying seller.

Recommended modal:

Notify seller to verify payment?
Only continue after you have paid S$23.00 for order ORD-8F3K2.
Your order is not confirmed yet. The seller will manually verify payment before accepting the order.
☐ I have completed payment using the QR code above.
[Cancel]
[Yes, notify seller]

The final button should only be enabled after the checkbox is checked.

When confirmed:

* Update order status to seller_verification_requested
* Notify seller by email
* Show buyer a waiting-for-verification screen

Buyer-facing confirmation after notify:

Seller notified.
Your order is now waiting for seller verification.
You will receive an email confirmation after the seller confirms payment.

⸻

24. Payment Countdown / Expiry

The payment page should show a 10-minute countdown timer.

The timer is an app-side payment window.

Use wording like:

Complete payment within 10 minutes.

Avoid claiming:

The QR will stop working after 10 minutes.

unless proven true across supported payment apps.

Order should have a server-side payment expiry timestamp.

If the payment window expires before the buyer requests seller verification, show:

Payment window expired.
If you already paid, contact the seller with your order reference.

Optional later:

* Allow “I already paid — notify seller anyway”
* Use a special status such as expired_verification_requested
* Warn seller to verify carefully

⸻

25. Order and Payment Statuses

Recommended MVP statuses:

payment_pending
seller_verification_requested
seller_confirmed_paid
expired
cancelled
completed

payment_pending

Order created. QR generated. Buyer has not requested seller verification.

seller_verification_requested

Buyer has claimed payment completion and requested seller verification.

This is not a paid status.

seller_confirmed_paid

Seller manually verified payment and marked order as paid.

expired

Payment window expired.

cancelled

Order cancelled.

completed

Seller has fulfilled/completed the order.

Optional future status:

expired_verification_requested

Used when buyer requests verification after payment window expiry.

⸻

26. Email Notification Requirements

> ⚠️ RESCOPED 2026-07-03 (see Implementation.md Phase 5 + whiteboard Decision Log):
> Automated email (Resend) is **NOT part of the MVP**. It is parked in Backlog / Optional Later.
> In the MVP:
> - The **seller alert** on a verification request is delivered via an **optional PWA push notification** (not email). Push is optional; the dashboard's pending-verification badge is the reliable fallback.
> - The **buyer confirmation** is delivered via the **tokenized buyer order status page** (not an automated email). After the seller marks payment verified, the seller sends confirmation **manually** using WhatsApp / an email draft / copy-message actions.
> The email requirements below remain the reference spec for IF/WHEN automated email is added later.

Seller Email

Trigger:

* Buyer confirms “Notify seller to verify payment”

Subject example:

New order awaiting payment verification — ORD-8F3K2

Email should include:

* Store name
* Order reference
* Customer name
* Customer contact
* Order items
* Total amount
* Fulfillment method
* Payment status: verification requested
* Reminder to manually check payment before marking paid
* Link to order dashboard

Important wording:

Please check your bank/PayLah app before marking this order as paid.

Do not describe the order as paid until seller verifies.

⸻

Buyer Confirmation Email

Trigger:

* Seller marks order as paid

Subject example:

Your order is confirmed — ORD-8F3K2

Email should include:

* Order reference
* Store name
* Order summary
* Total amount
* Confirmation status
* Fulfillment details
* Seller contact if available

Do not send final confirmation before seller payment verification.

⸻

27. Multi-Tenant Platform Requirements

The platform must support many sellers.

Each store is a tenant.

Store-scoped data includes:

* Store profile
* Subdomain
* Storefront vibe
* Hero content
* Products
* Product categories
* Fulfillment settings
* Payment settings
* Orders
* Analytics
* Customer/order records

Every seller dashboard query must be scoped to the seller’s store access.

Public buyers must not access private seller data.

Sellers must not access other sellers’:

* Orders
* Customers
* Payment settings
* Analytics
* Store settings

⸻

28. Store Status Requirements

The app should support at minimum:

draft
published
unpublished
suspended
deleted

draft

Store is being created and not public.

published

Store is live and accessible at its Nomi subdomain.

unpublished

Store exists but is not publicly available.

suspended

Platform has disabled store due to abuse, policy, or admin action.

deleted

Store is removed or no longer active.

⸻

29. Pricing / Monetization Direction

For MVP, do not require a mandatory credit card before store publishing unless explicitly changed later.

Recommended approach:

* Let sellers publish a basic store for free
* Monetize premium features later

Potential free plan:

* One store
* Limited products
* Nomi subdomain storefront
* Vibe selection
* Self-generated dynamic PayNow QR
* Manual order dashboard
* Platform branding

Potential paid features later:

* More products
* More advanced vibes
* Remove platform branding
* Custom domain
* Advanced analytics
* Order export
* Staff accounts
* Automated reminders
* Priority support

The product should feel low-commitment and affordable for early-stage sellers.

⸻

30. Out of Scope for MVP

Do not prioritize:

* Native iOS app
* Native Android app
* Full website/theme builder
* Freeform drag-and-drop page builder
* Pixel-level design control
* Complex page sections
* Advanced inventory management
* Stripe/card payments
* Payment provider integration
* Automatic payment verification
* Bank webhook reconciliation
* Multi-currency
* Deep logistics integration
* Full accounting features
* Marketplace discovery
* Staff roles
* App marketplace
* Complex tax settings
* Full custom domain support
* PayLah deep-link/tappable payment link unless official support is validated

⸻

31. ### Seller Authentication

MVP authentication should use Google OAuth only.

Sellers should be able to:
- Sign up with Google
- Log in with Google
- Log out
- Access protected dashboard routes

The buyer does not need an account.

Out of scope for MVP:
- Email/password login
- Phone login
- Apple login
- Magic link login
- Password reset flows

⸻

32. ### Suggested MVP Tech Stack

Recommended stack:
- Next.js for the web app
- Tailwind CSS for UI styling and vibe tokens
- Supabase for auth, Postgres database, and storage
- Supabase Google OAuth for seller login
- Resend for transactional emails
- Cloudflare DNS for nomi.store, app.nomi.store, and wildcard seller subdomains
- Cloudflare Pages/Workers for deployment

⸻

33. Acceptance Criteria

Seller Onboarding

A new seller can:

* Sign up
* Enter store name
* Claim unique Nomi subdomain
* Choose one of four vibes: Unicorn, Outback, Futuristic, Industrial
* Design storefront hero
* Reorder hero content blocks
* Add at least one product
* Optionally assign product category
* Configure pickup and/or delivery
* Configure PayNow payment details
* Preview public storefront
* Publish store
* Copy/share Nomi subdomain link

Public Storefront

A buyer can:

* Visit a seller’s Nomi subdomain
* View hero-led storefront
* Browse products
* See category filter pills when 2 or more categories exist
* Filter products by category
* View product detail
* Add products to cart
* Checkout without an account
* Select pickup or delivery
* See accurate final total
* Reach payment page

Dynamic QR Payment

The app can:

* Create an order reference
* Generate a dynamic PayNow QR per order
* Show exact amount and reference
* Show 10-minute payment window
* Provide Save QR Code feature
* Tell buyer they can screenshot QR
* Allow buyer to notify seller to verify payment
* Require confirmation modal with checkbox before notifying seller

Manual Verification

The app can:

* Alert seller after buyer requests verification (MVP: optional PWA push + dashboard pending badge; email is Backlog/Optional Later)
* Show order as awaiting verification
* Let seller manually mark order as paid
* Give buyer final confirmation only after seller marks paid (MVP: tokenized buyer order status page + seller's manual WhatsApp/email/copy message; automated buyer email is Backlog/Optional Later)

Dashboard

A seller can:

* View public link
* Copy/open public link
* Manage products
* Manage product categories
* Manage orders
* Mark orders paid/completed/cancelled
* Edit storefront vibe
* Edit hero content
* Edit fulfillment settings
* Edit payment settings

Data Isolation

The system prevents:

* Buyers from seeing seller dashboards
* Sellers from seeing another seller’s private data
* Duplicate subdomains
* Reserved subdomains
* Unpublished stores from being publicly orderable

⸻

34. Suggested First Build Milestone

The first build should prove the core loop:

Seller signs up
→ Enters store name
→ Claims subdomain
→ Chooses vibe
→ Designs hero
→ Adds first product with optional category
→ Configures fulfillment
→ Configures PayNow payment
→ Publishes store
→ Buyer browses storefront
→ Buyer adds product to cart
→ Buyer checks out
→ App generates dynamic PayNow QR
→ Buyer saves/screenshots QR
→ Buyer notifies seller to verify payment
→ Seller receives email
→ Seller marks order paid
→ Buyer receives confirmation email

This milestone is more important than visual perfection.

⸻

35. Payment Feasibility Spike

Because self-generated dynamic PayNow QR is the core USP, the team should validate this early.

Build or run a small test to confirm:

* QR can prefill recipient
* QR can prefill exact amount
* QR can include order reference
* QR works with major Singapore banking/payment apps where possible
* Buyer can complete same-phone flow using saved QR or screenshot
* Seller can see reference clearly in transaction history

Test scenarios:

* Small amount
* Normal amount
* Mobile PayNow
* UEN PayNow if available
* Short order reference
* Longer order reference
* DBS/POSB
* DBS PayLah
* OCBC
* UOB
* Other common apps if available

The product should not claim automatic verification unless future integration supports it.

⸻

36. Product Success Definition

The MVP is successful if:

1. A seller can create and publish a Nomi subdomain storefront without help.
2. The public storefront looks polished using one of the predefined vibes.
3. The Industrial vibe can produce a JigWave-like finished storefront.
4. A buyer can browse, add to cart, and checkout from mobile without confusion.
5. The buyer can save/screenshot a dynamic PayNow QR and complete payment outside the app.
6. The seller can manually verify payment and mark the order paid.
7. The buyer receives final confirmation only after seller verification.

The most important seller success moment is:

The seller copies their Nomi link and feels confident enough to put it in their Instagram bio.

The most important buyer success moment is:

The buyer reaches the payment page, understands how to save the QR, pays externally, and knows the seller will verify payment.

The most important design success moment is:

A seller can choose a vibe, add simple content, and end up with a storefront that feels professionally designed rather than generic.
