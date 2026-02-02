import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function LocaleNotFound() {
  const t = useTranslations("common.notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold text-foreground">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
        <Button asChild size="lg">
          <Link href="/">{t("home")}</Link>
        </Button>
      </div>
    </div>
  );
}
