import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaService } from "@/services";

export function useMedia() {
  return useQuery({
    queryKey: ["media"],
    queryFn: () => mediaService.getAll(),
  });
}

export function useSetMediaVerified() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      mediaService.setVerified(id, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] }).catch(() => {});
    },
  });
}

export function useUndoMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaService.undo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] }).catch(() => {});
    },
  });
}
