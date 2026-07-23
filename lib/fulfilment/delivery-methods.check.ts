import assert from "node:assert/strict";

import type { FulfillmentConfig } from "@/lib/stores/types";

import {
  centsUntilFreeDelivery,
  mirrorDeliveryFromMethods,
  normalizeDeliveryMethods,
  normalizeFreeDeliveryAboveCents,
  resolveDeliveryFeeCents,
  resolveDeliveryMethods,
} from "./delivery-methods";

const legacy: FulfillmentConfig = {
  delivery: {
    enabled: true,
    fee_cents: 500,
    instructions: "Ring",
    notes_enabled: true,
  },
};
const fromLegacy = resolveDeliveryMethods(legacy);
assert.equal(fromLegacy.length, 1);
assert.equal(fromLegacy[0]?.id, "default");
assert.equal(fromLegacy[0]?.name, "Delivery");
assert.equal(fromLegacy[0]?.fee_cents, 500);

const multi: FulfillmentConfig = {
  delivery_methods: [
    { id: "a", name: "Standard", fee_cents: 300 },
    { id: "b", name: "Express", fee_cents: 900 },
    { id: "c", name: "Same day", fee_cents: 1500 },
    { id: "d", name: "Overflow", fee_cents: 2000 },
  ],
};
const capped = normalizeDeliveryMethods(multi.delivery_methods);
assert.ok(capped);
assert.equal(capped.length, 3);
const mirrored = mirrorDeliveryFromMethods(capped);
assert.ok(mirrored);
assert.equal(mirrored.fee_cents, 300);

assert.deepEqual(resolveDeliveryMethods({}), []);

assert.equal(normalizeFreeDeliveryAboveCents(0), null);
assert.equal(normalizeFreeDeliveryAboveCents(-1), null);
assert.equal(normalizeFreeDeliveryAboveCents(5000), 5000);

const withFree: FulfillmentConfig = {
  delivery_methods: [{ id: "a", name: "Standard", fee_cents: 500 }],
  delivery_free_above_cents: 5000,
};
const below = resolveDeliveryFeeCents({
  fulfillment: withFree,
  deliveryMethodId: "a",
  subtotalCents: 4999,
});
assert.equal(below.feeCents, 500);
assert.equal(below.waived, false);
assert.equal(centsUntilFreeDelivery({
  fulfillment: withFree,
  deliveryMethodId: "a",
  subtotalCents: 4999,
}), 1);

const at = resolveDeliveryFeeCents({
  fulfillment: withFree,
  deliveryMethodId: "a",
  subtotalCents: 5000,
});
assert.equal(at.feeCents, 0);
assert.equal(at.waived, true);

const above = resolveDeliveryFeeCents({
  fulfillment: withFree,
  deliveryMethodId: "a",
  subtotalCents: 8000,
});
assert.equal(above.feeCents, 0);
assert.equal(above.waived, true);

const noRule = resolveDeliveryFeeCents({
  fulfillment: { delivery_methods: [{ id: "a", name: "Standard", fee_cents: 500 }] },
  deliveryMethodId: "a",
  subtotalCents: 99999,
});
assert.equal(noRule.feeCents, 500);
assert.equal(noRule.waived, false);

const missing = resolveDeliveryFeeCents({
  fulfillment: withFree,
  deliveryMethodId: null,
  subtotalCents: 8000,
});
assert.equal(missing.feeCents, 0);
assert.equal(missing.waived, false);

console.log("fulfilment/delivery-methods.check: ok");
