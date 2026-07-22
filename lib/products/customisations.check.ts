import assert from "node:assert/strict";

import {
  buildCustomisationSnapshot,
  customisationAnswersComplete,
  customisationAnswerFeeCents,
  multiSelectHint,
  productRequiresConfig,
  serializeCustomisationsForKey,
  totalCustomisationFeesCents,
  validateCustomisationsInput,
  type ProductCustomisation,
} from "./customisations";

assert.equal(
  validateCustomisationsInput([
    {
      label: "Message on cake",
      type: "text",
      required: true,
    },
  ]),
  null,
);

assert.match(
  validateCustomisationsInput([
    { label: "A", type: "single_select", required: false, choices: [] },
  ]) ?? "",
  /at least one option/i,
);

assert.match(
  validateCustomisationsInput([
    {
      label: "Toppings",
      type: "multi_select",
      required: false,
      choices: [
        { label: "A", price_cents: null },
        { label: "B", price_cents: null },
        { label: "C", price_cents: null },
      ],
      min_select: 3,
      max_select: 2,
    },
  ]) ?? "",
  /minimum picks can’t be more than maximum/i,
);

assert.equal(
  validateCustomisationsInput([
    {
      label: "Toppings",
      type: "multi_select",
      required: true,
      choices: [
        { label: "A", price_cents: null },
        { label: "B", price_cents: null },
        { label: "C", price_cents: null },
      ],
      min_select: 2,
      max_select: 2,
    },
  ]),
  null,
);

const defs: ProductCustomisation[] = [
  {
    id: "msg",
    label: "Message",
    type: "text",
    required: true,
    choices: [],
    price_cents: null,
    min_select: null,
    max_select: null,
    position: 0,
  },
  {
    id: "wrap",
    label: "Gift wrap",
    type: "yes_no",
    required: false,
    choices: [],
    price_cents: 200,
    min_select: null,
    max_select: null,
    position: 1,
  },
  {
    id: "top",
    label: "Topping",
    type: "single_select",
    required: false,
    choices: [
      { label: "Nuts", price_cents: 100 },
      { label: "Plain", price_cents: null },
    ],
    price_cents: null,
    min_select: null,
    max_select: null,
    position: 2,
  },
];

assert.equal(customisationAnswersComplete(defs, {}), false);
assert.equal(
  customisationAnswersComplete(defs, { msg: "Happy Birthday" }),
  true,
);

assert.equal(customisationAnswerFeeCents(defs[1], true), 200);
assert.equal(customisationAnswerFeeCents(defs[1], false), 0);
assert.equal(customisationAnswerFeeCents(defs[2], "Nuts"), 100);

assert.equal(
  totalCustomisationFeesCents(defs, {
    msg: "Happy Birthday",
    wrap: true,
    top: "Nuts",
  }),
  300,
);

const snap = buildCustomisationSnapshot(defs, {
  msg: "Happy Birthday",
  wrap: true,
});
assert.ok(!("error" in snap));
if (!("error" in snap)) {
  assert.equal(snap.entries.length, 2);
  assert.equal(snap.entries[0].display, "Happy Birthday");
  assert.equal(snap.entries[1].price_cents, 200);
}

assert.ok(
  productRequiresConfig({
    variants: [],
    customisations: defs,
  }),
);
assert.equal(
  productRequiresConfig({
    variants: [],
    customisations: [{ ...defs[1], required: false }],
  }),
  false,
);

assert.notEqual(
  serializeCustomisationsForKey({ msg: "A" }),
  serializeCustomisationsForKey({ msg: "B" }),
);
assert.equal(serializeCustomisationsForKey({}), "");

const multi: ProductCustomisation = {
  id: "mix",
  label: "Mix-ins",
  type: "multi_select",
  required: true,
  choices: [
    { label: "A", price_cents: null },
    { label: "B", price_cents: null },
    { label: "C", price_cents: null },
    { label: "D", price_cents: null },
  ],
  price_cents: null,
  min_select: 2,
  max_select: 3,
  position: 0,
};

assert.equal(multiSelectHint(multi), "Choose 2–3");
assert.equal(customisationAnswersComplete([multi], {}), false);
assert.equal(
  customisationAnswersComplete([multi], { mix: ["A"] }),
  false,
);
assert.equal(
  customisationAnswersComplete([multi], { mix: ["A", "B"] }),
  true,
);
assert.equal(
  customisationAnswersComplete([multi], { mix: ["A", "B", "C", "D"] }),
  false,
);

const exact: ProductCustomisation = {
  ...multi,
  min_select: 3,
  max_select: 3,
};
assert.equal(multiSelectHint(exact), "Choose exactly 3");

console.log("products/customisations.check: ok");
