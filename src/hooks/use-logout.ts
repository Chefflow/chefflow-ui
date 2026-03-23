import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/api/auth-client";
import { useAuthStore } from "@/store/auth-store";

interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useLogout(options?: UseLogoutOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await authClient.logout();

      if (response.error) {
        throw new Error(response.error.message[0] || "Logout failed");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.clear();

      clearUser();

      router.push("/auth/login");

      options?.onSuccess?.();
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during logout";

      queryClient.clear();
      clearUser();
      router.push("/auth/login");

      options?.onError?.(errorMessage);
    },
  });

  return {
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoading: logoutMutation.isPending,
    isSuccess: logoutMutation.isSuccess,
    isError: logoutMutation.isError,
    error: logoutMutation.error,
  };
}

export type UseLogoutReturn = ReturnType<typeof useLogout>;
