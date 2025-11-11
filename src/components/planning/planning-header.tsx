import { ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanningHeaderProps {
  title: string;
  generateShoppingListLabel: string;
  analyzePlanningLabel: string;
  onGenerateShoppingList: () => void;
  onAnalyzePlanning: () => void;
}

export const PlanningHeader = ({
  title,
  generateShoppingListLabel,
  analyzePlanningLabel,
  onGenerateShoppingList,
  onAnalyzePlanning,
}: PlanningHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="font-serif text-3xl font-bold text-foreground">{title}</h1>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={onGenerateShoppingList}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          {generateShoppingListLabel}
        </Button>
        <Button onClick={onAnalyzePlanning} className="gap-2">
          <Sparkles className="h-4 w-4" />
          {analyzePlanningLabel}
        </Button>
      </div>
    </div>
  );
};
