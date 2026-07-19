import assert from "node:assert/strict";

import {
  countDone,
  deriveReadiness,
  isItemDone,
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
assert.equal(empty.payments, false);
assert.equal(empty.logo, false);
assert.equal(empty.preview, false);
assert.equal(empty.publish, false);

const ready = deriveReadiness(
  {
    ...base,
    status: "published",
    hero: { title: "Shop", logo_url: "https://example.com/logo.webp" },
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
assert.equal(ready.payments, true);
assert.equal(ready.logo, true);
assert.equal(ready.publish, true);
assert.equal(ready.preview, false);

const derived: ReadinessDerived = ready;
assert.equal(isItemDone("preview", derived, {}), false);
assert.equal(isItemDone("preview", derived, { preview: true }), true);
assert.equal(isItemDone("logo", derived, { logo: false }), false);
assert.equal(countDone(derived, { preview: true }), 7);

console.log("readiness.check.ts: ok");
