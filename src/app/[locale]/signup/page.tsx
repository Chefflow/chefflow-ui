"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { PasswordInputField } from "@/components/auth/password-input-field";
import { TextInputField } from "@/components/auth/text-input-field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePasswordVisibility } from "@/hooks/use-password-visibility";
import { Link } from "@/i18n/routing";
import { type SignupInput, signupSchema } from "@/lib/validations/auth.schema";

export default function SignupPage() {
  const t = useTranslations("signup");
  const passwordVisibility = usePasswordVisibility();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onTouched",
  });

  const handleSubmit = (data: SignupInput) => {
    console.log("Signup data:", data);
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <TextInputField
                  id="username"
                  label={t("username")}
                  icon={User}
                  type="text"
                  placeholder={t("usernamePlaceholder") || "username"}
                  error={form.formState.errors.username?.message}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <TextInputField
                  id="name"
                  label={t("name")}
                  icon={User}
                  type="text"
                  placeholder={t("namePlaceholder") || "John Doe"}
                  error={form.formState.errors.name?.message}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <TextInputField
                  id="email"
                  label={t("email")}
                  icon={Mail}
                  type="email"
                  placeholder={t("email")}
                  error={form.formState.errors.email?.message}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <PasswordInputField
                  id="password"
                  label={t("password")}
                  placeholder={t("passwordHint") || "••••••••"}
                  error={form.formState.errors.password?.message}
                  showPassword={passwordVisibility.showPassword}
                  onToggleVisibility={passwordVisibility.toggleVisibility}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <PasswordInputField
                  id="confirmPassword"
                  label={t("confirmPassword")}
                  placeholder={t("confirmPassword")}
                  error={form.formState.errors.confirmPassword?.message}
                  showPassword={passwordVisibility.showPassword}
                  onToggleVisibility={passwordVisibility.toggleVisibility}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {t("createAccount")}
            </button>
          </form>

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
