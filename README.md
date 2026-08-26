# prooftrace

Local-first proof utilities for agent-built changes. The current CLI exposes
small building blocks for classifying verification commands and hashing text
that may later appear in proof bundles.

## Status

Early MVP. The public surface is intentionally narrow while the proof bundle
format is still being designed.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/prooftrace.git
cd prooftrace
npm install
npm run build
```

## Quickstart

Classify a verification command:

```sh
node dist/cli.js kind "npm test"
```

Hash a short evidence string:

```sh
node dist/cli.js hash "npm test passed"
```

Hash the included sample evidence fixture:

```sh
node dist/cli.js hash "$(cat fixtures/evidence.txt)"
```

Run the checked-in demo:

```sh
bash demo/run-proof-utility-demo.sh
```

Parse copied shell-log evidence into command stubs:

```sh
node dist/cli.js from-log "$ npm test
exit 0"
```

The walkthrough in [docs/tutorials/classify-and-hash-evidence.md](docs/tutorials/classify-and-hash-evidence.md)
covers the same command classification and hashing flow. Promotion notes are in
[docs/promo/social-hooks.md](docs/promo/social-hooks.md).

Check CLI metadata:

```sh
node dist/cli.js --help
node dist/cli.js --version
```

Help and version flags are top-level options and must appear before a command.
After `kind`, `hash`, or `from-log`, every argument is treated as that command's
payload, including text such as `--help` and `--version`. Each command requires
a non-empty payload.

After publishing, the global command is:

```sh
prooftrace kind "npm run release:check"
```

## Package Contents

The npm package allowlist includes compiled runtime files, docs, scripts, and
public support documents needed for release review: `README.md`, `LICENSE`,
`SECURITY.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`. Compiled test artifacts
(`dist/*.test.js`, `*.test.d.ts`, `*.test.js.map`) and `scripts/*.test.mjs`
suites are excluded from the tarball. Run `npm run package:smoke` before
publishing: it lists the tarball contents and fails if any test artifact
reappears.

## Verification

Run the full release gate before opening a PR or preparing a release:

```sh
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

`scripts/validate.sh` runs the same package scripts and also runs
`agent-qc ready` when that optional tool is installed. Missing `agent-qc` is
treated as a skip, not a failure.

Maintainers preparing a tagged npm release should follow
[the release prerequisites and recovery guide](docs/releasing.md).

## Limitations

- The CLI does not yet generate complete proof bundles.
- `from-log` parses copied logs only; it does not execute commands.
- Command classification is heuristic and should be treated as metadata, not a
  security decision.
- Hashes prove byte identity only for the exact input string or file content.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small and include the exact
verification command in every pull request.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance. Do not
include secrets, private logs, proprietary source, or customer data in public
proof examples.

## License

MIT
