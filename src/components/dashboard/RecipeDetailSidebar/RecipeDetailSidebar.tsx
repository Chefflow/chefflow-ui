"use client";

import { Clock, Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipe } from "@/hooks/useRecipes";
import type { Recipe, RecipeIngredient, RecipeStep } from "@/lib/api/interface";
import { cn } from "@/lib/utils";

interface RecipeDetailSidebarProps {
  recipeId: string | null;
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
  const totalTime = recipe.prepTime + (recipe.cookTime ?? 0);
  const sortedIngredients = [...(recipe.ingredients ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const sortedSteps = [...(recipe.steps ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h2 className="mb-2 font-serif text-[1.875rem] font-semibold leading-tight tracking-tight text-foreground">
          {recipe.title}
        </h2>
        {recipe.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        )}

        {/* Stat pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-subtle)]">
            <Users className="h-3.5 w-3.5 text-primary" />
            {recipe.servings} servings
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-subtle)]">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {totalTime} min total
          </span>
          {recipe.cookTime ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-subtle)]">
              <Flame className="h-3.5 w-3.5 text-primary" />
              Cook {recipe.cookTime}m
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(recipe)}>
            Edit recipe
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(recipe)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Separator className="mb-5" />

      {/* Ingredients */}
      {sortedIngredients.length > 0 && (
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Ingredients
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

      {/* Steps */}
      {sortedSteps.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Steps
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
                    {step.duration} min
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
  const isOpen = recipeId !== null;
  const { recipe, isLoading } = useRecipe(recipeId ?? "");

  return (
    <>
      {/* Backdrop — plain div, no body scroll lock */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Side panel — always in DOM, slides via CSS transform */}
      <aside
        aria-label="Recipe detail"
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col",
          "w-[90vw] max-w-[520px] min-w-[380px]",
          "bg-secondary border-l border-border",
          "shadow-[-12px_0_40px_oklch(20%_0.04_40_/_0.14)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Recipe Detail
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={onClose}
            aria-label="Close panel"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-5 pb-12">
            {isOpen && (isLoading || !recipe) ? (
              <SidebarSkeleton />
            ) : isOpen && recipe ? (
              <SidebarContent
                recipe={recipe}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ) : null}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};
