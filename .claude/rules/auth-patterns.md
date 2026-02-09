# Authentication Patterns

## Architecture

### Defense in Depth
Multiple layers of security:

1. **Client validation** (React Hook Form + Zod) - UX
2. **Client-side hashing** (SHA-256) - Protect password in transit
3. **Server validation** (Server Action + Zod) - Security
4. **Backend hashing** (bcrypt) - Secure storage

```typescript
// Client: Validate with Zod
const form = useForm({ resolver: zodResolver(signupSchema) });

// Server Action: Hash before sending to API
const hashedPassword = hashPassword(password);  // SHA-256
await apiRequest("/auth/signup", { password: hashedPassword });

// Backend API: Hash again for storage
const passwordHash = await bcrypt.hash(password, 10);  // bcrypt
```

## Password Hashing

### Client-Side SHA-256
Use for password transmission (NOT storage):

```typescript
// lib/crypto/hash-password.server.ts
import { createHash } from "node:crypto";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}
```

**Important:**
- Use `.server.ts` suffix - prevents client bundle inclusion
- Only for transmission protection
- Backend must still use bcrypt/argon2 for storage
- This is defense in depth, not replacement for backend hashing

### Backend Storage
Backend uses proper password hashing:

```typescript
// Backend (NestJS/Express)
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);
```

## HTTP-Only Cookies

### Server Sets Cookie
Backend sets HTTP-only cookie on login:

```typescript
// Backend sets:
res.cookie('auth_token', token, {
  httpOnly: true,      // Prevents JS access
  secure: true,        // HTTPS only
  sameSite: 'lax',     // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

### Client Includes Cookie
Frontend sends cookie with every request:

```typescript
const response = await fetch(`${API_URL}/endpoint`, {
  method: "POST",
  credentials: "include",  // REQUIRED - sends cookies
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
```

**Always use `credentials: "include"`** for authenticated requests.

## Server Actions

### Authentication Actions
Create actions for signup, login, logout:

```typescript
// app/actions/auth.ts
"use server";

import { hashPassword } from "@/lib/crypto/hash-password.server";

const API_URL = process.env.API_URL!;

interface ActionState {
  success?: boolean;
  error?: ErrorDisplayConfig;
  fieldErrors?: Record<string, string>;
  user?: User;
}

export async function signupAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // 1. Extract and validate
  const result = signupSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.errors.forEach(err => {
      if (err.path[0]) {
        fieldErrors[String(err.path[0])] = err.message;
      }
    });
    return { fieldErrors };
  }

  // 2. Hash password (SHA-256 for transmission)
  const hashedPassword = hashPassword(result.data.password);

  // 3. Call backend API
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...result.data,
        password: hashedPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        error: handleAuthError(errorData) 
      };
    }

    const user = await response.json();
    return { success: true, user };

  } catch (error) {
    return { 
      error: {
        title: "Network Error",
        description: "Could not connect to server",
        variant: "destructive",
        iconName: "WifiOff",
      }
    };
  }
}

export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // Similar pattern...
}

export async function logoutAction(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
```

### Key Points
- Always validate with Zod on server
- Hash passwords before API call
- Use credentials: "include" for cookies
- Return serializable data only (no functions/components)
- Handle all error cases (validation, network, API errors)

## Client-Side State

### Zustand Store (UI Only)
Use Zustand for client-side UI state, NOT as auth source of truth:

```typescript
// store/auth-store.ts
import { create } from "zustand";

export interface User {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

### Sync from Server
Server Components fetch real auth state, sync to Zustand for UI:

```typescript
// components/navbar-client.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

interface NavbarClientProps {
  user: User | null;  // From server
}

export function NavbarClient({ user: serverUser }: NavbarClientProps) {
  const { user, setUser } = useAuthStore();

  // Sync server state to client store (UI only)
  useEffect(() => {
    if (serverUser) {
      setUser(serverUser);
    }
  }, [serverUser, setUser]);

  // Use client state for UI
  return (
    <nav>
      {user && <p>Welcome, {user.name}</p>}
    </nav>
  );
}
```

**Pattern:**
1. Server Component fetches real auth state (via cookie)
2. Pass to Client Component as prop
3. Client Component syncs to Zustand for UI reactivity
4. NEVER use Zustand as source of truth for security decisions

## Protected Routes

### Middleware Approach
Check authentication in middleware:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Guest-only routes
  if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};
```

### Server Component Auth Check
Fetch user in layout for auth-required sections:

```typescript
// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user.server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Navbar user={user} />
      {children}
    </div>
  );
}
```

## OAuth / Social Login

### Callback Handling
```typescript
// app/[locale]/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        // Backend has already set cookie via OAuth flow
        // Fetch user profile to verify
        const response = await fetch(`${API_URL}/auth/profile`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const user = await response.json();
        setUser(user);
        router.push("/dashboard");
      } catch (error) {
        console.error("OAuth callback error:", error);
        router.push("/login");
      }
    }

    handleOAuthCallback();
  }, [router, setUser]);

  return <LoadingSpinner />;
}
```

## Security Best Practices

### Never Trust Client
- **Always validate on server** even if client validated
- **Never use client state for security decisions**
- **Always check auth on server** for protected data

### Logging
```typescript
// Good - Log for debugging (sanitized)
console.log("Login attempt:", { username, timestamp: Date.now() });

// Bad - Never log sensitive data
console.log("Login attempt:", { username, password }); // NEVER
console.log("Token:", token); // NEVER
```

### Error Messages
```typescript
// Good - Generic message
"Invalid username or password"

// Bad - Reveals if username exists
"Invalid password" // Confirms username exists
"User not found"   // Reveals username doesn't exist
```

### Rate Limiting
Let backend handle rate limiting:

```typescript
// Backend
@UseGuards(ThrottlerGuard)
@Post('login')
async login(@Body() dto: LoginDto) {
  // ...
}
```

Frontend displays the error:

```typescript
if (response.status === 429) {
  return {
    error: {
      title: "Too Many Attempts",
      description: "Please wait a moment before trying again",
      iconName: "Clock",
    }
  };
}
```

## Session Management

### Token Refresh
If using JWT with refresh tokens:

```typescript
// lib/api/refresh-token.ts
export async function refreshAuthToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

### Logout Everywhere
```typescript
export async function logoutAction(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  
  // Clear client-side state
  useAuthStore.getState().clearUser();
  
  // Redirect happens after
}
```

## Common Mistakes

### Don't Do This
❌ Store JWT in localStorage (XSS vulnerability)
❌ Make auth decisions based on Zustand state
❌ Send plaintext passwords to API (hash with SHA-256 first)
❌ Forget `credentials: "include"` in fetch
❌ Log passwords or tokens
❌ Use client-side only validation for security
❌ Trust data from client without server validation
