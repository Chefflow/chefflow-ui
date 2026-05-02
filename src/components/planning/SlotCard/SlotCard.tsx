"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotCardProps {
  slotNumber: 1 | 2 | 3;
  slotLabel: string;
  recipe: { id: number; title: string } | null;
  isPast: boolean;
  isLoading?: boolean;
  onAdd: () => void;
  onRemove: () => void;
  changeLabel: string;
  removeLabel: string;
}

export const SlotCard = ({
  slotNumber,
  slotLabel,
  recipe,
  isPast,
  isLoading = false,
  onAdd,
  onRemove,
  changeLabel,
  removeLabel,
}: SlotCardProps) => {
  if (isLoading) {
    return (
      <div className="h-20 animate-pulse rounded-[var(--radius-md)] bg-muted" />
    );
  }

  if (isPast && !recipe) {
    return (
      <div
        className={cn(
          "flex h-20 w-full items-center justify-center rounded-[var(--radius-md)]",
          "border border-dashed border-border bg-background",
          "opacity-50 cursor-not-allowed",
        )}
      >
        <span className="text-xs text-muted-foreground">
          {slotLabel} {slotNumber}
        </span>
      </div>
    );
  }

  if (isPast && recipe) {
    return (
      <div
        className={cn(
          "flex h-20 w-full items-start rounded-[var(--radius-md)]",
          "border border-border bg-secondary/50 px-3 py-2.5",
          "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {slotLabel} {slotNumber}
          </span>
          <p className="line-clamp-2 text-xs font-medium text-foreground">
            {recipe.title}
          </p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className={cn(
          "group flex h-20 w-full items-center justify-center gap-2 rounded-[var(--radius-md)]",
          "border border-dashed border-border bg-background",
          "text-sm text-muted-foreground transition-all",
          "hover:border-primary hover:bg-secondary/50 hover:text-primary",
        )}
      >
        <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span>
          {slotLabel} {slotNumber}
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group flex h-20 w-full items-stretch rounded-[var(--radius-md)]",
        "border border-border bg-secondary/50 px-3 py-2.5",
        "transition-all hover:shadow-sm",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {slotLabel} {slotNumber}
        </span>
        <p className="line-clamp-2 text-xs font-medium text-foreground">
          {recipe.title}
        </p>
      </div>
      <div className="ml-2 flex w-9 shrink-0 flex-col gap-1">
        <button
          type="button"
          onClick={onAdd}
          aria-label={changeLabel}
          className={cn(
            "flex flex-1 items-center justify-center rounded-[var(--radius-sm)]",
            "text-muted-foreground transition-colors hover:bg-secondary hover:text-primary",
          )}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className={cn(
            "flex flex-1 items-center justify-center rounded-[var(--radius-sm)]",
            "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
          )}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
