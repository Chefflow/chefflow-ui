import { useTranslations } from "next-intl";

interface TabNavigationProps {
  activeTab: "recipes" | "planning";
  onTabChange: (tab: "recipes" | "planning") => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  const t = useTranslations("dashboard.tabs");

  return (
    <div className="sticky top-16 z-40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="relative inline-grid grid-cols-2 rounded-full bg-secondary p-1">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-1 bottom-1 rounded-full bg-primary shadow-sm transition-all duration-300 ease-in-out ${
                activeTab === "recipes"
                  ? "left-1 right-1/2"
                  : "left-1/2 right-1"
              }`}
            />
            <button
              type="button"
              onClick={() => onTabChange("recipes")}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                activeTab === "recipes"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("recipes")}
            </button>
            <button
              type="button"
              onClick={() => onTabChange("planning")}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                activeTab === "planning"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("planning")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
