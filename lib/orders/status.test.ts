import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buyerOrderView, isPaymentWindowExpired } from "./status";
import type { OrderRow } from "./types";

const baseOrder = {
  payment_expires_at: new Date(Date.now() + 60_000).toISOString(),
} as Pick<OrderRow, "status" | "payment_expires_at">;

describe("buyerOrderView", () => {
  it("maps statuses to buyer screens", () => {
    assert.equal(
      buyerOrderView({ ...baseOrder, status: "payment_pending" }),
      "payment_pending",
    );
    assert.equal(
      buyerOrderView({
        ...baseOrder,
        status: "seller_verification_requested",
      }),
      "awaiting_verification",
    );
    assert.equal(
      buyerOrderView({ ...baseOrder, status: "seller_confirmed_paid" }),
      "confirmed",
    );
    assert.equal(
      buyerOrderView({ ...baseOrder, status: "completed" }),
      "confirmed",
    );
    assert.equal(
      buyerOrderView({ ...baseOrder, status: "cancelled" }),
      "cancelled",
    );
  });

  it("derives expired from payment window", () => {
    assert.ok(
      isPaymentWindowExpired({
        status: "payment_pending",
        payment_expires_at: new Date(Date.now() - 1000).toISOString(),
      }),
    );
    assert.equal(
      buyerOrderView({
        status: "payment_pending",
        payment_expires_at: new Date(Date.now() - 1000).toISOString(),
      }),
      "expired",
    );
  });
});
