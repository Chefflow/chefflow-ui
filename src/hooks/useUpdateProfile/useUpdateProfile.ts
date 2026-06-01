import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/api/auth-client";
import type { UpdateProfileRequest } from "@/lib/api/interface";

export const useUpdateProfile = (username: string | undefined) => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: UpdateProfileRequest) => {
      if (!username) {
        throw new Error("Username required");
      }
      return authClient.updateProfile(username, data);
    },
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error.message[0] ?? "Failed to save");
        return;
      }
      const updated = response.data;
      if (updated) {
        queryClient.setQueryData(["auth", "profile"], { data: updated });
      }
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      toast.success("Saved");
    },
    onError: () => {
      toast.error("Failed to save");
    },
  });

  return { updateProfile, isPending };
};
