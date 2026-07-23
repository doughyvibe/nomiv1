import assert from "node:assert/strict";

import {
  countDone,
  deriveReadiness,
  initialChecklistOpen,
  isItemDone,
  READINESS_ITEM_IDS,
  type ReadinessDerived,
} from "./readiness";
import type { Store } from "./types";

const base = {
  id: "1",
  owner_id: "u",
  name: "Shop",
  slug: "shop",
  status: "draft",
  vibe: "atelier",
  hero: { title: "Shop" },
  fulfillment: {},
  paynow: {},
  created_at: "",
  updated_at: "",
} as Store;

// Even with products / fulfillment / paynow / published — only foundation is auto-done
const afterOnboarding = deriveReadiness(
  {
    ...base,
    status: "published",
    hero: {
      title: "Shop",
      subheading: "Handmade goods from Singapore",
    },
    fulfillment: { pickup: { enabled: true, instructions: "" } },
    paynow: {
      proxy_type: "mobile",
      proxy_value: "91234567",
      recipient_name: "Shop",
    },
  },
  2,
);
assert.equal(afterOnboarding.store_created, true);
assert.equal(afterOnboarding.add_products, false);
assert.equal(afterOnboarding.fulfillment, false);
assert.equal(afterOnboarding.personalise, false);
assert.equal(afterOnboarding.style, false);
assert.equal(afterOnboarding.payments, false);
assert.equal(afterOnboarding.preview, false);
assert.equal(afterOnboarding.install, false);
assert.equal(afterOnboarding.publish, false);
assert.equal(READINESS_ITEM_IDS.length, 9);
assert.equal(countDone(afterOnboarding, {}), 1);

const derived: ReadinessDerived = afterOnboarding;
assert.equal(isItemDone("preview", derived, {}), false);
assert.equal(isItemDone("preview", derived, { preview: true }), true);
assert.equal(isItemDone("store_created", derived, { store_created: false }), true);
assert.equal(
  countDone(derived, {
    add_products: true,
    fulfillment: true,
    personalise: true,
    style: true,
    payments: true,
    preview: true,
    install: true,
    publish: true,
  }),
  9,
);

assert.equal(initialChecklistOpen(false, false), true);
assert.equal(initialChecklistOpen(false, true), true);
assert.equal(initialChecklistOpen(false, undefined), true);
assert.equal(initialChecklistOpen(true, undefined), false);
assert.equal(initialChecklistOpen(true, true), true);
assert.equal(initialChecklistOpen(true, false), false);

console.log("readiness.check.ts: ok");
