import { baseClient } from "./base-client";
import type {
  AddRecipeToSlotRequest,
  ApiResponse,
  CreatePlanningRequest,
  PlanningDayOfWeek,
  PlanningSlot,
  UpdatePlanningRequest,
  WeeklyPlanning,
} from "./interface";

class PlanningClient {
  async createPlanning(
    data: CreatePlanningRequest,
  ): Promise<ApiResponse<WeeklyPlanning>> {
    return baseClient.post<WeeklyPlanning>("/weekly-plannings", data);
  }

  async getPlannings(): Promise<ApiResponse<WeeklyPlanning[]>> {
    return baseClient.get<WeeklyPlanning[]>("/weekly-plannings");
  }

  async getPlanningById(id: number): Promise<ApiResponse<WeeklyPlanning>> {
    return baseClient.get<WeeklyPlanning>(`/weekly-plannings/${id}`);
  }

  async updatePlanning(
    id: number,
    data: UpdatePlanningRequest,
  ): Promise<ApiResponse<WeeklyPlanning>> {
    return baseClient.patch<WeeklyPlanning>(`/weekly-plannings/${id}`, data);
  }

  async deletePlanning(id: number): Promise<ApiResponse<void>> {
    return baseClient.delete<void>(`/weekly-plannings/${id}`);
  }

  async addRecipeToSlot(
    id: number,
    day: PlanningDayOfWeek,
    slot: number,
    data: AddRecipeToSlotRequest,
  ): Promise<ApiResponse<PlanningSlot>> {
    return baseClient.post<PlanningSlot>(
      `/weekly-plannings/${id}/slots/${day.toLowerCase()}/${slot}/recipes`,
      data,
    );
  }

  async removeRecipeFromSlot(
    id: number,
    day: PlanningDayOfWeek,
    slot: number,
    recipeId: number,
  ): Promise<ApiResponse<void>> {
    return baseClient.delete<void>(
      `/weekly-plannings/${id}/slots/${day.toLowerCase()}/${slot}/recipes/${recipeId}`,
    );
  }

  async deleteSlot(
    id: number,
    day: PlanningDayOfWeek,
    slot: number,
  ): Promise<ApiResponse<void>> {
    return baseClient.delete<void>(
      `/weekly-plannings/${id}/slots/${day.toLowerCase()}/${slot}`,
    );
  }
}

export const planningClient = new PlanningClient();
export default planningClient;
