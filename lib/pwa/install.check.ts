import assert from "node:assert/strict";

import { detectInstallBrowser } from "./install";

assert.equal(
  detectInstallBrowser({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    platform: "iPhone",
    maxTouchPoints: 5,
  }),
  "ios",
);

assert.equal(
  detectInstallBrowser({
    userAgent: "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0",
    platform: "Linux armv8l",
    maxTouchPoints: 5,
  }),
  "android",
);

assert.equal(
  detectInstallBrowser({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0",
    platform: "MacIntel",
    maxTouchPoints: 0,
  }),
  "desktop",
);

assert.equal(
  detectInstallBrowser({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    platform: "MacIntel",
    maxTouchPoints: 5,
  }),
  "ios",
);

console.log("install.check.ts: ok");
