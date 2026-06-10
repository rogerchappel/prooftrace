import test from "node:test";
import assert from "node:assert/strict";
import { classifyCommand } from "./command-kind.js";

test("classifyCommand recognizes common verification commands", () => {
  assert.equal(classifyCommand("npm test"), "test");
  assert.equal(classifyCommand("node --test dist/**/*.test.js"), "test");
  assert.equal(classifyCommand("npm run build"), "build");
  assert.equal(classifyCommand("npm run smoke"), "smoke");
  assert.equal(classifyCommand("npm pack --dry-run"), "package");
});

test("classifyCommand falls back to generic for unrelated commands", () => {
  assert.equal(classifyCommand("echo hello"), "generic");
});
