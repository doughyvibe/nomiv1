import assert from "node:assert/strict";

import {
  cartesianValueNames,
  expectedVariantCount,
  MAX_OPTION_DIMENSIONS,
  MAX_VARIANTS,
  validateChoicesInput,
} from "./variants";

assert.equal(MAX_OPTION_DIMENSIONS, 2);
assert.equal(MAX_VARIANTS, 50);
assert.equal(expectedVariantCount([3, 4]), 12);
assert.equal(expectedVariantCount([10, 6]), 60);

assert.deepEqual(cartesianValueNames([["A", "B"], ["1"]]), [
  ["A", "1"],
  ["B", "1"],
]);

assert.equal(
  validateChoicesInput({
    options: [
      { name: "Flavour", values: ["Chocolate", "Vanilla"] },
      { name: "Size", values: ["6 inch", "8 inch"] },
    ],
    variants: [
      { valueNames: ["Chocolate", "6 inch"], price_cents: null },
      { valueNames: ["Chocolate", "8 inch"], price_cents: 4500 },
      { valueNames: ["Vanilla", "6 inch"], price_cents: null },
      { valueNames: ["Vanilla", "8 inch"], price_cents: null },
    ],
  }),
  null,
);

assert.match(
  validateChoicesInput({
    options: [
      { name: "A", values: ["1", "2", "3"] },
      { name: "B", values: ["x", "y", "z"] },
      { name: "C", values: ["p"] },
    ],
    variants: [],
  }) ?? "",
  /up to 2/i,
);

// 10×6 = 60 > 50
const ten = Array.from({ length: 10 }, (_, i) => `v${i}`);
const six = Array.from({ length: 6 }, (_, i) => `s${i}`);
assert.match(
  validateChoicesInput({
    options: [
      { name: "Colour", values: ten },
      { name: "Size", values: six },
    ],
    variants: cartesianValueNames([ten, six]).map((valueNames) => ({
      valueNames,
      price_cents: null,
    })),
  }) ?? "",
  /50 or fewer/i,
);

assert.match(
  validateChoicesInput({
    options: [{ name: "Flavour", values: ["Chocolate", "Chocolate"] }],
    variants: [{ valueNames: ["Chocolate"], price_cents: null }],
  }) ?? "",
  /twice/i,
);

console.log("products/variants.check: ok");
