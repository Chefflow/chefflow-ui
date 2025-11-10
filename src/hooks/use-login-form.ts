import { useMemo, useState } from "react";

export interface LoginFormData {
  email: string;
  password: string;
}

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const isFormValid = useMemo(() => {
    return formData.email.trim() !== "" && formData.password !== "";
  }, [formData.email, formData.password]);

  const updateField = <K extends keyof LoginFormData>(
    field: K,
    value: LoginFormData[K],
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
    isFormValid,
  };
}
