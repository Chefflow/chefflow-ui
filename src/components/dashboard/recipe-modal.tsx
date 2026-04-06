"use client";

import { Loader2, Trash2 } from "lucide-react";
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

const UNIT_LABELS: Record<string, string> = {
  GRAM: "Gram",
  KILOGRAM: "Kilogram",
  MILLILITER: "Milliliter",
  LITER: "Liter",
  TEASPOON: "Teaspoon",
  TABLESPOON: "Tablespoon",
  CUP: "Cup",
  UNIT: "Unit",
  PINCH: "Pinch",
  TO_TASTE: "To Taste",
};

const UNITS = Object.keys(UNIT_LABELS) as (keyof typeof UNIT_LABELS)[];

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
            {mode === "create" ? "Create Recipe" : "Edit Recipe"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Spaghetti Carbonara"
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
                  Servings <span className="text-destructive">*</span>
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
                  Prep Time (min) <span className="text-destructive">*</span>
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
              <Label htmlFor="cookTime">Cook Time (min)</Label>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of the recipe…"
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

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Ingredients</h3>
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
                + Add
              </Button>
            </div>

            <div className="space-y-2">
              {ingredientsField.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      placeholder="Ingredient name"
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
                      placeholder="Qty"
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
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {UNIT_LABELS[unit]}
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

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Steps</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  stepsField.append({ instruction: "", duration: undefined })
                }
              >
                + Add
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
                      placeholder="Describe this step…"
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
                      placeholder="Min"
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
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? "Saving…" : "Save Recipe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
