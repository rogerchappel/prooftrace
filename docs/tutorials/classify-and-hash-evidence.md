# Classify and Hash Evidence

Prooftrace currently exposes small local proof utilities: command
classification and SHA-256 hashing. This demo shows the available surface
without claiming a complete proof-bundle format.

## Run the demo

```sh
bash demo/run-proof-utility-demo.sh
```

The script builds the CLI, then verifies:

- `npm test` is classified as `test`;
- `npm run package:smoke` is classified as `package`;
- `fixtures/evidence.txt` hashes to a 64-character SHA-256 digest.

## Manual commands

```sh
npm run build
node dist/cli.js kind "npm test"
node dist/cli.js kind "npm run package:smoke"
node dist/cli.js hash "$(cat fixtures/evidence.txt)"
```

## Talking points

- Command classification is useful metadata for proof bundles and review logs.
- The classifier treats package verification commands such as
  `npm run package:smoke` as `package`, even though their script name also
  contains `smoke`.
- Hashes prove byte identity for the exact text provided to the command.
- The current CLI is intentionally narrow while the proof bundle format is still
  being designed.
