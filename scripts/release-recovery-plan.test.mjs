import assert from "node:assert/strict";
import test from "node:test";

import { recoveryPlan } from "./release-recovery-plan.mjs";

test("creates both missing release destinations", () => {
  assert.deepEqual(recoveryPlan({ npmPublished: false, githubRelease: false }), {
    publishNpm: true,
    createGithubRelease: true,
    outcome: "publish-both",
  });
});

test("publishes only the missing npm package", () => {
  assert.deepEqual(recoveryPlan({ npmPublished: false, githubRelease: true }), {
    publishNpm: true,
    createGithubRelease: false,
    outcome: "publish-npm",
  });
});

test("creates only the missing GitHub release", () => {
  assert.deepEqual(recoveryPlan({ npmPublished: true, githubRelease: false }), {
    publishNpm: false,
    createGithubRelease: true,
    outcome: "create-github-release",
  });
});

test("skips an already complete release", () => {
  assert.deepEqual(recoveryPlan({ npmPublished: true, githubRelease: true }), {
    publishNpm: false,
    createGithubRelease: false,
    outcome: "complete",
  });
});
