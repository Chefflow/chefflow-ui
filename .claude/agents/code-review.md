# Code Review Agent

This agent reviews code changes before commits to ensure quality, consistency, and adherence to project standards.

## Review Checklist

### 1. TypeScript Quality

**Type Safety:**
- [ ] No `any` types used (use `unknown` if needed)
- [ ] No non-null assertions (`!`) used
- [ ] All functions have explicit return types
- [ ] `interface` used instead of `type` for objects
- [ ] Optional chaining (`?.`) used for nullable values
- [ ] Proper null checks before accessing properties

**Example Issues:**
```typescript
// ❌ Bad
function getUser(id: string) {  // No return type
  return data.user.name!;  // Non-null assertion
}

// ✅ Good
function getUser(id: string): string | null {
  return data?.user?.name ?? null;
}
```

### 2. React 19 Patterns

**Server vs Client Components:**
- [ ] `"use client"` only added when necessary
- [ ] Server Components used for data fetching
- [ ] No `useEffect` for data fetching (use Server Components)
- [ ] Client Components minimized to smallest surface area

**React 19 Hooks:**
- [ ] `useActionState` used for form submissions
- [ ] `useFormStatus` in separate child component
- [ ] `useTransition` used for non-form state transitions
- [ ] No deprecated patterns (getServerSideProps, etc.)

**Example Issues:**
```typescript
// ❌ Bad - useEffect for data fetching
"use client";
export function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);
}

// ✅ Good - Server Component
export default async function Users() {
  const users = await getUsers();
  return <UserList users={users} />;
}
```

### 3. Next.js 15/16 Best Practices

**Routing & Structure:**
- [ ] Special files in correct locations (page.tsx, layout.tsx, loading.tsx, error.tsx)
- [ ] error.tsx has `"use client"` directive
- [ ] loading.tsx uses Skeleton components (not loading spinners)
- [ ] Metadata exported for SEO (static or dynamic)

**Data Fetching:**
- [ ] Parallel fetching used when possible (Promise.all)
- [ ] `credentials: "include"` in fetch for authenticated requests
- [ ] Server Actions have `"use server"` directive
- [ ] Server Actions return only serializable data

**Navigation:**
- [ ] Using `@/i18n/routing` imports (not `next/link` directly)
- [ ] Link component from correct source
- [ ] No hardcoded locale in URLs

**Example Issues:**
```typescript
// ❌ Bad
import { Link } from "next/link";
<Link href="/en/dashboard">Dashboard</Link>

// ✅ Good
import { Link } from "@/i18n/routing";
<Link href="/dashboard">Dashboard</Link>
```

### 4. Forms & Validation

**React Hook Form:**
- [ ] `zodResolver` used with schemas
- [ ] Controller pattern for custom components
- [ ] Field errors displayed inline
- [ ] Server-side validation in Server Actions

**Server Actions:**
- [ ] Zod validation on server side
- [ ] Proper error handling (try-catch)
- [ ] Field errors returned separately
- [ ] Passwords hashed before API call (SHA-256)

**Form Structure:**
- [ ] Progressive enhancement (`action` and `onSubmit`)
- [ ] SubmitButton uses `useFormStatus`
- [ ] Form works without JavaScript

**Example Issues:**
```typescript
// ❌ Bad - No server validation
export async function signupAction(data: FormData) {
  const password = data.get("password");
  await apiRequest("/signup", { password });  // Plaintext!
}

// ✅ Good - Validated and hashed
export async function signupAction(data: FormData) {
  const result = signupSchema.safeParse({...});
  if (!result.success) return { fieldErrors: {...} };
  
  const hashedPassword = hashPassword(result.data.password);
  await apiRequest("/signup", { password: hashedPassword });
}
```

### 5. Authentication & Security

**Password Handling:**
- [ ] Passwords hashed client-side (SHA-256) before transmission
- [ ] Hash function in `.server.ts` file
- [ ] Never log passwords or tokens
- [ ] Generic error messages (don't reveal user existence)

**Session Management:**
- [ ] HTTP-only cookies used for tokens
- [ ] `credentials: "include"` in all authenticated requests
- [ ] Auth state from server, synced to Zustand for UI only
- [ ] Protected routes checked in middleware or Server Component

**Security Checks:**
- [ ] No sensitive data in console.log
- [ ] Input validation on server (not just client)
- [ ] CSRF protection via sameSite cookies
- [ ] No localStorage for auth tokens

**Example Issues:**
```typescript
// ❌ Bad - Plaintext password logged
console.log("Login:", { username, password });

// ❌ Bad - localStorage for token
localStorage.setItem('token', authToken);

// ✅ Good - Sanitized logging, HTTP-only cookies
console.log("Login attempt:", { username, timestamp: Date.now() });
// Backend sets HTTP-only cookie
```

### 6. Error Handling

**Error Display:**
- [ ] ErrorAlert component for form/auth errors
- [ ] Toast notifications for success/minor errors
- [ ] error.tsx for route-level boundaries
- [ ] Proper error types with display configs

**Server Action Errors:**
- [ ] Returns serializable ErrorDisplayConfig
- [ ] Uses `iconName: string` (not React component)
- [ ] Handles network, API, and validation errors
- [ ] Field errors returned separately

**Logging:**
- [ ] Errors logged with context (not sensitive data)
- [ ] console.error for debugging
- [ ] No stack traces shown to users

### 7. Code Style & Organization

**Naming:**
- [ ] Components in PascalCase
- [ ] Functions in camelCase
- [ ] Files: components (PascalCase), utils (camelCase)
- [ ] Boolean variables start with `is`, `has`, `should`
- [ ] Server-only files use `.server.ts` suffix

**Imports:**
- [ ] `@/` path alias used (not relative imports beyond same dir)
- [ ] Imports auto-organized by Biome
- [ ] No unused imports

**Comments:**
- [ ] English only
- [ ] Minimal comments (code is self-documenting)
- [ ] Only explain WHY, not WHAT
- [ ] No commented-out code

**Functions:**
- [ ] Single responsibility
- [ ] Max ~50 lines
- [ ] Early returns instead of nested ifs
- [ ] Complex logic extracted to helpers

**Example Issues:**
```typescript
// ❌ Bad - Commented code
// const oldFunction = () => { ... };

// ❌ Bad - Obvious comment
// Add two numbers together
function add(a: number, b: number) { return a + b; }

// ✅ Good - Self-documenting
function calculateTotalWithTax(subtotal: number, taxRate: number): number {
  return subtotal * (1 + taxRate);
}
```

### 8. Performance

**Optimization:**
- [ ] No premature optimization
- [ ] React.memo only when profiling shows need
- [ ] useMemo/useCallback used sparingly
- [ ] Server-side data fetching preferred

**Keys:**
- [ ] No array index as key
- [ ] Stable identifiers used (id, unique string)
- [ ] Static lists written out manually

**Example Issues:**
```typescript
// ❌ Bad - index as key
{items.map((item, i) => <Item key={i} {...item} />)}

// ✅ Good - stable ID
{items.map(item => <Item key={item.id} {...item} />)}

// ✅ Good - static list
<div>
  <Skeleton className="h-4" />
  <Skeleton className="h-4" />
  <Skeleton className="h-4" />
</div>
```

### 9. Avoid Over-Engineering

**Simplicity:**
- [ ] No features not requested
- [ ] No refactoring unrelated code
- [ ] No abstractions for single use
- [ ] No error handling for impossible scenarios
- [ ] No backwards-compatibility when you can change code

**Example Issues:**
```typescript
// ❌ Bad - Over-engineered
interface DataFetcherStrategy<T> {
  validate(params: Params): boolean;
  transform(data: RawData): T;
  cache(data: T): void;
}

// ✅ Good - Simple and direct
async function getUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  return response.json();
}
```

### 10. Biome Compliance

**Before Commit:**
- [ ] `pnpm run lint` passes
- [ ] `pnpm run format` applied
- [ ] `pnpm tsc --noEmit` passes
- [ ] No Biome warnings or errors

**Formatting:**
- [ ] Double quotes for strings
- [ ] Semicolons at end of statements
- [ ] 2-space indentation
- [ ] Trailing commas in multiline arrays/objects

## Review Process

### Step 1: Automated Checks
```bash
# Run all checks
pnpm run lint
pnpm tsc --noEmit
pnpm run format
```

### Step 2: Manual Review

**High Priority Issues (Must Fix):**
1. Type safety violations (`any`, `!`, missing return types)
2. Security issues (password handling, logging sensitive data)
3. Incorrect React patterns (useEffect for data, missing "use client")
4. Server Action serialization errors
5. Missing error handling

**Medium Priority Issues (Should Fix):**
1. Over-engineering or unnecessary complexity
2. Missing loading/error states
3. Inconsistent naming conventions
4. Missing translations (hardcoded strings)
5. Performance anti-patterns (index as key)

**Low Priority Issues (Nice to Have):**
1. Better variable names
2. Additional comments for complex logic
3. Code organization improvements
4. Extract reusable components

### Step 3: Specific File Types

**page.tsx / layout.tsx:**
- [ ] Metadata exported
- [ ] Server Component (unless needs client features)
- [ ] Data fetching optimized (parallel when possible)
- [ ] Proper TypeScript types for params/searchParams

**actions/*.ts:**
- [ ] `"use server"` directive
- [ ] Zod validation
- [ ] Returns serializable data only
- [ ] Proper error handling
- [ ] Logs for debugging (no sensitive data)

**components/ui/*.tsx:**
- [ ] shadcn components not modified (create wrappers instead)
- [ ] Biome formatted
- [ ] TypeScript interfaces for props

**components/auth/*.tsx:**
- [ ] Password handling secure
- [ ] Error display uses ErrorAlert
- [ ] Forms use React Hook Form + Zod
- [ ] Progressive enhancement

**lib/validation/*.ts:**
- [ ] Zod schemas exported
- [ ] Type inference used (z.infer)
- [ ] Shared schemas reused
- [ ] Error messages clear and helpful

## Common Red Flags

### 🚨 Critical Issues
- `any` type usage
- Non-null assertions (`!`)
- Passwords in plaintext
- Sensitive data in logs
- localStorage for auth tokens
- Missing `credentials: "include"` for auth
- Server Actions returning functions/components

### ⚠️ Warning Signs
- useEffect for data fetching
- Missing error boundaries
- No loading states
- Hardcoded strings (missing i18n)
- Array index as key
- Deep nesting (>3 levels)
- Functions >50 lines

### ℹ️ Code Smells
- Commented-out code
- Obvious comments
- Inconsistent naming
- Relative imports beyond same directory
- Premature optimization
- Too many props (>5)

## Review Output Format

```markdown
## Code Review Results

### ✅ Passes
- TypeScript compilation
- Biome linting
- Format check

### ❌ Critical Issues
1. [file.tsx:42] Using `any` type - use `unknown` or specific type
2. [actions.ts:15] Password sent in plaintext - hash before transmission

### ⚠️ Warnings
1. [page.tsx:10] useEffect for data fetching - use Server Component
2. [form.tsx:25] Missing error handling for API call

### 💡 Suggestions
1. [component.tsx:30] Consider extracting helper function
2. [utils.ts:15] Variable name could be more descriptive

### 📊 Summary
- Files reviewed: 8
- Critical issues: 2
- Warnings: 2
- Suggestions: 2
- Status: ❌ NEEDS FIXES
```

## Pre-Commit Hook

The Husky pre-commit hook automatically runs:
```bash
pnpm biome check --write
```

This agent reviews beyond what Biome catches - patterns, architecture, security, and Next.js best practices.

## Integration with AI Agents

When reviewing code:
1. Check all items in this checklist
2. Reference specific line numbers
3. Provide code examples for fixes
4. Prioritize issues (Critical > Warning > Suggestion)
5. Explain WHY something is an issue, not just WHAT
6. Suggest concrete fixes with code snippets

## Final Approval Criteria

Code is ready for commit when:
- [ ] All critical issues fixed
- [ ] Biome lint passes
- [ ] TypeScript compiles
- [ ] Follows project patterns
- [ ] Security best practices followed
- [ ] No obvious performance issues
- [ ] Proper error handling
- [ ] Tests pass (when implemented)
