export type AuthErrorCode =
  | "USERNAME_TAKEN"
  | "EMAIL_EXISTS"
  | "INVALID_CREDENTIALS"
  | "NETWORK_ERROR"
  | "RATE_LIMIT"
  | "SERVER_ERROR"
  | "VALIDATION_ERROR";

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  suggestions?: string[];
  retryAfter?: number;
  helpUrl?: string;
}

export interface ErrorAction {
  label: string;
  href?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export interface ErrorDisplayConfig {
  title: string;
  description: string;
  variant: "destructive" | "default";
  iconName: string;
  suggestions?: string[];
  actions?: ErrorAction[];
  countdown?: number;
}
