import { Eye, EyeOff, Lock } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldError } from "./form-field-error";

interface PasswordInputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  error?: string | null;
  hint?: ReactNode;
  onBlur?: () => void;
}

export const PasswordInputField = ({
  id,
  label,
  showPassword,
  onToggleVisibility,
  error,
  hint,
  className = "",
  ...inputProps
}: PasswordInputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`px-10 ${error ? "border-destructive" : ""} ${className}`}
          aria-invalid={!!error}
          {...inputProps}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {!error && hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <FormFieldError message={error} />}
    </div>
  );
};
