import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanningHeaderProps {
  title: string;
  generateShoppingListLabel: string;
  onGenerateShoppingList: () => void;
  isShoppingListDisabled: boolean;
}

export const PlanningHeader = ({
  title,
  generateShoppingListLabel,
  onGenerateShoppingList,
  isShoppingListDisabled,
}: PlanningHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onGenerateShoppingList}
          size="sm"
          className="gap-2"
          disabled={isShoppingListDisabled}
        >
          <ShoppingCart className="h-4 w-4" />
          {generateShoppingListLabel}
        </Button>
        {/* 
        // TODO: Uncomment when analyze planning is implemented
        <Button onClick={onAnalyzePlanning} size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          {analyzePlanningLabel}
        </Button> */}
      </div>
    </div>
  );
};
