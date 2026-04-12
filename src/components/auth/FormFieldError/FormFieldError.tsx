import { AlertCircle } from "lucide-react";

interface FormFieldErrorProps {
  message: string;
}

export const FormFieldError = ({ message }: FormFieldErrorProps) => {
  return (
    <div className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
};
