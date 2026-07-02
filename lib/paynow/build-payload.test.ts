import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPayNowPayload,
  extractPayloadCrc,
  normalizeSgMobile,
  validatePayloadCrc,
} from "./index";

describe("PayNow payload builder", () => {
  it("normalizes Singapore mobile numbers", () => {
    assert.equal(normalizeSgMobile("91234567"), "+6591234567");
    assert.equal(normalizeSgMobile("+6591234567"), "+6591234567");
    assert.equal(normalizeSgMobile("6591234567"), "+6591234567");
  });

  it("builds a mobile payload with required TLV fields", () => {
    const payload = buildPayNowPayload({
      proxyType: "mobile",
      proxyValue: "91234567",
      amount: 0.5,
      reference: "TEST-001",
      merchantName: "Sarah Bakes",
    });

    assert.match(payload, /^000201/);
    assert.match(payload, /010212/);
    assert.match(payload, /5802SG59/);
    assert.match(payload, /5303702/);
    assert.match(payload, /54040\.50/);
    assert.match(payload, /6304[A-F0-9]{4}$/);
    assert.ok(validatePayloadCrc(payload));
  });

  it("builds a UEN payload with non-editable amount", () => {
    const payload = buildPayNowPayload({
      proxyType: "uen",
      proxyValue: "201403121W",
      amount: 23,
      reference: "ORD-8F3K2",
      merchantName: "ACME Pte Ltd",
    });

    assert.match(payload, /010212/);
    assert.match(payload, /540523\.00/);
    assert.ok(validatePayloadCrc(payload));

    const { provided, computed } = extractPayloadCrc(payload);
    assert.equal(provided, computed);
  });

  it("rejects invalid references", () => {
    assert.throws(() =>
      buildPayNowPayload({
        proxyType: "mobile",
        proxyValue: "91234567",
        amount: 1,
        reference: "bad ref!",
      }),
    );
  });

  it("validates CRC independently", () => {
    const payload = buildPayNowPayload({
      proxyType: "mobile",
      proxyValue: "98765432",
      amount: 1.23,
      reference: "REF123",
    });

    assert.ok(validatePayloadCrc(payload));
    assert.ok(!validatePayloadCrc(`${payload.slice(0, -1)}0`));
  });
});
