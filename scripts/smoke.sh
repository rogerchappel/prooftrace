#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null

node dist/cli.js --help >/tmp/prooftrace-help.txt
grep -q "prooftrace" /tmp/prooftrace-help.txt
node dist/cli.js --version | grep -q "prooftrace 0.1.0"

kind="$(node dist/cli.js kind "npm test")"
test "$kind" = "test"

hash="$(node dist/cli.js hash "prooftrace")"
test "${#hash}" -eq 64
