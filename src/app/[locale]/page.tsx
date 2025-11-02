import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/LanguageSelector";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="min-h-screen bg-background p-8">
      <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground">
          ChefFlow
        </h1>
        <LanguageSelector />
      </header>

      <main className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-primary mb-4">
          {t("title")}
        </h2>
      </main>
    </div>
  );
}
