import { getTranslations } from "next-intl/server";

export default async function LocaleLoading({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="mt-4 text-lg font-medium text-foreground">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}
