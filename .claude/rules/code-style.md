# Code Style Rules

## TypeScript

### Type Definitions
- **Always use `interface` over `type`** for object shapes
- **Never use `any`** - use `unknown` if type is uncertain
- **Define explicit return types** for all functions
- **Use const assertions** for literal types when needed

```typescript
// Good
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
type User = {
  id: string;
  name: string;
}

function getUser(id: string) {  // No return type
  // ...
}
```

### Null Safety
- **Never use non-null assertions (`!`)** - Biome will reject them
- **Always use optional chaining** (`?.`) and nullish coalescing (`??`)
- **Validate data at boundaries** (API responses, user input)

```typescript
// Good
if (state?.user?.name && state?.user?.email) {
  return <Component userName={state.user.name} userEmail={state.user.email} />;
}

// Bad
return <Component userName={state.user.name!} userEmail={state.user.email!} />;
```

## Naming Conventions

### Files
- **Directories**: lowercase-with-dashes (e.g., `auth-wizard`, `date-helpers`)
- **Components**: PascalCase files (e.g., `UserProfile.tsx`, `PasswordInput.tsx`)
- **Utilities**: camelCase files (e.g., `formatDate.ts`, `apiRequest.ts`)
- **Server files**: `.server.ts` suffix (e.g., `hash-password.server.ts`)

### Variables and Functions
- **Components**: PascalCase (e.g., `SignupForm`, `ErrorAlert`)
- **Functions**: camelCase (e.g., `handleSubmit`, `calculateStrength`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config
- **Boolean variables**: Start with `is`, `has`, `should` (e.g., `isLoading`, `hasError`)

## Comments

### Policy: MINIMAL COMMENTS IN ENGLISH
- **Use English for ALL comments**
- **Use as FEW comments as possible**
- **Code should be self-documenting** through clear naming
- **Only comment WHY, never WHAT** - the code shows what it does
- **Delete commented-out code** - use git history instead

```typescript
// Good - No comment needed
function isPasswordStrong(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password);
}

// Acceptable - Explains non-obvious business logic
function calculatePrice(base: number, tax: number): number {
  // Tax rate is applied before the 10% platform fee per business rules
  return (base * (1 + tax)) * 1.1;
}

// Bad - Explains what the code obviously does
function addNumbers(a: number, b: number): number {
  // Add the two numbers together
  return a + b;
}
```

## Formatting

### Enforced by Biome
- **Double quotes** for strings (not single quotes)
- **Semicolons** at end of statements
- **2 spaces** for indentation
- **Trailing commas** in multiline arrays/objects
- **Auto-organized imports**

### Code Organization
- **One component per file** (except small internal components)
- **Co-locate related code** (component + types + helpers in same file/folder)
- **Order within files**:
  1. Imports (auto-organized by Biome)
  2. Type definitions
  3. Constants
  4. Main exported component/function
  5. Internal helper functions
  6. Static content

## React Specifics

### Component Declaration
- **Server Components**: Use `function` keyword
- **Client Components**: Use `const` with arrow function

```typescript
// Server Component
export default function HomePage() {
  return <div>Home</div>;
}

// Client Component
"use client";
export const LoginForm = () => {
  const [state, setState] = useState();
  return <form>...</form>;
};
```

### Exports
- **Prefer named exports** over default exports (except page.tsx/layout.tsx)
- **Export types separately** when used externally

```typescript
// Good
export interface ButtonProps {
  variant: "primary" | "secondary";
}
export function Button({ variant }: ButtonProps) {}

// Also acceptable for utilities
export const formatDate = (date: Date): string => {};
```

## Imports

### Path Aliases
- **Always use `@/` alias** for internal imports
- **Never use relative imports** beyond same directory

```typescript
// Good
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/request";

// Bad
import { Button } from "../../../components/ui/button";
```

### Import Order
Biome auto-organizes imports, but conceptually:
1. External packages (react, next, etc.)
2. Internal absolute imports (@/...)
3. Relative imports (./...)
4. Type-only imports

## Functions

### Complexity
- **Keep functions small** - max 50 lines ideally
- **Single responsibility** - one function does one thing
- **Extract complex logic** into named helper functions
- **Avoid deep nesting** - early returns are your friend

```typescript
// Good - Early returns, flat structure
function validateUser(user: User | null): string | null {
  if (!user) return "User is required";
  if (!user.email) return "Email is required";
  if (!isValidEmail(user.email)) return "Invalid email format";
  return null;
}

// Bad - Nested conditions
function validateUser(user: User | null): string | null {
  if (user) {
    if (user.email) {
      if (isValidEmail(user.email)) {
        return null;
      } else {
        return "Invalid email format";
      }
    } else {
      return "Email is required";
    }
  } else {
    return "User is required";
  }
}
```

## Avoid Over-Engineering

### Simplicity First
- **Don't add features not requested** - stick to requirements
- **Don't refactor code you're not changing** - focused changes only
- **Don't add error handling for impossible scenarios** - trust internal code
- **Don't create abstractions for single use** - three uses is the rule
- **Don't add comments/docstrings to unchanged code**
- **Don't add backwards-compatibility** when you can just change code

```typescript
// Good - Simple, direct
function createUser(name: string, email: string) {
  return apiRequest("/users", { name, email });
}

// Bad - Over-engineered for simple case
interface UserCreationStrategy {
  validate(data: UserData): ValidationResult;
  transform(data: UserData): TransformedData;
  execute(data: TransformedData): Promise<User>;
}
```

## Performance

### Only Optimize When Needed
- **Don't premature optimize** - profile first
- **Use React.memo only for expensive renders** - not by default
- **Use useMemo/useCallback sparingly** - they have overhead too
- **Prefer server-side data fetching** over client-side

## Security

### Defense in Depth
- **Never trust client-side validation alone** - always validate server-side
- **Sanitize user input** at system boundaries
- **Use HTTP-only cookies** for auth tokens
- **Hash sensitive data** before transmission (passwords use SHA-256 → bcrypt)
- **Never log sensitive data** (passwords, tokens, personal info)

## Linting

### Pre-commit Hook
- **Biome runs automatically** on git commit via Husky
- **All files must pass Biome checks** before commit
- **Run `pnpm run format`** after adding new files
- **Run `pnpm run lint`** to check without committing
