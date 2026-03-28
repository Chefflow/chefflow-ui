"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useCreateRecipe } from "@/hooks/use-recipes";
import type { Recipe } from "@/lib/api/interface";
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

  const openEditModal = (recipe: Recipe): void => {
    form.reset({
      title: recipe.title,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      ingredients: recipe.ingredients.map((ing) => ({
        ingredientName: ing.ingredientName,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      steps: recipe.steps.map((step) => ({
        instruction: step.instruction,
        duration: step.duration,
      })),
    });
    setEditingRecipe(recipe);
    setMode("edit");
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
    form.reset(DEFAULT_VALUES);
    setEditingRecipe(null);
  };

  const onSubmit = async (data: RecipeFormValues): Promise<void> => {
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
    isPending: createRecipe.isPending,
  };
};

export type UseRecipeModalReturn = ReturnType<typeof useRecipeModal>;
