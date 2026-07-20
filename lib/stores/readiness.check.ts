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

const empty = deriveReadiness(base, 0);
assert.equal(empty.store_created, true);
assert.equal(empty.add_products, false);
assert.equal(empty.fulfillment, false);
assert.equal(empty.personalise, false);
assert.equal(empty.style, false);
assert.equal(empty.payments, false);
assert.equal(empty.preview, false);
assert.equal(empty.install, false);
assert.equal(empty.publish, false);
assert.equal(READINESS_ITEM_IDS.length, 9);

const ready = deriveReadiness(
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
assert.equal(ready.add_products, true);
assert.equal(ready.fulfillment, true);
assert.equal(ready.personalise, true);
assert.equal(ready.style, false);
assert.equal(ready.payments, true);
assert.equal(ready.publish, true);
assert.equal(ready.preview, false);
assert.equal(ready.install, false);

const derived: ReadinessDerived = ready;
assert.equal(isItemDone("preview", derived, {}), false);
assert.equal(isItemDone("preview", derived, { preview: true }), true);
assert.equal(isItemDone("personalise", derived, { personalise: false }), false);
assert.equal(
  countDone(derived, { preview: true, style: true, install: true }),
  9,
);

assert.equal(initialChecklistOpen(false, false), true);
assert.equal(initialChecklistOpen(false, true), true);
assert.equal(initialChecklistOpen(false, undefined), true);
assert.equal(initialChecklistOpen(true, undefined), false);
assert.equal(initialChecklistOpen(true, true), true);
assert.equal(initialChecklistOpen(true, false), false);

console.log("readiness.check.ts: ok");
