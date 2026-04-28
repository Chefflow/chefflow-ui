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

export interface RecipeSchemaMessages {
  titleRequired: string;
  titleMaxLength: string;
  descriptionMaxLength: string;
  servingsRequired: string;
  servingsMin: string;
  servingsMax: string;
  prepTimeRequired: string;
  prepTimeMin: string;
  ingredientsRequired: string;
  ingredientNameRequired: string;
  quantityMin: string;
  unitInvalid: string;
  stepsRequired: string;
  instructionMin: string;
  durationMin: string;
}

export const createRecipeFormSchema = (msg: RecipeSchemaMessages) => {
  const ingredientSchema = z.object({
    ingredientName: z.string().min(1, msg.ingredientNameRequired),
    quantity: z.number().min(0.01, msg.quantityMin),
    unit: z.enum(INGREDIENT_UNITS, { error: msg.unitInvalid }),
  });

  const stepSchema = z.object({
    instruction: z.string().min(5, msg.instructionMin),
    duration: z.number().min(1, msg.durationMin).optional(),
  });

  return z.object({
    title: z.string().min(1, msg.titleRequired).max(100, msg.titleMaxLength),
    description: z.string().max(2000, msg.descriptionMaxLength).optional(),
    servings: z
      .number({ error: msg.servingsRequired })
      .min(1, msg.servingsMin)
      .max(100, msg.servingsMax),
    prepTime: z
      .number({ error: msg.prepTimeRequired })
      .min(1, msg.prepTimeMin),
    ingredients: z.array(ingredientSchema).min(1, msg.ingredientsRequired),
    steps: z.array(stepSchema).min(1, msg.stepsRequired),
  });
};

export type RecipeFormValues = z.infer<ReturnType<typeof createRecipeFormSchema>>;
export type IngredientFormValues = RecipeFormValues["ingredients"][number];
export type StepFormValues = RecipeFormValues["steps"][number];
