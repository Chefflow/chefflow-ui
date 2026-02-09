# Form Patterns (React Hook Form + Zod)

## Form Setup

### Basic Structure
Use React Hook Form with Zod resolver:

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",  // Validate on blur
  });

  return <form>{/* fields */}</form>;
}
```

## Zod Schemas

### Schema Organization
Co-locate schemas in `src/lib/validation/`:

```typescript
// src/lib/validation/auth.schema.ts
import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long");

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  username: z.string().min(3).max(30),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept terms",
  }),
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type SignupInput = z.infer<typeof signupSchema>;
```

### Shared Validation
Extract common validators:

```typescript
// Reusable field schemas
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username is too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, - and _");

// Use in multiple schemas
export const signupSchema = z.object({
  username: usernameSchema,
  // ...
});

export const updateProfileSchema = z.object({
  username: usernameSchema,
  // ...
});
```

### Custom Refinements
Add complex validation logic:

```typescript
const passwordStrengthSchema = z
  .string()
  .min(8)
  .refine(
    val => /[A-Z]/.test(val),
    "Must contain uppercase letter"
  )
  .refine(
    val => /[a-z]/.test(val),
    "Must contain lowercase letter"
  )
  .refine(
    val => /[0-9]/.test(val),
    "Must contain number"
  );
```

## Controller Pattern

### Using Controller
Wrap custom components with Controller:

```typescript
"use client";

import { Controller, useForm } from "react-hook-form";
import { TextInputField } from "@/components/auth/text-input-field";

export function SignupForm() {
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <form>
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <TextInputField
            id="email"
            label="Email"
            type="email"
            error={form.formState.errors.email?.message}
            {...field}
          />
        )}
      />
    </form>
  );
}
```

### Custom Component Interface
Components should accept field props:

```typescript
// components/auth/text-input-field.tsx
interface TextInputFieldProps {
  id: string;
  label: string;
  type: string;
  error?: string;
  // React Hook Form field props
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
}

export function TextInputField({
  id,
  label,
  type,
  error,
  value,
  onChange,
  onBlur,
  name,
}: TextInputFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <p className="text-destructive">{error}</p>}
    </div>
  );
}
```

## Integration with Server Actions

### Form Submission
Combine RHF validation with Server Actions:

```typescript
"use client";

import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signupAction } from "@/app/actions/auth";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, null);
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Convert to FormData for Server Action
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      {state?.error && <ErrorAlert config={state.error} />}
      {/* fields */}
      <SubmitButton>Submit</SubmitButton>
    </form>
  );
}
```

**Pattern:**
1. `form.handleSubmit` validates with Zod
2. If valid, convert to FormData
3. Call formAction inside startTransition
4. Server Action validates again (defense in depth)

### Server-Side Field Errors
Display field-specific errors from server:

```typescript
useEffect(() => {
  if (state?.fieldErrors) {
    Object.entries(state.fieldErrors).forEach(([field, message]) => {
      form.setError(field as keyof FormData, { message });
    });
  }
}, [state?.fieldErrors, form]);
```

Server Action returns:

```typescript
"use server";

export async function signupAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // Validate with Zod
  const result = signupSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      fieldErrors: {
        username: result.error.errors.find(e => e.path[0] === "username")?.message,
        email: result.error.errors.find(e => e.path[0] === "email")?.message,
      },
    };
  }

  // Process...
}
```

## Submit Button

### Using useFormStatus
Create separate component for submit button:

```typescript
// components/auth/submit-button.tsx
"use client";

import { useFormStatus } from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  children: React.ReactNode;
  loadingText?: string;
}

export function SubmitButton({ children, loadingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (loadingText || "Loading...") : children}
    </Button>
  );
}
```

**Must be separate component** - useFormStatus requires being inside form.

## Validation Modes

### Available Modes
```typescript
const form = useForm({
  mode: "onSubmit",     // Default - validate on submit only
  mode: "onBlur",       // Validate when field loses focus
  mode: "onChange",     // Validate on every keystroke (can be slow)
  mode: "onTouched",    // Validate on blur, then on change
  mode: "all",          // Validate on blur + change
});
```

**Recommendation**: Use `"onTouched"` for best UX - validates after user interacts, then continuously.

## Error Display

### Field Errors
Show errors inline with fields:

```typescript
<Controller
  name="email"
  control={form.control}
  render={({ field }) => (
    <div>
      <input {...field} />
      {form.formState.errors.email && (
        <p className="text-sm text-destructive">
          {form.formState.errors.email.message}
        </p>
      )}
    </div>
  )}
/>
```

### Form-Level Errors
Display server errors at form level:

```typescript
{state?.error && (
  <ErrorAlert
    title={state.error.title}
    description={state.error.description}
    variant={state.error.variant}
  />
)}
```

## Progressive Enhancement

### Form Works Without JS
Use proper form structure:

```typescript
<form action={formAction} onSubmit={handleSubmit}>
  <input name="email" type="email" required />
  <button type="submit">Submit</button>
</form>
```

- `action={formAction}` - Progressive enhancement
- `name` attributes - Server receives data
- `required` - Basic HTML validation
- `type="email"` - HTML5 validation

## Common Patterns

### Checkbox with Terms
```typescript
<Controller
  name="acceptTerms"
  control={form.control}
  render={({ field }) => (
    <div>
      <Checkbox
        id="terms"
        checked={field.value}
        onCheckedChange={field.onChange}
      />
      <label htmlFor="terms">
        I accept the <Link href="/terms">Terms</Link>
      </label>
      {form.formState.errors.acceptTerms && (
        <p className="text-destructive">
          {form.formState.errors.acceptTerms.message}
        </p>
      )}
    </div>
  )}
/>
```

### Password Confirmation
```typescript
const signupSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],  // Error shows on confirmPassword field
  }
);
```

### Dependent Fields
```typescript
const form = useForm();
const watchCountry = form.watch("country");

return (
  <>
    <Controller name="country" control={form.control} render={...} />
    
    {watchCountry === "US" && (
      <Controller name="state" control={form.control} render={...} />
    )}
  </>
);
```

## Performance

### Avoid Unnecessary Re-renders
```typescript
// Good - Only re-renders on email change
const emailError = form.formState.errors.email;

// Bad - Re-renders on ANY form state change
{form.formState.errors.email?.message}
```

### Disable Validation During Typing
```typescript
const form = useForm({
  mode: "onTouched",  // Validate on blur first
  reValidateMode: "onChange",  // Then continuously validate
});
```

## Testing Considerations

### Expose Form State for Testing
```typescript
// For debugging/testing
const formState = form.formState;
console.log({
  isValid: formState.isValid,
  errors: formState.errors,
  isDirty: formState.isDirty,
});
```
