"use client";

import { Clock, Flame, Pencil, Trash2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/lib/api/interface";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onView?: (recipe: Recipe) => void;
}

export const RecipeCard = ({
  recipe,
  onEdit,
  onDelete,
  onView,
}: RecipeCardProps) => {
  const t = useTranslations("dashboard.recipeCard");
  const totalTime = recipe.prepTime + (recipe.cookTime ?? 0);
  const ingredientCount = recipe.ingredients?.length ?? 0;
  const stepCount = recipe.steps?.length ?? 0;

  return (
    <article
      onClick={() => onView?.(recipe)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView?.(recipe);
        }
      }}
      tabIndex={onView ? 0 : -1}
      className={cn(
        "group relative flex flex-col gap-3",
        "bg-white rounded-[var(--radius-lg)]",
        "border border-border border-l-[3px] border-l-transparent",
        "p-5",
        "shadow-[var(--shadow-card)]",
        "transition-all duration-200 ease-out",
        onView && "cursor-pointer",
        "hover:-translate-y-0.5",
        "hover:shadow-[0_8px_24px_oklch(28%_0.05_40_/_0.11),_0_3px_8px_oklch(28%_0.05_40_/_0.07)]",
        "hover:border-l-primary",
      )}
    >
      <div className="space-y-1.5">
        <h3 className="font-serif text-[1.1rem] font-semibold text-foreground leading-snug tracking-tight">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {recipe.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary border border-border rounded-full px-2.5 py-0.5">
          <Users className="w-3 h-3 opacity-65" />
          {t("servings", { count: recipe.servings })}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary border border-border rounded-full px-2.5 py-0.5">
          <Clock className="w-3 h-3 opacity-65" />
          {t("totalTime", { count: totalTime })}
        </span>
        {recipe.cookTime ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary border border-border rounded-full px-2.5 py-0.5">
            <Flame className="w-3 h-3 opacity-65" />
            {t("cookTime", { count: recipe.cookTime })}
          </span>
        ) : null}
      </div>

      {(ingredientCount > 0 || stepCount > 0) && (
        <div className="flex gap-1.5">
          {ingredientCount > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
              {t("ingredients", { count: ingredientCount })}
            </span>
          )}
          {stepCount > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
              {t("steps", { count: stepCount })}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5">
        {onView ? (
          <span
            className={cn(
              "text-[11px] font-medium text-primary",
              "opacity-0 -translate-x-1",
              "group-hover:opacity-100 group-hover:translate-x-0",
              "transition-all duration-200",
            )}
          >
            {t("viewRecipe")}
          </span>
        ) : (
          <span />
        )}
        <fieldset
          className="flex gap-0.5 border-0 p-0 m-0"
          aria-label={t("recipeActions")}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
            aria-label={t("editRecipe")}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(recipe); }}
            aria-label={t("deleteRecipe")}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </fieldset>
      </div>
    </article>
  );
};
