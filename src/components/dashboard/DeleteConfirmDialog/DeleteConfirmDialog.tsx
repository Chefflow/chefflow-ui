"use client";

import { Loader2 } from "lucide-react";
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
  return (
    <Dialog open={recipe !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Recipe</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{recipe?.title}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
