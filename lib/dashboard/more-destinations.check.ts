import assert from "node:assert/strict";

import {
  isMoreDestinationPath,
  isSettingsNavPath,
} from "./more-destinations";

assert.equal(isMoreDestinationPath("/more"), true);
assert.equal(isMoreDestinationPath("/dashboard/more"), true);
assert.equal(isMoreDestinationPath("/storefront"), true);
assert.equal(isMoreDestinationPath("/dashboard/storefront"), true);
assert.equal(isMoreDestinationPath("/fulfilment"), true);
assert.equal(isMoreDestinationPath("/settings/install"), true);
assert.equal(isMoreDestinationPath("/dashboard/settings/install"), true);
assert.equal(isMoreDestinationPath("/products"), false);
assert.equal(isMoreDestinationPath("/settings"), false);

assert.equal(isSettingsNavPath("/settings"), true);
assert.equal(isSettingsNavPath("/dashboard/settings"), true);
assert.equal(isSettingsNavPath("/settings/foo"), true);
assert.equal(isSettingsNavPath("/settings/install"), false);
assert.equal(isSettingsNavPath("/dashboard/settings/install"), false);
assert.equal(isSettingsNavPath("/more"), false);

console.log("more-destinations.check.ts: ok");
