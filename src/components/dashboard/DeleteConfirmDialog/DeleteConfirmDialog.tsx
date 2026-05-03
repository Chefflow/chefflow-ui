"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Recipe } from "@/lib/api/interface";

interface DeleteConfirmDialogProps {
  recipe: Recipe | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export const DeleteConfirmDialog = ({
  recipe,
  onConfirm,
  onCancel,
  isPending,
}: DeleteConfirmDialogProps) => {
  const t = useTranslations("dashboard.deleteConfirm");

  return (
    <Dialog open={recipe !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { title: recipe?.title ?? "" })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
