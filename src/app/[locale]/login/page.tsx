"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Divider } from "@/components/auth/divider";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInputField } from "@/components/auth/password-input-field";
import { TextInputField } from "@/components/auth/text-input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLoginForm } from "@/hooks/use-login-form";
import { usePasswordVisibility } from "@/hooks/use-password-visibility";
import { Link } from "@/i18n/routing";
import api from "@/lib/api/axiosClient";
import { hashPassword } from "@/lib/crypto/hash-password";

export default function LoginPage() {
  const t = useTranslations("login");

  const { formData, updateField, isFormValid } = useLoginForm();
  const passwordVisibility = usePasswordVisibility();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const hashedPassword = await hashPassword(formData.password);
      const response = await api.post("/auth/login", {
        username: formData.username,
        password: hashedPassword,
      });

      // Handle successful login
      console.log("Login successful:", response.data);
      // TODO: Redirect to dashboard or home page
    } catch (error) {
      console.error("Login failed:", error);
      // TODO: Show error message to user
    }
  };

  const handleGoogleLogin = (): void => {
    // TODO: Implement Google OAuth
    console.log("Google login");
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

            <Button type="submit" className="w-full" size="lg">
              {t("signIn")}
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
