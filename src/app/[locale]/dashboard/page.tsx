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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto flex-1 px-6 py-8">
        {activeTab === "recipes" ? (
          <RecipesTab hasRecipes={hasRecipes} onCreateRecipe={openModal} />
        ) : (
          <PlanningTab />
        )}
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
