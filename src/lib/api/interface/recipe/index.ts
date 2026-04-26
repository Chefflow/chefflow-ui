import type { ApiUser } from "../auth";

export type IngredientUnit =
  | "GRAM"
  | "KILOGRAM"
  | "MILLILITER"
  | "LITER"
  | "TEASPOON"
  | "TABLESPOON"
  | "CUP"
  | "UNIT"
  | "PINCH"
  | "TO_TASTE";

export interface RecipeIngredient {
  id: number;
  recipeId: number;
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
  notes?: string;
  order: number;
}

export interface RecipeStep {
  id: number;
  recipeId: number;
  instruction: string;
  duration?: number;
  order: number;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  servings: number;
  prepTime: number;
  cookTime?: number;
  image?: string;
  authorId: string;
  author: ApiUser;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  servings: number;
  prepTime: number;
  cookTime?: number;
  ingredients: Omit<RecipeIngredient, "id" | "recipeId" | "order">[];
  steps: Omit<RecipeStep, "id" | "recipeId" | "order">[];
}

export interface AddIngredientRequest {
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
}

export interface CreateStepRequest {
  instruction: string;
  duration?: number;
}

export interface UpdateRecipeRequest {
  title?: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
}
