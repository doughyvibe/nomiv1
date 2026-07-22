import assert from "node:assert/strict";

import {
  isEditableStatus,
  parseEditableStatus,
  statusWriteFields,
} from "./status";

assert.deepEqual(statusWriteFields("live"), { status: "live", archived: false });
assert.deepEqual(statusWriteFields("archived"), {
  status: "archived",
  archived: true,
});
assert.equal(isEditableStatus("archived"), false);
assert.equal(isEditableStatus("live"), true);
assert.equal(parseEditableStatus("live"), "live");
assert.equal(parseEditableStatus("draft"), null);
assert.equal(parseEditableStatus("archived"), null);

console.log("products/status.check: ok");
