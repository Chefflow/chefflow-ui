"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RecipeFormValues } from "@/lib/validations/recipe.schema";

const UNITS = [
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

interface RecipeModalIngredientsProps {
  fields: FieldArrayWithId<RecipeFormValues, "ingredients">[];
  register: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
  ingredientUnits: string[];
  onAppend: () => void;
  onRemove: (index: number) => void;
  onUnitChange: (index: number, value: string) => void;
}

export const RecipeModalIngredients = ({
  fields,
  register,
  errors,
  ingredientUnits,
  onAppend,
  onRemove,
  onUnitChange,
}: RecipeModalIngredientsProps) => {
  const t = useTranslations("dashboard.recipeModal");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {t("ingredients")} <span className="text-destructive">*</span>
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onAppend}>
          {t("add")}
        </Button>
      </div>
      {errors.ingredients?.root?.message && (
        <p className="text-destructive text-xs">
          {errors.ingredients.root.message}
        </p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
              <Input
                placeholder={t("ingredientNamePlaceholder")}
                {...register(`ingredients.${index}.ingredientName`)}
              />
              {errors.ingredients?.[index]?.ingredientName && (
                <p className="text-destructive text-xs">
                  {errors.ingredients[index].ingredientName?.message}
                </p>
              )}
            </div>

            <div className="w-20">
              <Input
                type="number"
                min={0.01}
                step={0.01}
                placeholder={t("quantityPlaceholder")}
                {...register(`ingredients.${index}.quantity`, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="w-32">
              <Select
                value={ingredientUnits[index] ?? "UNIT"}
                onValueChange={(val) => onUnitChange(index, val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("unitPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {t(`units.${unit}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Remove ingredient</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
