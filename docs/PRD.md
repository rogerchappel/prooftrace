# ProofTrace PRD

Status: in-progress

## Summary

ProofTrace is a local-first proof bundle generator for agent-built changes. It collects commands, test outputs, changed files, package metadata, and smoke evidence into a signed-looking but unsigned JSON/Markdown bundle that reviewers can inspect before trusting a run.

## Problem

Agent runs often end with a narrative summary, but summaries are easy to overstate. Developers need a deterministic evidence bundle that shows exactly what changed, what commands ran, what passed or failed, and which files were used as fixtures.

## Goals

- Capture local command results from explicit commands or saved log files.
- Summarize git status, commits, changed files, and package scripts.
- Normalize test and smoke results into a concise proof report.
- Detect gaps such as missing smoke evidence, dirty worktrees, or untracked fixtures.
- Work offline and store all outputs locally.

## Non-Goals

- No cryptographic signing in V1.
- No CI service integration.
- No automatic command execution unless the user passes commands explicitly.

## CLI

```bash
prooftrace collect --cmd "npm test" --cmd "npm run build" --out tmp/proof
prooftrace from-log fixtures/run.log --repo fixtures/sample-repo
prooftrace check tmp/proof/prooftrace.json
```

## MVP Requirements

- TypeScript Node CLI with `collect`, `from-log`, and `check` commands.
- Safe command runner with timeout and explicit command list only.
- Parsers for common npm, shell, and generic command output.
- Fixture-backed tests and local smoke validation.
- README with a practical "trust but verify" workflow for agent output.

## Attribution

Inspired by agent execution logs, CI artifacts, and the growing need to verify AI-generated changes. Reframed as a small offline proof bundle for local developer workflows.
