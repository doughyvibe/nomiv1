import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { availableCartSummary } from "./storage";

describe("availableCartSummary", () => {
  it("ignores missing products for count and subtotal", () => {
    const prices = new Map([
      ["a", 1000],
      ["b", 500],
    ]);
    const summary = availableCartSummary(
      [
        { productId: "a", quantity: 2 },
        { productId: "gone", quantity: 9 },
        { productId: "b", quantity: 1 },
      ],
      prices,
    );
    assert.equal(summary.count, 3);
    assert.equal(summary.subtotalCents, 2500);
    assert.equal(summary.availableItems.length, 2);
  });
});
