import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormData } from "@/hooks/use-recipe-modal";

interface RecipeModalProps {
  isOpen: boolean;
  formData: RecipeFormData;
  onUpdateField: <K extends keyof RecipeFormData>(
    field: K,
    value: RecipeFormData[K],
  ) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const RecipeModal = ({
  isOpen,
  formData,
  onUpdateField,
  onCancel,
  onSave,
}: RecipeModalProps) => {
  const t = useTranslations("dashboard.modal");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipeName" className="text-sm font-medium">
              {t("recipeName")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recipeName"
              value={formData.recipeName}
              onChange={(e) => onUpdateField("recipeName", e.target.value)}
              placeholder={t("recipeNamePlaceholder")}
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings" className="text-sm font-medium">
                {t("servings")}
              </Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => onUpdateField("servings", e.target.value)}
                className="border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime" className="text-sm font-medium">
                {t("prepTime")}
              </Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={(e) => onUpdateField("prepTime", e.target.value)}
                className="border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime" className="text-sm font-medium">
                {t("cookTime")}
              </Label>
              <Input
                id="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={(e) => onUpdateField("cookTime", e.target.value)}
                className="border-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients" className="text-sm font-medium">
              {t("ingredients")}
            </Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => onUpdateField("ingredients", e.target.value)}
              placeholder={t("ingredientsPlaceholder")}
              className="min-h-[100px] border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-medium">
              {t("instructions")}
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => onUpdateField("instructions", e.target.value)}
              placeholder={t("instructionsPlaceholder")}
              className="min-h-[120px] border-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={onSave}>
              {t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
