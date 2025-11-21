"use client";

import { Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Divider } from "@/components/auth/divider";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInputField } from "@/components/auth/password-input-field";
import { TermsCheckbox } from "@/components/auth/terms-checkbox";
import { TextInputField } from "@/components/auth/text-input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePasswordVisibility } from "@/hooks/use-password-visibility";
import { useSignupForm } from "@/hooks/use-signup-form";
import { Link } from "@/i18n/routing";
import { apiClient } from "@/lib/api/client";
import { hashPassword } from "@/lib/crypto/hash-password";

export default function SignupPage() {
  const t = useTranslations("signup");

  const { formData, updateField, markFieldAsTouched, errors, isFormValid } =
    useSignupForm({
      usernameNoSpaces: t("errors.usernameNoSpaces"),
      usernameMinLength: t("errors.usernameMinLength"),
      nameInvalid: t("errors.nameInvalid"),
      passwordMinLength: t("errors.passwordMinLength"),
      passwordUppercase: t("errors.passwordUppercase"),
      passwordLowercase: t("errors.passwordLowercase"),
      passwordNumber: t("errors.passwordNumber"),
      passwordMismatch: t("errors.passwordMismatch"),
    });

  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const hashedPassword = await hashPassword(formData.password);

      const response = await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: hashedPassword,
          name: formData.name,
        }),
      });

      console.log("Signup successful:", response);
      // TODO: Redirect to dashboard or login page
    } catch (error) {
      console.error("Signup error:", error);
      // TODO: Show error message to user
    }
  };

  const handleGoogleSignup = (): void => {
    // TODO: Implement Google OAuth
    console.log("Google signup");
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
              icon={User}
              type="text"
              placeholder={t("usernamePlaceholder")}
              value={formData.username}
              onChange={(e) => updateField("username", e.target.value)}
              onBlur={() => markFieldAsTouched("username")}
              error={errors.username}
              required
            />

            <TextInputField
              id="name"
              label={t("name")}
              icon={User}
              type="text"
              placeholder={t("namePlaceholder")}
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => markFieldAsTouched("name")}
              error={errors.name}
              required
            />

            <TextInputField
              id="email"
              label={t("email")}
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => markFieldAsTouched("email")}
              required
            />

            <PasswordInputField
              id="password"
              label={t("password")}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              onBlur={() => markFieldAsTouched("password")}
              showPassword={passwordVisibility.showPassword}
              onToggleVisibility={passwordVisibility.toggleVisibility}
              error={errors.password}
              hint={t("passwordHint")}
              required
            />

            <PasswordInputField
              id="confirmPassword"
              label={t("confirmPassword")}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              onBlur={() => markFieldAsTouched("confirmPassword")}
              showPassword={confirmPasswordVisibility.showPassword}
              onToggleVisibility={confirmPasswordVisibility.toggleVisibility}
              error={errors.confirmPassword}
              required
            />

            <TermsCheckbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => updateField("acceptTerms", checked)}
            >
              {t("acceptThe")}{" "}
              <Link
                href="/terms"
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                {t("termsAndConditions")}
              </Link>
            </TermsCheckbox>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isFormValid}
            >
              {t("createAccount")}
            </Button>
          </form>

          <Divider text={t("or")} />

          <GoogleButton onClick={handleGoogleSignup}>
            {t("continueWithGoogle")}
          </GoogleButton>

          <p className="text-center text-sm text-muted-foreground">
            {t("haveAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("signIn")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
