import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { friendlyDbError } from "./friendly-db";

describe("friendlyDbError", () => {
  it("returns generic message for unknown errors", () => {
    assert.equal(
      friendlyDbError({ message: "connection reset" }),
      "Something went wrong. Please try again.",
    );
  });

  it("maps duplicate key errors", () => {
    assert.equal(
      friendlyDbError({ message: 'duplicate key value violates unique constraint "stores_slug_key"' }),
      "That value is already taken.",
    );
  });
});
