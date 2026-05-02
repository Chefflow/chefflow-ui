"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/dashboard/DeleteConfirmDialog/DeleteConfirmDialog";
import { RecipeModal } from "@/components/dashboard/RecipeModal/RecipeModal";
import { RecipesTab } from "@/components/dashboard/RecipesTab/RecipesTab";
import { TabNavigation } from "@/components/dashboard/TabNavigation/TabNavigation";
import { useRecipeModal } from "@/hooks/useRecipeModal/useRecipeModal";
import { useRecipeSidebar } from "@/hooks/useRecipeSidebar/useRecipeSidebar";
import { useDeleteRecipe } from "@/hooks/useRecipes/useRecipes";
import type { Recipe } from "@/lib/api/interface";

const RecipeDetailSidebar = dynamic(
  () =>
    import(
      "@/components/dashboard/RecipeDetailSidebar/RecipeDetailSidebar"
    ).then((m) => ({
      default: m.RecipeDetailSidebar,
    })),
  { ssr: false },
);

const PlanningTab = dynamic(
  () =>
    import("@/components/dashboard/PlanningTab/PlanningTab").then((m) => ({
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
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const {
    isOpen,
    mode,
    form,
    ingredientsField,
    stepsField,
    openCreateModal,
    openEditModal,
    closeModal,
    onSubmit,
    isPending,
  } = useRecipeModal();

  const deleteRecipe = useDeleteRecipe();
  const { selectedRecipeId, openSidebar, closeSidebar } = useRecipeSidebar();

  return (
    <div className="flex min-h-screen flex-col">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === "recipes" ? (
            <RecipesTab
              onOpenCreateModal={openCreateModal}
              onOpenEditModal={openEditModal}
              onDeleteRecipe={(recipe) => setRecipeToDelete(recipe)}
              onViewRecipe={(recipe) => openSidebar(recipe.id)}
            />
          ) : (
            <PlanningTab />
          )}
        </div>
      </div>

      <RecipeModal
        isOpen={isOpen}
        mode={mode}
        form={form}
        ingredientsField={ingredientsField}
        stepsField={stepsField}
        onSubmit={onSubmit}
        onClose={closeModal}
        isPending={isPending}
      />

      <DeleteConfirmDialog
        recipe={recipeToDelete}
        onConfirm={() => {
          if (recipeToDelete) {
            deleteRecipe.mutate(recipeToDelete.id, {
              onSuccess: () => setRecipeToDelete(null),
            });
          }
        }}
        onCancel={() => setRecipeToDelete(null)}
        isPending={deleteRecipe.isPending}
      />

      <RecipeDetailSidebar
        recipeId={selectedRecipeId}
        onClose={closeSidebar}
        onEdit={(recipe) => {
          closeSidebar();
          openEditModal(recipe);
        }}
        onDelete={(recipe) => {
          closeSidebar();
          setRecipeToDelete(recipe);
        }}
      />
    </div>
  );
}
