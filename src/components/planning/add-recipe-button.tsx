import { Plus } from "lucide-react";

interface AddRecipeButtonProps {
  onClick: () => void;
  label: string;
}

export const AddRecipeButton = ({ onClick, label }: AddRecipeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-16 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50 hover:text-primary"
    >
      <Plus className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};
