"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Divider } from "@/components/auth/divider";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInputField } from "@/components/auth/password-input-field";
import { TextInputField } from "@/components/auth/text-input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLoginForm } from "@/hooks/use-login-form";
import { usePasswordVisibility } from "@/hooks/use-password-visibility";
import { Link, useRouter } from "@/i18n/routing";
import api from "@/lib/api/axiosClient";
import { hashPassword } from "@/lib/crypto/hash-password";
import { useAuthStore, type User } from "@/store/auth-store";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const { formData, updateField, isFormValid } = useLoginForm();
  const passwordVisibility = usePasswordVisibility();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    try {
      const hashedPassword = await hashPassword(formData.password);
      const response = await api.post<{ user: User }>("/auth/login", {
        username: formData.username,
        password: hashedPassword,
      });

      setUser(response.data.user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        const message =
          axiosError.response?.data?.message ||
          "Login failed. Please try again.";
        toast.error(message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (): void => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-md border-border bg-background shadow-sm">
        <CardHeader className="space-y-1 pb-6 pt-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </CardHeader>

        <CardContent className="space-y-5 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInputField
              id="username"
              label={t("username")}
              icon={Mail}
              type="username"
              placeholder="username"
              value={formData.username}
              onChange={(e) => updateField("username", e.target.value)}
              required
            />

            <PasswordInputField
              id="password"
              label={t("password")}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              showPassword={passwordVisibility.showPassword}
              onToggleVisibility={passwordVisibility.toggleVisibility}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : t("signIn")}
            </Button>
          </form>

          <Divider text={t("or")} />

          <GoogleButton onClick={handleGoogleLogin}>
            {t("continueWithGoogle")}
          </GoogleButton>

          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/signup"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("signUp")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
