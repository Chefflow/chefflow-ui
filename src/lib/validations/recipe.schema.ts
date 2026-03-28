import { z } from "zod";

const INGREDIENT_UNITS = [
  "GRAM",
  "KILOGRAM",
  "MILLILITER",
  "LITER",
  "TEASPOON",
  "TABLESPOON",
  "CUP",
  "UNIT",
  "PINCH",
  "TO_TASTE",
] as const;

export const ingredientSchema = z.object({
  ingredientName: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().min(0.01, "Quantity must be at least 0.01"),
  unit: z.enum(INGREDIENT_UNITS, {
    error: "Please select a valid unit",
  }),
});

export const stepSchema = z.object({
  instruction: z.string().min(5, "Instruction must be at least 5 characters"),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
});

export const recipeFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  servings: z
    .number()
    .min(1, "Servings must be at least 1")
    .max(100, "Servings must be at most 100"),
  prepTime: z.number().min(1, "Prep time must be at least 1 minute"),
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
export type IngredientFormValues = z.infer<typeof ingredientSchema>;
export type StepFormValues = z.infer<typeof stepSchema>;
