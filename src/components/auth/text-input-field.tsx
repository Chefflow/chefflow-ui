import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldError } from "./form-field-error";

interface TextInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string | null;
  onBlur?: () => void;
}

export const TextInputField = ({
  id,
  label,
  icon: Icon,
  error,
  className = "",
  ...inputProps
}: TextInputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          className={`pl-10 ${error ? "border-destructive" : ""} ${className}`}
          aria-invalid={!!error}
          {...inputProps}
        />
      </div>
      {error && <FormFieldError message={error} />}
    </div>
  );
};
