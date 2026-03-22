# Auth Validation Schemas

Zod schemas for authentication forms. Used for both client-side validation (React Hook Form) and server-side validation (Server Actions).

## Schemas

### `signupSchema`
Complete signup validation with password confirmation.

**Fields:**
- `username`: 3+ chars, no spaces, alphanumeric + hyphens/underscores
- `name`: 2+ chars, letters with accents, spaces, hyphens, apostrophes
- `email`: Valid email format
- `password`: 8+ chars, 1 uppercase, 1 lowercase, 1 number
- `confirmPassword`: Must match password
- `acceptTerms`: Must be `true`

### `loginSchema`
Simple login validation.

**Fields:**
- `username`: Required
- `password`: Required

### `signupFieldSchema` / `loginFieldSchema`
Individual field schemas for progressive/real-time validation.

## Usage

### Basic validation

```typescript
import { signupSchema, loginSchema } from '@/lib/validation/auth.schema';

// Synchronous validation (throws on error)
const data = signupSchema.parse(formData);

// Safe validation (returns result object)
const result = signupSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.flatten());
}
```

### With React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@/lib/validation/auth.schema';

const form = useForm<SignupInput>({
  resolver: zodResolver(signupSchema),
  defaultValues: {
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  },
});
```

### In Server Actions

```typescript
'use server';
import { signupSchema } from '@/lib/validation/auth.schema';

export async function signupAction(formData: FormData) {
  const result = signupSchema.safeParse({
    username: formData.get('username'),
    name: formData.get('name'),
    // ...
  });

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // Proceed with validated data
  const { username, email, password } = result.data;
}
```

### Real-time field validation

```typescript
import { signupFieldSchema } from '@/lib/validation/auth.schema';

function validateUsername(value: string) {
  const result = signupFieldSchema.username.safeParse(value);
  return result.success ? null : result.error.errors[0].message;
}
```

## TypeScript Types

```typescript
import type { SignupInput, LoginInput } from '@/lib/validation/auth.schema';

// Inferred from schemas automatically
const signup: SignupInput = {
  username: 'chef_john',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123',
  acceptTerms: true,
};
```

## Error Handling

Zod errors can be transformed to our `ErrorDisplayConfig` format:

```typescript
import { handleError } from '@/lib/errors/error-handler';

const result = signupSchema.safeParse(data);
if (!result.success) {
  // Transform Zod error to AuthError
  const error = {
    code: 'VALIDATION_ERROR' as const,
    message: result.error.errors[0].message,
    field: result.error.errors[0].path[0] as string,
  };

  const displayConfig = handleError(error);
}
```

## Validation Rules

### Username
- Minimum 3 characters
- No spaces allowed
- Only letters, numbers, hyphens (-), and underscores (_)

### Name
- Minimum 2 characters
- Supports international characters (accents, ñ, etc.)
- Can contain spaces, hyphens, and apostrophes
- Must start and end with a letter

### Email
- Standard email format validation (RFC 5322)

### Password
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)

### Password Confirmation
- Must exactly match password field

### Accept Terms
- Must be explicitly `true` (not just truthy)
