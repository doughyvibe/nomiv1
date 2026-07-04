import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildEmailConfirmation,
  buildWhatsAppConfirmationMessage,
  whatsAppConfirmationUrl,
} from "./confirmation-message";

const sample = {
  storeName: "Sarah Bakes",
  order: {
    customer_name: "Alex",
    reference: "ORD-8F3K2",
    total_cents: 2300,
    fulfillment_method: "pickup" as const,
    delivery_address: null,
    fulfillment_fee_cents: 0,
  },
  items: [{ product_name: "Brownie", quantity: 2, price_cents: 1150 }],
};

describe("confirmation-message", () => {
  it("builds WhatsApp confirmation with key fields", () => {
    const msg = buildWhatsAppConfirmationMessage(sample);
    assert.match(msg, /Alex/);
    assert.match(msg, /ORD-8F3K2/);
    assert.match(msg, /Sarah Bakes/);
    assert.match(msg, /S\$23\.00/);
    assert.match(msg, /Pickup/);
  });

  it("builds email subject and body", () => {
    const { subject, body } = buildEmailConfirmation(sample);
    assert.equal(subject, "Your order is confirmed — ORD-8F3K2");
    assert.match(body, /verified your payment/);
  });

  it("builds WhatsApp URL with encoded message", () => {
    const url = whatsAppConfirmationUrl(
      "+6591234567",
      "Hello confirmed",
    );
    assert.ok(url.startsWith("https://wa.me/6591234567?text="));
  });
});
