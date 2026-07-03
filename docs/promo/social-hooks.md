# Prooftrace Social Hooks

Ground these posts in `demo/run-proof-utility-demo.sh`.

## Short posts

1. Prooftrace is starting with small pieces that proof bundles need: classify
   verification commands, hash evidence text, and keep the result local and
   inspectable.

2. A proof trail should say what kind of verification ran. `prooftrace kind
   "npm test"` returns `test`; `prooftrace kind "npm run package:smoke"`
   returns `smoke`.

3. The MVP is deliberately narrow: command metadata and hashes today, complete
   proof bundles later. That keeps the demo honest and easy to verify.

## Video angle

- Run the demo script.
- Show the command kind outputs.
- Show the SHA-256 file.
- Explain that hashes identify exact evidence text, not broad correctness.
