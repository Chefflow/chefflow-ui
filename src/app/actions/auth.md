# Auth Server Actions

Next.js Server Actions for authentication using React 19's `useActionState`.

## Actions

### `signupAction(prevState, formData)`

Creates a new user account with server-side validation.

**Parameters:**
- `prevState`: Previous action state (for `useActionState`)
- `formData`: Form data containing signup fields

**FormData Fields:**
- `username` (string, required)
- `name` (string, required)
- `email` (string, required)
- `password` (string, required)
- `confirmPassword` (string, required)
- `acceptTerms` (checkbox, "on" = true)

**Returns:** `ActionState`
```typescript
{
  success: boolean;
  error?: ErrorDisplayConfig;
  user?: User;
  fieldErrors?: Record<string, string>;
}
```

### `loginAction(prevState, formData)`

Authenticates an existing user.

**Parameters:**
- `prevState`: Previous action state (for `useActionState`)
- `formData`: Form data containing login fields

**FormData Fields:**
- `username` (string, required)
- `password` (string, required)

**Returns:** `ActionState`

### `logoutAction()`

Logs out the current user and redirects to `/login`.

**Note:** This action uses `redirect()`, so it should be called from a form action or transition, not directly in event handlers.

## Usage with React 19

### Basic Form (Progressive Enhancement)

```typescript
'use client';

import { useActionState } from 'react';
import { signupAction } from '@/app/actions/auth';
import { ErrorAlert } from '@/components/auth/error-alert';

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <form action={formAction}>
      {state?.error && <ErrorAlert config={state.error} />}

      <input name="username" required disabled={isPending} />
      {state?.fieldErrors?.username && (
        <p className="error">{state.fieldErrors.username}</p>
      )}

      <input name="name" required disabled={isPending} />
      <input name="email" type="email" required disabled={isPending} />
      <input name="password" type="password" required disabled={isPending} />
      <input name="confirmPassword" type="password" required disabled={isPending} />

      <input type="checkbox" name="acceptTerms" disabled={isPending} />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### With useFormStatus (Nested Components)

```typescript
'use client';

import { useFormStatus } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction}>
      {state?.error && <ErrorAlert config={state.error} />}

      <input name="username" required />
      <input name="password" type="password" required />

      <SubmitButton />
    </form>
  );
}
```

### Success Handling

```typescript
const [state, formAction, isPending] = useActionState(signupAction, null);

useEffect(() => {
  if (state?.success && state.user) {
    // Update client state
    setUser(state.user);

    // Redirect
    router.push('/dashboard');

    // Or show success message
    toast.success(`Welcome, ${state.user.name}!`);
  }
}, [state]);
```

## Validation Flow

1. **Client-side** (optional): HTML5 validation (`required`, `type="email"`)
2. **Server-side** (always): Zod schema validation in Server Action
3. **Error Display**:
   - Field errors: `state.fieldErrors.username`
   - Global errors: `state.error` (ErrorDisplayConfig)

```typescript
// Server Action validates with Zod
const result = signupSchema.safeParse(rawData);

if (!result.success) {
  // Returns field-level errors
  return {
    success: false,
    fieldErrors: { username: "Username is required", ... },
    error: handleError({ code: 'VALIDATION_ERROR', ... })
  };
}

// Proceeds with validated data
const response = await apiRequest('/auth/register', result.data);
```

## Security Features

### No Client-Side Password Hashing
Unlike the old implementation, passwords are sent **unhashed** to the Server Action. The Server Action communicates with the backend API over HTTPS, where the backend handles secure password hashing (bcrypt/argon2).

**Old (insecure):**
```typescript
// ❌ Client-side SHA-256 (no salt, predictable)
const hashedPassword = await hashPassword(password);
await api.post('/auth/register', { password: hashedPassword });
```

**New (secure):**
```typescript
// ✅ Server Action sends plaintext over HTTPS, backend hashes properly
await apiRequest('/auth/register', { password }); // Backend handles bcrypt + salt
```

### HTTP-Only Cookies
Authentication cookies are set by the backend as HTTP-only, preventing XSS attacks. The Server Action uses `credentials: 'include'` to ensure cookies are sent/received.

```typescript
const response = await fetch(`${API_URL}/auth/login`, {
  credentials: 'include', // Send/receive cookies
  // ...
});
```

### CSRF Protection
Server Actions are protected by Next.js's built-in CSRF token mechanism (no additional setup needed).

## Error Handling

Errors are handled through the error handler system (Phase 1):

```typescript
try {
  const response = await apiRequest('/auth/login', data);
  return { success: true, user: response.user };
} catch (error) {
  return {
    success: false,
    error: handleError(error), // Converts to ErrorDisplayConfig
  };
}
```

**Error Types:**
- `VALIDATION_ERROR`: Zod schema validation failed
- `USERNAME_TAKEN`: Username already exists (409)
- `EMAIL_EXISTS`: Email already registered
- `INVALID_CREDENTIALS`: Wrong username/password
- `NETWORK_ERROR`: Fetch failed (no connection)
- `RATE_LIMIT`: Too many attempts
- `SERVER_ERROR`: Backend error (500)

## API Contract

Server Actions call these backend endpoints:

**POST /auth/register**
```json
{
  "username": "chef_john",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "user": {
    "username": "chef_john",
    "email": "john@example.com",
    "name": "John Doe",
    "image": null,
    "provider": "LOCAL"
  }
}
```

**POST /auth/login**
```json
{
  "username": "chef_john",
  "password": "SecurePass123"
}
```

Response: Same as register

**POST /auth/logout**

No body, sets cookies to expire.

## Migration Notes

### Before (Client-side API calls)
```typescript
// ❌ Old approach
const handleSubmit = async (e) => {
  e.preventDefault();
  const hashedPassword = await hashPassword(password); // Insecure
  const response = await api.post('/auth/login', { username, password: hashedPassword });
  setUser(response.data.user);
  router.push('/dashboard');
};
```

### After (Server Actions)
```typescript
// ✅ New approach
const [state, formAction, isPending] = useActionState(loginAction, null);

<form action={formAction}>
  {/* No manual submit handler needed */}
</form>

useEffect(() => {
  if (state?.success) {
    setUser(state.user);
    router.push('/dashboard');
  }
}, [state]);
```

## Test Page

Visit `/en/test-actions` to test Server Actions in isolation with debug output.
