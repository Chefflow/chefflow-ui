import { useMemo, useState } from "react";
import {
  addWeeks,
  formatWeekRange,
  getEndOfWeek,
  getStartOfWeek,
  getWeekDays,
} from "@/lib/date-utils";
import type { DayOfWeek, WeekRange } from "@/types/planning";

interface UseWeekPlanningProps {
  locale: string;
}

export function useWeekPlanning({ locale }: UseWeekPlanningProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const weekRange: WeekRange = useMemo(
    () => ({
      start: getStartOfWeek(currentDate),
      end: getEndOfWeek(currentDate),
    }),
    [currentDate],
  );

  const weekDays: DayOfWeek[] = useMemo(
    () => getWeekDays(weekRange.start, locale),
    [weekRange.start, locale],
  );

  const weekRangeText: string = useMemo(
    () => formatWeekRange(weekRange.start, weekRange.end, locale),
    [weekRange.start, weekRange.end, locale],
  );

  const weekStartISO: string = useMemo(() => {
    const d = weekRange.start;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, [weekRange.start]);

  const goToPreviousWeek = (): void => {
    setCurrentDate((prev) => addWeeks(prev, -1));
  };

  const goToNextWeek = (): void => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    weekRange,
    weekDays,
    weekRangeText,
    weekStartISO,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  };
}
