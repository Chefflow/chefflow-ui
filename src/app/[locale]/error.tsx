"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common.error");

  useEffect(() => {
    console.error("Locale error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
        <Button onClick={reset} size="lg">
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}
