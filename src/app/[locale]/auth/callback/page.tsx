"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import api from "@/lib/api/axiosClient";
import { useAuthStore, type User } from "@/store/auth-store";

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        // Fetch the user profile to verify authentication
        const response = await api.get<User>("/auth/profile");
        setUser(response.data);
        toast.success("Welcome!");
        router.push("/dashboard");
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        router.push("/login");
      }
    }

    handleOAuthCallback();
  }, [router, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-sm text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
