import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeekNavigationProps {
  weekRange: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export const WeekNavigation = ({
  weekRange,
  onPreviousWeek,
  onNextWeek,
}: WeekNavigationProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousWeek}
        className="h-9 w-9 rounded-lg"
        aria-label="Previous week"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="min-w-[150px] text-center">
        <span className="text-sm font-medium text-foreground">
          Week of {weekRange}
        </span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onNextWeek}
        className="h-9 w-9 rounded-lg"
        aria-label="Next week"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
