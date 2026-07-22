import assert from "node:assert/strict";

import { formatPrepCopy, parseLeadTimeDays } from "./lead-time";

assert.equal(parseLeadTimeDays(0), 0);
assert.equal(parseLeadTimeDays(3), 3);
assert.equal(parseLeadTimeDays("3"), 3);
assert.equal(parseLeadTimeDays(-1), null);
assert.equal(parseLeadTimeDays(1.5), null);
assert.equal(parseLeadTimeDays("3.0"), null);
assert.equal(parseLeadTimeDays(""), null);

assert.equal(formatPrepCopy(0), null);
assert.equal(formatPrepCopy(-1), null);
assert.equal(formatPrepCopy(1), "Needs 1 day to prepare");
assert.equal(formatPrepCopy(3), "Needs 3 days to prepare");

console.log("products/lead-time.check: ok");
