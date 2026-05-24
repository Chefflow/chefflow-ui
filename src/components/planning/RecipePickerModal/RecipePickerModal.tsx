"use client";

import { Clock, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Recipe } from "@/lib/api/interface";
import { cn } from "@/lib/utils";

interface RecipePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
  onCreateNew: () => void;
  createNewLabel: string;
  title: string;
  searchPlaceholder: string;
  noRecipesText: string;
  noResultsText: string;
  noAvailableRecipesText: string;
  recipes: Recipe[];
  excludeRecipeIds: number[];
  isLoading: boolean;
}

const RecipeCardSkeleton = () => (
  <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border p-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <div className="mt-1 flex gap-3">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const RecipePickerModal = ({
  isOpen,
  onClose,
  onSelect,
  onCreateNew,
  createNewLabel,
  title,
  searchPlaceholder,
  noRecipesText,
  noResultsText,
  noAvailableRecipesText,
  recipes,
  excludeRecipeIds,
  isLoading,
}: RecipePickerModalProps) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const availableRecipes = recipes.filter(
    (recipe) => !excludeRecipeIds.includes(recipe.id),
  );

  const filteredRecipes = availableRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (recipe: Recipe) => {
    onSelect(recipe);
    onClose();
  };

  const showNoRecipesAtAll = !isLoading && recipes.length === 0;
  const showNoAvailable =
    !isLoading && recipes.length > 0 && availableRecipes.length === 0;
  const showNoResults =
    !isLoading &&
    availableRecipes.length > 0 &&
    filteredRecipes.length === 0 &&
    search.length > 0;
  const showList = !isLoading && filteredRecipes.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="font-serif text-xl text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              autoFocus={false}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2 hover:border-primary hover:text-primary"
            onClick={onCreateNew}
          >
            <Plus className="size-4" />
            {createNewLabel}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isLoading && (
            <div className="flex flex-col gap-3">
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </div>
          )}

          {showNoRecipesAtAll && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <p className="text-sm text-muted-foreground">{noRecipesText}</p>
            </div>
          )}

          {showNoAvailable && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {noAvailableRecipesText}
              </p>
            </div>
          )}

          {showNoResults && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <p className="text-sm text-muted-foreground">{noResultsText}</p>
            </div>
          )}

          {showList && (
            <div className="flex flex-col gap-2">
              {filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => handleSelect(recipe)}
                  className={cn(
                    "group w-full rounded-[var(--radius-md)] border border-border bg-background p-4 text-left",
                    "transition-all duration-150",
                    "hover:border-primary/50 hover:bg-secondary/50",
                    "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                  )}
                >
                  <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {recipe.title}
                  </p>

                  {recipe.description && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {recipe.description}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {recipe.servings}
                    </span>
                    {recipe.prepTime > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {recipe.prepTime}m
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
