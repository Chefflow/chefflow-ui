import { useMemo, useState } from "react";

export interface LoginFormData {
  username: string;
  password: string;
}

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const isFormValid = useMemo(() => {
    return formData.username.trim() !== "" && formData.password !== "";
  }, [formData.username, formData.password]);

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
