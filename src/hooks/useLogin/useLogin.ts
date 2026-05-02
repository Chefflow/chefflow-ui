import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/api/auth-client";
import type { ApiUser, AuthResponse, LoginRequest } from "@/lib/api/interface";
import { hashPassword } from "@/lib/crypto/hash-password.client";

interface UseLoginOptions {
  onSuccess?: (user: ApiUser) => void;
  onError?: (error: string) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (
      credentials: Omit<LoginRequest, "password"> & { password: string },
    ) => {
      const hashedPassword = await hashPassword(credentials.password);

      const response = await authClient.login({
        username: credentials.username,
        password: hashedPassword,
      });

      if (response.error) {
        throw new Error(response.error.message[0] || "Login failed");
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
          : "An unexpected error occurred during login";

      options?.onError?.(errorMessage);
    },
  });

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    isError: loginMutation.isError,
    error: loginMutation.error,
    data: loginMutation.data,
  };
}

export type UseLoginReturn = ReturnType<typeof useLogin>;
