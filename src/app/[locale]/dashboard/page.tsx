"use client";

import { useState } from "react";
import { PlanningTab } from "@/components/dashboard/planning-tab";
import { RecipeModal } from "@/components/dashboard/recipe-modal";
import { RecipesTab } from "@/components/dashboard/recipes-tab";
import { TabNavigation } from "@/components/dashboard/tab-navigation";
import { useRecipeModal } from "@/hooks/use-recipe-modal";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"recipes" | "planning">("recipes");
  const hasRecipes = false;

  const { isOpen, formData, updateField, openModal, handleCancel, handleSave } =
    useRecipeModal();

  return (
    <div className="flex min-h-screen flex-col">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === "recipes" ? (
            <RecipesTab hasRecipes={hasRecipes} onCreateRecipe={openModal} />
          ) : (
            <PlanningTab />
          )}
        </div>
      </div>

      <RecipeModal
        isOpen={isOpen}
        formData={formData}
        onUpdateField={updateField}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
