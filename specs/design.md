# Design — <feature-id>

> Technical plan derived from `requirements.md`. Names the exact files to touch and the
> patterns to follow (see `docs/conventions.md`). The implementer changes ONLY what is
> listed here. No new patterns without recording them here first.

## Approach

2–4 sentences on the chosen approach and why, calling out trade-offs.

## Files to modify

| File | Change |
|------|--------|
| `src/...` | … |

## New files

| File | Purpose |
|------|---------|
| `src/components/<Feature>/<Feature>.tsx` | PascalCase folder, one component |

## Data / API

- API client method(s) used or added in `src/lib/api/*-client.ts` (typed `ApiResponse<T>`).
- React Query keys touched (e.g. `RECIPE_KEYS.all`) and invalidation on mutation.
- Zod schema changes in `src/lib/validations/`.
- Zustand store changes in `src/store/` (client state only).

## Types

- New/changed interfaces in `src/types/` or `src/lib/api/interface/`.

## i18n

- New message keys to add to all locale files under `messages/`.

## Patterns followed

- Confirm: client component as `const`, server as `function`, `import type`, `cn()`,
  no comments, named exports. Note any repo-specific pattern reused.

## Risks

- Edge cases, migration concerns, anything that could break existing behavior.
