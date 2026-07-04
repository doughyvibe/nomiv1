import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canMarkCancelled,
  canMarkCompleted,
  canMarkPaymentVerified,
} from "./status-transitions";

describe("status-transitions", () => {
  it("allows verify from pending states", () => {
    assert.ok(canMarkPaymentVerified("payment_pending"));
    assert.ok(canMarkPaymentVerified("seller_verification_requested"));
    assert.ok(!canMarkPaymentVerified("seller_confirmed_paid"));
  });

  it("allows complete only after verified", () => {
    assert.ok(canMarkCompleted("seller_confirmed_paid"));
    assert.ok(!canMarkCompleted("seller_verification_requested"));
  });

  it("allows cancel before completed", () => {
    assert.ok(canMarkCancelled("payment_pending"));
    assert.ok(canMarkCancelled("seller_confirmed_paid"));
    assert.ok(!canMarkCancelled("completed"));
  });
});
