"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { signupAction } from "@/app/actions/auth";
import { ErrorAlert } from "@/components/auth/error-alert";
import { PasswordInputField } from "@/components/auth/password-input-field";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { SubmitButton } from "@/components/auth/submit-button";
import { TermsCheckbox } from "@/components/auth/terms-checkbox";
import { TextInputField } from "@/components/auth/text-input-field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePasswordVisibility } from "@/hooks/use-password-visibility";
import { Link, useRouter } from "@/i18n/routing";
import { type SignupInput, signupSchema } from "@/lib/validation/auth.schema";
import { useAuthStore } from "@/store/auth-store";

export default function SignupPage() {
  const t = useTranslations("signup");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [state, formAction] = useActionState(signupAction, null);
  const [isPending, startTransition] = useTransition();

  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();

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

  useEffect(() => {
    if (state?.success && state.user) {
      setUser(state.user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    }
  }, [state, setUser, router]);

  useEffect(() => {
    if (state?.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([field, message]) => {
        form.setError(field as keyof SignupInput, { message });
      });
    }
  }, [state?.fieldErrors, form]);

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("acceptTerms", data.acceptTerms ? "on" : "");

    startTransition(() => {
      formAction(formData);
    });
  });

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
          {state?.error && <ErrorAlert config={state.error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <TextInputField
                  id="username"
                  label={t("username")}
                  icon={User}
                  type="text"
                  placeholder={t("usernamePlaceholder")}
                  error={form.formState.errors.username?.message}
                  disabled={isPending}
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
                  placeholder={t("namePlaceholder")}
                  error={form.formState.errors.name?.message}
                  disabled={isPending}
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
                  placeholder="you@example.com"
                  error={form.formState.errors.email?.message}
                  disabled={isPending}
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
                    placeholder="secret password"
                    error={form.formState.errors.password?.message}
                    showPassword={passwordVisibility.showPassword}
                    onToggleVisibility={passwordVisibility.toggleVisibility}
                    hint={t("passwordHint")}
                    disabled={isPending}
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
                  placeholder="confirm password"
                  error={form.formState.errors.confirmPassword?.message}
                  showPassword={confirmPasswordVisibility.showPassword}
                  onToggleVisibility={
                    confirmPasswordVisibility.toggleVisibility
                  }
                  disabled={isPending}
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
                <div className="space-y-2">
                  <TermsCheckbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  >
                    {t("acceptThe")}{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      {t("termsAndConditions")}
                    </Link>
                  </TermsCheckbox>
                  {form.formState.errors.acceptTerms && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.acceptTerms.message}
                    </p>
                  )}
                </div>
              )}
            />

            <SubmitButton className="w-full">{t("createAccount")}</SubmitButton>
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
