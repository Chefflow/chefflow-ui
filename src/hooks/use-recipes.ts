"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateRecipeRequest } from "@/lib/api/interface";
import { recipeClient } from "@/lib/api/recipe-client";

export const RECIPE_KEYS = {
  all: ["recipes"] as const,
  detail: (id: string) => ["recipes", id] as const,
};

export const useRecipes = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: RECIPE_KEYS.all,
    queryFn: async () => {
      const response = await recipeClient.getRecipes();
      if (response.error) {
        throw new Error(response.error.message[0]);
      }
      return response.data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });

  return { recipes: data ?? [], isLoading, error, refetch };
};

export const useRecipe = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: RECIPE_KEYS.detail(id),
    queryFn: async () => {
      const response = await recipeClient.getRecipe(id);
      if (response.error) {
        throw new Error(response.error.message[0]);
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  return { recipe: data, isLoading, error };
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipeClient.createRecipe(data),
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error.message[0] ?? "Failed to create recipe");
        return;
      }
      queryClient.invalidateQueries({ queryKey: RECIPE_KEYS.all });
      toast.success("Recipe created!");
    },
    onError: () => {
      toast.error("Failed to create recipe");
    },
  });
};
