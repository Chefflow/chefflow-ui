"use client";

import { Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SlotCardProps {
  slotNumber: number;
  slotLabel: string;
  recipes: Array<{ id: number; title: string }>;
  maxRecipes?: number;
  isPast: boolean;
  isLoading?: boolean;
  onAddRecipe: () => void;
  onRemoveRecipe: (recipeId: number) => void;
  onClearSlot: () => void;
  addRecipeLabel: string;
  addAnotherRecipeLabel: string;
  removeRecipeLabel: string;
  clearSlotLabel: string;
  slotFullLabel: string;
}

export const SlotCard = ({
  slotNumber,
  slotLabel,
  recipes,
  maxRecipes = 5,
  isPast,
  isLoading = false,
  onAddRecipe,
  onRemoveRecipe,
  onClearSlot,
  addRecipeLabel,
  addAnotherRecipeLabel,
  removeRecipeLabel,
  clearSlotLabel,
  slotFullLabel,
}: SlotCardProps) => {
  if (isLoading) {
    return (
      <div className="h-20 animate-pulse rounded-[var(--radius-md)] bg-muted" />
    );
  }

  if (isPast && recipes.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-20 w-full items-center justify-center rounded-[var(--radius-md)]",
          "border border-dashed border-border bg-background",
          "opacity-50 cursor-not-allowed",
        )}
      >
        <span className="text-xs text-muted-foreground">
          {slotLabel} {slotNumber}
        </span>
      </div>
    );
  }

  if (isPast && recipes.length > 0) {
    return (
      <div
        className={cn(
          "flex min-h-20 w-full flex-col gap-1.5 rounded-[var(--radius-md)]",
          "border border-border bg-secondary/50 px-3 py-2.5",
          "opacity-50 cursor-not-allowed",
        )}
      >
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {slotLabel} {slotNumber}
        </span>
        <div className="flex flex-col gap-1">
          {recipes.map((recipe) => (
            <Badge
              key={recipe.id}
              variant="secondary"
              className="max-w-full justify-start truncate px-2 py-1 text-xs font-medium"
            >
              <span className="truncate">{recipe.title}</span>
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <button
        type="button"
        onClick={onAddRecipe}
        aria-label={addRecipeLabel}
        className={cn(
          "group flex min-h-20 w-full items-center justify-center gap-2 rounded-[var(--radius-md)]",
          "border border-dashed border-border bg-background",
          "text-sm text-muted-foreground transition-all",
          "hover:border-primary hover:bg-secondary/50 hover:text-primary",
        )}
      >
        <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span>
          {slotLabel} {slotNumber}
        </span>
      </button>
    );
  }

  const isFull = recipes.length >= maxRecipes;

  return (
    <div
      className={cn(
        "group flex min-h-20 w-full flex-col rounded-[var(--radius-md)]",
        "border border-border bg-secondary/50 px-3 py-2.5",
        "transition-all hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {slotLabel} {slotNumber}
        </span>
        <button
          type="button"
          onClick={onClearSlot}
          aria-label={clearSlotLabel}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
            "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-1.5 flex flex-col gap-1">
        {recipes.map((recipe) => (
          <Badge
            key={recipe.id}
            variant="secondary"
            className={cn(
              "max-w-full justify-between gap-1 px-2 py-1 text-xs font-medium",
              "bg-background/70",
            )}
          >
            <span className="truncate">{recipe.title}</span>
            <button
              type="button"
              onClick={() => onRemoveRecipe(recipe.id)}
              aria-label={removeRecipeLabel}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              )}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {!isFull && (
        <button
          type="button"
          onClick={onAddRecipe}
          aria-label={addAnotherRecipeLabel}
          title={addAnotherRecipeLabel}
          className={cn(
            "mt-2 flex w-full items-center justify-center gap-1 rounded-[var(--radius-sm)]",
            "border border-dashed border-border bg-background/40 px-2 py-1",
            "text-[11px] text-muted-foreground transition-all",
            "hover:border-primary hover:bg-secondary/60 hover:text-primary",
          )}
        >
          <Plus className="h-3 w-3" />
          <span>{addAnotherRecipeLabel}</span>
        </button>
      )}

      {isFull && (
        <span className="sr-only" aria-live="polite">
          {slotFullLabel}
        </span>
      )}
    </div>
  );
};
