import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  orderStoreAllowsBuyerAccess,
  sellerMobileContact,
} from "./seller-contact";

describe("orderStoreAllowsBuyerAccess", () => {
  it("allows published and unpublished stores", () => {
    assert.equal(orderStoreAllowsBuyerAccess("published"), true);
    assert.equal(orderStoreAllowsBuyerAccess("unpublished"), true);
    assert.equal(orderStoreAllowsBuyerAccess("suspended"), true);
  });

  it("blocks deleted stores", () => {
    assert.equal(orderStoreAllowsBuyerAccess("deleted"), false);
  });
});

describe("sellerMobileContact", () => {
  it("builds WhatsApp and tel links from PayNow mobile", () => {
    const contact = sellerMobileContact({
      proxy_type: "mobile",
      proxy_value: "91234567",
      recipient_name: "Test Shop",
    });
    assert.ok(contact);
    assert.equal(contact.display, "+65 9123 4567");
    assert.equal(contact.waUrl, "https://wa.me/6591234567");
    assert.equal(contact.telUrl, "tel:+6591234567");
  });

  it("returns null for UEN PayNow", () => {
    assert.equal(
      sellerMobileContact({
        proxy_type: "uen",
        proxy_value: "201234567A",
        recipient_name: "Co Pte Ltd",
      }),
      null,
    );
  });
});
