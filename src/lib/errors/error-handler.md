# Error Handler

Centralized error handling for auth flows.

## API

```typescript
import { handleError, generateUsernameSuggestions } from "@/lib/errors/error-handler";
```

### `handleError(error: unknown): ErrorDisplayConfig`

Converts any error into a UI-friendly configuration.

**Returns:** Config object for `<ErrorAlert />` component.

### `generateUsernameSuggestions(username: string): string[]`

Generates alternative username suggestions.

**Returns:** Array of 3 suggested usernames.

## Usage

```tsx
import { handleError } from "@/lib/errors/error-handler";
import { ErrorAlert } from "@/components/auth/error-alert";

function SignupForm() {
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      await fetch("/api/auth/signup", { method: "POST", body: formData });
    } catch (err) {
      setError(handleError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorAlert config={error} />}
    </form>
  );
}
```

## Error Codes

| Code | UI Features | Backend Response |
|------|-------------|------------------|
| `USERNAME_TAKEN` | Shows suggestions (clickable) | `{ code, message, field, suggestions }` |
| `EMAIL_EXISTS` | Login/Reset buttons | `{ code, message }` |
| `INVALID_CREDENTIALS` | Forgot password link | `{ code, message }` |
| `NETWORK_ERROR` | Retry button | Auto-detected |
| `RATE_LIMIT` | Countdown timer | `{ code, message, retryAfter }` |
| `SERVER_ERROR` | Support link | `{ code, message }` |
| `VALIDATION_ERROR` | Shows message | `{ code, message }` |

## Backend Contract

```typescript
interface BackendErrorResponse {
  code: "USERNAME_TAKEN" | "EMAIL_EXISTS" | "INVALID_CREDENTIALS" | "RATE_LIMIT" | "SERVER_ERROR" | "VALIDATION_ERROR";
  message: string;
  field?: string;
  suggestions?: string[];
  retryAfter?: number;
}
```

**Example:**
```json
{
  "code": "USERNAME_TAKEN",
  "message": "Username already taken",
  "field": "chef123",
  "suggestions": ["chef123_pro", "chef_123", "chef-flow-123"]
}
```

## Testing

View all states: `/en/test-errors`
