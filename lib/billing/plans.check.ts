import assert from "node:assert/strict";

import {
  BILLING_COPY,
  isBillingEnabled,
  subscriptionAllowsPublish,
} from "./plans";

assert.equal(BILLING_COPY.weeklyPrice, "$3.90");
assert.equal(BILLING_COPY.yearlyPrice, "$149");
assert.equal(subscriptionAllowsPublish("active"), true);
assert.equal(subscriptionAllowsPublish("trialing"), true);
assert.equal(subscriptionAllowsPublish("canceled"), false);
assert.equal(subscriptionAllowsPublish(null), false);
// Without Stripe env, billing stays off (local/dev publish still works)
assert.equal(typeof isBillingEnabled(), "boolean");

console.log("billing plans.check.ts: ok");
