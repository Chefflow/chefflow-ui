# Design System — ChefFlow UI

Custom, **light-mode-only** system defined in `src/app/globals.css` via Tailwind v4's
`@theme` directive. shadcn components consume these tokens automatically — change a
variable to change every component. Never hardcode hex/`bg-blue-600`; use semantic tokens.

## Color palette (OKLCH)

| Token | Value | Use |
|---|---|---|
| Primary | `oklch(72% 0.19 30)` (#FF6B4A) | CTAs, accents (orange/coral) |
| Secondary | `oklch(94% 0.03 70)` (#F5EBD5) | Warm cream backgrounds |
| Foreground | `oklch(28% 0.05 40)` (#3D2817) | Text (dark brown) |
| Background | `oklch(98% 0.015 70)` | Warm off-white |
| Destructive | `oklch(62% 0.22 25)` | Errors |
| Muted | secondary-derived | Subtle backgrounds |

Apply via utilities: `bg-primary`, `text-foreground`, `bg-secondary`, etc.

## Typography

- Sans (body/UI): **Inter** → `font-sans`, variable `--font-inter`.
- Serif (headings/editorial): **Crimson Pro** → `font-serif`, variable `--font-crimson`.
- Loaded in `src/app/[locale]/layout.tsx` via `next/font/google`.

## Spacing & effects

- Radius: `--radius-sm` (0.5rem), `--radius-md` (0.75rem), `--radius-lg` (1rem).
- Shadows: `--shadow-subtle`, `--shadow-card`.
- Access: `rounded-[var(--radius-md)]`, `shadow-[var(--shadow-card)]`.
