/**
 * Centralized API interfaces and types for ChefFlow
 * Based on API documentation and authentication specs
 */

export interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: ApiUser;
}

export interface UpdateProfileRequest {
  name?: string;
  image?: string;
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

export interface CsrfTokenResponse {
  csrfToken: string;
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export interface QueryConfig {
  staleTime: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number | boolean;
}

export type PlanningDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface PlanningSlot {
  id: number;
  weeklyPlanningId: number;
  dayOfWeek: PlanningDayOfWeek;
  slotNumber: 1 | 2 | 3;
  recipeId: number;
  recipe: Recipe | null;
}

export interface WeeklyPlanning {
  id: number;
  userId: number;
  weekStart: string;
  weekEnd: string;
  createdAt: string;
  updatedAt: string;
  slots?: PlanningSlot[];
}

export interface CreatePlanningRequest {
  weekStart: string;
}

export interface UpdatePlanningRequest {
  weekStart: string;
}

export interface AssignSlotRequest {
  recipeId: number;
}

export const CACHE_CONFIG = {
  PROFILE: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }, // 5 minutes
  RECIPES: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false }, // 10 minutes
  INGREDIENTS: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false }, // 10 minutes
  STEPS: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false }, // 10 minutes
  PLANNING: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }, // 5 minutes
} as const;
