import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { authClient } from "@/lib/api/auth-client";
import { baseClient } from "@/lib/api/base-client";
import {
  type ApiError,
  type ApiResponse,
  type ApiUser,
  CACHE_CONFIG,
} from "@/lib/api/interface";

function isApiResponseWithError(obj: unknown): obj is { error: ApiError } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "error" in obj &&
    baseClient.isError(obj as ApiResponse<unknown>)
  );
}

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => authClient.getProfile(),
    staleTime: CACHE_CONFIG.PROFILE.staleTime,
    refetchOnWindowFocus: CACHE_CONFIG.PROFILE.refetchOnWindowFocus,
    retry: false,
  });

  const setUser = (userData: ApiUser | null) => {
    queryClient.setQueryData(
      ["auth", "profile"],
      userData ? { data: userData } : null,
    );
  };

  const clearUser = () => {
    setUser(null);
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  const isAuthenticated = Boolean(user && baseClient.isSuccess(user));

  const errorMessage =
    error && isApiResponseWithError(error)
      ? baseClient.getErrorMessage(error.error)
      : error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : null;

  return {
    user: user?.data || null,
    isLoading,
    isAuthenticated,
    error: errorMessage,
    setUser,
    clearUser,
    refetch,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
