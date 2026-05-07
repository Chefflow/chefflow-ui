"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { RECIPE_KEYS, useCreateRecipe } from "@/hooks/useRecipes/useRecipes";
import type { Recipe } from "@/lib/api/interface";
import { recipeClient } from "@/lib/api/recipe-client";
import {
  createRecipeFormSchema,
  type RecipeFormValues,
} from "@/lib/validations/recipe.schema";

const DEFAULT_VALUES: RecipeFormValues = {
  title: "",
  description: undefined,
  servings: 2,
  prepTime: 15,
  ingredients: [{ ingredientName: "", quantity: 1, unit: "UNIT" }],
  steps: [],
};

export const useRecipeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [onCreatedCallback, setOnCreatedCallback] = useState<
    ((recipe: Recipe) => void) | null
  >(null);

  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const createRecipe = useCreateRecipe();

  const t = useTranslations("dashboard.recipeModal");
  const schema = useMemo(
    () =>
      createRecipeFormSchema({
        titleRequired: t("errors.titleRequired"),
        titleMaxLength: t("errors.titleMaxLength"),
        descriptionMaxLength: t("errors.descriptionMaxLength"),
        servingsRequired: t("errors.servingsRequired"),
        servingsMin: t("errors.servingsMin"),
        servingsMax: t("errors.servingsMax"),
        prepTimeRequired: t("errors.prepTimeRequired"),
        prepTimeMin: t("errors.prepTimeMin"),
        ingredientsRequired: t("errors.ingredientsRequired"),
        ingredientNameRequired: t("errors.ingredientNameRequired"),
        quantityMin: t("errors.quantityMin"),
        unitInvalid: t("errors.unitInvalid"),
        stepsRequired: t("errors.stepsRequired"),
        instructionMin: t("errors.instructionMin"),
        durationMin: t("errors.durationMin"),
      }),
    [t],
  );

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(schema),
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

  const openCreateModal = (onCreated?: (recipe: Recipe) => void): void => {
    form.reset(DEFAULT_VALUES);
    setEditingRecipe(null);
    setMode("create");
    setOnCreatedCallback(() => onCreated ?? null);
    setIsOpen(true);
  };

  const openEditModal = async (recipe: Recipe): Promise<void> => {
    // Reset with list data immediately so title/servings/prepTime are
    // pre-filled before the modal mounts — avoids RHF timing issues.
    form.reset({
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      ingredients: [],
      steps: [],
    });
    setEditingRecipe(recipe);
    setMode("edit");
    setIsOpen(true);

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
      form.setValue("description", full.description);
    }
  };

  const closeModal = (): void => {
    setIsOpen(false);
    form.reset(DEFAULT_VALUES);
    setEditingRecipe(null);
    setOnCreatedCallback(null);
  };

  const onSubmit = async (data: RecipeFormValues): Promise<void> => {
    if (mode === "edit" && editingRecipe) {
      setIsEditSubmitting(true);
      try {
        const updateRes = await recipeClient.updateRecipe(editingRecipe.id, {
          title: data.title,
          description: data.description,
          servings: data.servings,
          prepTime: data.prepTime,
        });
        if (updateRes.error) {
          toast.error(updateRes.error.message[0] ?? "Failed to update recipe");
          return;
        }

        await Promise.all(
          editingRecipe.ingredients.map((ing) =>
            recipeClient.deleteIngredient(editingRecipe.id, ing.id),
          ),
        );
        await Promise.all(
          data.ingredients.map((ing) =>
            recipeClient.addIngredient(editingRecipe.id, {
              ingredientName: ing.ingredientName,
              quantity: ing.quantity,
              unit: ing.unit,
            }),
          ),
        );

        await Promise.all(
          editingRecipe.steps.map((step) =>
            recipeClient.deleteStep(editingRecipe.id, step.id),
          ),
        );
        await Promise.all(
          data.steps.map((step) =>
            recipeClient.createStep(editingRecipe.id, {
              instruction: step.instruction,
              duration: step.duration,
            }),
          ),
        );

        queryClient.invalidateQueries({ queryKey: RECIPE_KEYS.all });
        queryClient.invalidateQueries({
          queryKey: RECIPE_KEYS.detail(editingRecipe.id),
        });
        toast.success("Recipe updated!");
        closeModal();
      } catch {
        toast.error("Failed to update recipe");
      } finally {
        setIsEditSubmitting(false);
      }
    } else {
      createRecipe.mutate(
        {
          title: data.title,
          description: data.description,
          servings: data.servings,
          prepTime: data.prepTime,
          ingredients: data.ingredients,
          steps: data.steps,
        },
        {
          onSuccess: (response) => {
            if (!response.error && response.data) {
              const created = response.data;
              onCreatedCallback?.(created);
              setOnCreatedCallback(null);
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
    isPending: createRecipe.isPending || isEditSubmitting,
  };
};

export type UseRecipeModalReturn = ReturnType<typeof useRecipeModal>;
