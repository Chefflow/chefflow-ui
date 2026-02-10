# ChefFlow AI Configuration

This directory contains rules, patterns, and agent definitions for AI assistance on the ChefFlow project. These ensure code quality, consistency, and adherence to Next.js 15/16 and React 19 best practices.

## 📁 Directory Structure

```
.claude/
├── README.md           # This file
├── rules/             # Code patterns and best practices
│   ├── code-style.md
│   ├── react-patterns.md
│   ├── nextjs-patterns.md
│   ├── forms.md
│   ├── auth-patterns.md
│   └── error-handling.md
└── agents/            # AI agent definitions
    └── code-review.md
```

## 📚 Rule Files

### [code-style.md](./rules/code-style.md)
General code style guidelines for TypeScript, naming conventions, formatting, and organization.

**Key Topics:**
- TypeScript type safety (no `any`, explicit return types)
- Naming conventions (files, variables, functions)
- Minimal English comments policy
- Import organization with `@/` aliases
- Function complexity and early returns
- Avoiding over-engineering

**Use When:** Writing any TypeScript/React code

---

### [react-patterns.md](./rules/react-patterns.md)
React 19-specific patterns and component architecture.

**Key Topics:**
- Server Components vs Client Components
- React 19 hooks (useActionState, useFormStatus, useTransition)
- State management (useState, useEffect, Zustand)
- Component composition patterns
- Performance optimization (React.memo, useMemo)
- Key prop usage

**Use When:** Creating or modifying React components

---

### [nextjs-patterns.md](./rules/nextjs-patterns.md)
Next.js 15/16 App Router patterns and conventions.

**Key Topics:**
- App Router file structure (page, layout, loading, error)
- Server Components data fetching
- Server Actions and route handlers
- Metadata for SEO
- Internationalization (next-intl)
- Middleware for auth
- Image optimization
- Environment variables

**Use When:** Working with routing, data fetching, or Next.js features

---

### [forms.md](./rules/forms.md)
Form handling with React Hook Form and Zod validation.

**Key Topics:**
- React Hook Form setup with zodResolver
- Zod schema organization and reuse
- Controller pattern for custom components
- Integration with Server Actions
- Progressive enhancement
- Field-level and form-level error display
- Submit button with useFormStatus

**Use When:** Creating or modifying forms

---

### [auth-patterns.md](./rules/auth-patterns.md)
Authentication and security patterns.

**Key Topics:**
- Defense in depth (client validation + hashing + server validation)
- Password hashing (SHA-256 client-side, bcrypt backend)
- HTTP-only cookies with `credentials: "include"`
- Server Actions for auth operations
- Zustand for UI state (not auth source of truth)
- Protected routes (middleware + Server Components)
- Security best practices (never log sensitive data)

**Use When:** Working with authentication, user sessions, or security

---

### [error-handling.md](./rules/error-handling.md)
Centralized error handling system.

**Key Topics:**
- Domain error types and display configs
- Error handler (server-side transformation)
- Icon mapper (client-side resolution)
- ErrorAlert component with suggestions
- Field-level vs form-level errors
- Error boundaries (error.tsx)
- Toast notifications for minor feedback
- Logging without sensitive data

**Use When:** Implementing error handling or user feedback

---

## 🤖 AI Agents

### [code-review.md](./agents/code-review.md)
Pre-commit code review agent with comprehensive checklist.

**Key Topics:**
- Comprehensive review checklist (10 categories)
- Critical issues vs warnings vs suggestions
- File-type specific checks
- Common red flags and code smells
- Review output format
- Final approval criteria

**Use When:** Reviewing code before commits or PRs

This agent references all rule files to provide comprehensive code review.

---

## 🤖 How AI Agents Should Use These Guidelines

### 1. Context-Aware Application

AI agents should load relevant rules based on the task:

```
Task: "Create a new login form"
→ Load: rules/forms.md, rules/auth-patterns.md, rules/react-patterns.md, rules/error-handling.md

Task: "Add a new dashboard page"
→ Load: rules/nextjs-patterns.md, rules/react-patterns.md, rules/code-style.md

Task: "Review code before commit"
→ Load: agents/code-review.md (which references all rules)
```

### 2. Priority Order

When multiple rules apply, follow this priority:

1. **Security** (auth-patterns.md) - Non-negotiable
2. **Type Safety** (code-style.md) - Must pass TypeScript
3. **React/Next.js Patterns** - Framework best practices
4. **Error Handling** - User experience
5. **Code Style** - Consistency and maintainability

### 3. Rule Enforcement Levels

**MUST (Critical):**
- No `any` types or non-null assertions
- Password hashing before transmission
- Server-side validation
- `credentials: "include"` for auth requests
- Server Actions return serializable data only
- Biome lint passes

**SHOULD (Recommended):**
- Server Components for data fetching
- React 19 hooks (useActionState, useFormStatus)
- Progressive enhancement
- Loading and error states
- Proper error handling with ErrorAlert

**COULD (Suggestions):**
- Extract complex logic into helpers
- Better variable names
- Additional comments for complex business logic
- Performance optimizations (when measured)

### 4. Cross-References

Rules reference each other:
- `forms.md` references `react-patterns.md` (useActionState)
- `auth-patterns.md` references `error-handling.md` (ErrorAlert)
- The `code-review` agent references all rules

AI agents should follow these references for comprehensive understanding.

### 5. Examples Usage

Each rule file contains:
- ✅ **Good** examples (what to do)
- ❌ **Bad** examples (what to avoid)

AI agents should:
1. Match user's code against examples
2. Identify anti-patterns
3. Suggest fixes using good examples
4. Explain WHY the change improves the code

## 📋 Common Workflows

### Creating a New Feature

1. **Check:** rules/nextjs-patterns.md (file structure)
2. **Check:** rules/react-patterns.md (Server vs Client Component)
3. **Check:** rules/code-style.md (naming, organization)
4. **Write:** Implementation following patterns
5. **Review:** agents/code-review.md checklist
6. **Commit:** After Biome lint passes

### Fixing a Bug

1. **Check:** rules/error-handling.md (proper error display)
2. **Check:** Relevant pattern file for the area
3. **Fix:** Issue following patterns
4. **Test:** Ensure error handling works
5. **Review:** agents/code-review.md checklist

### Refactoring

1. **Identify:** What needs improvement
2. **Check:** Relevant pattern files in rules/
3. **Plan:** Changes maintaining consistency
4. **Apply:** Following all applicable rules
5. **Verify:** No regressions, all checks pass

## 🔍 Code Review Process

When reviewing code, AI agents should:

1. **Run Automated Checks:**
   ```bash
   pnpm run lint
   pnpm tsc --noEmit
   ```

2. **Check Critical Issues:**
   - Type safety violations
   - Security problems
   - Incorrect React patterns
   - Missing error handling

3. **Check Warnings:**
   - Over-engineering
   - Missing states (loading/error)
   - Inconsistent naming
   - Performance anti-patterns

4. **Provide Feedback:**
   - Reference specific files and line numbers
   - Show code examples for fixes
   - Explain reasoning (WHY, not just WHAT)
   - Prioritize issues clearly

## 🚀 Quick Reference

### Before Every Commit
- [ ] Run `pnpm run lint`
- [ ] Run `pnpm tsc --noEmit`
- [ ] Review critical sections in agents/code-review.md
- [ ] Ensure no sensitive data logged

### For Forms
- [ ] React Hook Form + Zod
- [ ] Controller pattern
- [ ] Server Action with validation
- [ ] Password hashing (if auth)
- [ ] ErrorAlert for errors

### For Auth
- [ ] SHA-256 hash before transmission
- [ ] HTTP-only cookies
- [ ] `credentials: "include"`
- [ ] Generic error messages
- [ ] No sensitive data in logs

### For Pages
- [ ] Server Component by default
- [ ] Metadata exported
- [ ] loading.tsx with Skeleton
- [ ] error.tsx with handler
- [ ] Use `@/i18n/routing`

## 📖 Project-Specific Context

### Tech Stack
- Next.js 16.1.5 (App Router, Turbopack)
- React 19.2.4
- TypeScript (strict mode)
- Tailwind CSS v4
- Biome 2.2.0 (linting/formatting)
- next-intl 4.4.0 (i18n)
- shadcn/ui (components)
- React Hook Form + Zod (forms)
- Zustand (client state)

### Package Manager
**Always use `pnpm`**, never npm or yarn.

### Design System
- Light mode only
- OKLCH color space
- Custom theme in `src/app/globals.css`
- Fonts: Inter (sans), Crimson Pro (serif)

### Key Patterns
- Server Components by default
- Server Actions for mutations
- HTTP-only cookies for auth
- SHA-256 → bcrypt password hashing
- Centralized error handling
- Minimal English comments

## 🤝 Contributing to Rules

When adding new rules:

1. **Follow Format:**
   - Clear section headings
   - Code examples (Good ✅ and Bad ❌)
   - Explanation of WHY, not just WHAT
   - Cross-references to related rules

2. **Keep Updated:**
   - Rules reflect actual codebase patterns
   - Remove outdated practices
   - Add new patterns as adopted

3. **Be Specific:**
   - Show concrete examples
   - Reference actual files when possible
   - Include commands and tools used

## 📞 Questions?

If rules conflict or are unclear:
1. Check cross-references in related files
2. Look at actual codebase examples
3. Default to Next.js/React documentation
4. Prioritize security and type safety
