# React 19 Patterns

## Server vs Client Components

### Default to Server Components
- **All components are Server Components by default**
- **Only add `"use client"` when necessary**
- **Minimize client component surface area**

### When to Use Client Components
Add `"use client"` directive ONLY when you need:
- **Browser APIs** (window, localStorage, etc.)
- **Event handlers** (onClick, onChange, etc.)
- **React hooks** (useState, useEffect, etc.)
- **Client-only libraries** (animation libraries, etc.)

```typescript
// Server Component (default) - NO "use client" needed
import { getUser } from "@/lib/api/users";

export default async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId);
  return <div>{user.name}</div>;
}

// Client Component - needs "use client"
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Server Component Benefits
- **Fetch data directly** - no useEffect needed
- **Access backend resources** - databases, file system, etc.
- **Smaller bundle size** - code doesn't ship to client
- **Better SEO** - fully rendered HTML

## React 19 Hooks

### useActionState (New in React 19)
Use for form submissions with Server Actions:

```typescript
"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/actions/auth";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, null);
  
  return (
    <form action={formAction}>
      {state?.error && <ErrorAlert config={state.error} />}
      <input name="email" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

**Key Points:**
- `formAction` goes in `<form action={formAction}>`
- Second parameter is initial state (usually `null`)
- Progressive enhancement - works without JavaScript
- Server Action must have `"use server"` directive

### useFormStatus (New in React 19)
Use for accessing form submission state:

```typescript
"use client";

import { useFormStatus } from "react";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : children}
    </button>
  );
}
```

**Requirements:**
- Must be used in a **child component** of the form
- Cannot be in the same component as the form
- Provides: `pending`, `data`, `method`, `action`

### useTransition
Use for non-form transitions:

```typescript
"use client";

import { useTransition } from "react";

export function TabSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("home");

  const handleTabChange = (newTab: string) => {
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div>
      <button onClick={() => handleTabChange("home")}>Home</button>
      {isPending && <Spinner />}
    </div>
  );
}
```

### Combining useActionState + useTransition
For React Hook Form validation before Server Action:

```typescript
"use client";

import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## State Management

### useState
- Use for **simple local state** only
- Prefer Server Components + URL state for complex state
- Co-locate state as close as possible to where it's used

```typescript
// Good - Local UI state
const [isOpen, setIsOpen] = useState(false);

// Bad - Should be in URL or server state
const [currentPage, setCurrentPage] = useState(1);
```

### useEffect
- **Avoid useEffect for data fetching** - use Server Components
- Use only for:
  - Syncing with external systems (analytics, etc.)
  - Browser APIs (localStorage, etc.)
  - Cleanup (timers, subscriptions)

```typescript
// Good - Syncing external system
useEffect(() => {
  const timer = setInterval(() => setCount(c => c - 1), 1000);
  return () => clearInterval(timer);
}, []);

// Bad - Data fetching (use Server Component instead)
useEffect(() => {
  fetch("/api/user").then(res => res.json()).then(setUser);
}, []);
```

### Zustand (Global State)
- Use for **client-side UI state only**, not source of truth
- Server provides auth state, Zustand syncs for UI
- Keep stores small and focused

```typescript
// Good - UI state synchronized from server
"use client";

export function NavbarClient({ user: serverUser }: { user: User | null }) {
  const { setUser } = useAuthStore();
  
  useEffect(() => {
    if (serverUser) {
      setUser(serverUser);
    }
  }, [serverUser, setUser]);
}
```

## Component Patterns

### Composition Over Props
Prefer children/slots over many props:

```typescript
// Good
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Bad - Too many props
export function Card({ 
  title, 
  content, 
  footer, 
  headerClass, 
  contentClass 
}: CardProps) {
  return (
    <div className="card">
      <div className={headerClass}>{title}</div>
      <div className={contentClass}>{content}</div>
      <div>{footer}</div>
    </div>
  );
}
```

### Controller Pattern (React Hook Form)
Use Controller for custom form components:

```typescript
"use client";

import { Controller, useForm } from "react-hook-form";

export function SignupForm() {
  const form = useForm<FormData>();

  return (
    <form>
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <TextInput
            label="Email"
            error={form.formState.errors.email?.message}
            {...field}
          />
        )}
      />
    </form>
  );
}
```

### Error Boundaries
Use error.tsx for route-level error handling:

```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Performance

### React.memo
Only use when profiling shows unnecessary re-renders:

```typescript
// Only when needed
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
}: {
  data: ComplexData;
}) {
  // Expensive rendering logic
});
```

### useMemo / useCallback
Use sparingly - they have overhead:

```typescript
// Good use case - expensive calculation
const sortedItems = useMemo(
  () => items.sort((a, b) => a.price - b.price),
  [items]
);

// Bad - premature optimization
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);
```

## Key Prop

### Never Use Array Index as Key
Biome will reject this:

```typescript
// Bad - Will fail lint
{items.map((item, i) => <Item key={i} {...item} />)}

// Good - Use stable identifier
{items.map(item => <Item key={item.id} {...item} />)}

// Good - For static content, write out manually
<div>
  <Skeleton className="h-4" />
  <Skeleton className="h-4" />
  <Skeleton className="h-4" />
</div>
```

## Conditional Rendering

### Early Returns
Prefer early returns over nested ternaries:

```typescript
// Good
if (showSuccess) {
  return <SuccessScreen />;
}

return <Form />;

// Bad
return (
  <div>
    {showSuccess ? (
      <SuccessScreen />
    ) : (
      <Form />
    )}
  </div>
);
```

## PropTypes

### Use TypeScript interfaces
Never use PropTypes - we have TypeScript:

```typescript
// Good
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: ButtonProps) {
  // ...
}

// Bad - Don't use PropTypes in TypeScript projects
Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  children: PropTypes.node.isRequired,
};
```
