# Error Handling Patterns

## Architecture

### Centralized Error System
All errors go through consistent handling:

1. **Domain errors** (`src/domain/auth/errors.ts`) - Type definitions
2. **Error handler** (`src/lib/errors/error-handler.ts`) - Transform to display config
3. **Icon mapper** (`src/lib/errors/icon-mapper.ts`) - Client-side icon resolution
4. **Error Alert** (`src/components/auth/error-alert.tsx`) - Display component

## Error Types

### Domain Error Definitions
Define error types with display configuration:

```typescript
// src/domain/auth/errors.ts
export type AuthErrorCode =
  | "USERNAME_TAKEN"
  | "EMAIL_TAKEN"
  | "INVALID_CREDENTIALS"
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT"
  | "SERVER_ERROR";

export interface AuthError {
  code: AuthErrorCode;
  field?: string;
  context?: Record<string, unknown>;
}

export interface ErrorDisplayConfig {
  title: string;
  description: string;
  variant: "destructive" | "default";
  iconName: string;  // String, not React component
  suggestions?: string[];
  actions?: ErrorAction[];
  countdown?: number;
}

export interface ErrorAction {
  label: string;
  href?: string;
  variant?: "default" | "outline";
}
```

**Important:** Use `iconName: string` instead of `icon: LucideIcon` because Server Actions can only return serializable data.

## Error Handler

### Server-Side Handler
Transform backend errors to display configs:

```typescript
// src/lib/errors/error-handler.ts
import { type AuthError, type AuthErrorCode, type ErrorDisplayConfig } from "@/domain/auth/errors";

const errorConfigs: Record<AuthErrorCode, (error: AuthError) => ErrorDisplayConfig> = {
  USERNAME_TAKEN: (error) => ({
    title: "Username not available",
    description: `The username "${error.context?.username || 'you entered'}" is already taken.`,
    variant: "destructive",
    iconName: "UserX",
    suggestions: [
      "Try adding numbers or special characters",
      "Use a variation of your name",
    ],
    actions: [
      { label: "Try different username", variant: "default" },
    ],
  }),

  EMAIL_TAKEN: (error) => ({
    title: "Email already registered",
    description: "An account with this email already exists.",
    variant: "destructive",
    iconName: "Mail",
    suggestions: [
      "Log in to your existing account",
      "Use a different email address",
    ],
    actions: [
      { label: "Go to login", href: "/login" },
    ],
  }),

  INVALID_CREDENTIALS: () => ({
    title: "Invalid credentials",
    description: "The username or password you entered is incorrect.",
    variant: "destructive",
    iconName: "KeyRound",
    suggestions: [
      "Check your username and password",
      "Passwords are case-sensitive",
    ],
  }),

  NETWORK_ERROR: () => ({
    title: "Connection failed",
    description: "Could not connect to the server. Please check your internet connection.",
    variant: "destructive",
    iconName: "WifiOff",
    suggestions: [
      "Check your internet connection",
      "Try again in a moment",
    ],
  }),

  RATE_LIMIT: (error) => ({
    title: "Too many attempts",
    description: "Please wait a moment before trying again.",
    variant: "default",
    iconName: "Clock",
    countdown: error.context?.retryAfter as number,
  }),

  SERVER_ERROR: () => ({
    title: "Something went wrong",
    description: "We encountered an unexpected error. Please try again.",
    variant: "destructive",
    iconName: "ServerCrash",
    suggestions: [
      "Try again in a moment",
      "Contact support if the problem persists",
    ],
  }),

  VALIDATION_ERROR: (error) => ({
    title: "Invalid input",
    description: error.context?.message as string || "Please check your input and try again.",
    variant: "destructive",
    iconName: "AlertCircle",
  }),
};

export function handleAuthError(error: unknown): ErrorDisplayConfig {
  // Already formatted AuthError
  if (isAuthError(error)) {
    const config = errorConfigs[error.code];
    return config ? config(error) : getDefaultError();
  }

  // Backend API error response
  if (isApiError(error)) {
    return parseApiError(error);
  }

  // Network/fetch error
  if (error instanceof TypeError) {
    return errorConfigs.NETWORK_ERROR({} as AuthError);
  }

  // Unknown error
  return getDefaultError();
}

function getDefaultError(): ErrorDisplayConfig {
  return {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    variant: "destructive",
    iconName: "AlertCircle",
  };
}
```

## Icon Mapper

### Client-Side Icon Resolution
Map string names to Lucide components:

```typescript
// src/lib/errors/icon-mapper.ts
import {
  AlertCircle,
  Clock,
  KeyRound,
  Mail,
  ServerCrash,
  UserX,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  UserX,
  Mail,
  KeyRound,
  WifiOff,
  Clock,
  ServerCrash,
  AlertCircle,
};

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || AlertCircle;
}
```

**Why?** Server Actions can't return React components (not serializable), so we return string names and map them client-side.

## Error Display Component

### Error Alert
Display errors with icons, suggestions, and actions:

```typescript
// src/components/auth/error-alert.tsx
"use client";

import { motion } from "motion/react";
import { getIconComponent } from "@/lib/errors/icon-mapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { type ErrorDisplayConfig } from "@/domain/auth/errors";

interface ErrorAlertProps {
  config: ErrorDisplayConfig;
}

export function ErrorAlert({ config }: ErrorAlertProps) {
  const Icon = getIconComponent(config.iconName);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert variant={config.variant}>
        <Icon className="h-4 w-4" />
        <AlertTitle>{config.title}</AlertTitle>
        <AlertDescription>
          <p>{config.description}</p>
          
          {config.suggestions && config.suggestions.length > 0 && (
            <ul className="mt-2 list-disc list-inside space-y-1">
              {config.suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          )}
          
          {config.actions && config.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {config.actions.map((action, i) => (
                <Button
                  key={i}
                  variant={action.variant || "default"}
                  size="sm"
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <Link href={action.href}>{action.label}</Link>
                  ) : (
                    <span>{action.label}</span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
```

## Usage in Server Actions

### Handling Different Error Types
```typescript
"use server";

export async function signupAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    // Validation errors
    const result = signupSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[String(err.path[0])] = err.message;
        }
      });
      return { fieldErrors };
    }

    // API call
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      return { 
        error: handleAuthError(errorData) 
      };
    }

    const user = await response.json();
    return { success: true, user };

  } catch (error) {
    // Network errors
    return { 
      error: handleAuthError(error)
    };
  }
}
```

## Backend API Error Format

### Expected Error Response
Backend should return structured errors:

```typescript
// Backend error response format
{
  "statusCode": 400,
  "message": "Username already exists",
  "code": "USERNAME_TAKEN",
  "field": "username",
  "context": {
    "username": "john_doe"
  }
}
```

Frontend parses and transforms:

```typescript
function parseApiError(apiError: ApiErrorResponse): ErrorDisplayConfig {
  const authError: AuthError = {
    code: apiError.code as AuthErrorCode,
    field: apiError.field,
    context: apiError.context,
  };
  
  return handleAuthError(authError);
}
```

## Field-Level Errors

### Displaying Field Errors
Show validation errors inline:

```typescript
"use client";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, null);
  const form = useForm<SignupInput>();

  // Set field errors from server
  useEffect(() => {
    if (state?.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([field, message]) => {
        form.setError(field as keyof SignupInput, { message });
      });
    }
  }, [state?.fieldErrors, form]);

  return (
    <form action={formAction}>
      <Controller
        name="username"
        control={form.control}
        render={({ field }) => (
          <TextInput
            {...field}
            error={form.formState.errors.username?.message}
          />
        )}
      />
    </form>
  );
}
```

## Error Boundaries

### Route-Level Error Boundary
Use error.tsx for unexpected errors:

```typescript
// app/[locale]/signup/error.tsx
"use client";

import { useEffect } from "react";

export default function SignupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Signup page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <AlertCircle className="h-8 w-8 text-destructive" />
          <h1>Something went wrong</h1>
        </CardHeader>
        <CardContent>
          {error.digest && <p>Error ID: {error.digest}</p>}
          <Button onClick={reset}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Toast Notifications

### For Non-Critical Feedback
Use Sonner for success/info messages:

```typescript
import { toast } from "sonner";

// Success
toast.success("Account created successfully!");

// Info
toast.info("Welcome back!");

// Error (for minor issues)
toast.error("Failed to save changes");
```

**When to use toast vs ErrorAlert:**
- **ErrorAlert**: Form validation, auth errors, user needs to act
- **Toast**: Success confirmation, minor errors, FYI messages

## Logging

### Client-Side Logging
```typescript
// Good - Log for debugging
console.error("API error:", {
  endpoint: "/auth/signup",
  status: response.status,
  timestamp: Date.now(),
});

// Bad - Never log sensitive data
console.error("API error:", {
  password: userPassword,  // NEVER
  token: authToken,        // NEVER
});
```

### Error Tracking
Integrate error tracking service:

```typescript
// lib/error-tracking.ts
export function trackError(error: Error, context?: Record<string, unknown>) {
  // Send to Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === "production") {
    // errorTrackingService.captureException(error, context);
  }
  console.error(error, context);
}
```

## Progressive Enhancement

### Errors Work Without JS
Ensure errors display even if JS fails:

```typescript
// Server Action returns error state
// Next.js renders it server-side
// User sees error even without JS
{state?.error && <ErrorAlert config={state.error} />}
```

## Best Practices

### Do This
✅ Use consistent error codes
✅ Provide helpful suggestions
✅ Generic messages for security (don't reveal if user exists)
✅ Return serializable data from Server Actions
✅ Handle all error types (validation, network, API, unknown)
✅ Log errors for debugging (without sensitive data)

### Don't Do This
❌ Return React components from Server Actions
❌ Reveal sensitive information in error messages
❌ Log passwords, tokens, or personal data
❌ Show technical errors to users
❌ Forget to handle network errors
❌ Use alerts/confirms (use proper UI components)
