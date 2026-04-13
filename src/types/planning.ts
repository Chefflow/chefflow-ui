export interface DayOfWeek {
  name: string;
  date: string;
  dateNumber: number;
}

export interface WeekRange {
  start: Date;
  end: Date;
}

export interface DayPlanningSlot {
  slotNumber: 1 | 2 | 3;
  recipe: { id: number; title: string; imageUrl?: string | null } | null;
}
