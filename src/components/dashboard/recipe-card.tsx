"use client";

import { ChefHat, Clock, Flame, Pencil, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Recipe } from "@/lib/api/interface";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

const difficultyConfig = {
  EASY: { label: "Easy", className: "bg-green-100 text-green-700" },
  MEDIUM: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
  HARD: { label: "Hard", className: "bg-red-100 text-red-700" },
};

export const RecipeCard = ({ recipe, onEdit, onDelete }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden shadow-[var(--shadow-card)] rounded-[var(--radius-md)] flex flex-col group">
      {/* Image area */}
      <div className="relative h-40 bg-secondary flex items-center justify-center overflow-hidden">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ChefHat className="w-12 h-12 text-primary opacity-40" />
        )}
        {recipe.difficulty && (
          <span
            className={cn(
              "absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full",
              difficultyConfig[recipe.difficulty].className,
            )}
          >
            {difficultyConfig[recipe.difficulty].label}
          </span>
        )}
      </div>

      <CardContent className="flex-1 px-4 pt-3 pb-2">
        <h3 className="font-serif text-base font-semibold text-foreground line-clamp-2 leading-snug">
          {recipe.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {recipe.servings}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {recipe.prepTime}m
          </span>
          {recipe.cookTime ? (
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {recipe.cookTime}m
            </span>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-3 pt-0 flex justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(recipe);
          }}
          aria-label="Edit recipe"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(recipe);
          }}
          aria-label="Delete recipe"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};
