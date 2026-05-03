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
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormValues } from "@/lib/validations/recipe.schema";

interface RecipeModalStepsProps {
  fields: FieldArrayWithId<RecipeFormValues, "steps">[];
  register: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
  onAppend: () => void;
  onRemove: (index: number) => void;
}

export const RecipeModalSteps = ({
  fields,
  register,
  errors,
  onAppend,
  onRemove,
}: RecipeModalStepsProps) => {
  const t = useTranslations("dashboard.recipeModal");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {t("steps")} <span className="text-destructive">*</span>
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onAppend}>
          {t("add")}
        </Button>
      </div>
      {errors.steps?.root?.message && (
        <p className="text-destructive text-xs">{errors.steps.root.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold mt-2">
              {index + 1}
            </span>

            <div className="flex-1 space-y-1">
              <Textarea
                placeholder={t("stepPlaceholder")}
                className="resize-none min-h-[72px]"
                {...register(`steps.${index}.instruction`)}
              />
              {errors.steps?.[index]?.instruction && (
                <p className="text-destructive text-xs">
                  {errors.steps[index].instruction?.message}
                </p>
              )}
            </div>

            <div className="w-20">
              <Input
                type="number"
                min={1}
                placeholder={t("durationPlaceholder")}
                {...register(`steps.${index}.duration`, {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v),
                })}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-2 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">{t("removeStep")}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
