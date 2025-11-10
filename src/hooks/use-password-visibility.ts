import { useState } from "react";

export function usePasswordVisibility() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  return {
    showPassword,
    toggleVisibility,
  };
}
