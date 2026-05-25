#!/usr/bin/env bash
# ChefFlow harness Guardian.
# Run BEFORE starting any task:  ./init.sh
# Verifies toolchain, dependencies, harness memory files, types, and lint.
# Exits non-zero if the workspace is not safe to build on.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

FAIL=0
say()  { printf '\n\033[1m▶ %s\033[0m\n' "$1"; }
ok()   { printf '  \033[32m✓ %s\033[0m\n' "$1"; }
warn() { printf '  \033[33m! %s\033[0m\n' "$1"; }
err()  { printf '  \033[31m✗ %s\033[0m\n' "$1"; FAIL=1; }

say "1/5 Toolchain"
if command -v node >/dev/null 2>&1; then ok "node $(node -v)"; else err "node not found"; fi
if command -v pnpm >/dev/null 2>&1; then ok "pnpm $(pnpm -v)"; else err "pnpm not found — npm i -g pnpm"; fi

say "2/5 Dependencies"
if [ -d node_modules ]; then
  ok "node_modules present"
else
  warn "node_modules missing — running pnpm install"
  pnpm install || err "pnpm install failed"
fi

say "3/5 Harness memory files"
mkdir -p specs progress .claude/agents
if [ ! -f progress/history.md ]; then printf '# Progress History\n' > progress/history.md; warn "created progress/history.md"; fi
if [ ! -f features.json ]; then printf '{\n  "version": 1,\n  "features": []\n}\n' > features.json; warn "created features.json"; fi
for f in specs/requirements.md specs/design.md specs/tasks.md; do
  [ -f "$f" ] || warn "missing $f — run the spec-author agent before implementing"
done
ok "harness scaffold present"

say "4/5 Type check (tsc --noEmit)"
if pnpm exec tsc --noEmit; then ok "no type errors"; else err "type errors"; fi

say "5/5 Lint (biome check)"
if pnpm biome check --no-errors-on-unmatched --files-ignore-unknown=true; then ok "biome clean"; else err "biome reported issues"; fi

# Optional: run the test suite only if a "test" script exists in package.json.
if node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts.test ? 0 : 1)" 2>/dev/null; then
  say "6/6 Tests"
  if pnpm test; then ok "tests pass"; else err "tests failing"; fi
fi

echo
if [ "$FAIL" -eq 0 ]; then
  printf '\033[1;32m✅ Harness healthy — safe to start.\033[0m\n'
else
  printf '\033[1;31m❌ Harness check failed — fix the items above before starting.\033[0m\n'
fi
exit "$FAIL"
