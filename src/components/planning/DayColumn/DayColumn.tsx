import type { ReactNode } from "react";

interface DayColumnProps {
  dayName: string;
  date: string;
  children: ReactNode;
}

export const DayColumn = ({ dayName, date, children }: DayColumnProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="rounded-lg border border-border bg-background px-4 py-3 text-center">
        <h3 className="text-sm font-semibold capitalize text-foreground">
          {dayName}
        </h3>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <div className="flex flex-col space-y-3">{children}</div>
    </div>
  );
};
