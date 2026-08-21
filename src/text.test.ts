import assert from "node:assert/strict";
import test from "node:test";

import { truncateMiddle } from "./text.js";

test("truncateMiddle bounds small and normal limits", () => {
  const input = "abcdefghijklmnopqrstuvwxyz";

  assert.equal(truncateMiddle(input, 1), "…");
  assert.equal(truncateMiddle(input, 10), "abcdefghi…");

  const longInput = "x".repeat(200);
  const truncated = truncateMiddle(longInput, 80);
  assert.equal(truncated.length, 80);
  assert.match(truncated, /\[prooftrace omitted 157 characters\]/);
});

test("truncateMiddle preserves inputs within the limit", () => {
  assert.equal(truncateMiddle("short", 5), "short");
});

test("truncateMiddle rejects invalid limits", () => {
  for (const limit of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => truncateMiddle("value", limit), {
      name: "RangeError",
      message: "maxChars must be a positive safe integer",
    });
  }
});
