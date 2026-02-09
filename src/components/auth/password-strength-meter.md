# PasswordStrengthMeter Component

Visual password strength indicator with animated feedback using Framer Motion.

## Features

- **Real-time strength calculation**: Updates as user types
- **Animated progress bar**: Smooth transitions between strength levels
- **Color-coded feedback**: Red (weak) to green (strong)
- **Requirements checklist**: Shows missing criteria
- **Success confirmation**: Checkmark when all requirements met
- **Accessible**: Uses semantic HTML and ARIA patterns

## Usage

### Basic

```typescript
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';

function MyForm() {
  const [password, setPassword] = useState('');

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordStrengthMeter password={password} />
    </div>
  );
}
```

### With React Hook Form

```typescript
import { Controller, useForm } from 'react-hook-form';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';

function SignupForm() {
  const form = useForm();

  return (
    <Controller
      name="password"
      control={form.control}
      render={({ field }) => (
        <div>
          <input type="password" {...field} />
          <PasswordStrengthMeter password={field.value} />
        </div>
      )}
    />
  );
}
```

### Without Feedback

```typescript
<PasswordStrengthMeter password={password} showFeedback={false} />
```

## Props

```typescript
interface PasswordStrengthMeterProps {
  password: string;         // Password to evaluate
  showFeedback?: boolean;   // Show requirements list (default: true)
}
```

## Visual States

### Empty State
No meter shown when password is empty.

### Very Weak (1/5)
```
Password strength: Very Weak
[████░░░░░░░░░░░░░░░░] 20%  (Red)

Requirements:
✗ At least 8 characters
✗ One uppercase letter
✗ One number
✗ One special character
```

### Weak (2/5)
```
Password strength: Weak
[████████░░░░░░░░░░░░] 40%  (Orange)

Requirements:
✗ One uppercase letter
✗ One number
✗ One special character
```

### Fair (3/5)
```
Password strength: Fair
[████████████░░░░░░░░] 60%  (Yellow)

Requirements:
✗ One number
✗ One special character
```

### Good (4/5)
```
Password strength: Good
[████████████████░░░░] 80%  (Blue)

Requirements:
✗ One special character (!@#$%^&*)
```

### Strong (5/5)
```
Password strength: Strong
[████████████████████] 100% (Green)

✓ Password meets all requirements!
```

## Animations

### Progress Bar
- **Initial**: Starts at 0% width
- **Transition**: Smooth ease-out animation (300ms)
- **Color**: Transitions between red → orange → yellow → blue → green

### Label
- **Fade in**: Opacity 0 → 1
- **Slide up**: Moves from -5px to 0

### Requirements List
- **Expand**: Height animates from 0 to auto
- **Stagger**: Each item slides in from left (-10px)

### Success Message
- **Scale**: Grows from 0.95 to 1.0
- **Fade in**: Opacity 0 → 1

## Color Scheme

| Strength | Color | Tailwind Class |
|----------|-------|----------------|
| Empty | Gray | `bg-gray-300` |
| Very Weak | Red | `bg-red-500` |
| Weak | Orange | `bg-orange-500` |
| Fair | Yellow | `bg-yellow-500` |
| Good | Blue | `bg-blue-500` |
| Strong | Green | `bg-green-500` |

## Icons

- **XCircle** (Lucide): Red X for missing requirements
- **CheckCircle2** (Lucide): Green check for success

## Integration Example

```typescript
<Controller
  name="password"
  control={form.control}
  render={({ field }) => (
    <div className="space-y-2">
      <PasswordInputField
        label="Password"
        error={form.formState.errors.password?.message}
        {...field}
      />
      <PasswordStrengthMeter password={field.value} />
    </div>
  )}
/>
```

## Requirements Displayed

1. **At least 8 characters**
2. **One uppercase letter** (A-Z)
3. **One lowercase letter** (a-z)
4. **One number** (0-9)
5. **One special character** (!@#$%^&*)

## Accessibility

- Uses semantic HTML (`<ul>`, `<li>`)
- Color is not the only indicator (text labels provided)
- Icons complement text
- Smooth animations don't distract

## Performance

- Recalculates on every password change
- O(n) complexity (n = password length)
- Animations use GPU-accelerated transforms
- No layout thrashing

## Styling

### Progress Bar Container
```css
h-2 w-full bg-gray-200 rounded-full overflow-hidden
```

### Progress Bar Fill
```css
h-full {color} rounded-full
```

### Requirements List
```css
space-y-1 pt-1
```

### Success Message
```css
flex items-center gap-2 text-xs text-green-600 pt-1
```

## Dependencies

- **Framer Motion** (motion/react): Animations
- **Lucide React**: Icons (CheckCircle2, XCircle)
- **@/lib/validation/password-strength**: Strength calculation logic

## When to Use

✅ **Use when:**
- User is creating a new password
- You want to guide users to stronger passwords
- Real-time feedback improves UX

❌ **Don't use when:**
- User is entering existing password (login)
- Space is limited (mobile compact views)
- Password is masked and user can't see feedback

## Progressive Enhancement

The meter is purely visual. Even without JavaScript:
- Password validation still works (Zod on server)
- Form still submits
- Errors still displayed

## Customization

### Hide Feedback List
```typescript
<PasswordStrengthMeter password={password} showFeedback={false} />
```

### Custom Styling
Wrap in a container with custom classes:
```typescript
<div className="my-custom-wrapper">
  <PasswordStrengthMeter password={password} />
</div>
```

## Future Enhancements

Potential improvements (not yet implemented):
- Custom strength levels
- Configurable requirements
- Internationalization support
- Password entropy calculation
- Common password checking (e.g., "password123")
