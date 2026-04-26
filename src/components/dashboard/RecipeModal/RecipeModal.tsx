"use client";

import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { RecipeFormValues } from "@/lib/validations/recipe.schema";
import { RecipeModalFields } from "./RecipeModalFields";
import { RecipeModalFooter } from "./RecipeModalFooter";
import { RecipeModalHeader } from "./RecipeModalHeader";
import { RecipeModalIngredients } from "./RecipeModalIngredients";
import { RecipeModalSteps } from "./RecipeModalSteps";

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
    control,
  } = form;

  const watchedIngredients = useWatch({ control, name: "ingredients", defaultValue: [] });
  const ingredientUnits = watchedIngredients.map((ing) => ing?.unit ?? "UNIT");

  const handleUnitChange = (index: number, value: string) => {
    setValue(
      `ingredients.${index}.unit`,
      value as RecipeFormValues["ingredients"][number]["unit"],
      { shouldValidate: true },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <RecipeModalHeader mode={mode} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <RecipeModalFields register={register} errors={errors} />

          <RecipeModalIngredients
            fields={ingredientsField.fields}
            register={register}
            errors={errors}
            ingredientUnits={ingredientUnits}
            onAppend={() =>
              ingredientsField.append({
                ingredientName: "",
                quantity: 1,
                unit: "UNIT",
              })
            }
            onRemove={(index) => ingredientsField.remove(index)}
            onUnitChange={handleUnitChange}
          />

          <RecipeModalSteps
            fields={stepsField.fields}
            register={register}
            errors={errors}
            onAppend={() =>
              stepsField.append({ instruction: "", duration: undefined })
            }
            onRemove={(index) => stepsField.remove(index)}
          />

          <RecipeModalFooter isPending={isPending} onClose={onClose} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
