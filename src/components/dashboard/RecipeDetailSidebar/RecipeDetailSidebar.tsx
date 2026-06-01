"use client";

import { Clock, Flame, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { BaseSidePanel } from "@/components/BaseSidePanel/BaseSidePanel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipe } from "@/hooks/useRecipes/useRecipes";
import type { Recipe, RecipeIngredient, RecipeStep } from "@/lib/api/interface";

interface RecipeDetailSidebarProps {
  recipeId: number | null;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

const SidebarSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-3/4 bg-white/60" />
      <Skeleton className="h-4 w-full bg-white/60" />
      <Skeleton className="h-4 w-2/3 bg-white/60" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-7 w-24 rounded-full bg-white/60" />
      <Skeleton className="h-7 w-24 rounded-full bg-white/60" />
      <Skeleton className="h-7 w-24 rounded-full bg-white/60" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-8 w-28 rounded-md bg-white/60" />
      <Skeleton className="h-8 w-20 rounded-md bg-white/60" />
    </div>
    <Skeleton className="h-px w-full bg-white/60" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 bg-white/60" />
      {[0, 1, 2, 3].map((i) => (
        <Skeleton
          key={`ing-skel-${i}`}
          className="h-10 w-full rounded-[var(--radius-sm)] bg-white/60"
        />
      ))}
    </div>
    <Skeleton className="h-px w-full bg-white/60" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-16 bg-white/60" />
      {[0, 1, 2].map((i) => (
        <div key={`step-skel-${i}`} className="flex gap-3">
          <Skeleton className="h-6 w-6 shrink-0 rounded-full bg-white/60" />
          <Skeleton className="h-12 flex-1 bg-white/60" />
        </div>
      ))}
    </div>
  </div>
);

interface SidebarContentProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

const SidebarContent = ({ recipe, onEdit, onDelete }: SidebarContentProps) => {
  const t = useTranslations("dashboard");
  const totalTime = recipe.prepTime + (recipe.cookTime ?? 0);
  const sortedIngredients = [...(recipe.ingredients ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const sortedSteps = [...(recipe.steps ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div>
      <div className="mb-5">
        <h2 className="mb-2 font-serif text-[1.875rem] font-semibold leading-tight tracking-tight text-foreground">
          {recipe.title}
        </h2>
        {recipe.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-subtle)]">
            <Users className="h-3.5 w-3.5 text-primary" />
            {t("recipeCard.servings", { count: recipe.servings })}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-subtle)]">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {t("recipeDetail.minTotal", { count: totalTime })}
          </span>
          {recipe.cookTime ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-subtle)]">
              <Flame className="h-3.5 w-3.5 text-primary" />
              {t("recipeCard.cookTime", { count: recipe.cookTime })}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hover:border-primary hover:text-primary"
            onClick={() => onEdit(recipe)}
          >
            {t("recipeCard.editRecipe")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(recipe)}
          >
            {t("recipeDetail.delete")}
          </Button>
        </div>
      </div>

      <Separator className="mb-5" />

      {sortedIngredients.length > 0 && (
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("recipeDetail.ingredients")}
            </span>
            <span className="rounded-full bg-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {sortedIngredients.length}
            </span>
          </div>
          {sortedIngredients.map((ingredient: RecipeIngredient) => (
            <div
              key={ingredient.id}
              className="mb-2 flex items-center gap-3 rounded-[var(--radius-sm)] border border-border bg-white px-3.5 py-2.5"
            >
              <span className="min-w-[72px] tabular-nums text-sm font-semibold text-primary">
                {ingredient.quantity} {ingredient.unit.toLowerCase()}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-border" />
              <span className="text-sm text-foreground">
                {ingredient.ingredientName}
              </span>
            </div>
          ))}
        </div>
      )}

      <Separator className="mb-5" />

      {sortedSteps.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t("recipeDetail.steps")}
            </span>
            <span className="rounded-full bg-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {sortedSteps.length}
            </span>
          </div>
          {sortedSteps.map((step: RecipeStep, i: number) => (
            <div key={step.id} className="mb-4 flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-sm">
                {i + 1}
              </span>
              <div className="flex-1 pt-0.5">
                <p className="text-sm leading-relaxed text-foreground">
                  {step.instruction}
                </p>
                {step.duration ? (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {t("recipeDetail.stepDurationMinutes", {
                      count: step.duration,
                    })}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RecipeDetailSidebar = ({
  recipeId,
  onClose,
  onEdit,
  onDelete,
}: RecipeDetailSidebarProps) => {
  const t = useTranslations("dashboard");
  const isOpen = recipeId !== null;
  const { recipe, isLoading } = useRecipe(recipeId ?? 0);

  return (
    <BaseSidePanel
      isOpen={isOpen}
      onClose={onClose}
      label={t("recipeDetail.label")}
    >
      {isOpen && (isLoading || !recipe) ? (
        <SidebarSkeleton />
      ) : isOpen && recipe ? (
        <SidebarContent recipe={recipe} onEdit={onEdit} onDelete={onDelete} />
      ) : null}
    </BaseSidePanel>
  );
};
