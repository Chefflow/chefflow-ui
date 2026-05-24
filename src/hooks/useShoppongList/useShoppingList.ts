"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { RECIPE_KEYS } from "@/hooks/useRecipes/useRecipes";
import type { IngredientUnit, PlanningSlot, Recipe } from "@/lib/api/interface";
import { recipeClient } from "@/lib/api/recipe-client";

export interface AggregatedIngredient {
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
}

export const useShoppingList = (
  slots: PlanningSlot[],
): { ingredients: AggregatedIngredient[]; isLoading: boolean } => {
  const uniqueRecipeIds = useMemo(
    () => [...new Set(slots.flatMap((s) => s.recipes.map((r) => r.id)))],
    [slots],
  );

  const recipeQueries = useQueries({
    queries: uniqueRecipeIds.map((id) => ({
      queryKey: RECIPE_KEYS.detail(id),
      queryFn: async (): Promise<Recipe | null> => {
        const response = await recipeClient.getRecipe(id);
        if (response.error) return null;
        return response.data ?? null;
      },
      staleTime: 10 * 60 * 1000,
    })),
  });

  const isLoading = recipeQueries.some((q) => q.isLoading);

  const ingredients = useMemo<AggregatedIngredient[]>(() => {
    if (isLoading) return [];

    const recipeById = new Map<number, Recipe | null>();
    uniqueRecipeIds.forEach((id, index) => {
      recipeById.set(id, recipeQueries[index]?.data ?? null);
    });

    const aggregation = new Map<string, AggregatedIngredient>();

    for (const slot of slots) {
      for (const slotRecipe of slot.recipes) {
        const recipe = recipeById.get(slotRecipe.id);
        if (!recipe) continue;

        for (const ingredient of recipe.ingredients) {
          const key = `${ingredient.ingredientName.toLowerCase().trim()}::${ingredient.unit}`;
          const existing = aggregation.get(key);
          if (existing) {
            existing.quantity += ingredient.quantity;
          } else {
            aggregation.set(key, {
              ingredientName: ingredient.ingredientName,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            });
          }
        }
      }
    }

    return [...aggregation.values()].sort((a, b) =>
      a.ingredientName.localeCompare(b.ingredientName),
    );
  }, [isLoading, slots, uniqueRecipeIds, recipeQueries]);

  return { ingredients, isLoading };
};
