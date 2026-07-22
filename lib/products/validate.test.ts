import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parsePriceToCents, validateProductInput } from "./validate";

describe("products/validate", () => {
  it("accepts valid product input", () => {
    assert.equal(
      validateProductInput({
        name: "Slayer",
        price_cents: 950,
        description: "A jig",
      }),
      null,
    );
  });

  it("rejects empty name and bad price", () => {
    assert.match(
      validateProductInput({
        name: "  ",
        price_cents: 950,
        description: "",
      }) ?? "",
      /name/i,
    );
    assert.match(
      validateProductInput({
        name: "Slayer",
        price_cents: -1,
        description: "",
      }) ?? "",
      /price/i,
    );
  });

  it("parses dollar input to cents", () => {
    assert.equal(parsePriceToCents("9.50"), 950);
    assert.equal(parsePriceToCents("bad"), null);
  });

  it("accepts live status", () => {
    assert.equal(
      validateProductInput({
        name: "Slayer",
        price_cents: 950,
        description: "",
        status: "live",
      }),
      null,
    );
  });

  it("accepts lead_time_days ≥ 0 and rejects negatives", () => {
    assert.equal(
      validateProductInput({
        name: "Brownies",
        price_cents: 1200,
        description: "",
        lead_time_days: 3,
      }),
      null,
    );
    assert.match(
      validateProductInput({
        name: "Brownies",
        price_cents: 1200,
        description: "",
        lead_time_days: -1,
      }) ?? "",
      /prep/i,
    );
  });
});
