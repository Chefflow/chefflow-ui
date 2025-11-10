import { useMemo, useState } from "react";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface TouchedFields {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

interface ValidationMessages {
  usernameNoSpaces: string;
  usernameMinLength: string;
  passwordMinLength: string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordNumber: string;
  passwordMismatch: string;
}

export function useSignupForm(messages: ValidationMessages) {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const usernameError = useMemo(() => {
    if (!touched.name || !formData.name) return null;
    if (/\s/.test(formData.name)) {
      return messages.usernameNoSpaces;
    }
    if (formData.name.length < 3) {
      return messages.usernameMinLength;
    }
    return null;
  }, [formData.name, touched.name, messages]);

  const passwordError = useMemo(() => {
    if (!touched.password || !formData.password) return null;
    if (formData.password.length < 8) {
      return messages.passwordMinLength;
    }
    if (!/[A-Z]/.test(formData.password)) {
      return messages.passwordUppercase;
    }
    if (!/[a-z]/.test(formData.password)) {
      return messages.passwordLowercase;
    }
    if (!/[0-9]/.test(formData.password)) {
      return messages.passwordNumber;
    }
    return null;
  }, [formData.password, touched.password, messages]);

  const confirmPasswordError = useMemo(() => {
    if (!touched.confirmPassword || !formData.confirmPassword) return null;
    if (formData.password !== formData.confirmPassword) {
      return messages.passwordMismatch;
    }
    return null;
  }, [
    formData.password,
    formData.confirmPassword,
    touched.confirmPassword,
    messages,
  ]);

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      !usernameError &&
      formData.email.trim() !== "" &&
      formData.password !== "" &&
      !passwordError &&
      formData.confirmPassword !== "" &&
      !confirmPasswordError &&
      formData.acceptTerms
    );
  }, [
    formData.name,
    formData.email,
    formData.password,
    formData.confirmPassword,
    formData.acceptTerms,
    usernameError,
    passwordError,
    confirmPasswordError,
  ]);

  const updateField = <K extends keyof SignupFormData>(
    field: K,
    value: SignupFormData[K],
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const markFieldAsTouched = (field: keyof TouchedFields): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return {
    formData,
    updateField,
    touched,
    markFieldAsTouched,
    errors: {
      username: usernameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    },
    isFormValid,
  };
}
