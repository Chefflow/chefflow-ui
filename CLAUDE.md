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
- Directories: lowercase-with-dashes (e.g., `auth-wizard`, `date-helpers`)
- Components: PascalCase files (e.g., `UserProfile.tsx`)
- Utilities: camelCase files (e.g., `formatDate.ts`)
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
