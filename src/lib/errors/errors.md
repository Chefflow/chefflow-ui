# Error Handler

Centralized error handling system for authentication flows. Converts raw errors into user-friendly display configurations with icons, suggestions, and actions.

## Architecture

### Serialization-Safe Design

This system is designed to work with **Server Actions** in Next.js. All data structures are **serializable** (no functions, classes, or React components can be passed from server to client).

**Key principle**: Server Actions return **strings** for icon names, which the client component maps to actual React components.

## Files

- `error-handler.ts` - Server-side error handler (returns serializable config)
- `icon-mapper.ts` - Client-side icon component mapper
- `src/domain/auth/errors.ts` - Type definitions
- `src/components/auth/error-alert.tsx` - UI component (client)

## Usage

### In Server Actions

```typescript
'use server';

import { handleError } from '@/lib/errors/error-handler';

export async function signupAction(prevState, formData) {
  try {
    // ... signup logic
  } catch (error) {
    return {
      success: false,
      error: handleError(error), // Returns serializable ErrorDisplayConfig
    };
  }
}
```

### In Client Components

```typescript
'use client';

import { ErrorAlert } from '@/components/auth/error-alert';

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <form action={formAction}>
      {state?.error && <ErrorAlert config={state.error} />}
      {/* form fields */}
    </form>
  );
}
```

## Error Types

### `USERNAME_TAKEN`
- **Icon**: UserX
- **Variant**: destructive
- **Features**: Username suggestions

### `EMAIL_EXISTS`
- **Icon**: Mail
- **Variant**: default
- **Features**: Login/reset password actions

### `INVALID_CREDENTIALS`
- **Icon**: KeyRound
- **Variant**: destructive
- **Features**: Forgot password link

### `NETWORK_ERROR`
- **Icon**: WifiOff
- **Variant**: destructive
- **Features**: None (removed retry action as functions aren't serializable)

### `RATE_LIMIT`
- **Icon**: Clock
- **Variant**: default
- **Features**: Countdown timer

### `SERVER_ERROR`
- **Icon**: ServerCrash
- **Variant**: destructive
- **Features**: Support contact link

### `VALIDATION_ERROR`
- **Icon**: AlertCircle
- **Variant**: destructive
- **Features**: None (field-specific errors shown inline)

## Error Display Config Structure

```typescript
interface ErrorDisplayConfig {
  title: string;
  description: string;
  variant: "destructive" | "default";
  iconName: string; // Icon identifier (not component!)
  suggestions?: string[];
  actions?: ErrorAction[];
  countdown?: number;
}

interface ErrorAction {
  label: string;
  href?: string; // Only hrefs, no functions
  variant?: "default" | "outline" | "ghost" | "destructive";
}
```

**Important**: Actions can only contain `href` links, not functions. This ensures the config is serializable for Server Actions.

## Icon Mapping

Icons are mapped on the client side:

```typescript
// icon-mapper.ts
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

**Usage in ErrorAlert**:
```typescript
const Icon = getIconComponent(config.iconName);
return <Icon className="h-4 w-4" />;
```

## Custom Error Handling

### Throwing Errors from Server Actions

```typescript
const error: AuthError = {
  code: 'USERNAME_TAKEN',
  message: 'Username is already taken',
  field: 'username',
  suggestions: generateUsernameSuggestions(username),
};
throw error;
```

### Parsing Errors

The `parseError()` function handles multiple error formats:

1. **Already an AuthError** - Returns as-is
2. **Fetch/Axios error with response** - Extracts error data
3. **Network error** - Returns NETWORK_ERROR code
4. **Generic error** - Returns SERVER_ERROR with message

## Username Suggestions

```typescript
export function generateUsernameSuggestions(username: string): string[] {
  const base = username.toLowerCase().replace(/[^a-z0-9]/g, "");
  return [
    `${base}${Math.floor(Math.random() * 1000)}`,
    `${base}_chef`,
    `${base}-pro`,
  ];
}
```

## Backend Contract

The backend should return errors in this format:

```json
{
  "code": "USERNAME_TAKEN",
  "message": "Username 'chef_john' is already taken",
  "field": "username",
  "suggestions": ["chef_john_123", "chef_john_chef", "chef_john-pro"]
}
```

**Status codes**:
- 409 Conflict → USERNAME_TAKEN
- 401 Unauthorized → INVALID_CREDENTIALS
- 429 Too Many Requests → RATE_LIMIT
- 500+ → SERVER_ERROR

## Design Decisions

### Why String Icon Names?

**Problem**: Next.js Server Actions can only return serializable data. React components (functions) cannot be serialized.

**Solution**: Return icon **names** as strings from the server, map them to components on the client.

```typescript
// ❌ NOT SERIALIZABLE - Will crash
return {
  icon: ServerCrash, // Function/React component
};

// ✅ SERIALIZABLE - Works with Server Actions
return {
  iconName: "ServerCrash", // String
};
```

### Why No Action Functions?

**Problem**: Functions aren't serializable in Server Actions.

**Solution**: Only use `href` links in actions. For dynamic actions (like retry), handle them in the client component:

```typescript
// ❌ NOT SERIALIZABLE
actions: [{
  label: "Retry",
  action: () => window.location.reload(), // Function
}]

// ✅ Use client-side handler instead
if (config.iconName === "WifiOff") {
  <Button onClick={() => window.location.reload()}>Retry</Button>
}
```

## Testing

Test page at `/en/test-errors` demonstrates all error states.

```typescript
// Example: Test USERNAME_TAKEN error
const config = handleError({
  code: 'USERNAME_TAKEN',
  message: 'Username taken',
  field: 'chef_john',
  suggestions: ['chef_john_123', 'chef_john_chef'],
});

<ErrorAlert config={config} />
```

## Migration from Old System

### Before (Client-side only)
```typescript
toast.error("Signup failed. Please try again.");
```

### After (Server Action + Error Handler)
```typescript
// Server Action
catch (error) {
  return {
    success: false,
    error: handleError(error), // Converts to ErrorDisplayConfig
  };
}

// Client
{state?.error && <ErrorAlert config={state.error} />}
```

**Benefits**:
- Consistent error display
- Actionable suggestions
- Animated transitions
- Proper error categorization
- Works with Server Actions
