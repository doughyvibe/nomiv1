import assert from "node:assert/strict";

import {
  assertCartStock,
  availableQty,
  filterVisibleStorefrontProducts,
  isProductSoldOut,
  isVariantSoldOut,
  shouldHideSoldOut,
  validateInventoryInput,
} from "./inventory";

const thrift = {
  id: "p1",
  name: "Vintage tee",
  track_inventory: true,
  stock_qty: 1,
  sold_out_policy: "show" as const,
  variants: [],
};

assert.equal(availableQty(thrift), 1);
assert.equal(isProductSoldOut(thrift), false);
assert.equal(
  assertCartStock([thrift], [{ productId: "p1", quantity: 1 }]),
  null,
);
assert.equal(
  assertCartStock([thrift], [{ productId: "p1", quantity: 2 }]),
  "Only 1 left of Vintage tee",
);

const oos = { ...thrift, stock_qty: 0 };
assert.equal(isProductSoldOut(oos), true);
const oosHidden = {
  ...oos,
  id: "oos",
  sold_out_policy: "hide" as const,
};
assert.equal(shouldHideSoldOut(oosHidden), true);
assert.equal(shouldHideSoldOut({ ...oos, sold_out_policy: "show" }), false);
assert.equal(
  filterVisibleStorefrontProducts([oosHidden, thrift])
    .map((p) => p.id)
    .join(","),
  "p1",
);
assert.equal(
  assertCartStock([oos], [{ productId: "p1", quantity: 1 }]),
  "Vintage tee is sold out",
);

const withVariants = {
  id: "cake",
  name: "Cake",
  track_inventory: true,
  stock_qty: null,
  sold_out_policy: "show" as const,
  variants: [
    {
      id: "v1",
      option_value_ids: ["a"],
      label: "Chocolate",
      price_cents: null,
      stock_qty: 0,
    },
    {
      id: "v2",
      option_value_ids: ["b"],
      label: "Vanilla",
      price_cents: null,
      stock_qty: 2,
    },
  ],
};

assert.equal(isProductSoldOut(withVariants), false);
assert.equal(isVariantSoldOut(withVariants, withVariants.variants[0]), true);
assert.equal(availableQty(withVariants, "v2"), 2);
assert.equal(
  assertCartStock(
    [withVariants],
    [{ productId: "cake", quantity: 1, variantId: "v1" }],
  ),
  "Cake (Chocolate) is sold out",
);
assert.equal(
  assertCartStock(
    [withVariants],
    [
      { productId: "cake", quantity: 1, variantId: "v2" },
      { productId: "cake", quantity: 2, variantId: "v2" },
    ],
  ),
  "Only 2 left of Cake (Vanilla)",
);

const unlimited = {
  id: "u",
  name: "Unlimited",
  track_inventory: false,
  stock_qty: null,
  variants: [],
};
assert.equal(availableQty(unlimited), null);
assert.equal(isProductSoldOut(unlimited), false);
assert.equal(
  assertCartStock([unlimited], [{ productId: "u", quantity: 99 }]),
  null,
);

assert.equal(
  validateInventoryInput(
    { track_inventory: true, stock_qty: 1, sold_out_policy: "show" },
    false,
  ),
  null,
);
assert.equal(
  validateInventoryInput(
    { track_inventory: true, stock_qty: null, sold_out_policy: "show" },
    false,
  ),
  "Enter how many you have in stock (0 or more)",
);
assert.equal(
  validateInventoryInput(
    { track_inventory: true, stock_qty: null, sold_out_policy: "hide" },
    true,
    [0, 3],
  ),
  null,
);

console.log("products/inventory.check: ok");
