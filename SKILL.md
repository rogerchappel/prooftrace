# prooftrace Skill

Use this skill when an agent needs to produce or inspect local evidence for code changes: command kinds, hashes, copied verification logs, and future proof bundles.

## Inputs

- Explicit verification commands or copied command logs.
- Local evidence text or fixture files to hash.
- Repository context for release or PR review.

## Workflow

1. Classify each verification command with `prooftrace kind "<command>"`.
2. Hash short evidence strings with `prooftrace hash "<text>"` when a stable identity is needed.
3. Parse copied shell logs with `prooftrace from-log "<log text>"` to create command evidence stubs.
4. Include command kind, pass/fail status, exit code, and excerpts in the PR or release evidence.
5. Keep raw logs local unless they are already reviewed for secrets and private paths.

## Side Effects

- `kind`, `hash`, and `from-log` only read their arguments and print output.
- No command executes shell text, calls a network service, or writes files by default.

## Approval Boundaries

Ask before publishing logs, storing proprietary evidence in fixtures, or adding automatic command execution. Treat hashes as evidence identifiers, not cryptographic release signatures.

## Verification

Run:

```bash
npm run check
npm test
npm run smoke
npm run package:smoke
```

## Examples

```bash
prooftrace kind "npm run release:check"
prooftrace hash "npm test passed"
prooftrace from-log "$ npm test
exit 0"
```
