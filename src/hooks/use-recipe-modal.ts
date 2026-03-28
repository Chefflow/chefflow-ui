"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useCreateRecipe, useUpdateRecipe } from "@/hooks/use-recipes";
import type { Recipe } from "@/lib/api/interface";
import { recipeClient } from "@/lib/api/recipe-client";
import {
  type RecipeFormValues,
  recipeFormSchema,
} from "@/lib/validations/recipe.schema";

const DEFAULT_VALUES: RecipeFormValues = {
  title: "",
  servings: 2,
  prepTime: 15,
  ingredients: [{ ingredientName: "", quantity: 1, unit: "UNIT" }],
  steps: [{ instruction: "", duration: undefined }],
};

export const useRecipeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const ingredientsField = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const stepsField = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const openCreateModal = (): void => {
    form.reset(DEFAULT_VALUES);
    setEditingRecipe(null);
    setMode("create");
    setIsOpen(true);
  };

  const openEditModal = async (recipe: Recipe): Promise<void> => {
    // Reset with list data immediately so title/servings/prepTime are
    // pre-filled before the modal mounts — avoids RHF timing issues.
    form.reset({
      title: recipe.title,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      ingredients: [],
      steps: [],
    });
    setEditingRecipe(recipe);
    setMode("edit");
    setIsOpen(true);

    // Fetch full recipe to populate ingredients and steps asynchronously.
    const response = await recipeClient.getRecipe(recipe.id);
    if (response.data) {
      const full = response.data;
      setEditingRecipe(full);
      form.setValue(
        "ingredients",
        (full.ingredients ?? []).map((ing) => ({
          ingredientName: ing.ingredientName,
          quantity: ing.quantity,
          unit: ing.unit,
        })),
      );
      form.setValue(
        "steps",
        (full.steps ?? []).map((step) => ({
          instruction: step.instruction,
          duration: step.duration,
        })),
      );
    }
  };

  const closeModal = (): void => {
    setIsOpen(false);
    form.reset(DEFAULT_VALUES);
    setEditingRecipe(null);
  };

  const onSubmit = async (data: RecipeFormValues): Promise<void> => {
    if (mode === "edit" && editingRecipe) {
      updateRecipe.mutate(
        {
          id: editingRecipe.id,
          data: {
            title: data.title,
            servings: data.servings,
            prepTime: data.prepTime,
          },
        },
        {
          onSuccess: (response) => {
            if (!response.error) {
              closeModal();
            }
          },
        },
      );
    } else {
      createRecipe.mutate(
        {
          title: data.title,
          servings: data.servings,
          prepTime: data.prepTime,
          ingredients: data.ingredients,
          steps: data.steps,
        },
        {
          onSuccess: (response) => {
            if (!response.error) {
              closeModal();
            }
          },
        },
      );
    }
  };

  return {
    isOpen,
    mode,
    editingRecipe,
    form,
    ingredientsField,
    stepsField,
    openCreateModal,
    openEditModal,
    closeModal,
    onSubmit,
    isPending: createRecipe.isPending || updateRecipe.isPending,
  };
};

export type UseRecipeModalReturn = ReturnType<typeof useRecipeModal>;
