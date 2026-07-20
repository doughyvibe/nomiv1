import assert from "node:assert/strict";

import { deriveOnboardingStep } from "./progress";
import { fulfillmentIsComplete, type Store } from "./types";

const base = {
  id: "1",
  owner_id: "u",
  name: "Shop",
  slug: "shop",
  status: "draft",
  vibe: "atelier",
  hero: { title: "Shop" },
  fulfillment: {},
  paynow: {},
  created_at: "",
  updated_at: "",
} as Store;

const branded = {
  ...base,
  hero: { title: "Shop", onboarding_branding_done: true },
} as Store;

assert.equal(deriveOnboardingStep(null, 0), 1);
assert.equal(deriveOnboardingStep(base, 0), 2);
assert.equal(deriveOnboardingStep(branded, 0), 3);
assert.equal(fulfillmentIsComplete({}), false);
assert.equal(
  fulfillmentIsComplete({ pickup: { enabled: true, instructions: "" } }),
  true,
);
assert.equal(
  deriveOnboardingStep(
    {
      ...branded,
      fulfillment: { pickup: { enabled: true, instructions: "" } },
    },
    1,
  ),
  5,
);
assert.equal(
  deriveOnboardingStep(
    {
      ...branded,
      fulfillment: { pickup: { enabled: true, instructions: "MRT" } },
    },
    1,
  ),
  5,
);
assert.equal(
  deriveOnboardingStep(
    {
      ...branded,
      fulfillment: { pickup: { enabled: true, instructions: "MRT" } },
      paynow: {
        proxy_type: "mobile",
        proxy_value: "91234567",
        recipient_name: "Shop",
      },
      status: "draft",
    },
    1,
  ),
  "done",
);
assert.equal(
  deriveOnboardingStep(
    {
      ...branded,
      fulfillment: { pickup: { enabled: true, instructions: "MRT" } },
      paynow: {
        proxy_type: "mobile",
        proxy_value: "91234567",
        recipient_name: "Shop",
      },
      status: "published",
    },
    1,
  ),
  "done",
);

console.log("progress.check.ts: ok");
