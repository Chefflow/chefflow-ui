import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
}

export const TermsCheckbox = ({
  id,
  checked,
  onCheckedChange,
  children,
}: TermsCheckboxProps) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
        required
      />
      <label
        htmlFor={id}
        className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        {children}
      </label>
    </div>
  );
};
