import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { storePublishIssues } from "./publish-readiness";
import type { Store } from "./types";

const base = {
  id: "1",
  owner_id: "u",
  name: "Test",
  slug: "test",
  status: "draft",
  vibe: null,
  hero: {},
  fulfillment: {},
  paynow: {},
  created_at: "",
  updated_at: "",
} as Store;

describe("storePublishIssues", () => {
  it("links each issue to a fix route", () => {
    const issues = storePublishIssues(base, 0);
    assert.ok(issues.some((i) => i.href === "/storefront"));
    assert.ok(issues.some((i) => i.href === "/products/new"));
    assert.ok(issues.some((i) => i.href === "/settings"));
  });

  it("returns empty when ready", () => {
    const ready = {
      ...base,
      vibe: "strada",
      hero: { title: "Shop" },
      fulfillment: {
        pickup: { enabled: true, instructions: "Counter" },
      },
      paynow: {
        proxy_type: "mobile",
        proxy_value: "91234567",
        recipient_name: "Test",
      },
    } as Store;
    assert.deepEqual(storePublishIssues(ready, 1), []);
  });

  it("treats method-only fulfillment as complete", () => {
    const ready = {
      ...base,
      vibe: "strada",
      hero: { title: "Shop" },
      fulfillment: {
        delivery: { enabled: true, fee_cents: 0, instructions: "" },
      },
      paynow: {
        proxy_type: "mobile",
        proxy_value: "91234567",
        recipient_name: "Test",
      },
    } as Store;
    assert.deepEqual(storePublishIssues(ready, 1), []);
  });
});
