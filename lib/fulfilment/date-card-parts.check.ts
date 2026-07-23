import assert from "node:assert/strict";

import { fulfilmentDateCardParts } from "./dates";

const parts = fulfilmentDateCardParts("2026-07-24", "2026-07-23");
assert.equal(parts.weekday, "FRI");
assert.equal(parts.day, "24");
assert.equal(parts.month, "JUL");

const today = fulfilmentDateCardParts("2026-07-23", "2026-07-23");
assert.equal(today.weekday, "TODAY");
assert.equal(today.day, "23");

console.log("date-card-parts.check.ts: ok");
