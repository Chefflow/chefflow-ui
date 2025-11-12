import { ChefHat, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface RecipesTabProps {
  hasRecipes: boolean;
  onCreateRecipe: () => void;
}

export const RecipesTab = ({ hasRecipes, onCreateRecipe }: RecipesTabProps) => {
  const t = useTranslations("dashboard");

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("myRecipes")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("myRecipesSubtitle")}
          </p>
        </div>
        <Button onClick={onCreateRecipe} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          {t("newRecipe")}
        </Button>
      </div>

      {!hasRecipes ? (
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
            <Button onClick={onCreateRecipe} size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("empty.createFirst")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Recipe cards will go here */}
        </div>
      )}
    </>
  );
};
