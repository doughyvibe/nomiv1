import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { availableCartSummary } from "./storage";
import { buildCartLineKey } from "./types";

describe("availableCartSummary", () => {
  it("ignores missing products for count and subtotal", () => {
    const prices = new Map([
      ["a::", 1000],
      ["b::", 500],
    ]);
    const summary = availableCartSummary(
      [
        {
          productId: "a",
          quantity: 2,
          lineKey: buildCartLineKey("a"),
        },
        {
          productId: "gone",
          quantity: 9,
          lineKey: buildCartLineKey("gone"),
        },
        {
          productId: "b",
          quantity: 1,
          lineKey: buildCartLineKey("b"),
        },
      ],
      (line) => prices.get(line.lineKey),
    );
    assert.equal(summary.count, 3);
    assert.equal(summary.subtotalCents, 2500);
    assert.equal(summary.availableItems.length, 2);
  });

  it("treats different variants as separate priced lines", () => {
    const summary = availableCartSummary(
      [
        {
          productId: "cake",
          variantId: "v1",
          quantity: 1,
          lineKey: buildCartLineKey("cake", "v1"),
        },
        {
          productId: "cake",
          variantId: "v2",
          quantity: 2,
          lineKey: buildCartLineKey("cake", "v2"),
        },
      ],
      (line) => (line.variantId === "v1" ? 1000 : 2000),
    );
    assert.equal(summary.count, 3);
    assert.equal(summary.subtotalCents, 5000);
  });
});

describe("buildCartLineKey", () => {
  it("differs by variant", () => {
    assert.notEqual(
      buildCartLineKey("p", "a"),
      buildCartLineKey("p", "b"),
    );
    assert.equal(buildCartLineKey("p"), "p::");
  });

  it("differs by customisation answers", () => {
    assert.notEqual(
      buildCartLineKey("brownie", null, { msg: "Happy Birthday" }),
      buildCartLineKey("brownie", null, { msg: "Congrats" }),
    );
    assert.equal(
      buildCartLineKey("brownie", null, { msg: "Happy Birthday" }),
      buildCartLineKey("brownie", null, { msg: "Happy Birthday" }),
    );
  });
});
