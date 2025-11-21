import { useMemo, useState } from "react";

export interface SignupFormData {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface TouchedFields {
  username: boolean;
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

interface ValidationMessages {
  usernameNoSpaces: string;
  usernameMinLength: string;
  nameInvalid: string;
  passwordMinLength: string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordNumber: string;
  passwordMismatch: string;
}

export function useSignupForm(messages: ValidationMessages) {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [touched, setTouched] = useState<TouchedFields>({
    username: false,
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const usernameError = useMemo(() => {
    if (!touched.username || !formData.username) return null;
    if (/\s/.test(formData.username)) {
      return messages.usernameNoSpaces;
    }
    if (formData.username.length < 3) {
      return messages.usernameMinLength;
    }
    return null;
  }, [formData.username, touched.username, messages]);

  const nameError = useMemo(() => {
    if (!touched.name || !formData.name) return null;
    const nameRegex =
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+([\s'-][a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/;
    if (
      !nameRegex.test(formData.name.trim()) ||
      formData.name.trim().length < 2
    ) {
      return messages.nameInvalid;
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
      formData.username.trim() !== "" &&
      !usernameError &&
      formData.name.trim() !== "" &&
      !nameError &&
      formData.email.trim() !== "" &&
      formData.password !== "" &&
      !passwordError &&
      formData.confirmPassword !== "" &&
      !confirmPasswordError &&
      formData.acceptTerms
    );
  }, [
    formData.username,
    formData.name,
    formData.email,
    formData.password,
    formData.confirmPassword,
    formData.acceptTerms,
    usernameError,
    nameError,
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
      name: nameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    },
    isFormValid,
  };
}
