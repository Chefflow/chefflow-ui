"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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

interface RecipeModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  form: UseFormReturn<RecipeFormValues>;
  ingredientsField: UseFieldArrayReturn<RecipeFormValues, "ingredients">;
  stepsField: UseFieldArrayReturn<RecipeFormValues, "steps">;
  onSubmit: (data: RecipeFormValues) => Promise<void>;
  onClose: () => void;
  isPending: boolean;
}

export const RecipeModal = ({
  isOpen,
  mode,
  form,
  ingredientsField,
  stepsField,
  onSubmit,
  onClose,
  isPending,
}: RecipeModalProps) => {
  const t = useTranslations("dashboard.recipeModal");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const ingredientUnits = ingredientsField.fields.map((_, i) =>
    watch(`ingredients.${i}.unit`),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {mode === "create" ? t("createTitle") : t("editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <Label htmlFor="prepTime">
                  {t("prepTime")} <span className="text-destructive">*</span>
                </Label>
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
              <Label htmlFor="cookTime">{t("cookTime")}</Label>
              <Input
                id="cookTime"
                type="number"
                min={1}
                {...register("cookTime", { valueAsNumber: true })}
              />
              {errors.cookTime && (
                <p className="text-destructive text-xs mt-1">
                  {errors.cookTime.message}
                </p>
              )}
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t("ingredients")}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  ingredientsField.append({
                    ingredientName: "",
                    quantity: 1,
                    unit: "UNIT",
                  })
                }
              >
                {t("add")}
              </Button>
            </div>

            <div className="space-y-2">
              {ingredientsField.fields.map((field, index) => (
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
                      onValueChange={(val) =>
                        setValue(
                          `ingredients.${index}.unit`,
                          val as RecipeFormValues["ingredients"][number]["unit"],
                          { shouldValidate: true },
                        )
                      }
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

                  {ingredientsField.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => ingredientsField.remove(index)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remove ingredient</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t("steps")}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  stepsField.append({ instruction: "", duration: undefined })
                }
              >
                {t("add")}
              </Button>
            </div>

            <div className="space-y-3">
              {stepsField.fields.map((field, index) => (
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
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {stepsField.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-2 text-muted-foreground hover:text-destructive"
                      onClick={() => stepsField.remove(index)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remove step</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
