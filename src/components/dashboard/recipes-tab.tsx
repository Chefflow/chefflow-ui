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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t("myRecipes")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("myRecipesSubtitle")}
          </p>
        </div>
        <Button
          className="bg-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          onClick={onCreateRecipe}
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t("newRecipe")}
        </Button>
      </div>

      {!hasRecipes ? (
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/50 shadow-lg">
              <ChefHat className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">
              {t("empty.title")}
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              {t("empty.description")}
            </p>
            <Button
              className="bg-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              onClick={onCreateRecipe}
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
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
