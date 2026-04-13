import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DayColumnProps {
  dayName: string;
  date: string;
  children: ReactNode;
  isPast?: boolean;
}

export const DayColumn = ({
  dayName,
  date,
  children,
  isPast = false,
}: DayColumnProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <div
        className={cn(
          "rounded-lg border border-border bg-background px-4 py-3 text-center transition-opacity",
          isPast && "opacity-50",
        )}
      >
        <h3
          className={cn(
            "text-sm font-semibold capitalize text-foreground",
            isPast && "line-through decoration-muted-foreground/60",
          )}
        >
          {dayName}
        </h3>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <div className="flex flex-col space-y-3">{children}</div>
    </div>
  );
};
