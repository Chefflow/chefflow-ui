# Architecture — ChefFlow UI

Recipe management and meal-planning app. Next.js 16 (App Router), React 19,
TypeScript strict, Tailwind v4 + shadcn/ui, next-intl. Talks to a separate
`chefflow-api` backend over HTTP (JWT cookie auth).

## File structure

```
src/
  app/[locale]/            # Locale-scoped routes (dashboard, login, signup, terms, privacy)
    layout.tsx             # Locale layout: NextIntlClientProvider + fonts + providers
    globals.css            # Design system via @theme (see docs/design-system.md)
  components/
    ui/                    # shadcn/ui primitives (kebab-case, auto-generated)
    auth/ dashboard/ planning/ …   # Feature components, one PascalCase folder each
  config/                  # environment.ts and app config
  hooks/<useThing>/        # One React Query / logic hook per domain
  i18n/                    # config.ts, routing.ts, request.ts
  lib/
    api/                   # Class-based API clients + interface/ types
    auth/ crypto/ validations/ metadata/   # Schemas, helpers
    utils.ts               # cn()
  providers/               # query-client-provider.tsx, etc.
  store/                   # Zustand stores
  types/                   # Shared domain types
  proxy.ts                 # Next.js 16 Proxy: locale routing (next-intl) + auth gating
messages/                  # en|es|fr|de|it translation JSON
```

## Internationalization (next-intl)

- Locales: `en` (default), `es`, `fr`, `de`, `it`. `localePrefix: "always"`.
- Routing pattern `/{locale}/path`. Next.js 16 uses the **Proxy** convention: routing
  logic lives in `src/proxy.ts` (`export default function proxy`), not `middleware.ts`.
  It runs next-intl locale routing and also gates auth — redirects unauthenticated users
  away from `/dashboard` and authenticated users away from `/login` & `/signup`
  (reads the `accessToken` cookie). Matcher is the `config.matcher` export in that file.
- Config split: `src/i18n/config.ts` (locale names/flags), `routing.ts` (nav helpers),
  `request.ts` (message loading). Layout `src/app/[locale]/layout.tsx` generates static
  params for all locales and 404s on invalid ones.
- Usage snippets: see `docs/conventions.md` → i18n.

## Component & data architecture

- Server Components by default; client islands for interactivity.
- Server state via TanStack React Query (hooks in `src/hooks/`), client state via Zustand
  (`src/store/`). API access only through clients in `src/lib/api/`.
- shadcn/ui (new-york, RSC enabled) configured in `components.json`; Radix primitives.

## Key integration points

### Add a locale
1. `src/i18n/config.ts` — `locales`, `localeNames`, `localeFlags`.
2. `src/i18n/routing.ts` — `locales`.
3. `src/proxy.ts` — `validLocales` array and `config.matcher`.
4. `messages/{locale}.json`.

### Add a shadcn component
1. `pnpm dlx shadcn@latest add [component-name]` → lands in `src/components/ui/`.
2. `pnpm run format`.
3. Import: `import { Component } from "@/components/ui/component"`. It picks up theme
   tokens from `globals.css` automatically.

### Path aliases
- `@/*` → `./src/*` (`tsconfig.json`). Used everywhere.
