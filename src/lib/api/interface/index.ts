/**
 * Centralized API interfaces and types for ChefFlow
 * Based on API documentation and authentication specs
 */


export interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}

export interface ApiResponse<T = any> {
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
  id: string;
  title: string;
  description?: string;
  servings: number;
  prepTime: number;
  cookTime?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  image?: string;
  authorId: string;
  author: ApiUser;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
  order: number;
}

export interface RecipeStep {
  id: string;
  recipeId: string;
  instruction: string;
  duration?: number;
  order: number;
}

export type IngredientUnit = 
  | 'GRAM'
  | 'KILOGRAM'
  | 'MILLILITER'
  | 'LITER'
  | 'TEASPOON'
  | 'TABLESPOON'
  | 'CUP'
  | 'UNIT'
  | 'PINCH'
  | 'TO_TASTE';

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  servings: number;
  prepTime: number;
  cookTime?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  image?: string;
  ingredients: Omit<RecipeIngredient, 'id' | 'recipeId'>[];
  steps: Omit<RecipeStep, 'id' | 'recipeId'>[];
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

export interface CsrfTokenResponse {
  csrfToken: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export interface QueryConfig {
  staleTime: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number | boolean;
}

export const CACHE_CONFIG = {
  PROFILE: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }, // 5 minutes
  RECIPES: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false }, // 10 minutes
  INGREDIENTS: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false }, // 10 minutes
  STEPS: { staleTime: 10 * 60 * 1000, refetchOnWindowFocus: false }, // 10 minutes
} as const;