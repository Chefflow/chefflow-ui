import type { DayOfWeek } from "@/types/planning";

export function getMonthName(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { month: "short" });
}

export function getWeekDays(startDate: Date, locale: string): DayOfWeek[] {
  const days: DayOfWeek[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const dayName = currentDate.toLocaleDateString(locale, {
      weekday: "long",
    });
    const month = getMonthName(currentDate, locale);
    const dateNumber = currentDate.getDate();
    const dateString = `${month} ${dateNumber}`;

    days.push({
      name: dayName,
      date: dateString,
      dateNumber,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

export function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as start of week
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function formatWeekRange(
  start: Date,
  end: Date,
  locale: string,
): string {
  const startMonth = getMonthName(start, locale);
  const endMonth = getMonthName(end, locale);
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

export function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}
