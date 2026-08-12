import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "@/services";

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: () => restaurantService.getAll(),
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => restaurantService.getById(id),
    enabled: !!id,
  });
}

export function useRestaurantReviews(restaurantId: string) {
  return useQuery({
    queryKey: ["reviews", restaurantId],
    queryFn: () => restaurantService.getReviews(restaurantId),
    enabled: !!restaurantId,
  });
}

export function useVerifyRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurantId: string) =>
      restaurantService.verify(restaurantId),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["restaurants"] })
        .catch(() => {});
    },
  });
}

export function useCheckRestaurantData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurantId: string) =>
      restaurantService.checkData(restaurantId),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["restaurants"] })
        .catch(() => {});
    },
  });
}

export function useSetRestaurantDataStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      restaurantId,
      status,
    }: {
      restaurantId: string;
      status: "pending" | "verified" | "flagged";
    }) => restaurantService.setDataStatus(restaurantId, status),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["restaurants"] })
        .catch(() => {});
    },
  });
}
