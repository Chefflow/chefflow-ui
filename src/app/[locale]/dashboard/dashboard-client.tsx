"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { RecipeModal } from "@/components/dashboard/recipe-modal";
import { RecipesTab } from "@/components/dashboard/recipes-tab";
import { TabNavigation } from "@/components/dashboard/tab-navigation";
import { useRecipeModal } from "@/hooks/use-recipe-modal";

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

  return (
    <div className="flex min-h-screen flex-col">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === "recipes" ? (
            <RecipesTab
              onOpenCreateModal={openCreateModal}
              onOpenEditModal={openEditModal}
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
    </div>
  );
}
