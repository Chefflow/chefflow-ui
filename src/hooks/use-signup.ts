import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/api/auth-client";
import type { ApiUser, AuthResponse, RegisterRequest } from "@/lib/api/interface";
import { hashPassword } from "@/lib/crypto/hash-password.client";

interface UseSignupOptions {
  onSuccess?: (user: ApiUser) => void;
  onError?: (error: string) => void;
}

interface SignupCredentials extends Omit<RegisterRequest, "password"> {
  password: string;
  acceptTerms: boolean;
}

export function useSignup(options?: UseSignupOptions) {
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      if (!credentials.acceptTerms) {
        throw new Error("You must accept the terms and conditions");
      }

      const hashedPassword = await hashPassword(credentials.password);

      const response = await authClient.register({
        username: credentials.username,
        email: credentials.email,
        password: hashedPassword,
        name: credentials.name,
      });

      if (response.error) {
        throw new Error(response.error.message[0] || "Signup failed");
      }

      if (!response.data) {
        throw new Error("No data received from server");
      }

      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      const user = data.user;

      queryClient.setQueryData(["auth", "profile"], { data: user });

      queryClient.invalidateQueries({ queryKey: ["auth"] });

      options?.onSuccess?.(user);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during signup";

      options?.onError?.(errorMessage);
    },
  });

  return {
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    isLoading: signupMutation.isPending,
    isSuccess: signupMutation.isSuccess,
    isError: signupMutation.isError,
    error: signupMutation.error,
    data: signupMutation.data,
  };
}

export type UseSignupReturn = ReturnType<typeof useSignup>;
