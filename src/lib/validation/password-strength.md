# Password Strength Calculator

Utility for calculating password strength based on multiple criteria.

## Usage

```typescript
import { calculatePasswordStrength } from '@/lib/validation/password-strength';

const strength = calculatePasswordStrength("MyPass123!");

console.log(strength);
// {
//   score: 4,
//   label: "Good",
//   color: "bg-blue-500",
//   percentage: 80,
//   feedback: ["One special character (!@#$%^&*)"]
// }
```

## Criteria

The password is evaluated on 5 criteria (1 point each):

1. **Length**: At least 8 characters
2. **Uppercase**: Contains at least one uppercase letter (A-Z)
3. **Lowercase**: Contains at least one lowercase letter (a-z)
4. **Numbers**: Contains at least one digit (0-9)
5. **Special Characters**: Contains at least one special character (!@#$%^&*, etc.)

## Score Levels

| Score | Label | Color | Percentage |
|-------|-------|-------|------------|
| 0 | Enter password | Gray | 0% |
| 1 | Very Weak | Red | 20% |
| 2 | Weak | Orange | 40% |
| 3 | Fair | Yellow | 60% |
| 4 | Good | Blue | 80% |
| 5 | Strong | Green | 100% |

## Return Type

```typescript
interface PasswordStrength {
  score: number;           // 0-5
  label: string;           // "Weak", "Strong", etc.
  color: string;           // Tailwind class (bg-red-500, etc.)
  percentage: number;      // 0-100 for progress bar
  feedback: string[];      // Missing requirements
}
```

## Feedback Array

The `feedback` array contains messages for **missing** requirements:

```typescript
const strength = calculatePasswordStrength("password");

console.log(strength.feedback);
// [
//   "One uppercase letter",
//   "One number",
//   "One special character (!@#$%^&*)"
// ]
```

When all requirements are met:
```typescript
const strength = calculatePasswordStrength("MySecure123!");

console.log(strength.feedback);
// []  (empty array)
console.log(strength.score);
// 5
```

## Examples

### Very Weak (1/5)
```typescript
calculatePasswordStrength("pass")
// Score: 1 (only lowercase)
// Feedback: ["At least 8 characters", "One uppercase letter", "One number", "One special character"]
```

### Weak (2/5)
```typescript
calculatePasswordStrength("password")
// Score: 2 (lowercase + length)
// Feedback: ["One uppercase letter", "One number", "One special character"]
```

### Fair (3/5)
```typescript
calculatePasswordStrength("Password")
// Score: 3 (lowercase + length + uppercase)
// Feedback: ["One number", "One special character"]
```

### Good (4/5)
```typescript
calculatePasswordStrength("Password1")
// Score: 4 (lowercase + length + uppercase + number)
// Feedback: ["One special character (!@#$%^&*)"]
```

### Strong (5/5)
```typescript
calculatePasswordStrength("Password1!")
// Score: 5 (all criteria met)
// Feedback: []
```

## Integration with Zod

This calculator is **separate** from Zod validation. Zod enforces minimum requirements, while this provides **real-time visual feedback**.

**Zod schema** (src/lib/validation/auth.schema.ts):
```typescript
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");
```

**Strength calculator**:
- Shows progress as user types
- Suggests adding special characters (not required by Zod)
- Provides visual feedback before submit

## Color Classes

The returned color classes are Tailwind utility classes:

- `bg-gray-300` - Empty/no password
- `bg-red-500` - Very weak
- `bg-orange-500` - Weak
- `bg-yellow-500` - Fair
- `bg-blue-500` - Good
- `bg-green-500` - Strong

Use with Tailwind's dynamic classes or ensure they're included in your config.

## Real-time Usage

```typescript
import { useState } from 'react';

function PasswordInput() {
  const [password, setPassword] = useState('');
  const strength = calculatePasswordStrength(password);

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="progress-bar">
        <div
          className={strength.color}
          style={{ width: `${strength.percentage}%` }}
        />
      </div>
      <p>{strength.label}</p>
      {strength.feedback.map(item => <p key={item}>{item}</p>)}
    </div>
  );
}
```

## Performance

- **O(n) complexity** where n = password length
- Runs 5 regex tests (constant time for practical passwords)
- Safe to run on every keystroke
- No async operations or network calls
