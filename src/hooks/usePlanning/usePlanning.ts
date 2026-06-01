import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreatePlanningRequest,
  PlanningDayOfWeek,
  PlanningSlot,
  Recipe,
  WeeklyPlanning,
} from "@/lib/api/interface";
import { CACHE_CONFIG } from "@/lib/api/interface";
import { planningClient } from "@/lib/api/planning-client";
import { PLANNING_KEYS, RECIPE_KEYS } from "@/lib/query-keys";

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

interface SlotMutationVariables {
  day: PlanningDayOfWeek;
  slot: number;
  recipeId: number;
}

interface SlotMutationContext {
  previous: WeeklyPlanning | null | undefined;
}

export const useAddRecipeToSlot = (planningId: number) => {
  const queryClient = useQueryClient();

  const { mutate: addRecipeToSlot, isPending } = useMutation<
    Awaited<ReturnType<typeof planningClient.addRecipeToSlot>>,
    Error,
    SlotMutationVariables,
    SlotMutationContext
  >({
    mutationFn: ({ day, slot, recipeId }) =>
      planningClient.addRecipeToSlot(planningId, day, slot, { recipeId }),
    onMutate: async ({ day, slot, recipeId }) => {
      await queryClient.cancelQueries({
        queryKey: PLANNING_KEYS.detail(planningId),
      });

      const previous = queryClient.getQueryData<WeeklyPlanning | null>(
        PLANNING_KEYS.detail(planningId),
      );

      const cachedRecipe = queryClient.getQueryData<Recipe>(
        RECIPE_KEYS.detail(recipeId),
      );

      const recipeObj: Recipe =
        cachedRecipe ??
        ({
          id: recipeId,
          title: "",
          servings: 0,
          prepTime: 0,
          authorId: "",
          ingredients: [],
          steps: [],
          createdAt: "",
          updatedAt: "",
        } as unknown as Recipe);

      if (previous) {
        const slots = previous.slots ?? [];
        const existingIndex = slots.findIndex(
          (s) => s.dayOfWeek === day && s.slotNumber === slot,
        );

        let nextSlots: PlanningSlot[];
        if (existingIndex >= 0) {
          nextSlots = slots.map((s, idx) =>
            idx === existingIndex
              ? { ...s, recipes: [...s.recipes, recipeObj] }
              : s,
          );
        } else {
          const tempSlot: PlanningSlot = {
            id: -Date.now(),
            weeklyPlanningId: planningId,
            dayOfWeek: day,
            slotNumber: slot,
            recipes: [recipeObj],
          };
          nextSlots = [...slots, tempSlot];
        }

        queryClient.setQueryData<WeeklyPlanning>(
          PLANNING_KEYS.detail(planningId),
          { ...previous, slots: nextSlots },
        );
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          PLANNING_KEYS.detail(planningId),
          context.previous,
        );
      }
      toast.error("Failed to add recipe");
    },
    onSuccess: (response, _variables, context) => {
      if (response.error) {
        if (context?.previous !== undefined) {
          queryClient.setQueryData(
            PLANNING_KEYS.detail(planningId),
            context.previous,
          );
        }
        toast.error(response.error.message[0] ?? "Failed to add recipe");
        return;
      }
      toast.success("Recipe added!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PLANNING_KEYS.detail(planningId),
      });
      queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
    },
  });

  return { addRecipeToSlot, isPending };
};

export const useRemoveRecipeFromSlot = (planningId: number) => {
  const queryClient = useQueryClient();

  const { mutate: removeRecipeFromSlot, isPending } = useMutation<
    Awaited<ReturnType<typeof planningClient.removeRecipeFromSlot>>,
    Error,
    SlotMutationVariables,
    SlotMutationContext
  >({
    mutationFn: ({ day, slot, recipeId }) =>
      planningClient.removeRecipeFromSlot(planningId, day, slot, recipeId),
    onMutate: async ({ day, slot, recipeId }) => {
      await queryClient.cancelQueries({
        queryKey: PLANNING_KEYS.detail(planningId),
      });

      const previous = queryClient.getQueryData<WeeklyPlanning | null>(
        PLANNING_KEYS.detail(planningId),
      );

      if (previous) {
        const slots = previous.slots ?? [];
        const nextSlots = slots.map((s) =>
          s.dayOfWeek === day && s.slotNumber === slot
            ? { ...s, recipes: s.recipes.filter((r) => r.id !== recipeId) }
            : s,
        );

        queryClient.setQueryData<WeeklyPlanning>(
          PLANNING_KEYS.detail(planningId),
          { ...previous, slots: nextSlots },
        );
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          PLANNING_KEYS.detail(planningId),
          context.previous,
        );
      }
      toast.error("Failed to remove recipe");
    },
    onSuccess: (response, _variables, context) => {
      if (response.error) {
        if (context?.previous !== undefined) {
          queryClient.setQueryData(
            PLANNING_KEYS.detail(planningId),
            context.previous,
          );
        }
        toast.error(response.error.message[0] ?? "Failed to remove recipe");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: PLANNING_KEYS.detail(planningId),
      });
      queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.all });
    },
  });

  return { removeRecipeFromSlot, isPending };
};

export const useDeleteSlot = (planningId: number) => {
  const queryClient = useQueryClient();

  const { mutate: deleteSlot, isPending } = useMutation({
    mutationFn: ({ day, slot }: { day: PlanningDayOfWeek; slot: number }) =>
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
