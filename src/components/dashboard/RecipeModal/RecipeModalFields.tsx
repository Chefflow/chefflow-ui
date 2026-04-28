"use client";

import { useTranslations } from "next-intl";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { RecipeFormValues } from "@/lib/validations/recipe.schema";

interface RecipeModalFieldsProps {
  register: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
}

export const RecipeModalFields = ({
  register,
  errors,
}: RecipeModalFieldsProps) => {
  const t = useTranslations("dashboard.recipeModal");

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">
          {t("titleLabel")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t("titlePlaceholder")}
          className={cn(errors.title && "border-destructive")}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-xs mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="servings">
            {t("servings")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="servings"
            type="number"
            min={1}
            {...register("servings", { valueAsNumber: true })}
          />
          {errors.servings && (
            <p className="text-destructive text-xs mt-1">
              {errors.servings.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="prepTime">{t("prepTime")}</Label>
          <Input
            id="prepTime"
            type="number"
            min={1}
            {...register("prepTime", { valueAsNumber: true })}
          />
          {errors.prepTime && (
            <p className="text-destructive text-xs mt-1">
              {errors.prepTime.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          placeholder={t("descriptionPlaceholder")}
          className="resize-none min-h-[72px]"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
};
