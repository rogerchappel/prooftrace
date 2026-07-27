#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const workflow = await readFile(new URL(".github/workflows/release.yml", root), "utf8");
const tag = process.argv[2] ?? `v${packageJson.version}`;
const expectedTag = `v${packageJson.version}`;

const errors = [];

if (tag !== expectedTag) {
  errors.push(`release tag ${tag} does not match package version ${expectedTag}`);
}
if (packageJson.publishConfig?.access !== "public") {
  errors.push('package.json publishConfig.access must be "public"');
}
if (packageJson.publishConfig?.provenance !== true) {
  errors.push("package.json publishConfig.provenance must be true");
}

const requiredWorkflowFragments = [
  'run: node scripts/validate-release.mjs "${GITHUB_REF_NAME}"',
  "run: npm run release:check",
  "run: npm publish --provenance --access public",
  'run: gh release create "${GITHUB_REF_NAME}"',
];

for (const fragment of requiredWorkflowFragments) {
  if (!workflow.includes(fragment)) {
    errors.push(`release workflow is missing: ${fragment}`);
  }
}

const publishIndex = workflow.indexOf("run: npm publish --provenance --access public");
const releaseIndex = workflow.indexOf('run: gh release create "${GITHUB_REF_NAME}"');
if (publishIndex >= releaseIndex) {
  errors.push("npm publish must run before the GitHub release is created");
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`release validation failed: ${error}`);
  }
  process.exit(1);
}

console.log(`release configuration is valid for ${tag}`);
