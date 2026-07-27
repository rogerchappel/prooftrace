# Releasing prooftrace

Tagged releases publish the package to npm with provenance and public access,
then create a GitHub release containing the package tarball.

## Prerequisites

- The npm package `prooftrace` must trust this repository's
  `.github/workflows/release.yml` workflow as an npm trusted publisher.
- The release commit must pass `npm run release:check` and
  `npm run release:dry-run`.
- `package.json` must contain the intended version. The tag must be exactly
  `v<package version>` (for example, package version `0.1.0` uses tag
  `v0.1.0`).

Run the local, non-publishing checks before creating a tag:

```sh
npm ci
npm run release:check
npm run release:dry-run
node scripts/validate-release.mjs v0.1.0
```

Replace `v0.1.0` with the proposed tag. The validator rejects a version
mismatch or missing publication wiring.

## Recovery

Do not move or reuse a published version tag.

- If validation or tests fail, fix the default branch and create a new version
  and tag.
- If npm publication fails, inspect the workflow's publish step. Correct the
  trusted-publisher configuration or repository change before retrying the
  same unpublished tag.
- If npm publication succeeds but GitHub release creation fails, do not rerun
  the npm publish step. Confirm the published version with
  `npm view prooftrace@<version> version`, download its tarball with
  `npm pack prooftrace@<version>`, and create the matching GitHub release from
  that immutable package artifact.

Publishing and creating releases are maintainer actions. The dry-run commands
above never publish.
