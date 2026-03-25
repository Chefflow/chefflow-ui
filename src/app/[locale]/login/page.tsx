"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInputField } from "@/components/auth/password-input-field";
import { TextInputField } from "@/components/auth/text-input-field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLogin } from "@/hooks/use-login";
import { usePasswordVisibility } from "@/hooks/use-password-visibility";
import { Link } from "@/i18n/routing";
import { getRedirectUrl } from "@/lib/auth/redirect";
import { type LoginInput, loginSchema } from "@/lib/validations/auth.schema";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordVisibility = usePasswordVisibility();

  const redirectTo = getRedirectUrl(searchParams);

  const { login, isLoading } = useLogin({
    onSuccess: (user) => {
      toast.success(t("successMessage", { name: user.name }));
      router.push(redirectTo);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });

  const handleSubmit = (data: LoginInput) => {
    login(data);
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
                  icon={Mail}
                  type="text"
                  placeholder={t("username")}
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
              name="password"
              control={form.control}
              render={({ field }) => (
                <PasswordInputField
                  id="password"
                  label={t("password")}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isLoading ? t("signingIn") : t("signIn")}
            </button>
          </form>

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
