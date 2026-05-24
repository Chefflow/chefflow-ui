import { useTranslations } from "next-intl";

type DashboardTab = "recipes" | "planning" | "settings";

interface TabNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const TABS: DashboardTab[] = ["recipes", "planning", "settings"];

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  const t = useTranslations("dashboard.tabs");
  const activeIndex = TABS.indexOf(activeTab);

  return (
    <div className="sticky top-16 z-40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="relative inline-grid grid-cols-3 rounded-full bg-secondary p-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-in-out"
              style={{
                width: "calc(33.3333% - 4px)",
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                aria-current={activeTab === tab ? "page" : undefined}
                className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeTab === tab
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
