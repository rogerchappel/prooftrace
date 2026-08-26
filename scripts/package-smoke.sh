#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null

test -f ./dist/cli.js
test -f ./dist/index.js

pack_list="$(npm pack --dry-run 2>&1)"
printf '%s\n' "$pack_list"

if printf '%s\n' "$pack_list" | grep -E 'dist/.*\.test\.(js|d\.ts|js\.map)$|scripts/.*\.test\.mjs$'; then
  echo "error: test artifacts found in the publish tarball" >&2
  exit 1
fi

echo "package:smoke passed: publish tarball contains no test artifacts"
