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
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 pt-6">
          <button
            type="button"
            onClick={() => onTabChange("recipes")}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === "recipes"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("recipes")}
            {activeTab === "recipes" && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onTabChange("planning")}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === "planning"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("planning")}
            {activeTab === "planning" && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
