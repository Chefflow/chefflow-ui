# Next.js 15 & 16 Patterns

## App Router Structure

### File Conventions
Follow Next.js App Router conventions:

```
app/
  [locale]/              # Dynamic locale segment
    layout.tsx           # Shared layout (required)
    page.tsx             # Route page
    loading.tsx          # Loading UI
    error.tsx            # Error boundary
    not-found.tsx        # 404 page
    route-name/
      page.tsx           # Nested route
      loading.tsx        # Route-specific loading
```

### Special Files
- **layout.tsx**: Shared UI that wraps pages (required at root)
- **page.tsx**: Unique UI for a route, makes route publicly accessible
- **loading.tsx**: Loading UI with automatic Suspense boundary
- **error.tsx**: Error UI boundary (must be "use client")
- **not-found.tsx**: 404 UI for this route and children

## Data Fetching

### Server Components (Default)
Fetch data directly in Server Components:

```typescript
// app/users/page.tsx
import { getUsers } from "@/lib/api/users";

export default async function UsersPage() {
  const users = await getUsers();
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**Benefits:**
- No loading states needed
- No useEffect
- Automatic request deduplication
- Parallel data fetching

### Parallel Data Fetching
Fetch multiple resources in parallel:

```typescript
export default async function Dashboard() {
  // These run in parallel automatically
  const userPromise = getUser();
  const postsPromise = getPosts();
  
  const [user, posts] = await Promise.all([userPromise, postsPromise]);
  
  return <div>{/* render */}</div>;
}
```

### Sequential Data Fetching
When one request depends on another:

```typescript
export default async function UserPosts({ userId }: { userId: string }) {
  const user = await getUser(userId);
  const posts = await getPostsByAuthor(user.authorId);
  
  return <div>{/* render */}</div>;
}
```

## Server Actions

### Definition
Create Server Actions with `"use server"` directive:

```typescript
// app/actions/auth.ts
"use server";

import { hashPassword } from "@/lib/crypto/hash-password.server";

export async function signupAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const username = formData.get("username") as string;
  
  // Validate, process, call API
  const response = await apiRequest("/auth/signup", { username });
  
  if (!response.ok) {
    return { error: { title: "Signup failed" } };
  }
  
  return { success: true };
}
```

**Key Points:**
- Must be async functions
- Can only return JSON-serializable data (no functions, no React components)
- Use `.server.ts` suffix for server-only utilities
- Always validate input - never trust client data

### Usage in Forms
Use with useActionState:

```typescript
"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/actions/auth";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, null);
  
  return (
    <form action={formAction}>
      <input name="username" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Return Types
Server Actions can only return serializable data:

```typescript
// Good - JSON serializable
interface ActionState {
  success?: boolean;
  error?: {
    title: string;
    description: string;
    iconName: string;  // String, not component
  };
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

// Bad - Not serializable
interface ActionState {
  icon: LucideIcon;           // React component
  action: () => void;         // Function
  date: Date;                 // Use string instead
}
```

## Route Handlers

### API Routes
Create API endpoints with route.ts:

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await createUser(body);
  return NextResponse.json(user, { status: 201 });
}
```

**Prefer Server Actions over API routes** for form submissions.

## Metadata

### Static Metadata
Export metadata object for SEO:

```typescript
// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChefFlow - Recipe Management",
  description: "Organize your recipes and plan meals",
};

export default function HomePage() {
  return <div>Home</div>;
}
```

### Dynamic Metadata
Generate metadata based on params:

```typescript
// app/recipes/[id]/page.tsx
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const recipe = await getRecipe(params.id);
  
  return {
    title: recipe.name,
    description: recipe.description,
  };
}
```

## Internationalization (next-intl)

### Routing Pattern
All routes are under `[locale]` dynamic segment:

```
app/
  [locale]/
    page.tsx           # /en, /es, /fr
    login/page.tsx     # /en/login, /es/login
```

### Using Translations
Different syntax for Client vs Server Components:

```typescript
// Server Component
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  return <h1>{t("title")}</h1>;
}

// Client Component
"use client";
import { useTranslations } from "next-intl";

export function WelcomeMessage() {
  const t = useTranslations("home");
  return <p>{t("welcome")}</p>;
}
```

### Navigation
Use i18n-aware navigation:

```typescript
// Never use next/link or next/navigation directly
// Always use from @/i18n/routing

import { Link, useRouter, usePathname } from "@/i18n/routing";

export function Navigation() {
  const router = useRouter();
  
  return (
    <>
      <Link href="/dashboard">Dashboard</Link>
      <button onClick={() => router.push("/settings")}>
        Settings
      </button>
    </>
  );
}
```

## Loading States

### loading.tsx
Create loading.tsx for automatic Suspense boundaries:

```typescript
// app/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-64 w-full mt-4" />
    </div>
  );
}
```

This shows while `app/dashboard/page.tsx` is loading data.

## Error Handling

### error.tsx
Create error boundaries for route segments:

```typescript
// app/dashboard/error.tsx
"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Failed to load dashboard</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Must be a Client Component** - needs event handlers.

## Middleware

### Cookie-based Auth Check
Use middleware for auth redirects:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

## Image Optimization

### next/image
Always use Next.js Image component:

```typescript
import Image from "next/image";

<Image
  src="/recipe.jpg"
  alt="Delicious recipe"
  width={600}
  height={400}
  priority  // For above-the-fold images
/>
```

## Caching

### Fetch Caching
Next.js caches fetch requests by default:

```typescript
// Cached by default
const data = await fetch("https://api.example.com/data");

// Revalidate every 60 seconds
const data = await fetch("https://api.example.com/data", {
  next: { revalidate: 60 }
});

// Never cache
const data = await fetch("https://api.example.com/data", {
  cache: "no-store"
});
```

### Credentials in Fetch
For authenticated requests:

```typescript
const response = await fetch(`${API_URL}/endpoint`, {
  method: "POST",
  credentials: "include",  // Send cookies
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
```

## Static Params

### generateStaticParams
Generate static pages at build time:

```typescript
// app/[locale]/page.tsx
export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "es" },
    { locale: "fr" },
  ];
}
```

## Environment Variables

### Client vs Server
- `NEXT_PUBLIC_*`: Available in browser
- Others: Server-only

```typescript
// Server-side only
const SECRET_KEY = process.env.SECRET_KEY;

// Available everywhere
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

## Build Configuration

### Turbopack
We use Turbopack for faster builds:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack"
  }
}
```

## Common Pitfalls

### Don't Do This
❌ Fetch in useEffect (use Server Component)
❌ Use next/link directly (use @/i18n/routing)
❌ Return functions/components from Server Actions
❌ Use relative imports beyond same directory
❌ Create API routes for form submissions (use Server Actions)
❌ Use getServerSideProps/getStaticProps (App Router uses different pattern)
