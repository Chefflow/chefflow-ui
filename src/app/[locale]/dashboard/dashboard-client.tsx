"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { RecipesTab } from "@/components/dashboard/recipes-tab";
import { TabNavigation } from "@/components/dashboard/tab-navigation";
import { useRecipeModal } from "@/hooks/use-recipe-modal";

// Lazy load heavy components with loading states
const RecipeModal = dynamic(
  () =>
    import("@/components/dashboard/recipe-modal").then((m) => ({
      default: m.RecipeModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="animate-pulse rounded-lg bg-background p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        </div>
      </div>
    ),
    ssr: false,
  },
);

const PlanningTab = dynamic(
  () =>
    import("@/components/dashboard/planning-tab").then((m) => ({
      default: m.PlanningTab,
    })),
  {
    loading: () => (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    ),
    ssr: false,
  },
);

interface DashboardClientProps {
  initialTab?: "recipes" | "planning";
}

export function DashboardClient({
  initialTab = "recipes",
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"recipes" | "planning">(
    initialTab,
  );
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
