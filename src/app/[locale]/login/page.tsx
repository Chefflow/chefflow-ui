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

export default function LoginPage() {
  const t = useTranslations("login");

  const { formData, updateField, isFormValid } = useLoginForm();
  const passwordVisibility = usePasswordVisibility();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isFormValid) return;

    // TODO: Implement login logic
    console.log("Login attempt:", formData);
  };

  const handleGoogleLogin = (): void => {
    // TODO: Implement Google OAuth
    console.log("Google login");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInputField
              id="email"
              label={t("email")}
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
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
              className="font-medium text-primary hover:underline"
            >
              {t("signUp")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
