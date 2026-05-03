"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface WeekNavigationProps {
  weekRange: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export const WeekNavigation = ({
  weekRange,
  onPreviousWeek,
  onNextWeek,
}: WeekNavigationProps) => {
  const t = useTranslations("planning");

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousWeek}
        className="h-9 w-9 rounded-lg"
        aria-label={t("prevWeek")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="min-w-[150px] text-center">
        <span className="text-sm font-medium text-foreground">
          {t("shoppingList.subtitle", { weekRange })}
        </span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onNextWeek}
        className="h-9 w-9 rounded-lg"
        aria-label={t("nextWeek")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
