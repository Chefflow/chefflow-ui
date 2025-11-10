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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("recipes")}
              className={`relative pb-4 pt-5 text-sm font-medium transition-all ${
                activeTab === "recipes"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("tabs.recipes")}
              {activeTab === "recipes" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("planning")}
              className={`relative pb-4 pt-5 text-sm font-medium transition-all ${
                activeTab === "planning"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("tabs.planning")}
              {activeTab === "planning" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex-1 px-6 py-8">
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
            onClick={() => setIsModalOpen(true)}
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
                onClick={() => setIsModalOpen(true)}
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
