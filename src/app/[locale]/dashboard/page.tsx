"use client";

import { useEffect, useState } from "react";
import { PlanningTab } from "@/components/dashboard/planning-tab";
import { RecipeModal } from "@/components/dashboard/recipe-modal";
import { RecipesTab } from "@/components/dashboard/recipes-tab";
import { TabNavigation } from "@/components/dashboard/tab-navigation";
import { useRecipeModal } from "@/hooks/use-recipe-modal";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  console.log(user);
  const [activeTab, setActiveTab] = useState<"recipes" | "planning">("recipes");
  const hasRecipes = false;

  const { isOpen, formData, updateField, openModal, handleCancel, handleSave } =
    useRecipeModal();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

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
