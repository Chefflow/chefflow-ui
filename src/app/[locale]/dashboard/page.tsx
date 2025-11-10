"use client";

import { ChefHat, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [activeTab, setActiveTab] = useState<"recipes" | "planning">("recipes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [servings, setServings] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const hasRecipes = false;

  const handleSaveRecipe = () => {
    // TODO: Implement save logic
    console.log({
      recipeName,
      servings,
      prepTime,
      cookTime,
      ingredients,
      instructions,
    });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRecipeName("");
    setServings("");
    setPrepTime("");
    setCookTime("");
    setIngredients("");
    setInstructions("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="bg-background">
        <div className="container mx-auto px-6">
          <div className="flex gap-8 border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("recipes")}
              className={`pb-3 pt-4 text-sm font-medium transition-colors ${
                activeTab === "recipes"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("tabs.recipes")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("planning")}
              className={`pb-3 pt-4 text-sm font-medium transition-colors ${
                activeTab === "planning"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("tabs.planning")}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex-1 px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t("myRecipes")}
          </h1>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("newRecipe")}
          </Button>
        </div>

        {!hasRecipes ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <ChefHat className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                {t("empty.title")}
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                {t("empty.description")}
              </p>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("empty.createFirst")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Recipe cards will go here */}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {t("modal.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("modal.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipeName" className="text-sm font-medium">
                {t("modal.recipeName")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder={t("modal.recipeNamePlaceholder")}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="servings" className="text-sm font-medium">
                  {t("modal.servings")}
                </Label>
                <Input
                  id="servings"
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepTime" className="text-sm font-medium">
                  {t("modal.prepTime")}
                </Label>
                <Input
                  id="prepTime"
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookTime" className="text-sm font-medium">
                  {t("modal.cookTime")}
                </Label>
                <Input
                  id="cookTime"
                  type="number"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="border-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients" className="text-sm font-medium">
                {t("modal.ingredients")}
              </Label>
              <Textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={t("modal.ingredientsPlaceholder")}
                className="min-h-[100px] border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm font-medium">
                {t("modal.instructions")}
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={t("modal.instructionsPlaceholder")}
                className="min-h-[120px] border-primary/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                {t("modal.cancel")}
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleSaveRecipe}
              >
                {t("modal.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
