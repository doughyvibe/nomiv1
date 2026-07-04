import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatBuyerDetailsCopy,
  mailtoBuyerUrl,
  whatsAppBuyerUrl,
  whatsAppPhoneDigits,
} from "./contact-buyer";

describe("contact-buyer", () => {
  it("normalizes SG phones for WhatsApp", () => {
    assert.equal(whatsAppPhoneDigits("91234567"), "6591234567");
    assert.equal(whatsAppPhoneDigits("+6591234567"), "6591234567");
    assert.equal(
      whatsAppBuyerUrl("+6591234567"),
      "https://wa.me/6591234567",
    );
  });

  it("builds mailto and copy text", () => {
    assert.equal(
      mailtoBuyerUrl("buyer@example.com", { subject: "Hi" }),
      "mailto:buyer@example.com?subject=Hi",
    );
    assert.match(
      formatBuyerDetailsCopy({
        customer_name: "Alex",
        customer_phone: "+6591234567",
        customer_email: "alex@example.com",
      }),
      /Alex/,
    );
  });
});
