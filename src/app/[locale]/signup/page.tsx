"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInputField } from "@/components/auth/PasswordInputField/PasswordInputField";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter/PasswordStrengthMeter";
import { TermsCheckbox } from "@/components/auth/TermsCheckbox/TermsCheckbox";
import { TextInputField } from "@/components/auth/TextInputField/TextInputField";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import { useSignup } from "@/hooks/useSignup";
import { Link } from "@/i18n/routing";
import { getRedirectUrl } from "@/lib/auth/redirect";
import { type SignupInput, signupSchema } from "@/lib/validations/auth.schema";

export default function SignupPage() {
  const t = useTranslations("signup");
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordVisibility = usePasswordVisibility();

  const redirectTo = getRedirectUrl(searchParams);

  const { signup, isLoading } = useSignup({
    onSuccess: (user) => {
      toast.success(t("successMessage", { name: user.name }));
      router.push(redirectTo);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

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
    signup(data);
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
                <div className="space-y-2">
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
                  <PasswordStrengthMeter password={field.value} />
                </div>
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

            <Controller
              name="acceptTerms"
              control={form.control}
              render={({ field }) => (
                <TermsCheckbox
                  id="acceptTerms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                >
                  {t("acceptThe")}{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    {t("termsAndConditions")}
                  </Link>
                </TermsCheckbox>
              )}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isLoading ? t("creatingAccount") : t("createAccount")}
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
