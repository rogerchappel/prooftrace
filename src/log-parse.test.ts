import assert from "node:assert/strict";
import test from "node:test";
import { parseCommandLog } from "./log-parse.js";

test("parseCommandLog does not pass commands without an explicit exit status", () => {
  const [command] = parseCommandLog(`$ npm test
tests passed but no exit status was captured`);

  assert.equal(command!.passed, false);
  assert.equal(command!.exitCode, null);
});

test("parseCommandLog uses explicit exit statuses for copied shell logs", () => {
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
  assert.equal(first.exitCode, 0);
  assert.equal(second.kind, "build");
  assert.equal(second.passed, false);
  assert.equal(second.exitCode, 2);
  assert.match(second.excerpt, /type error/);
});

test("parseCommandLog strips ANSI color from copied prompts, statuses, and output", () => {
  const [command] = parseCommandLog(
    "\u001b[32m$ npm test\u001b[0m\n\u001b[36mtests passed\u001b[0m\n\u001b[32mexit 0\u001b[0m"
  );

  assert.deepEqual(command, {
    command: "npm test",
    kind: "test",
    passed: true,
    exitCode: 0,
    excerpt: "tests passed"
  });
});
