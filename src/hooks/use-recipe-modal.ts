import { useState } from "react";

export interface RecipeFormData {
  recipeName: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  ingredients: string;
  instructions: string;
}

export function useRecipeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<RecipeFormData>({
    recipeName: "",
    servings: "",
    prepTime: "",
    cookTime: "",
    ingredients: "",
    instructions: "",
  });

  const updateField = <K extends keyof RecipeFormData>(
    field: K,
    value: RecipeFormData[K],
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openModal = (): void => {
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const resetForm = (): void => {
    setFormData({
      recipeName: "",
      servings: "",
      prepTime: "",
      cookTime: "",
      ingredients: "",
      instructions: "",
    });
  };

  const handleCancel = (): void => {
    closeModal();
    resetForm();
  };

  const handleSave = (): void => {
    // TODO: Implement save logic
    console.log("Saving recipe:", formData);
    closeModal();
    resetForm();
  };

  return {
    isOpen,
    formData,
    updateField,
    openModal,
    closeModal,
    handleCancel,
    handleSave,
  };
}
