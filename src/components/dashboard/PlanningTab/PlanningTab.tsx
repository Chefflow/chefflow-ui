"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DayColumn } from "@/components/planning/DayColumn/DayColumn";
import { PlanningHeader } from "@/components/planning/PlanningHeader/PlanningHeader";
import { RecipePickerModal } from "@/components/planning/RecipePickerModal/RecipePickerModal";
import { ShoppingListPanel } from "@/components/planning/ShoppingListPanel/ShoppingListPanel";
import { SlotCard } from "@/components/planning/SlotCard/SlotCard";
import { WeekNavigation } from "@/components/planning/WeekNavigation/WeekNavigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth/useAuth";
import {
  PLANNING_KEYS,
  useAddRecipeToSlot,
  useCreatePlanning,
  useDeleteSlot,
  useRemoveRecipeFromSlot,
  useWeeklyPlanning,
  useWeeklyPlannings,
} from "@/hooks/usePlanning/usePlanning";
import { useRecipes } from "@/hooks/useRecipes/useRecipes";
import { useShoppingList } from "@/hooks/useShoppongList/useShoppingList";
import { useWeekPlanning } from "@/hooks/useWeekPlanning/useWeekPlanning";
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

const MAX_RECIPES_PER_SLOT = 5;

function getSlotsForDay(
  slots: PlanningSlot[],
  dayOfWeek: PlanningDayOfWeek,
  slotsPerDay: number,
): (PlanningSlot | null)[] {
  return Array.from({ length: slotsPerDay }, (_, i) => i + 1).map(
    (slotNumber) =>
      slots.find(
        (s) => s.dayOfWeek === dayOfWeek && s.slotNumber === slotNumber,
      ) ?? null,
  );
}

interface PlanningTabProps {
  onOpenCreateModal: (onCreated?: (recipe: Recipe) => void) => void;
}

export const PlanningTab = ({ onOpenCreateModal }: PlanningTabProps) => {
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

  const { user } = useAuth();
  const effectiveSlotsPerDay = planning?.slotsPerDay ?? user?.slotsPerDay ?? 3;
  const slotNumbers = Array.from(
    { length: effectiveSlotsPerDay },
    (_, i) => i + 1,
  );

  const { createPlanning } = useCreatePlanning();
  const { addRecipeToSlot } = useAddRecipeToSlot(currentPlanning?.id ?? 0);
  const { removeRecipeFromSlot } = useRemoveRecipeFromSlot(
    currentPlanning?.id ?? 0,
  );
  const { deleteSlot } = useDeleteSlot(currentPlanning?.id ?? 0);

  const [pendingSlot, setPendingSlot] = useState<{
    dayIndex: number;
    slotNumber: number;
    existingRecipeIds: number[];
  } | null>(null);
  const [slotToClear, setSlotToClear] = useState<{
    dayIndex: number;
    slotNumber: number;
    count: number;
  } | null>(null);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

  useEffect(() => {
    if (weekStartISO) {
      setPendingSlot(null);
      setSlotToClear(null);
    }
  }, [weekStartISO]);

  const slots = planning?.slots ?? [];
  const { ingredients: shoppingIngredients, isLoading: shoppingLoading } =
    useShoppingList(slots);

  const isDayPast = (dayIndex: number): boolean => {
    const dayDate = new Date(weekRange.start);
    dayDate.setDate(weekRange.start.getDate() + dayIndex);
    dayDate.setHours(23, 59, 59, 999);
    return dayDate < new Date();
  };

  const handleAddRecipe = (
    slot: { dayIndex: number; slotNumber: number },
    recipe: Recipe,
  ): void => {
    const { dayIndex, slotNumber } = slot;
    const day = DAY_OF_WEEK[dayIndex];

    if (currentPlanning) {
      addRecipeToSlot({ day, slot: slotNumber, recipeId: recipe.id });
    } else {
      createPlanning(
        { weekStart: weekStartISO },
        {
          onSuccess: async (response) => {
            if (response?.data) {
              await planningClient.addRecipeToSlot(
                response.data.id,
                day,
                slotNumber,
                { recipeId: recipe.id },
              );
              queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
            }
          },
        },
      );
    }
  };

  const handleRecipeSelect = (recipe: Recipe): void => {
    if (!pendingSlot) return;
    const slotSnapshot = pendingSlot;
    setPendingSlot(null);
    handleAddRecipe(slotSnapshot, recipe);
  };

  const handleCreateNewRecipe = (): void => {
    const slotSnapshot = pendingSlot;
    if (!slotSnapshot) return;
    setPendingSlot(null);
    onOpenCreateModal((createdRecipe) => {
      handleAddRecipe(slotSnapshot, createdRecipe);
    });
  };

  const handleConfirmClear = (): void => {
    if (!slotToClear || !currentPlanning) {
      setSlotToClear(null);
      return;
    }
    deleteSlot({
      day: DAY_OF_WEEK[slotToClear.dayIndex],
      slot: slotToClear.slotNumber,
    });
    setSlotToClear(null);
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
          slots.length === 0 || slots.every((s) => s.recipes.length === 0)
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
            {slotNumbers.map((slotNumber) => {
              const slot =
                getSlotsForDay(
                  planning?.slots ?? [],
                  DAY_OF_WEEK[dayIndex],
                  effectiveSlotsPerDay,
                ).find((s) => s?.slotNumber === slotNumber) ?? null;

              return (
                <SlotCard
                  key={slotNumber}
                  slotNumber={slotNumber}
                  slotLabel={t("slot")}
                  recipes={
                    slot?.recipes.map((r) => ({
                      id: r.id,
                      title: r.title,
                    })) ?? []
                  }
                  maxRecipes={MAX_RECIPES_PER_SLOT}
                  isPast={isDayPast(dayIndex)}
                  isLoading={planningLoading}
                  onAddRecipe={() => {
                    setPendingSlot({
                      dayIndex,
                      slotNumber,
                      existingRecipeIds: slot?.recipes.map((r) => r.id) ?? [],
                    });
                  }}
                  onRemoveRecipe={(recipeId) => {
                    if (slot && currentPlanning) {
                      removeRecipeFromSlot({
                        day: DAY_OF_WEEK[dayIndex],
                        slot: slotNumber,
                        recipeId,
                      });
                    }
                  }}
                  onClearSlot={() => {
                    if (!slot || !currentPlanning) return;
                    if (slot.recipes.length >= 2) {
                      setSlotToClear({
                        dayIndex,
                        slotNumber,
                        count: slot.recipes.length,
                      });
                    } else {
                      deleteSlot({
                        day: DAY_OF_WEEK[dayIndex],
                        slot: slotNumber,
                      });
                    }
                  }}
                  addRecipeLabel={t("addRecipe")}
                  addAnotherRecipeLabel={t("addAnotherRecipe")}
                  removeRecipeLabel={t("removeRecipe")}
                  clearSlotLabel={t("clearSlot")}
                  slotFullLabel={t("slotFull", { max: MAX_RECIPES_PER_SLOT })}
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
        onCreateNew={handleCreateNewRecipe}
        recipes={recipes}
        isLoading={recipesLoading}
        excludeRecipeIds={pendingSlot?.existingRecipeIds ?? []}
        title={t("selectRecipe")}
        searchPlaceholder={t("searchRecipes")}
        noRecipesText={t("noRecipes")}
        noResultsText={t("noResults")}
        noAvailableRecipesText={t("noAvailableRecipes")}
        createNewLabel={t("createNewRecipe")}
      />

      <AlertDialog
        open={slotToClear !== null}
        onOpenChange={(open) => {
          if (!open) setSlotToClear(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmClearSlotTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmClearSlotMessage", {
                count: slotToClear?.count ?? 0,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("confirmClearSlotCancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmClear}
            >
              {t("confirmClearSlotConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
