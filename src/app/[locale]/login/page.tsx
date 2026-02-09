"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "@/app/actions/auth";
import { ErrorAlert } from "@/components/auth/error-alert";
import { PasswordInputField } from "@/components/auth/password-input-field";
import { TextInputField } from "@/components/auth/text-input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePasswordVisibility } from "@/hooks/use-password-visibility";
import { Link, useRouter } from "@/i18n/routing";
import { type LoginInput, loginSchema } from "@/lib/validation/auth.schema";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [state, formAction] = useActionState(loginAction, null);
  const [isPending, startTransition] = useTransition();

  const passwordVisibility = usePasswordVisibility();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    console.log("[Client] State changed:", state);

    if (state?.success && state.user) {
      console.log("[Client] Login successful, redirecting...");
      setUser(state.user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    }

    if (state?.error) {
      console.log("[Client] Error received:", state.error);
    }
  }, [state, setUser, router]);

  useEffect(() => {
    if (state?.fieldErrors) {
      console.log("[Client] Field errors:", state.fieldErrors);
      Object.entries(state.fieldErrors).forEach(([field, message]) => {
        form.setError(field as keyof LoginInput, { message });
      });
    }
  }, [state?.fieldErrors, form]);

  const handleSubmit = form.handleSubmit((data) => {
    console.log("[Client] Form validation passed:", data);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    console.log("[Client] Calling formAction with FormData");
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
                  icon={Mail}
                  type="text"
                  placeholder="username"
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
              name="password"
              control={form.control}
              render={({ field }) => (
                <PasswordInputField
                  id="password"
                  label={t("password")}
                  placeholder="secret password"
                  error={form.formState.errors.password?.message}
                  showPassword={passwordVisibility.showPassword}
                  onToggleVisibility={passwordVisibility.toggleVisibility}
                  disabled={isPending}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : t("signIn")}
            </Button>
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
