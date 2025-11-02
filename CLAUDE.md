# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChefFlow is a recipe management and meal planning application built with Next.js 15, React 19, and Tailwind CSS v4. The project uses Biome for linting and formatting, and is designed with a warm, culinary-focused design system.

## Development Commands

```bash
# Start development server (with Turbopack)
npm run dev
# Runs on http://localhost:3000

# Build for production (with Turbopack)
npm run build

# Start production server
npm start

# Lint code (using Biome)
npm run lint

# Format code (using Biome)
npm run format
```

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **React**: 19.1.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 (PostCSS-based)
- **Fonts**: Inter (sans) and Crimson Pro (serif headings)
- **Code Quality**: Biome 2.2.0 (replaces ESLint + Prettier)
- **Build Tool**: Turbopack

## Design System

ChefFlow uses a custom light-mode-only design system defined in `src/app/globals.css` using Tailwind v4's `@theme` directive:

### Color Palette
- **Primary**: Orange/coral (`#FF6B4A`) - used for CTAs and accents
- **Secondary**: Cream/beige (`#F5EBD5`) - warm background tones
- **Foreground**: Dark brown (`#3D2817`) - main text color
- **Background**: White - clean canvas

### Typography
- **Sans-serif**: Inter (via `--font-inter` CSS variable) - body text, UI elements
- **Serif**: Crimson Pro (via `--font-crimson` CSS variable, weights: 400, 600, 700) - headings, editorial content
- Default: `font-sans` class applies Inter

### Spacing & Borders
- Border radius: `--radius-sm` (0.5rem), `--radius-md` (0.75rem), `--radius-lg` (1rem)
- Custom shadows: `--shadow-subtle`, `--shadow-card`
- Colors accessed via Tailwind utilities (e.g., `text-primary`, `bg-secondary`)

## Project Structure

```
src/
  app/              # Next.js App Router
    layout.tsx      # Root layout with fonts and metadata
    page.tsx        # Homepage
    globals.css     # Design system and Tailwind configuration
```

### Key Files
- **src/app/layout.tsx**: Root layout defining:
  - Site metadata (title: "ChefFlow - Organize Your Recipes & Meal Planning")
  - Font loading (Inter and Crimson Pro)
  - Global CSS variables applied to body
- **src/app/globals.css**: Complete design system using `@theme` directive
- **biome.json**: Linter/formatter config with Next.js and React recommended rules

## Configuration

### TypeScript
- Path alias: `@/*` maps to `./src/*`
- Strict mode enabled
- Target: ES2017

### Biome
- Auto-organizes imports on save
- 2-space indentation
- Recommended rules for Next.js and React domains
- Unknown CSS at-rules disabled (for Tailwind v4 compatibility)

### Package Manager
The project uses pnpm (evidenced by `pnpm-lock.yaml`). Use `pnpm install` for dependencies.

## Important Conventions

- **Linting**: Always use Biome (`npm run lint`, `npm run format`), not ESLint or Prettier
- **Styling**: Use Tailwind utility classes with the custom design tokens defined in `globals.css`
- **Fonts**: Apply `font-sans` for Inter or `font-serif` for Crimson Pro (configure in `tailwind.config` if needed)
- **Next.js**: App Router pattern - Server Components by default, use `'use client'` for client components
