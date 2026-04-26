"use client";

import { useTranslations } from "next-intl";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RecipeModalHeaderProps {
  mode: "create" | "edit";
}

export const RecipeModalHeader = ({ mode }: RecipeModalHeaderProps) => {
  const t = useTranslations("dashboard.recipeModal");

  return (
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold tracking-tight">
        {mode === "create" ? t("createTitle") : t("editTitle")}
      </DialogTitle>
    </DialogHeader>
  );
};
