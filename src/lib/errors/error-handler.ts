import type {
  AuthError,
  AuthErrorCode,
  ErrorDisplayConfig,
} from "@/domain/auth/errors";

const configs: Record<AuthErrorCode, (error: AuthError) => ErrorDisplayConfig> =
  {
    USERNAME_TAKEN: (error) => ({
      title: "Username not available",
      description: error.field
        ? `"${error.field}" is already taken. Try one of these suggestions:`
        : "This username is already taken.",
      variant: "destructive",
      iconName: "UserX",
      suggestions: error.suggestions,
    }),

    EMAIL_EXISTS: (_error) => ({
      title: "Account already exists",
      description: "An account with this email already exists.",
      variant: "default",
      iconName: "Mail",
      actions: [
        { label: "Login instead", href: "/login", variant: "default" },
        {
          label: "Reset password",
          href: "/forgot-password",
          variant: "outline",
        },
      ],
    }),

    INVALID_CREDENTIALS: (_error) => ({
      title: "Incorrect username or password",
      description: "Double-check your credentials and try again.",
      variant: "destructive",
      iconName: "KeyRound",
      actions: [
        {
          label: "Forgot password?",
          href: "/forgot-password",
          variant: "outline",
        },
      ],
    }),

    NETWORK_ERROR: (_error) => ({
      title: "Connection problem",
      description:
        "Unable to reach our servers. Check your internet connection.",
      variant: "destructive",
      iconName: "WifiOff",
    }),

    RATE_LIMIT: (error) => ({
      title: "Too many attempts",
      description: "Please wait before trying again.",
      variant: "default",
      iconName: "Clock",
      countdown: error.retryAfter,
    }),

    SERVER_ERROR: (_error) => ({
      title: "Something went wrong on our end",
      description:
        "Our team has been notified. Please try again in a few minutes.",
      variant: "destructive",
      iconName: "ServerCrash",
      actions: [
        { label: "Contact support", href: "/support", variant: "outline" },
      ],
    }),

    VALIDATION_ERROR: (error) => ({
      title: "Please check your information",
      description: error.message,
      variant: "destructive",
      iconName: "AlertCircle",
    }),
  };

function parseError(error: unknown): AuthError {
  // Already an AuthError object
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  ) {
    return error as AuthError;
  }

  // Axios/fetch error with response
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          code?: string;
          message?: string;
          field?: string;
          suggestions?: string[];
          retryAfter?: number;
        };
      };
    };
    const data = axiosError.response?.data;

    return {
      code: (data?.code as AuthErrorCode) || "SERVER_ERROR",
      message: data?.message || "An error occurred",
      field: data?.field,
      suggestions: data?.suggestions,
      retryAfter: data?.retryAfter,
    };
  }

  // Network error
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      code: "NETWORK_ERROR",
      message: "Network connection failed",
    };
  }

  // Generic error
  return {
    code: "SERVER_ERROR",
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

export function handleError(error: unknown): ErrorDisplayConfig {
  const authError = parseError(error);
  const config = configs[authError.code];

  return config
    ? config(authError)
    : {
        title: "Error",
        description: authError.message || "Something went wrong",
        variant: "destructive",
        iconName: "AlertCircle",
      };
}

export function generateUsernameSuggestions(username: string): string[] {
  const base = username.toLowerCase().replace(/[^a-z0-9]/g, "");
  return [
    `${base}${Math.floor(Math.random() * 1000)}`,
    `${base}_chef`,
    `${base}-pro`,
  ];
}
