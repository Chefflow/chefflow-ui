# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChefFlow is a recipe management and meal planning application built with Next.js 15, React 19, and Tailwind CSS v4. The project uses Biome for linting and formatting, shadcn/ui for components, and is designed with a warm, culinary-focused design system.

## Development Commands

```bash
# Package manager: ALWAYS use pnpm
pnpm install              # Install dependencies
pnpm run dev              # Start dev server (Turbopack) on http://localhost:3000
pnpm run build            # Build for production (Turbopack)
pnpm start                # Start production server
pnpm run lint             # Lint code (Biome)
pnpm run format           # Format code (Biome)

# shadcn/ui component management
pnpm dlx shadcn@latest add [component-name]  # Add shadcn component

# Git hooks (Husky)
# Pre-commit hook automatically runs Biome checks before each commit
```

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **React**: 19.1.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 (PostCSS-based) + shadcn/ui (new-york style)
- **Internationalization**: next-intl v4.4.0 (English, Spanish, French, German, Italian)
- **Icons**: lucide-react
- **Fonts**: Inter (sans) and Crimson Pro (serif headings)
- **Code Quality**: Biome 2.2.0 (replaces ESLint + Prettier)
- **Git Hooks**: Husky v9.1.7 (pre-commit checks)
- **Build Tool**: Turbopack
- **Package Manager**: pnpm

## Architecture Overview

### Internationalization (i18n) Setup

The app uses **next-intl** with a locale-based routing strategy:

- **Supported locales**: `en` (default), `es`, `fr`, `de`, `it`
- **Routing pattern**: `/{locale}/path` (e.g., `/en/recipes`, `/es/recetas`)
- **Locale prefix**: Always required (`localePrefix: "always"`)
- **Middleware**: `src/middleware.ts` handles locale detection and automatic redirection
  - Routes without locale (e.g., `/login`) are automatically redirected to `/en/login` (default locale)
  - Detects user's preferred language from Accept-Language header
- **Configuration files**:
  - `src/i18n/config.ts` - Locale definitions, names, and flags
  - `src/i18n/routing.ts` - Routing configuration and navigation helpers
  - `src/i18n/request.ts` - Request config for loading locale messages
- **Translation files**: `messages/{locale}.json` (en.json, es.json, fr.json, de.json, it.json)
- **Layout structure**:
  - `src/app/[locale]/layout.tsx` - Locale-specific layout with NextIntlClientProvider
  - Generates static params for all locales
  - Validates locale and shows 404 for invalid locales

**Using i18n in components**:
```typescript
// Client components
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');

// Server components
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('namespace');

// Navigation (replaces next/navigation)
import { Link, useRouter, usePathname } from '@/i18n/routing';
```

### Component Architecture

**shadcn/ui Integration**:
- Configuration: `components.json` (new-york style, RSC enabled)
- Components location: `src/components/ui/`
- Utility function: `src/lib/utils.ts` exports `cn()` for className merging
- Uses Radix UI primitives (@radix-ui/react-*)
- All shadcn components are auto-formatted to match Biome style (double quotes, semicolons)

**Component patterns**:
- Server Components by default (no `'use client'` unless needed)
- Client components only for: user interactions, browser APIs, React hooks, client-only libraries
- Use `function` keyword for Server Components, `const` arrow functions for Client Components

## Design System

ChefFlow uses a custom light-mode-only design system defined in `src/app/globals.css` using Tailwind v4's `@theme` directive.

### Color Palette (OKLCH format)
- **Primary**: `oklch(72% 0.19 30)` - Orange/coral (#FF6B4A) for CTAs and accents
- **Secondary**: `oklch(94% 0.03 70)` - Cream/beige (#F5EBD5) for warm backgrounds
- **Foreground**: `oklch(28% 0.05 40)` - Dark brown (#3D2817) for text
- **Background**: `oklch(98% 0.015 70)` - Warm off-white with slight cream tone
- **Destructive**: `oklch(62% 0.22 25)` - Red for errors
- **Muted**: Uses secondary color for subtle backgrounds

All shadcn components automatically use these CSS variables via Tailwind utilities (e.g., `bg-primary`, `text-foreground`).

### Typography
- **Sans-serif**: Inter (body text, UI) - apply with `font-sans`
- **Serif**: Crimson Pro (headings, editorial) - apply with `font-serif`
- Font variables: `--font-inter`, `--font-crimson`
- Loaded in `src/app/[locale]/layout.tsx` via `next/font/google`

### Spacing & Effects
- Border radius: `--radius-sm` (0.5rem), `--radius-md` (0.75rem), `--radius-lg` (1rem)
- Shadows: `--shadow-subtle`, `--shadow-card`
- Access via Tailwind: `rounded-[var(--radius-md)]`, `shadow-[var(--shadow-card)]`

## Code Style and Conventions

### From .cursor/rules/standard.mdc

**TypeScript**:
- Prefer `interface` over `type`
- Avoid `any` - use `unknown` if type uncertain
- Define explicit return types for functions
- Use const assertions for literal types

**Naming**:
- `.tsx` files → PascalCase (e.g., `RecipeCard.tsx`)
- `.ts` files → camelCase (e.g., `useRecipes.ts`, `authClient.ts`)
- Each React component lives in its own PascalCase subfolder matching the filename (e.g., `RecipeCard/RecipeCard.tsx`)
- Route/section directories: lowercase (e.g., `dashboard/`, `auth/`, `planning/`)
- Exception: `src/components/ui/` keeps kebab-case (shadcn auto-generated)
- Exception: Next.js reserved files keep their names (`page.tsx`, `layout.tsx`, `error.tsx`, etc.)
- Named exports preferred

**Component Structure**:
- Order: exported component → subcomponents → helpers → static content → types
- Break complex components into smaller reusable parts
- Minimize `'use client'` surface area
- Co-locate related components/utils/types

**Next.js Patterns**:
- Fetch data in Server Components when possible
- Use Server Actions for mutations
- Implement loading.tsx, error.tsx, not-found.tsx conventions
- Use `generateMetadata` for SEO

**Styling**:
- shadcn/ui as default component library
- Tailwind utility-first approach
- Use `cn()` from `@/lib/utils` for conditional classes
- Customize theme in `globals.css` (not tailwind.config)

### Biome Configuration

- **Quote style**: Double quotes (matches shadcn)
- **Indentation**: 2 spaces
- **Auto-organize imports**: Enabled
- **Disabled rules** (for shadcn compatibility):
  - `useFilenamingConvention` - allows kebab-case files (e.g., `dropdown-menu.tsx`)
  - `noExcessiveCognitiveComplexity` - shadcn components can be complex
  - `noUnknownAtRules` - Tailwind v4 uses custom at-rules

**Important**: Always run `pnpm run format` after adding shadcn components to ensure consistent formatting.

### Git Hooks (Husky)

The project uses Husky to enforce code quality through pre-commit hooks:

- **Pre-commit hook** (`.husky/pre-commit`):
  - Automatically runs `pnpm biome check --write` before each commit
  - Fixes formatting issues automatically
  - Prevents commits if linting errors are found
  - Ensures all committed code follows Biome rules

**Note**: The pre-commit hook runs automatically. To bypass it (not recommended), use `git commit --no-verify`.

## File Structure

```
src/
  app/
    [locale]/              # Locale-specific routes
      layout.tsx           # Locale layout with i18n provider
      page.tsx             # Homepage for each locale
    globals.css            # Design system (@theme directive)
  components/
    ui/                    # shadcn/ui components (auto-generated)
    LanguageSelector.tsx   # Custom locale switcher (uses shadcn Select)
  i18n/
    config.ts              # Locale definitions, names, flags
    routing.ts             # next-intl routing config
    request.ts             # Message loading config
  lib/
    utils.ts               # cn() utility for className merging
  middleware.ts            # Locale routing middleware
messages/                  # Translation JSON files (en, es, fr, de, it)
components.json            # shadcn/ui configuration
biome.json                 # Linter/formatter config
next.config.ts             # Next.js config with next-intl plugin
```

## Key Integration Points

### Adding New Locales

1. Add locale to `src/i18n/config.ts` (`locales` array, `localeNames`, `localeFlags`)
2. Add locale to `src/i18n/routing.ts` (`locales` array)
3. Update middleware matcher in `src/middleware.ts`
4. Create translation file in `messages/{locale}.json`

### Adding shadcn Components

1. Run: `pnpm dlx shadcn@latest add [component-name]`
2. Component appears in `src/components/ui/`
3. Auto-formatted by Biome (run `pnpm run format` if needed)
4. Import and use: `import { Component } from '@/components/ui/component'`
5. Components automatically use custom color palette from `globals.css`

### Path Aliases

- `@/*` → `./src/*` (configured in `tsconfig.json`)
- Used everywhere: `@/components/ui/button`, `@/lib/utils`, `@/i18n/routing`

<!-- autoskills:start -->

Summary generated by `autoskills`. Check the full files inside `.claude/skills`.

## Accessibility (a11y)

Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".

- `.claude/skills/accessibility/SKILL.md`
- `.claude/skills/accessibility/references/A11Y-PATTERNS.md`: Practical, copy-paste-ready patterns for common accessibility requirements. Each pattern is self-contained and linked from the main [SKILL.md](../SKILL.md).
- `.claude/skills/accessibility/references/WCAG.md`

## Design Thinking

Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beaut...

- `.claude/skills/frontend-design/SKILL.md`

## Next.js Best Practices

Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling

- `.claude/skills/next-best-practices/SKILL.md`
- `.claude/skills/next-best-practices/async-patterns.md`: In Next.js 15+, `params`, `searchParams`, `cookies()`, and `headers()` are asynchronous.
- `.claude/skills/next-best-practices/bundling.md`: Fix common bundling issues with third-party packages.
- `.claude/skills/next-best-practices/data-patterns.md`: Choose the right data fetching pattern for each use case.
- `.claude/skills/next-best-practices/debug-tricks.md`: Tricks to speed up debugging Next.js applications.
- `.claude/skills/next-best-practices/directives.md`: These are React directives, not Next.js specific.
- `.claude/skills/next-best-practices/error-handling.md`: Handle errors gracefully in Next.js applications.
- `.claude/skills/next-best-practices/file-conventions.md`: Next.js App Router uses file-based routing with special file conventions.
- `.claude/skills/next-best-practices/font.md`: Use `next/font` for automatic font optimization with zero layout shift.
- `.claude/skills/next-best-practices/functions.md`: Next.js function APIs.
- `.claude/skills/next-best-practices/hydration-error.md`: Diagnose and fix React hydration mismatch errors.
- `.claude/skills/next-best-practices/image.md`: Use `next/image` for automatic image optimization.
- `.claude/skills/next-best-practices/metadata.md`: Add SEO metadata to Next.js pages using the Metadata API.
- `.claude/skills/next-best-practices/parallel-routes.md`: Parallel routes render multiple pages in the same layout. Intercepting routes show a different UI when navigating from within your app vs direct URL access. Together they enable modal patterns.
- `.claude/skills/next-best-practices/route-handlers.md`: Create API endpoints with `route.ts` files.
- `.claude/skills/next-best-practices/rsc-boundaries.md`: Detect and prevent invalid patterns when crossing Server/Client component boundaries.
- `.claude/skills/next-best-practices/runtime-selection.md`: Use the default Node.js runtime for new routes and pages. Only use Edge runtime if the project already uses it or there's a specific requirement.
- `.claude/skills/next-best-practices/scripts.md`: Loading third-party scripts in Next.js.
- `.claude/skills/next-best-practices/self-hosting.md`: Deploy Next.js outside of Vercel with confidence.
- `.claude/skills/next-best-practices/suspense-boundaries.md`: Client hooks that cause CSR bailout without Suspense boundaries.

## Cache Components (Next.js 16+)

Next.js 16 Cache Components - PPR, use cache directive, cacheLife, cacheTag, updateTag

- `.claude/skills/next-cache-components/SKILL.md`

## Upgrade Next.js

Upgrade Next.js to the latest version following official migration guides and codemods

- `.claude/skills/next-upgrade/SKILL.md`

## Node.js Backend Patterns

Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js servers, REST APIs, GraphQL backends, or microservices architectures.

- `.claude/skills/nodejs-backend-patterns/SKILL.md`
- `.claude/skills/nodejs-backend-patterns/references/advanced-patterns.md`: Advanced patterns for dependency injection, database integration, authentication, caching, and API response formatting.

## Node.js Best Practices

Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.

- `.claude/skills/nodejs-best-practices/SKILL.md`

## SEO optimization

Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".

- `.claude/skills/seo/SKILL.md`

## shadcn/ui

Manages shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component registries, presets, --preset codes, or any project with a components.json file. A...

- `.claude/skills/shadcn/SKILL.md`
- `.claude/skills/shadcn/cli.md`: Configuration is read from `components.json`.
- `.claude/skills/shadcn/customization.md`: Components reference semantic CSS variable tokens. Change the variables to change every component.
- `.claude/skills/shadcn/mcp.md`: The CLI includes an MCP server that lets AI assistants search, browse, view, and install components from registries.
- `.claude/skills/shadcn/rules/base-vs-radix.md`: API differences between `base` and `radix`. Check the `base` field from `npx shadcn@latest info`.
- `.claude/skills/shadcn/rules/composition.md`: Never render items directly inside the content container.
- `.claude/skills/shadcn/rules/forms.md`: Always use `FieldGroup` + `Field` — never raw `div` with `space-y-*`:
- `.claude/skills/shadcn/rules/icons.md`: **Always use the project's configured `iconLibrary` for imports.** Check the `iconLibrary` field from project context: `lucide` → `lucide-react`, `tabler` → `@tabler/icons-react`, etc. Never assume `lucide-react`.
- `.claude/skills/shadcn/rules/styling.md`: See [customization.md](../customization.md) for theming, CSS variables, and adding custom colors.

## Tailwind CSS Development Patterns

Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svelte components, building responsive layouts, implementing design systems, or o...

- `.claude/skills/tailwind-css-patterns/SKILL.md`
- `.claude/skills/tailwind-css-patterns/references/accessibility.md`
- `.claude/skills/tailwind-css-patterns/references/animations.md`: Usage:
- `.claude/skills/tailwind-css-patterns/references/component-patterns.md`
- `.claude/skills/tailwind-css-patterns/references/configuration.md`: Use the `@theme` directive for CSS-based configuration:
- `.claude/skills/tailwind-css-patterns/references/layout-patterns.md`: Basic flex container:
- `.claude/skills/tailwind-css-patterns/references/performance.md`: Configure content sources for optimal purging:
- `.claude/skills/tailwind-css-patterns/references/reference.md`: Tailwind CSS is a utility-first CSS framework that generates styles by scanning HTML, JavaScript, and template files for class names. It provides a comprehensive design system through CSS utility classes, enabling rapid UI development without writing custom CSS. The framework operates at build-ti...
- `.claude/skills/tailwind-css-patterns/references/responsive-design.md`: Enable dark mode in tailwind.config.js:

## Tailwind v4 + shadcn/ui Production Stack

|

- `.claude/skills/tailwind-v4-shadcn/SKILL.md`
- `.claude/skills/tailwind-v4-shadcn/references/advanced-usage.md`: **Purpose**: Advanced customization and component patterns for experienced Tailwind v4 + shadcn/ui developers **When to Load**: User asks for custom colors beyond defaults, advanced component patterns, composition best practices, or component customization
- `.claude/skills/tailwind-v4-shadcn/references/common-gotchas.md`: ❌ **WRONG:**
- `.claude/skills/tailwind-v4-shadcn/references/dark-mode.md`: Tailwind v4 + shadcn/ui dark mode requires: 1. `ThemeProvider` component to manage state 2. `.dark` class toggling on `<html>` element 3. localStorage persistence 4. System theme detection
- `.claude/skills/tailwind-v4-shadcn/references/migration-guide.md`: This guide helps you migrate from hardcoded Tailwind colors (`bg-blue-600`) to semantic CSS variables (`bg-primary`).
- `.claude/skills/tailwind-v4-shadcn/references/plugins-reference.md`: **Purpose**: Complete guide to Tailwind v4 official plugins (Typography, Forms) **When to Load**: User mentions prose class, Typography plugin, Forms plugin, @plugin directive, or plugin installation errors

## TypeScript Advanced Types

Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript pr...

- `.claude/skills/typescript-advanced-types/SKILL.md`

## React Composition Patterns

Composition patterns for building flexible, maintainable React components. Avoid boolean prop proliferation by using compound components, lifting state, and composing internals. These patterns make codebases easier for both humans and AI agents to work with as they scale.

- `.claude/skills/vercel-composition-patterns/SKILL.md`
- `.claude/skills/vercel-composition-patterns/AGENTS.md`: **Version 1.0.0** Engineering January 2026
- `.claude/skills/vercel-composition-patterns/README.md`: A structured repository for React composition patterns that scale. These patterns help avoid boolean prop proliferation by using compound components, lifting state, and composing internals.
- `.claude/skills/vercel-composition-patterns/rules/_sections.md`: This file defines all sections, their ordering, impact levels, and descriptions. The section ID (in parentheses) is the filename prefix used to group rules.
- `.claude/skills/vercel-composition-patterns/rules/_template.md`: Brief explanation of the rule and why it matters.
- `.claude/skills/vercel-composition-patterns/rules/architecture-avoid-boolean-props.md`: Don't add boolean props like `isThread`, `isEditing`, `isDMThread` to customize component behavior. Each boolean doubles possible states and creates unmaintainable conditional logic. Use composition instead.
- `.claude/skills/vercel-composition-patterns/rules/architecture-compound-components.md`: Structure complex components as compound components with a shared context. Each subcomponent accesses shared state via context, not props. Consumers compose the pieces they need.
- `.claude/skills/vercel-composition-patterns/rules/patterns-children-over-render-props.md`: Use `children` for composition instead of `renderX` props. Children are more readable, compose naturally, and don't require understanding callback signatures.
- `.claude/skills/vercel-composition-patterns/rules/patterns-explicit-variants.md`: Instead of one component with many boolean props, create explicit variant components. Each variant composes the pieces it needs. The code documents itself.
- `.claude/skills/vercel-composition-patterns/rules/react19-no-forwardref.md`: In React 19, `ref` is now a regular prop (no `forwardRef` wrapper needed), and `use()` replaces `useContext()`.
- `.claude/skills/vercel-composition-patterns/rules/state-context-interface.md`: Define a **generic interface** for your component context with three parts: can implement—enabling the same UI components to work with completely different state implementations.
- `.claude/skills/vercel-composition-patterns/rules/state-decouple-implementation.md`: The provider component should be the only place that knows how state is managed. UI components consume the context interface—they don't know if state comes from useState, Zustand, or a server sync.
- `.claude/skills/vercel-composition-patterns/rules/state-lift-state.md`: Move state management into dedicated provider components. This allows sibling components outside the main UI to access and modify state without prop drilling or awkward refs.

## Vercel React Best Practices

React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimizati...

- `.claude/skills/vercel-react-best-practices/SKILL.md`
- `.claude/skills/vercel-react-best-practices/AGENTS.md`: **Version 1.0.0** Vercel Engineering January 2026
- `.claude/skills/vercel-react-best-practices/README.md`: A structured repository for creating and maintaining React Best Practices optimized for agents and LLMs.
- `.claude/skills/vercel-react-best-practices/rules/_sections.md`: This file defines all sections, their ordering, impact levels, and descriptions. The section ID (in parentheses) is the filename prefix used to group rules.
- `.claude/skills/vercel-react-best-practices/rules/_template.md`: **Impact: MEDIUM (optional impact description)**
- `.claude/skills/vercel-react-best-practices/rules/advanced-effect-event-deps.md`: Effect Event functions do not have a stable identity. Their identity intentionally changes on every render. Do not include the function returned by `useEffectEvent` in a `useEffect` dependency array. Keep the actual reactive values as dependencies and call the Effect Event from inside the effect...
- `.claude/skills/vercel-react-best-practices/rules/advanced-event-handler-refs.md`: Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.
- `.claude/skills/vercel-react-best-practices/rules/advanced-init-once.md`: Do not put app-wide initialization that must run once per app load inside `useEffect([])` of a component. Components can remount and effects will re-run. Use a module-level guard or top-level init in the entry module instead.
- `.claude/skills/vercel-react-best-practices/rules/advanced-use-latest.md`: Access latest values in callbacks without adding them to dependency arrays. Prevents effect re-runs while avoiding stale closures.
- `.claude/skills/vercel-react-best-practices/rules/async-api-routes.md`: In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.
- `.claude/skills/vercel-react-best-practices/rules/async-cheap-condition-before-await.md`: When a branch uses `await` for a flag or remote value and also requires a **cheap synchronous** condition (local props, request metadata, already-loaded state), evaluate the cheap condition **first**. Otherwise you pay for the async call even when the compound condition can never be true.
- `.claude/skills/vercel-react-best-practices/rules/async-defer-await.md`: Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.
- `.claude/skills/vercel-react-best-practices/rules/async-dependencies.md`: For operations with partial dependencies, use `better-all` to maximize parallelism. It automatically starts each task at the earliest possible moment.
- `.claude/skills/vercel-react-best-practices/rules/async-parallel.md`: When async operations have no interdependencies, execute them concurrently using `Promise.all()`.
- `.claude/skills/vercel-react-best-practices/rules/async-suspense-boundaries.md`: Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.
- `.claude/skills/vercel-react-best-practices/rules/bundle-barrel-imports.md`: Import directly from source files instead of barrel files to avoid loading thousands of unused modules. **Barrel files** are entry points that re-export multiple modules (e.g., `index.js` that does `export * from './module'`).
- `.claude/skills/vercel-react-best-practices/rules/bundle-conditional.md`: Load large data or modules only when a feature is activated.
- `.claude/skills/vercel-react-best-practices/rules/bundle-defer-third-party.md`: Analytics, logging, and error tracking don't block user interaction. Load them after hydration.
- `.claude/skills/vercel-react-best-practices/rules/bundle-dynamic-imports.md`: Use `next/dynamic` to lazy-load large components not needed on initial render.
- `.claude/skills/vercel-react-best-practices/rules/bundle-preload.md`: Preload heavy bundles before they're needed to reduce perceived latency.
- `.claude/skills/vercel-react-best-practices/rules/client-event-listeners.md`: Use `useSWRSubscription()` to share global event listeners across component instances.
- `.claude/skills/vercel-react-best-practices/rules/client-localstorage-schema.md`: Add version prefix to keys and store only needed fields. Prevents schema conflicts and accidental storage of sensitive data.
- `.claude/skills/vercel-react-best-practices/rules/client-passive-event-listeners.md`: Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling. Browsers normally wait for listeners to finish to check if `preventDefault()` is called, causing scroll delay.
- `.claude/skills/vercel-react-best-practices/rules/client-swr-dedup.md`: SWR enables request deduplication, caching, and revalidation across component instances.
- `.claude/skills/vercel-react-best-practices/rules/js-batch-dom-css.md`: Avoid interleaving style writes with layout reads. When you read a layout property (like `offsetWidth`, `getBoundingClientRect()`, or `getComputedStyle()`) between style changes, the browser is forced to trigger a synchronous reflow.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-function-results.md`: Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-property-access.md`: Cache object property lookups in hot paths.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-storage.md`: **Incorrect (reads storage on every call):**
- `.claude/skills/vercel-react-best-practices/rules/js-combine-iterations.md`: Multiple `.filter()` or `.map()` calls iterate the array multiple times. Combine into one loop.
- `.claude/skills/vercel-react-best-practices/rules/js-early-exit.md`: Return early when result is determined to skip unnecessary processing.
- `.claude/skills/vercel-react-best-practices/rules/js-flatmap-filter.md`: **Impact: LOW-MEDIUM (eliminates intermediate array)**
- `.claude/skills/vercel-react-best-practices/rules/js-hoist-regexp.md`: Don't create RegExp inside render. Hoist to module scope or memoize with `useMemo()`.
- `.claude/skills/vercel-react-best-practices/rules/js-index-maps.md`: Multiple `.find()` calls by the same key should use a Map.
- `.claude/skills/vercel-react-best-practices/rules/js-length-check-first.md`: When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first. If lengths differ, the arrays cannot be equal.
- `.claude/skills/vercel-react-best-practices/rules/js-min-max-loop.md`: Finding the smallest or largest element only requires a single pass through the array. Sorting is wasteful and slower.
- `.claude/skills/vercel-react-best-practices/rules/js-request-idle-callback.md`: **Impact: MEDIUM (keeps UI responsive during background tasks)**
- `.claude/skills/vercel-react-best-practices/rules/js-set-map-lookups.md`: Convert arrays to Set/Map for repeated membership checks.
- `.claude/skills/vercel-react-best-practices/rules/js-tosorted-immutable.md`: **Incorrect (mutates original array):**
- `.claude/skills/vercel-react-best-practices/rules/rendering-activity.md`: Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.
- `.claude/skills/vercel-react-best-practices/rules/rendering-animate-svg-wrapper.md`: Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a `<div>` and animate the wrapper instead.
- `.claude/skills/vercel-react-best-practices/rules/rendering-conditional-render.md`: Use explicit ternary operators (`? :`) instead of `&&` for conditional rendering when the condition can be `0`, `NaN`, or other falsy values that render.
- `.claude/skills/vercel-react-best-practices/rules/rendering-content-visibility.md`: Apply `content-visibility: auto` to defer off-screen rendering.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hoist-jsx.md`: Extract static JSX outside components to avoid re-creation.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-no-flicker.md`: When rendering content that depends on client-side storage (localStorage, cookies), avoid both SSR breakage and post-hydration flickering by injecting a synchronous script that updates the DOM before React hydrates.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-suppress-warning.md`: In SSR frameworks (e.g., Next.js), some values are intentionally different on server vs client (random IDs, dates, locale/timezone formatting). For these *expected* mismatches, wrap the dynamic text in an element with `suppressHydrationWarning` to prevent noisy warnings. Do not use this to hide r...
- `.claude/skills/vercel-react-best-practices/rules/rendering-resource-hints.md`: **Impact: HIGH (reduces load time for critical resources)**
- `.claude/skills/vercel-react-best-practices/rules/rendering-script-defer-async.md`: **Impact: HIGH (eliminates render-blocking)**
- `.claude/skills/vercel-react-best-practices/rules/rendering-svg-precision.md`: Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.
- `.claude/skills/vercel-react-best-practices/rules/rendering-usetransition-loading.md`: Use `useTransition` instead of manual `useState` for loading states. This provides built-in `isPending` state and automatically manages transitions.
- `.claude/skills/vercel-react-best-practices/rules/rerender-defer-reads.md`: Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.
- `.claude/skills/vercel-react-best-practices/rules/rerender-dependencies.md`: Specify primitive dependencies instead of objects to minimize effect re-runs.
- `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`: If a value can be computed from current props/state, do not store it in state or update it in an effect. Derive it during render to avoid extra renders and state drift. Do not set state in effects solely in response to prop changes; prefer derived values or keyed resets instead.
- `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state.md`: Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.
- `.claude/skills/vercel-react-best-practices/rules/rerender-functional-setstate.md`: When updating state based on the current state value, use the functional update form of setState instead of directly referencing the state variable. This prevents stale closures, eliminates unnecessary dependencies, and creates stable callback references.
- `.claude/skills/vercel-react-best-practices/rules/rerender-lazy-state-init.md`: Pass a function to `useState` for expensive initial values. Without the function form, the initializer runs on every render even though the value is only used once.
- `.claude/skills/vercel-react-best-practices/rules/rerender-memo-with-default-value.md`: When memoized component has a default value for some non-primitive optional parameter, such as an array, function, or object, calling the component without that parameter results in broken memoization. This is because new value instances are created on every rerender, and they do not pass strict...
- `.claude/skills/vercel-react-best-practices/rules/rerender-memo.md`: Extract expensive work into memoized components to enable early returns before computation.
- `.claude/skills/vercel-react-best-practices/rules/rerender-move-effect-to-event.md`: If a side effect is triggered by a specific user action (submit, click, drag), run it in that event handler. Do not model the action as state + effect; it makes effects re-run on unrelated changes and can duplicate the action.
- `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`: **Impact: HIGH (prevents remount on every render)**
- `.claude/skills/vercel-react-best-practices/rules/rerender-simple-expression-in-memo.md`: When an expression is simple (few logical or arithmetical operators) and has a primitive result type (boolean, number, string), do not wrap it in `useMemo`. Calling `useMemo` and comparing hook dependencies may consume more resources than the expression itself.
- `.claude/skills/vercel-react-best-practices/rules/rerender-split-combined-hooks.md`: When a hook contains multiple independent tasks with different dependencies, split them into separate hooks. A combined hook reruns all tasks when any dependency changes, even if some tasks don't use the changed value.
- `.claude/skills/vercel-react-best-practices/rules/rerender-transitions.md`: Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.
- `.claude/skills/vercel-react-best-practices/rules/rerender-use-deferred-value.md`: When user input triggers expensive computations or renders, use `useDeferredValue` to keep the input responsive. The deferred value lags behind, allowing React to prioritize the input update and render the expensive result when idle.
- `.claude/skills/vercel-react-best-practices/rules/rerender-use-ref-transient-values.md`: When a value changes frequently and you don't want a re-render on every update (e.g., mouse trackers, intervals, transient flags), store it in `useRef` instead of `useState`. Keep component state for UI; use refs for temporary DOM-adjacent values. Updating a ref does not trigger a re-render.
- `.claude/skills/vercel-react-best-practices/rules/server-after-nonblocking.md`: Use Next.js's `after()` to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.
- `.claude/skills/vercel-react-best-practices/rules/server-auth-actions.md`: **Impact: CRITICAL (prevents unauthorized access to server mutations)**
- `.claude/skills/vercel-react-best-practices/rules/server-cache-lru.md`: **Implementation:**
- `.claude/skills/vercel-react-best-practices/rules/server-cache-react.md`: Use `React.cache()` for server-side request deduplication. Authentication and database queries benefit most.
- `.claude/skills/vercel-react-best-practices/rules/server-dedup-props.md`: **Impact: LOW (reduces network payload by avoiding duplicate serialization)**
- `.claude/skills/vercel-react-best-practices/rules/server-hoist-static-io.md`: **Impact: HIGH (avoids repeated file/network I/O per request)**
- `.claude/skills/vercel-react-best-practices/rules/server-no-shared-module-state.md`: For React Server Components and client components rendered during SSR, avoid using mutable module-level variables to share request-scoped data. Server renders can run concurrently in the same process. If one render writes to shared module state and another render reads it, you can get race condit...
- `.claude/skills/vercel-react-best-practices/rules/server-parallel-fetching.md`: React Server Components execute sequentially within a tree. Restructure with composition to parallelize data fetching.
- `.claude/skills/vercel-react-best-practices/rules/server-parallel-nested-fetching.md`: When fetching nested data in parallel, chain dependent fetches within each item's promise so a slow item doesn't block the rest.
- `.claude/skills/vercel-react-best-practices/rules/server-serialization.md`: The React Server/Client boundary serializes all object properties into strings and embeds them in the HTML response and subsequent RSC requests. This serialized data directly impacts page weight and load time, so **size matters a lot**. Only pass fields that the client actually uses.

<!-- autoskills:end -->
