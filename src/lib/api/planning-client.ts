import { baseClient } from "./base-client";
import type {
  ApiResponse,
  AssignSlotRequest,
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

  async assignSlot(
    id: number,
    day: PlanningDayOfWeek,
    slot: 1 | 2 | 3,
    data: AssignSlotRequest,
  ): Promise<ApiResponse<PlanningSlot>> {
    return baseClient.put<PlanningSlot>(
      `/weekly-plannings/${id}/slots/${day.toLowerCase()}/${slot}`,
      data,
    );
  }

  async deleteSlot(
    id: number,
    day: PlanningDayOfWeek,
    slot: 1 | 2 | 3,
  ): Promise<ApiResponse<void>> {
    return baseClient.delete<void>(
      `/weekly-plannings/${id}/slots/${day.toLowerCase()}/${slot}`,
    );
  }
}

export const planningClient = new PlanningClient();
export default planningClient;
