import { baseClient } from "./base-client";
import type {
  AddIngredientRequest,
  ApiResponse,
  CreateRecipeRequest,
  CreateStepRequest,
  Recipe,
  RecipeIngredient,
  RecipeStep,
  UpdateRecipeRequest,
} from "./interface";

class RecipeClient {
  async getRecipes(): Promise<ApiResponse<Recipe[]>> {
    return baseClient.get<Recipe[]>("/recipes");
  }

  async createRecipe(data: CreateRecipeRequest): Promise<ApiResponse<Recipe>> {
    return baseClient.post<Recipe>("/recipes", data);
  }

  async getRecipe(id: string): Promise<ApiResponse<Recipe>> {
    return baseClient.get<Recipe>(`/recipes/${id}`);
  }

  async addIngredient(
    recipeId: string,
    data: AddIngredientRequest,
  ): Promise<ApiResponse<RecipeIngredient>> {
    return baseClient.post<RecipeIngredient>(
      `/recipes/${recipeId}/ingredients`,
      data,
    );
  }

  async createStep(
    recipeId: string,
    data: CreateStepRequest,
  ): Promise<ApiResponse<RecipeStep>> {
    return baseClient.post<RecipeStep>(`/recipes/${recipeId}/steps`, data);
  }

  async updateRecipe(
    id: string,
    data: UpdateRecipeRequest,
  ): Promise<ApiResponse<Recipe>> {
    return baseClient.patch<Recipe>(`/recipes/${id}`, data);
  }

  async deleteRecipe(id: string): Promise<ApiResponse<void>> {
    return baseClient.delete<void>(`/recipes/${id}`);
  }

  async deleteIngredient(
    recipeId: string,
    ingredientId: string,
  ): Promise<ApiResponse<void>> {
    return baseClient.delete<void>(
      `/recipes/${recipeId}/ingredients/${ingredientId}`,
    );
  }

  async deleteStep(
    recipeId: string,
    stepId: string,
  ): Promise<ApiResponse<void>> {
    return baseClient.delete<void>(`/recipes/${recipeId}/steps/${stepId}`);
  }
}

export const recipeClient = new RecipeClient();
export default recipeClient;
