"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface RecipeModalFooterProps {
  isPending: boolean;
  onClose: () => void;
}

export const RecipeModalFooter = ({
  isPending,
  onClose,
}: RecipeModalFooterProps) => {
  const t = useTranslations("dashboard.recipeModal");

  return (
    <DialogFooter className="pt-4 border-t">
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={isPending}
      >
        {t("cancel")}
      </Button>
      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {isPending ? t("saving") : t("save")}
      </Button>
    </DialogFooter>
  );
};
