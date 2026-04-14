import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreatePlanningRequest,
  PlanningDayOfWeek,
} from "@/lib/api/interface";
import { CACHE_CONFIG } from "@/lib/api/interface";
import { planningClient } from "@/lib/api/planning-client";

export const PLANNING_KEYS = {
  all: ["plannings"] as const,
  detail: (id: number) => ["plannings", id] as const,
};

export const useWeeklyPlannings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: PLANNING_KEYS.all,
    queryFn: async () => {
      const response = await planningClient.getPlannings();
      if (response.error) {
        throw new Error(response.error.message[0]);
      }
      return response.data ?? [];
    },
    staleTime: CACHE_CONFIG.PLANNING.staleTime,
    refetchOnWindowFocus: CACHE_CONFIG.PLANNING.refetchOnWindowFocus,
  });

  return { plannings: data ?? [], isLoading, error };
};

export const useWeeklyPlanning = (id: number | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: PLANNING_KEYS.detail(id ?? 0),
    enabled: id !== undefined,
    queryFn: async () => {
      const response = await planningClient.getPlanningById(id ?? 0);
      if (response.error) {
        throw new Error(response.error.message[0]);
      }
      return response.data ?? null;
    },
    staleTime: CACHE_CONFIG.PLANNING.staleTime,
    refetchOnWindowFocus: CACHE_CONFIG.PLANNING.refetchOnWindowFocus,
  });

  return { planning: data ?? null, isLoading, error };
};

export const useCreatePlanning = () => {
  const queryClient = useQueryClient();

  const { mutate: createPlanning, isPending } = useMutation({
    mutationFn: (data: CreatePlanningRequest) =>
      planningClient.createPlanning(data),
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error.message[0] ?? "Failed to create planning");
        return;
      }
      queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
      toast.success("Planning created!");
    },
    onError: () => {
      toast.error("Failed to create planning");
    },
  });

  return { createPlanning, isPending };
};

export const useAssignSlot = (planningId: number) => {
  const queryClient = useQueryClient();

  const { mutate: assignSlot, isPending } = useMutation({
    mutationFn: ({
      day,
      slot,
      recipeId,
    }: {
      day: PlanningDayOfWeek;
      slot: 1 | 2 | 3;
      recipeId: number;
    }) => planningClient.assignSlot(planningId, day, slot, { recipeId }),
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error.message[0] ?? "Failed to assign slot");
        return;
      }
      queryClient.invalidateQueries({
        queryKey: PLANNING_KEYS.detail(planningId),
      });
      queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
      toast.success("Slot assigned!");
    },
    onError: () => {
      toast.error("Failed to assign slot");
    },
  });

  return { assignSlot, isPending };
};

export const useDeleteSlot = (planningId: number) => {
  const queryClient = useQueryClient();

  const { mutate: deleteSlot, isPending } = useMutation({
    mutationFn: ({ day, slot }: { day: PlanningDayOfWeek; slot: 1 | 2 | 3 }) =>
      planningClient.deleteSlot(planningId, day, slot),
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error.message[0] ?? "Failed to delete slot");
        return;
      }
      queryClient.invalidateQueries({
        queryKey: PLANNING_KEYS.detail(planningId),
      });
      queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
      toast.success("Slot removed");
    },
    onError: () => {
      toast.error("Failed to delete slot");
    },
  });

  return { deleteSlot, isPending };
};

export const useDeletePlanning = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePlanning, isPending } = useMutation({
    mutationFn: (id: number) => planningClient.deletePlanning(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
      toast.success("Planning deleted");
    },
    onError: () => {
      toast.error("Failed to delete planning");
    },
  });

  return { deletePlanning, isPending };
};
