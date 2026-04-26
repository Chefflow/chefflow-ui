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
  slotNumber: 1 | 2 | 3;
  recipeId: number;
  recipe: Recipe | null;
}

export interface WeeklyPlanning {
  id: number;
  userId: number;
  weekStart: string;
  weekEnd: string;
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

export interface AssignSlotRequest {
  recipeId: number;
}
