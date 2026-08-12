import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services";

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewService.getAll(),
  });
}

export function useSetLanguageVerified() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      reviewService.setLanguageVerified(id, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] }).catch(() => {});
    },
  });
}

export function useUndoReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.undo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] }).catch(() => {});
    },
  });
}
