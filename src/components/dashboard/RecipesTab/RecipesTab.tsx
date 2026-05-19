"use client";

import { ChefHat, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { RecipeCard } from "@/components/dashboard/RecipeCard/RecipeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipes } from "@/hooks/useRecipes/useRecipes";
import type { Recipe } from "@/lib/api/interface";

interface RecipesTabProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  onViewRecipe: (recipe: Recipe) => void;
}

const RecipeCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-card)]">
    <Skeleton className="h-40 w-full rounded-none" />
    <div className="flex-1 space-y-2 px-4 pb-2 pt-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex justify-end gap-1 px-4 pb-3 pt-0">
      <Skeleton className="h-7 w-7 rounded-md" />
      <Skeleton className="h-7 w-7 rounded-md" />
    </div>
  </div>
);

export const RecipesTab = ({
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteRecipe,
  onViewRecipe,
}: RecipesTabProps) => {
  const t = useTranslations("dashboard");
  const { recipes, isLoading, error, refetch } = useRecipes();

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("myRecipes")}
            {recipes.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium text-muted-foreground">
                {recipes.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("myRecipesSubtitle")}
          </p>
        </div>
        <Button onClick={() => onOpenCreateModal()} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("newRecipe")}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((id) => (
            <RecipeCardSkeleton key={`skeleton-${id}`} />
          ))}
        </div>
      ) : error ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex max-w-md flex-col items-center text-center">
            <p className="mb-4 text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : t("errorLoadingRecipes")}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              {t("retry")}
            </Button>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ChefHat className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              {t("empty.title")}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {t("empty.description")}
            </p>
            <Button onClick={() => onOpenCreateModal()} size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("empty.createFirst")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={onOpenEditModal}
              onDelete={onDeleteRecipe}
              onView={onViewRecipe}
            />
          ))}
        </div>
      )}
    </>
  );
};
