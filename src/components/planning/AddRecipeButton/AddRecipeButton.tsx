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
      className="group flex h-20 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background text-sm text-muted-foreground transition-all hover:border-primary hover:bg-secondary/50 hover:text-primary"
    >
      <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
      <span>{label}</span>
    </button>
  );
};
