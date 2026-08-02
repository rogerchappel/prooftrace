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

For an existing tag whose npm package or GitHub release is missing, open
**Actions → Recover existing tagged release → Run workflow**, enter the exact
tag (for example `v0.1.0`), and run it from the default branch. The workflow:

1. requires a strict `vX.Y.Z` tag that already exists;
2. checks out that tag and verifies its commit is `HEAD` and its version matches
   `package.json`;
3. runs the tagged revision's full release checks and package dry run;
4. queries npm and GitHub, then creates only the missing destination.

It is safe to dispatch again after interruption: an existing npm version is
never republished and an existing GitHub release is never recreated. When the
GitHub release is missing, its tarball is downloaded from npm after publication
so the attached artifact is the registry's immutable package.

- If validation or tests fail, fix the default branch and create a new version
  and tag.
- If npm publication fails, correct the trusted-publisher configuration before
  dispatching recovery again for the same still-unpublished tag.
- If npm succeeds but GitHub release creation fails, dispatch recovery again;
  it skips npm and creates the release from `npm pack prooftrace@<version>`.
- If the GitHub release exists but npm is missing, recovery publishes npm and
  leaves the existing GitHub release untouched.
- If both destinations already exist, recovery runs validation and checks, then
  records a completed no-op.

Publishing and creating releases are maintainer actions. The dry-run commands
above never publish.
