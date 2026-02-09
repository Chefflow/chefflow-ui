"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { type User, useAuthStore } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const user: User = await response.json();
        setUser(user);
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
