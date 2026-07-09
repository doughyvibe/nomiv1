import assert from "node:assert/strict";

import {
  heroLogoClassName,
  resolveLogoSize,
  resolveLogoStyle,
} from "@/lib/stores/hero-logo";

assert.equal(resolveLogoSize(undefined), "m");
assert.equal(resolveLogoSize("s"), "s");
assert.equal(resolveLogoSize("l"), "l");
assert.equal(resolveLogoStyle(undefined), "plain");
assert.equal(resolveLogoStyle("circle"), "circle");

const classes = heroLogoClassName("l", "circle");
assert.ok(classes.includes("hero-logo"));
assert.ok(classes.includes("object-contain"));
assert.ok(classes.includes("hero-logo-l"));
assert.ok(classes.includes("hero-logo-circle"));
assert.ok(!classes.includes("object-cover"));

const preview = heroLogoClassName("m", "plain", { preview: true });
assert.ok(preview.includes("hero-logo-preview"));
assert.ok(preview.includes("hero-logo-plain"));

console.log("hero-logo self-check ok");
