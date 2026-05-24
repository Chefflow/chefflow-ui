import type { Recipe } from "../recipe";

export type PlanningDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface PlanningSlot {
  id: number;
  weeklyPlanningId: number;
  dayOfWeek: PlanningDayOfWeek;
  slotNumber: number;
  recipes: Recipe[];
}

export interface WeeklyPlanning {
  id: number;
  userId: number;
  weekStart: string;
  weekEnd: string;
  slotsPerDay: number;
  createdAt: string;
  updatedAt: string;
  slots?: PlanningSlot[];
}

export interface CreatePlanningRequest {
  weekStart: string;
}

export interface UpdatePlanningRequest {
  weekStart: string;
}

export interface AddRecipeToSlotRequest {
  recipeId: number;
}
