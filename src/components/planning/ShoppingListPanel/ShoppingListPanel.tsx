"use client";

import { BaseSidePanel } from "@/components/BaseSidePanel/BaseSidePanel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { AggregatedIngredient } from "@/hooks/useShoppingList";
import type { IngredientUnit } from "@/lib/api/interface";

const UNIT_LABELS: Record<IngredientUnit, string> = {
  GRAM: "g",
  KILOGRAM: "kg",
  MILLILITER: "ml",
  LITER: "L",
  TEASPOON: "tsp",
  TABLESPOON: "tbsp",
  CUP: "cup",
  UNIT: "unit",
  PINCH: "pinch",
  TO_TASTE: "to taste",
};

interface ShoppingListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: AggregatedIngredient[];
  isLoading: boolean;
  title: string;
  subtitleText: string;
  emptyText: string;
  ingredientsCountText: string;
}

const SkeletonRows = () => (
  <div className="space-y-2">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Skeleton
        key={`shopping-skel-${i}`}
        className="h-10 w-full rounded-[var(--radius-sm)] bg-white/60"
      />
    ))}
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="flex items-center justify-center py-8">
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

const IngredientList = ({
  ingredients,
}: {
  ingredients: AggregatedIngredient[];
}) => (
  <div>
    {ingredients.map((ingredient) => (
      <div
        key={`${ingredient.ingredientName}::${ingredient.unit}`}
        className="mb-2 flex items-center gap-3 rounded-[var(--radius-sm)] border border-border bg-white px-3.5 py-2.5"
      >
        <span className="min-w-[80px] tabular-nums text-sm font-semibold text-primary">
          {ingredient.quantity} {UNIT_LABELS[ingredient.unit]}
        </span>
        <span className="h-1 w-1 shrink-0 rounded-full bg-border" />
        <span className="text-sm text-foreground">
          {ingredient.ingredientName}
        </span>
      </div>
    ))}
  </div>
);

export const ShoppingListPanel = ({
  isOpen,
  onClose,
  ingredients,
  isLoading,
  title,
  subtitleText,
  emptyText,
  ingredientsCountText,
}: ShoppingListPanelProps): React.ReactElement => {
  return (
    <BaseSidePanel isOpen={isOpen} onClose={onClose} label={title}>
      <p className="mb-5 text-sm text-muted-foreground">{subtitleText}</p>

      <Separator className="mb-5" />

      <div className="mb-3 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Ingredients
        </span>
        <span className="rounded-full bg-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {ingredientsCountText}
        </span>
      </div>

      {isLoading ? (
        <SkeletonRows />
      ) : ingredients.length === 0 ? (
        <EmptyState text={emptyText} />
      ) : (
        <IngredientList ingredients={ingredients} />
      )}
    </BaseSidePanel>
  );
};
