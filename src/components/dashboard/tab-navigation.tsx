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
    <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => onTabChange("recipes")}
            className={`relative pb-4 pt-5 text-sm font-medium transition-all ${
              activeTab === "recipes"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("recipes")}
            {activeTab === "recipes" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onTabChange("planning")}
            className={`relative pb-4 pt-5 text-sm font-medium transition-all ${
              activeTab === "planning"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("planning")}
            {activeTab === "planning" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
