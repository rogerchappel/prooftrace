#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d "/tmp/prooftrace-demo.XXXXXX")"
trap 'rm -rf "$tmp_dir"' EXIT

cd "$repo_root"
npm run build >/dev/null

node dist/cli.js kind "npm test" >"$tmp_dir/kind-test.txt"
node dist/cli.js kind "npm run package:smoke" >"$tmp_dir/kind-package.txt"
node dist/cli.js hash "$(cat fixtures/evidence.txt)" >"$tmp_dir/evidence.sha256"

grep -q '^test$' "$tmp_dir/kind-test.txt"
grep -q '^package$' "$tmp_dir/kind-package.txt"
test "$(wc -c <"$tmp_dir/evidence.sha256" | tr -d ' ')" -eq 65

echo "Command kind outputs: $tmp_dir/kind-test.txt, $tmp_dir/kind-package.txt"
echo "Evidence hash:        $tmp_dir/evidence.sha256"
