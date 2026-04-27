"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { DayColumn } from "@/components/planning/DayColumn/DayColumn";
import { PlanningHeader } from "@/components/planning/PlanningHeader/PlanningHeader";
import { RecipePickerModal } from "@/components/planning/RecipePickerModal/RecipePickerModal";
import { ShoppingListPanel } from "@/components/planning/ShoppingListPanel/ShoppingListPanel";
import { SlotCard } from "@/components/planning/SlotCard/SlotCard";
import { WeekNavigation } from "@/components/planning/WeekNavigation/WeekNavigation";
import {
  PLANNING_KEYS,
  useAssignSlot,
  useCreatePlanning,
  useDeleteSlot,
  useWeeklyPlanning,
  useWeeklyPlannings,
} from "@/hooks/usePlanning";
import { useRecipes } from "@/hooks/useRecipes";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useWeekPlanning } from "@/hooks/useWeekPlanning";
import type {
  PlanningDayOfWeek,
  PlanningSlot,
  Recipe,
} from "@/lib/api/interface";
import { planningClient } from "@/lib/api/planning-client";

const DAY_OF_WEEK: PlanningDayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function getSlotsForDay(
  slots: PlanningSlot[],
  dayOfWeek: PlanningDayOfWeek,
): (PlanningSlot | null)[] {
  return [1, 2, 3].map(
    (slotNumber) =>
      slots.find(
        (s) => s.dayOfWeek === dayOfWeek && s.slotNumber === slotNumber,
      ) ?? null,
  );
}

export const PlanningTab = () => {
  const t = useTranslations("planning");
  const locale = useLocale();
  const queryClient = useQueryClient();

  const {
    weekDays,
    weekRangeText,
    weekRange,
    weekStartISO,
    goToPreviousWeek,
    goToNextWeek,
  } = useWeekPlanning({ locale });

  const { plannings } = useWeeklyPlannings();

  const currentPlanning = plannings.find((p) =>
    p.weekStart.startsWith(weekStartISO),
  );

  const { planning, isLoading: planningLoading } = useWeeklyPlanning(
    currentPlanning?.id,
  );

  const { recipes, isLoading: recipesLoading } = useRecipes();

  const { createPlanning } = useCreatePlanning();
  const { assignSlot } = useAssignSlot(currentPlanning?.id ?? 0);
  const { deleteSlot } = useDeleteSlot(currentPlanning?.id ?? 0);

  const [pendingSlot, setPendingSlot] = useState<{
    dayIndex: number;
    slotNumber: 1 | 2 | 3;
  } | null>(null);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

  const slots = planning?.slots ?? [];
  const { ingredients: shoppingIngredients, isLoading: shoppingLoading } =
    useShoppingList(slots);

  const isDayPast = (dayIndex: number): boolean => {
    const dayDate = new Date(weekRange.start);
    dayDate.setDate(weekRange.start.getDate() + dayIndex);
    dayDate.setHours(23, 59, 59, 999);
    return dayDate < new Date();
  };

  const handleRecipeSelect = (recipe: Recipe): void => {
    if (!pendingSlot) return;
    const { dayIndex, slotNumber } = pendingSlot;
    const day = DAY_OF_WEEK[dayIndex];
    setPendingSlot(null);

    if (currentPlanning) {
      assignSlot({ day, slot: slotNumber, recipeId: recipe.id });
    } else {
      createPlanning(
        { weekStart: weekStartISO },
        {
          onSuccess: async (response) => {
            if (response?.data) {
              await planningClient.assignSlot(
                response.data.id,
                day,
                slotNumber,
                {
                  recipeId: recipe.id,
                },
              );
              queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
            }
          },
        },
      );
    }
  };

  const handleGenerateShoppingList = (): void => {
    setIsShoppingListOpen(true);
  };

  return (
    <div className="space-y-8">
      <PlanningHeader
        title={t("title")}
        generateShoppingListLabel={t("generateShoppingList")}
        onGenerateShoppingList={handleGenerateShoppingList}
        isShoppingListDisabled={
          slots.length === 0 || slots.every((s) => s.recipe === null)
        }
      />

      <div className="flex items-center justify-center">
        <WeekNavigation
          weekRange={weekRangeText}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {weekDays.map((day, dayIndex) => (
          <DayColumn
            key={day.date}
            dayName={day.name}
            date={day.date}
            isPast={isDayPast(dayIndex)}
          >
            {([1, 2, 3] as const).map((slotNumber) => {
              const slot =
                getSlotsForDay(
                  planning?.slots ?? [],
                  DAY_OF_WEEK[dayIndex],
                ).find((s) => s?.slotNumber === slotNumber) ?? null;

              return (
                <SlotCard
                  key={slotNumber}
                  slotNumber={slotNumber}
                  slotLabel={t("slot")}
                  recipe={
                    slot?.recipe
                      ? { id: slot.recipe.id, title: slot.recipe.title }
                      : null
                  }
                  isPast={isDayPast(dayIndex)}
                  isLoading={planningLoading}
                  onAdd={() => {
                    setPendingSlot({ dayIndex, slotNumber });
                  }}
                  onRemove={() => {
                    if (slot && currentPlanning) {
                      deleteSlot({
                        day: DAY_OF_WEEK[dayIndex],
                        slot: slotNumber,
                      });
                    }
                  }}
                  changeLabel={t("changeRecipe")}
                  removeLabel={t("removeRecipe")}
                />
              );
            })}
          </DayColumn>
        ))}
      </div>

      <RecipePickerModal
        isOpen={pendingSlot !== null}
        onClose={() => setPendingSlot(null)}
        onSelect={handleRecipeSelect}
        recipes={recipes}
        isLoading={recipesLoading}
        title={t("selectRecipe")}
        searchPlaceholder={t("searchRecipes")}
        noRecipesText={t("noRecipes")}
        noResultsText={t("noResults")}
      />

      <ShoppingListPanel
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        ingredients={shoppingIngredients}
        isLoading={shoppingLoading}
        title={t("shoppingList.title")}
        subtitleText={t("shoppingList.subtitle", { weekRange: weekRangeText })}
        emptyText={t("shoppingList.empty")}
        ingredientsCountText={t("shoppingList.ingredientsCount", {
          count: shoppingIngredients.length,
        })}
      />
    </div>
  );
};
