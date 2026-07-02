import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { slugify, suggestAlternatives, validateSlugFormat } from "./slug";

describe("slug", () => {
  it("slugifies store names", () => {
    assert.equal(slugify("Sarah Bakes"), "sarah-bakes");
    assert.equal(slugify("  Café--Délice!  "), "cafe-delice");
    assert.equal(slugify("JigWave 🎣 Tackle"), "jigwave-tackle");
  });

  it("validates format per PRD §7", () => {
    assert.equal(validateSlugFormat("sarah-bakes"), null);
    assert.equal(validateSlugFormat("abc123"), null);
    assert.ok(validateSlugFormat("ab"));
    assert.ok(validateSlugFormat("-abc"));
    assert.ok(validateSlugFormat("abc-"));
    assert.ok(validateSlugFormat("a--b"));
    assert.ok(validateSlugFormat("Has Space"));
    assert.ok(validateSlugFormat("UPPER"));
  });

  it("suggests alternatives within length limits", () => {
    const alts = suggestAlternatives("sarahbakes");
    assert.ok(alts.includes("sarahbakes-sg"));
    assert.ok(alts.every((s) => validateSlugFormat(s) === null));
  });
});
