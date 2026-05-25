# Conventions — ChefFlow UI

The implementer follows these. When generic React/Next.js advice conflicts with a
pattern documented here, **the repo pattern wins**. These are derived from the actual
codebase, not from defaults.

## TypeScript

- Prefer `interface` over `type`.
- No `any`. Use `unknown` + narrowing when the type is uncertain.
- Strict mode is on — respect nullability. Use `??` (not `||`) when the fallback
  should apply only to `null`/`undefined`.
- Explicit return types on exported/public functions.
- Import types with `import type { ... }`.
- Const assertions for literal types (`as const`).

## Comments

- Zero comments unless strictly necessary to understand non-obvious logic.
- No JSDoc, no inline explainers, no "what this does" headers.
- All code and comments in English.

## Naming & file layout

- `.tsx` → PascalCase, each component in its own PascalCase folder:
  `RecipeCard/RecipeCard.tsx`.
- `.ts` → camelCase (`useRecipes.ts`, `recipe-client.ts` is the shadcn-style exception).
- Route/section directories: lowercase (`dashboard/`, `auth/`, `planning/`).
- `src/components/ui/` keeps kebab-case (shadcn auto-generated) — do not rename.
- Next.js reserved files keep their names (`page.tsx`, `layout.tsx`, `error.tsx`, …).
- Named exports preferred over default exports.

## Component structure

- Server Components by default. Add `"use client"` only for interactivity, browser
  APIs, React hooks, or client-only libraries — keep its surface minimal.
- Client components: `"use client"` at top, declared as `const Component = () => {}`.
- Server components: declared with the `function` keyword.
- Order within a file: exported component → subcomponents → helpers → static content → types.
- Co-locate related component/util/types in the same folder.
- Use `cn()` from `@/lib/utils` to merge class names.

## Data fetching — TanStack React Query

One hook per domain under `src/hooks/<useThing>/<useThing>.ts`, marked `"use client"`.

- Export a frozen query-key object per domain, e.g.:
  ```ts
  export const RECIPE_KEYS = {
    all: ["recipes"] as const,
    detail: (id: string | number) => ["recipes", id] as const,
  };
  ```
- In `queryFn`, call the API client, and **throw** when `response.error` is set:
  `throw new Error(response.error.message[0]);`
- Return a clean shape from the hook (`{ recipes, isLoading, error, refetch }`),
  defaulting collections to `[]`.
- Mutations use `useMutation` + `useQueryClient`, invalidate the relevant key on
  success, and surface results with `toast` from `sonner`.
- Query defaults live in `src/providers/query-client-provider.tsx`
  (`staleTime: 60s`, `retry: 1`, `refetchOnWindowFocus: false`).

## API layer

- Class-based clients in `src/lib/api/` (`base-client.ts`, `recipe-client.ts`,
  `planning-client.ts`, `auth-client.ts`). Each domain client extends/uses `BaseClient`.
- Auth is **JWT in an httpOnly cookie**; requests use `credentials: "include"`.
  `BaseClient` handles a single-flight token refresh via `/auth/refresh`.
- All responses are typed `ApiResponse<T>` / `ApiError` — interfaces live in
  `src/lib/api/interface/` (re-exported from `src/lib/api/interface/index.ts`).
- Base URL comes from `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:4000`).
- Do not call `fetch` directly from components/hooks — go through a client.

## State

- Client state: Zustand stores in `src/store/` (e.g. `auth-store.ts`).
- Server state: React Query (above). Don't duplicate server data into Zustand.

## Forms & validation

- `react-hook-form` + `zod` via `@hookform/resolvers`.
- Zod schemas live in `src/lib/validations/` (`auth.schema.ts`, `recipe.schema.ts`, …).
- Reuse field components from `src/components/auth/` (`TextInputField`,
  `PasswordInputField`, `FormFieldError`) instead of hand-rolling inputs.

## i18n (next-intl)

```ts
// Client components
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");

// Server components
import { getTranslations } from "next-intl/server";
const t = await getTranslations("namespace");

// Navigation — replaces next/navigation
import { Link, useRouter, usePathname } from "@/i18n/routing";
```

Every user-facing string must have keys in all locale files under `messages/`
(`en, es, fr, de, it`). `en` is the source of truth.

## Styling

- shadcn/ui (new-york) as the default component library; primitives via Radix.
- Tailwind v4, utility-first. Theme tokens are defined in `src/app/globals.css`
  with `@theme` — customize there, never a `tailwind.config`.
- Use semantic tokens (`bg-primary`, `text-foreground`) — see `docs/design-system.md`.

## Tooling

- Package manager: **pnpm** only.
- Lint/format: **Biome** (`pnpm run lint` = `biome check`, `pnpm run format`).
  Run `pnpm run format` after adding shadcn components.
- Husky pre-commit runs `biome check --write`; it blocks commits with unfixable issues.
- Path alias: `@/*` → `./src/*`.
