export interface DayOfWeek {
  name: string;
  date: string;
  dateNumber: number;
}

export interface WeekRange {
  start: Date;
  end: Date;
}

export interface MealSlot {
  id: string;
  recipeId?: string;
  recipeName?: string;
}

export interface DayPlan {
  date: string;
  meals: MealSlot[];
}

export interface WeekPlan {
  weekStart: Date;
  weekEnd: Date;
  days: DayPlan[];
}
