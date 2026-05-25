# Progress History

Rolling, append-only log. When context fills past ~20%, summarize the session here
and `/clear`. Newest entries on top.

---

## 2026-05-25 — Harness engineering bootstrap

- Applied the harness-builder structure to the repo (SDD workflow).
- Added: `init.sh` (Guardian), `features.json` (backlog), `specs/{requirements,design,tasks}.md`
  (EARS-based), `progress/history.md`, `.claude/agents/{leader,spec-author,implementer,reviewer}.md`.
- Pruned `CLAUDE.md` to a lean core; moved detail into `docs/conventions.md`,
  `docs/architecture.md`, `docs/design-system.md`. Left the `autoskills` block untouched.
- Verification gate has no test framework yet → `init.sh` gates on `tsc --noEmit` + `biome check`
  (auto-runs `pnpm test` if a `test` script is later added).
