"use client";

import { useTranslations } from "next-intl";
import { AddRecipeButton } from "@/components/planning/add-recipe-button";
import { DayColumn } from "@/components/planning/day-column";
import { PlanningHeader } from "@/components/planning/planning-header";
import { WeekNavigation } from "@/components/planning/week-navigation";
import { useWeekPlanning } from "@/hooks/use-week-planning";

export const PlanningTab = () => {
  const t = useTranslations("planning");

  // TODO: Get locale from next-intl
  const locale = "en-US";

  const { weekDays, weekRangeText, goToPreviousWeek, goToNextWeek } =
    useWeekPlanning({ locale });

  const handleAddRecipe = (day: string, slotIndex: number): void => {
    // TODO: Implement add recipe logic
    console.log("Add recipe to", day, "slot", slotIndex);
  };

  const handleGenerateShoppingList = (): void => {
    // TODO: Implement generate shopping list logic
    console.log("Generate shopping list");
  };

  const handleAnalyzePlanning = (): void => {
    // TODO: Implement analyze planning logic
    console.log("Analyze planning");
  };

  return (
    <div className="space-y-8">
      <PlanningHeader
        title={t("title")}
        generateShoppingListLabel={t("generateShoppingList")}
        analyzePlanningLabel={t("analyzePlanning")}
        onGenerateShoppingList={handleGenerateShoppingList}
        onAnalyzePlanning={handleAnalyzePlanning}
      />

      <div className="flex items-center justify-center">
        <WeekNavigation
          weekRange={weekRangeText}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {weekDays.map((day) => (
          <DayColumn key={day.date} dayName={day.name} date={day.date}>
            {[0, 1, 2].map((slotIndex) => (
              <AddRecipeButton
                key={slotIndex}
                onClick={() => handleAddRecipe(day.date, slotIndex)}
                label={t("addRecipe")}
              />
            ))}
          </DayColumn>
        ))}
      </div>
    </div>
  );
};
