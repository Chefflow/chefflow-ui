# SubmitButton Component

Progressive loading button for forms using React 19's `useFormStatus`.

## Features

- **Automatic pending state**: Uses `useFormStatus` hook to detect form submission
- **Progressive loading messages**: Cycles through multiple states for better UX
- **Animated spinner**: Shows loading indicator with Lucide's `Loader2`
- **Accessible**: Properly disabled during submission
- **No manual state management**: Automatically syncs with form pending state

## Usage

### Basic

```typescript
import { SubmitButton } from '@/components/auth/submit-button';

<form action={formAction}>
  <input name="email" />
  <SubmitButton>Sign Up</SubmitButton>
</form>
```

### With Custom Loading Text

```typescript
<SubmitButton loadingText="Processing...">
  Submit
</SubmitButton>
```

### With Custom Styling

```typescript
<SubmitButton className="w-full bg-primary">
  Create Account
</SubmitButton>
```

## Props

```typescript
interface SubmitButtonProps {
  children: React.ReactNode;      // Button label
  loadingText?: string;            // Custom loading text (overrides progressive states)
  className?: string;              // Additional CSS classes
  disabled?: boolean;              // External disabled state
}
```

## Progressive Loading States

When no `loadingText` is provided, cycles through:

1. **"Validating information..."** (800ms)
2. **"Securing your data..."** (600ms)
3. **"Almost there..."** (400ms+)

Total ~1.8s before settling on final state.

## How It Works

### useFormStatus Hook

```typescript
const { pending } = useFormStatus();
```

React 19's `useFormStatus` automatically detects when a parent `<form>` is submitting. The button reads this state without manual prop drilling.

### Progressive State Machine

```typescript
const loadingStates = [
  { text: "Validating information...", duration: 800 },
  { text: "Securing your data...", duration: 600 },
  { text: "Almost there...", duration: 400 },
];
```

Uses intervals to transition between states, giving users feedback about what's happening.

## Integration with Server Actions

```typescript
// signup/page.tsx
const [state, formAction] = useActionState(signupAction, null);

<form action={formAction}>
  <input name="username" />
  <SubmitButton>Sign Up</SubmitButton>
</form>
```

**Key points**:
- Must be used inside a `<form>` with `action={formAction}`
- `useFormStatus` only works in components **nested inside** the form
- Cannot use `useFormStatus` in the same component that renders the `<form>`

## Why Nested Component?

**This won't work:**
```typescript
function MyForm() {
  const { pending } = useFormStatus(); // ❌ Wrong - outside form

  return (
    <form action={formAction}>
      <button disabled={pending}>Submit</button>
    </form>
  );
}
```

**This works:**
```typescript
function MyForm() {
  return (
    <form action={formAction}>
      <SubmitButton>Submit</SubmitButton> {/* ✅ Correct - nested */}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus(); // ✅ Inside form context
  return <button disabled={pending}>Submit</button>;
}
```

## Accessibility

- Button is disabled during submission (`disabled={pending}`)
- External `disabled` prop also respected
- Loading state visually indicated with spinner
- Text updates provide screen reader feedback

## Styling

Uses shadcn's `Button` component internally, so inherits:
- Size variants (default: `lg`)
- Color variants (default: primary)
- All Tailwind classes via `className`

## Examples

### Login Form

```typescript
<form action={loginAction}>
  <input name="username" />
  <input name="password" type="password" />
  <SubmitButton className="w-full">Sign In</SubmitButton>
</form>
```

### Signup Form

```typescript
<form action={signupAction}>
  <input name="email" />
  <input name="password" type="password" />
  <SubmitButton className="w-full">
    Create Account
  </SubmitButton>
</form>
```

### Custom Loading Message

```typescript
<SubmitButton loadingText="Creating your account...">
  Sign Up
</SubmitButton>
```

## React 19 Features

- ✅ **useFormStatus**: Reads form submission state
- ✅ **Server Actions**: Works seamlessly with `useActionState`
- ✅ **Progressive Enhancement**: Form works without JS (button still submits)

## Migration from Old Pattern

### Before (Manual State)

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  setIsLoading(true);
  try {
    await submitForm();
  } finally {
    setIsLoading(false);
  }
};

<form onSubmit={handleSubmit}>
  <button disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Submit'}
  </button>
</form>
```

### After (useFormStatus)

```typescript
const [state, formAction] = useActionState(submitAction, null);

<form action={formAction}>
  <SubmitButton>Submit</SubmitButton>
</form>
```

**Benefits**:
- No manual loading state
- No try/finally cleanup
- Automatic error handling
- Progressive enhancement
