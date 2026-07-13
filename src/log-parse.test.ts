import assert from "node:assert/strict";
import test from "node:test";
import { parseCommandLog } from "./log-parse.js";

test("parseCommandLog extracts command stubs from copied shell logs", () => {
  const parsed = parseCommandLog(`$ npm test
tests passed
exit 0
$ npm run build
type error
exit 2`);

  assert.equal(parsed.length, 2);
  const first = parsed[0]!;
  const second = parsed[1]!;
  assert.equal(first.command, "npm test");
  assert.equal(first.kind, "test");
  assert.equal(first.passed, true);
  assert.equal(second.kind, "build");
  assert.equal(second.passed, false);
  assert.equal(second.exitCode, 2);
  assert.match(second.excerpt, /type error/);
});
